import { create } from 'zustand';
import { instance } from '../config/axios.ts';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthState } from '../types/store.type.ts';

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isVerifyingSignup: false,
  isLoggingIn: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await instance.get('/auth/check');
      set({ authUser: response.data });
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
      const response = await instance.post('/auth/signup', data);
      toast.success(response.data.message || 'Verification code sent');
      return response.data;
    } catch (error: any) {
      console.error('Signup error: ', error);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifySignup: async (verificationCode: string) => {
    set({ isVerifyingSignup: true });

    try {
      const response = await instance.post('/auth/signup/verify', {
        verification_code: verificationCode
      });
      toast.success(response.data.message || 'Signup verified successfully');
      set({ authUser: response.data.user });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.error || 'Verification failed. Please try again.'
        );
      }
      throw error;
    } finally {
      set({ isVerifyingSignup: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    set({ isLoggingIn: true });

    try {
      const response = await instance.post('/auth/login', data);
      set({ authUser: response.data });
      toast.success(response.data.message || 'Logged in successfully');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response)
        toast.error(
          error.response.data.error || 'Invalid credentials. Please try again.'
        );
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await instance.delete('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.error || 'Logout failed. Please try again.'
        );
      }
    }
  }
}));
