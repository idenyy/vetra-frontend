import { useChat } from '../store/useChat.store.ts';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader.tsx';
import MessageInput from './MessageInput.tsx';

const Chat = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChat();

  useEffect(() => {
    if (selectedUser?.id) getMessages(selectedUser.id);
  }, [selectedUser?.id]);

  if (isMessagesLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <p>messages...</p>

      <MessageInput />
    </div>
  );
};

export default Chat;
