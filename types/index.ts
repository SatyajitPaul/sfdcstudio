export interface SessionData {
    instanceUrl: string;
    userId: string;
    orgId: string;
    env: string;
    expiresAt: number;
    accessToken?: string;
    loginTime: number;
    refreshToken: string;
    expiresIn: number;
  }


