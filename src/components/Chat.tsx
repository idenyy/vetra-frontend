import { useChat } from '../store/useChat.store.ts';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader.tsx';
import MessageInput from './MessageInput.tsx';
import MessagesSkeleton from './skeletons/MessagesSkeleton.tsx';
import { useAuth } from '../store/useAuth.store.ts';
import { formatDate } from '../config/utils.ts';

const Chat = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChat();
  const { authUser } = useAuth();

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id]);

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-bubble flex flex-col">
                <div className="div">
                  {message.content?.image && (
                    <img
                      src={message.content?.image}
                      alt="Image"
                      className="sm:max-w-[200px] rounded-mb mb-2"
                    />
                  )}
                </div>

                <div className="w-full h-full flex items-center justify-between">
                  {message.content?.text && <p className="pr-2">{message.content?.text}</p>}

                  <div className="flex self-end">
                    <time className="text-xs opacity-50">
                      {message.createdAt ? formatDate(new Date(message.createdAt)) : ''}
                    </time>
                  </div>
                  <div className="flex self-end">
                    {message.senderId === authUser?._id && (
                      <div className="flex ml-2">{message.isRead ? '✓✓' : '✓'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default Chat;
