import { create } from 'zustand';
import { axios } from '../config/axios.ts';
import toast from 'react-hot-toast';
import { AuthState } from '../types/store.type.ts';
import { io } from 'socket.io-client';

const BASE_URL: string = 'https://vetra-4a1b4efd0f63.herokuapp.com/';

export const useAuth = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isVerifyingSignup: false,
  isVerifyingCode: false,
  isLoggingIn: false,

  isCheckingAuth: true,
  onlineUsers: [],

  socket: null,

  checkAuth: async () => {
    try {
      const response = await axios.get('/auth/check');
      set({ authUser: response.data });
      get().connectSocket();
      return response.data;
    } catch {
      set({ authUser: null });
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: { name: string; email: string; password: string }) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post('/auth/signup', data);
      toast.success(response.data.message || 'Verification code sent');
      set({ isVerifyingCode: true });
    } catch (error: any) {
      toast.error(error.response.data.error || 'Signup failed. Please try again.');
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifySignup: async (verificationCode: string) => {
    set({ isVerifyingSignup: true });

    try {
      const response = await axios.post('/auth/signup/verify', {
        verification_code: verificationCode
      });
      set({ authUser: response.data.user });
      toast.success(response.data.message || 'Signup verified successfully');

      get().connectSocket();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response.data.error || 'Verification failed. Please try again.');
      throw error;
    } finally {
      set({ isVerifyingSignup: false });
      set({ isVerifyingCode: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    set({ isLoggingIn: true });

    try {
      const response = await axios.post('/auth/login', data);
      set({ authUser: response.data });
      toast.success(response.data.message || 'Logged in successfully');

      get().connectSocket();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response.data.error || 'Login failed. Please try again.');
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.delete('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.error || 'Logout failed. Please try again.');
    }
  },

  connectSocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();

    set({ socket: socket });

    socket.on('getOnlineUsers', (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket?.disconnect();
  }
}));
