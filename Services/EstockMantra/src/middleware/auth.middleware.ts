import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prismaClient.js";
import jwt from "jsonwebtoken";
import {
  getEffectiveWorkspaceRole,
  getWorkspaceId,
} from "../utils/userPermission.js";

interface JwtPayload {
  id: string;
}

// Avoid writing to the DB on every single request — only refresh the
// heartbeat once this many ms have passed since the last recorded activity.
const PRESENCE_HEARTBEAT_THROTTLE_MS = 60_000;

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      if (!token || token === "undefined" || token === "null") {
        return res.status(401).json({
          success: false,
          message: "Not authorized, no token",
        });
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "",
      ) as JwtPayload;

      // Check if user exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyOwner: true,
          disabled: true,
          lastActiveAt: true,
          ownedWorkspaces: {
            select: {
              id: true,
            },
          },
          memberships: {
            select: {
              workspaceId: true,
              role: true,
              status: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      if (user.disabled) {
        return res.status(403).json({
          success: false,
          message: "User account is disabled",
        });
      }

      // Fire-and-forget presence heartbeat, throttled so we don't write on every request
      const lastActive = user.lastActiveAt;
      if (
        !lastActive ||
        Date.now() - lastActive.getTime() > PRESENCE_HEARTBEAT_THROTTLE_MS
      ) {
        prisma.user
          .update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() },
          })
          .catch((err) => console.warn("Failed to update lastActiveAt:", err));
      }

      // Determine active workspace: header first, then fallback
      const headerWorkspaceId = req.headers["x-workspace-id"] as string;
      const primaryWorkspaceId = getWorkspaceId(user);

      let activeWorkspaceId = primaryWorkspaceId;
      if (headerWorkspaceId) {
        const hasActiveMembership = user.memberships?.some(
          (m) => m.workspaceId === headerWorkspaceId && m.status === "active",
        );
        const ownsWorkspace = user.ownedWorkspaces?.some(
          (w) => w.id === headerWorkspaceId,
        );
        const isLegacyWorkspace = headerWorkspaceId === user.id;

        if (isLegacyWorkspace || hasActiveMembership || ownsWorkspace) {
          activeWorkspaceId = headerWorkspaceId;
        }
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        companyOwner: user.companyOwner,
        disabled: user.disabled,
        memberships: user.memberships,
        role: getEffectiveWorkspaceRole(user, activeWorkspaceId),
        workspaceId: activeWorkspaceId,
      };
      return next();
    } catch (error) {
      console.warn("JWT Verification Error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

export const blockViewerWrites = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.role === "viewer") {
    return res.status(403).json({
      success: false,
      message: "Viewers have read-only access",
    });
  }
  next();
};
