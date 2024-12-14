import { useChat } from '../store/useChat.store.ts';
import { useAuth } from '../store/useAuth.store.ts';
import { X } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();
  return (
    <div className="p-2 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/*Avatar*/}
          <div className="avatar">
            <div className="relative size-10 rounded-full">
              <img src={selectedUser?.profilePic || '/avatar.svg'} alt={selectedUser?.name} />
            </div>
          </div>

          {/*User Info*/}
          <div>
            <h3 className="font-medium mb-1">{selectedUser?.name}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser?._id && onlineUsers.some((_id) => _id === selectedUser._id)
                ? 'Online'
                : 'Offline'}
            </p>
          </div>
        </div>

        {/*Close Button*/}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
