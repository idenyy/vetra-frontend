export type Message = {
  _id?: string | null;
  senderId?: string;
  receiverId?: string;
  content?: Record<string, any>;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
