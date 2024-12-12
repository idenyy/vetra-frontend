import { create } from 'zustand';
import { instance } from '../config/axios.ts';
import { User } from '../types/user.type.ts';
import toast from 'react-hot-toast';
import axios from 'axios';

interface UserState {
  authUser: User | null;
  isUpdatingProfile: boolean;

  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string; profilePic?: string }) => Promise<User | void>;
}

export const useUserStore = create<UserState>((set) => ({
  authUser: null,
  isUpdatingProfile: false,

  updateProfile: async (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string; profilePic?: string }) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await instance.put('/user', data);
      set({ authUser: response.data });
      toast.success(response.data.message || 'Profile updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Update profile error: ', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Something went wrong. Please try again.');
      }
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}));
