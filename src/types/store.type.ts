import { User } from './user.type.ts';
import { Message } from './message.type.ts';

export interface AuthState {
  socket: any;
  authUser: User | null;
  isSigningUp: boolean;
  isVerifyingSignup: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];

  checkAuth: () => Promise<User | null>;
  signup: (data: { name: string; email: string; password: string }) => Promise<User | void>;
  verifySignup: (verificationCode: string) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<User | void>;
  logout: () => Promise<void>;

  connectSocket: () => Promise<void>;
  disconnectSocket: () => Promise<void>;
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

export interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => Promise<void>;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (_id: string) => Promise<void>;
  getLastMessage: (_id: string) => Promise<void>;
  lastMessages: Record<string, string> | null;
  sendMessage: (message: Message) => Promise<void>;
  markMessagesAsRead: (chatId: string) => Promise<void>;

  subscribeToMessages: () => void;
  unsubscribeToMessages: () => void;
}
