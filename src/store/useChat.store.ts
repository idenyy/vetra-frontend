import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axios } from '../config/axios.ts';
import { ChatState } from '../types/store.type.ts';
import { User } from '../types/user.type.ts';

export const useChat = create<ChatState>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axios.get('/chat/users');
      set({ users: response.data });
    } catch (error: any) {
      toast.error(
        error.response.data.error || 'Something went wrong. Please try again.'
      );
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id: string) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axios.get(`/chat/:${id}`);
      set({ messages: response.data });
    } catch (error: any) {
      toast.error(
        error.response.data.error || 'Something went wrong. Please try again.'
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: async (user: User | null) => {
    set({ selectedUser: user });
  }
}));
