import { User } from './user.type.ts';

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isVerifyingSignup: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<User | null>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<User | void>;
  verifySignup: (verificationCode: string) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<User | void>;
  logout: () => Promise<void>;
}

export interface UserState {
  authUser: User | null;
  isUpdatingProfile: boolean;

  updateProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    profilePic?: string;
  }) => Promise<User | void>;
}

export interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}
