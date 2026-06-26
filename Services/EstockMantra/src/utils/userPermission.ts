import { Prisma, Project, User } from "@prisma/client";
import prisma from "../utils/prismaClient.js";

const FEATURE_FLAGS = {
  USE_WORKSPACE_MEMBERSHIP: true,
  MULTI_WORKSPACE_UI: true,
};

export const WORKSPACE_ROLES = ["admin", "user", "viewer"] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];
export type AuthenticatedUserContext = {
  id: string;
  email: string;
  role: string;
  companyOwner: string | null;
  workspaceId: string;
  disabled: boolean;
  memberships?: Array<{ workspaceId: string; role: string; status: string }>;
};

export type ProjectAccessLevel = "owner" | "admin" | "user";

type WorkspaceUser = Pick<User, "id" | "companyOwner"> & {
  memberships?: Array<{ workspaceId: string }>;
};
type WorkspaceRoleUser =
  | (Pick<User, "role" | "companyOwner"> & {
      memberships?: Array<{
        workspaceId: string;
        role: string;
        status: string;
      }>;
    })
  | (Pick<AuthenticatedUserContext, "role" | "companyOwner"> & {
      memberships?: Array<{
        workspaceId: string;
        role: string;
        status: string;
      }>;
    });

export const normalizeRole = (role: string | null | undefined) =>
  role?.trim().toLowerCase() ?? "";

export const sanitizeWorkspaceRole = (
  role: string | null | undefined,
): WorkspaceRole | null => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "superadmin") {
    return "admin";
  }

  return WORKSPACE_ROLES.includes(normalizedRole as WorkspaceRole)
    ? (normalizedRole as WorkspaceRole)
    : null;
};

export const getEffectiveWorkspaceRole = (
  user: WorkspaceRoleUser,
  activeWorkspaceId?: string,
) => {
  // New logic: Check WorkspaceMember first if context is provided and flag is enabled
  if (
    FEATURE_FLAGS.USE_WORKSPACE_MEMBERSHIP &&
    user.memberships &&
    activeWorkspaceId
  ) {
    const membership = user.memberships.find(
      (m) => m.workspaceId === activeWorkspaceId && m.status === "active",
    );
    if (membership) {
      return sanitizeWorkspaceRole(membership.role) ?? "user";
    }
  }

  // Fallback logic for backward compatibility
  const sanitizedRole = sanitizeWorkspaceRole(user.role);

  // Legacy self-registered workspace owners may still have role="user".
  if (!user.companyOwner) {
    return sanitizedRole === "viewer" ? "viewer" : "admin";
  }

  return sanitizedRole ?? "user";
};

const hasProjectRole = (
  project: Project,
  userId: string,
  minimumRole: ProjectAccessLevel,
) => {
  const isOwner = project.ownerId === userId;
  const isAllowedAdmin = project.allowedAdmins.includes(userId);
  const isAllowedUser = project.allowedUsers.includes(userId);

  if (minimumRole === "owner") {
    return isOwner;
  }

  if (minimumRole === "admin") {
    return isOwner || isAllowedAdmin;
  }

  return isOwner || isAllowedAdmin || isAllowedUser;
};

export const getWorkspaceId = (user: WorkspaceUser) => {
  // If user has memberships, the first one could be considered default or we check context.
  // For legacy support, we stick to the old field if it exists.
  return user.companyOwner ?? user.id;
};

export const isWorkspaceAdmin = (
  user:
    | Pick<User, "role" | "companyOwner">
    | (Pick<AuthenticatedUserContext, "role" | "companyOwner"> & {
        workspaceId?: string;
        memberships?: Array<{
          workspaceId: string;
          role: string;
          status: string;
        }>;
      }),
) => {
  if ("workspaceId" in user && user.workspaceId) {
    return getEffectiveWorkspaceRole(user, user.workspaceId) === "admin";
  }
  return getEffectiveWorkspaceRole(user) === "admin";
};

export const isSameWorkspace = (left: WorkspaceUser, right: WorkspaceUser) => {
  return getWorkspaceId(left) === getWorkspaceId(right);
};

export const buildWorkspaceUserWhere = (
  workspaceId: string,
): Prisma.UserWhereInput => ({
  memberships: {
    some: {
      workspaceId,
      status: {
        in: ["active", "invited"],
      },
    },
  },
});

export const buildAccessibleProjectWhere = (
  user: AuthenticatedUserContext,
): Prisma.ProjectWhereInput => {
  // Always scope to the user's active workspace to prevent cross-workspace leakage
  const workspaceFilter: Prisma.ProjectWhereInput = {
    workspaceId: user.workspaceId,
  };

  if (isWorkspaceAdmin(user)) {
    // Admins see every project in their active workspace
    return workspaceFilter;
  }

  // Non-admins: workspace-scoped AND (owner OR explicit access)
  return {
    AND: [
      workspaceFilter,
      {
        OR: [
          { ownerId: user.id },
          { allowedAdmins: { has: user.id } },
          { allowedUsers: { has: user.id } },
        ],
      },
    ],
  };
};

export const getAccessibleProjectIds = async (
  user: AuthenticatedUserContext,
) => {
  const projects = await prisma.project.findMany({
    where: buildAccessibleProjectWhere(user),
    select: { id: true },
  });

  return projects.map((project) => project.id);
};

export const getProjectForUser = async (
  projectId: string,
  user: AuthenticatedUserContext,
  minimumRole: ProjectAccessLevel = "user",
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: {
        select: {
          id: true,
          companyOwner: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Hard workspace boundary: project must belong to the user's active workspace
  if (project.workspaceId && project.workspaceId !== user.workspaceId) {
    return null;
  }

  const hasExplicitAccess = hasProjectRole(project, user.id, minimumRole);
  const hasWorkspaceAdminAccess =
    isWorkspaceAdmin(user) &&
    minimumRole !== "owner" &&
    project.workspaceId === user.workspaceId;

  if (!hasExplicitAccess && !hasWorkspaceAdminAccess) {
    return null;
  }

  return project;
};
