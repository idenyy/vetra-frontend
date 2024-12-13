import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axios } from '../config/axios.ts';
import { ChatState } from '../types/store.type.ts';
import { User } from '../types/user.type.ts';
import { Message } from '../types/message.type.ts';

export const useChat = create<ChatState>((set, get) => ({
  messages: [] as Message[],
  users: [] as User[],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  lastMessages: {} as Record<string, string>,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axios.get('/chat/users');
      set({ users: response.data });
    } catch (error: any) {
      toast.error(error.response.data.error || 'Something went wrong. Please try again.');
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (_id: string) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axios.get(`/chat/${_id}`);
      set({ messages: response.data });
    } catch (error: any) {
      toast.error(error.response.data.error || 'Something went wrong. Please try again.');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getLastMessage: async (_id: string) => {
    try {
      const response = await axios.get(`/chat/${_id}`);
      const messages = response.data;
      if (messages && messages.length > 0) {
        set((state) => ({
          lastMessages: {
            ...state.lastMessages,
            [_id]: messages[messages.length - 1].content.text
          }
        }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong. Please try again.');
    }
  },

  sendMessage: async (content: Message) => {
    const { selectedUser, messages } = get();

    try {
      const response = await axios.post(`/chat/send/${selectedUser?._id}`, content);
      set({ messages: [...(messages || []), response.data] });
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong. Please try again.');
      console.log(error);
    }
  },

  setSelectedUser: async (user: User | null) => {
    set({ selectedUser: user });
  }
}));
