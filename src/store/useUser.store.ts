import { create } from 'zustand';
import { axios } from '../config/axios.ts';
import toast from 'react-hot-toast';
import { UserState } from '../types/store.type.ts';

export const useUserStore = create<UserState>((set) => ({
  authUser: null,
  isUpdatingProfile: false,

  updateProfile: async (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    profilePic?: string;
  }) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axios.put('/user', data);
      set({ authUser: response.data });
      toast.success(response.data.message || 'Profile updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response.data.error || 'Something went wrong. Please try again.'
      );
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}));
