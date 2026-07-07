export interface User {
  id: string;
  email: string;
  name: string;
}

export interface StoredIdentityInfo {
  identityType: 'email' | 'mobile' | 'username';
  mobile: string | null;
  email: string | null;
  operation: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';
  redirectVerifyPassword: boolean;
  isTwoStepLogin: boolean;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken?: string;
  sessionKey?: string;
  loginType?: number;
  identityInfo?: StoredIdentityInfo;
}
