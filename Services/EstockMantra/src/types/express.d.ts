declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string | null;
        role: string;
        companyOwner: string | null;
        workspaceId: string;
        disabled: boolean;
        memberships?: Array<{
          workspaceId: string;
          role: string;
          status: string;
        }>;
      };
    }
  }
}
export {};
