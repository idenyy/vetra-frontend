import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axios } from '../config/axios.ts';
import { ChatState } from '../types/store.type.ts';
import { User } from '../types/user.type.ts';
import { Message } from '../types/message.type.ts';
import { useAuth } from './useAuth.store.ts';

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

      await get().markMessagesAsRead(_id);
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

  markMessagesAsRead: async (chatId: string) => {
    try {
      const socket = useAuth.getState().socket;
      const { messages } = get();

      const unreadMessages = messages.filter((msg) => !msg.isRead);

      if (unreadMessages.length > 0) {
        socket.emit('readMessage', {
          chatId,
          messageIds: unreadMessages.map((msg) => msg._id)
        });

        set({
          messages: messages.map((msg) => (unreadMessages.includes(msg) ? { ...msg, isRead: true } : msg))
        });
      }
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuth.getState().socket;

    socket.on('newMessage', async (message: Message) => {
      if (message.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, message] });
    });

    socket.on('messageRead', (messageId: string) => {
      set((state) => ({
        messages: state.messages.map((message) =>
          message._id === messageId ? { ...message, isRead: true } : message
        )
      }));
    });
  },

  unsubscribeToMessages: async () => {
    const socket = useAuth.getState().socket;
    socket.off('newMessage');
    socket.off('messageRead');
  },

  setSelectedUser: async (user: User | null) => {
    set({ selectedUser: user });
  }
}));
