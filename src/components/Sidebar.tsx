import { useEffect, useState } from 'react';
import { useChat } from '../store/useChat.store.ts';

import SidebarSkeleton from './skeletons/SidebarSkeleton.tsx';
import { Users } from 'lucide-react';
import { useAuth } from '../store/useAuth.store.ts';
import { User } from '../types/user.type.ts';

const Sidebar = () => {
  const {
    getUsers,
    getMessages,
    getLastMessage,
    lastMessages,
    users,
    selectedUser,
    markMessagesAsRead,
    setSelectedUser,
    isUsersLoading
  } = useChat();

  const { onlineUsers } = useAuth();
  const onlineUserIds = onlineUsers.map((_id) => _id);
  const [showOnline, setShowOnline] = useState<boolean>(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnline ? users.filter((user) => onlineUsers.includes(user._id as string)) : users;

  useEffect(() => {
    if (users) {
      users.forEach((user) => {
        getLastMessage(user._id as string);
      });
    }
  }, [users, getLastMessage, lastMessages]);

  const handleUserSelect = async (user: User) => {
    await setSelectedUser(user);
    await getMessages(user._id as string);
    await markMessagesAsRead(user._id as string);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/*Online Filter*/}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnline}
              onChange={(e) => setShowOnline(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-sm text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers &&
          filteredUsers?.map((user) => (
            <button
              key={user?._id}
              onClick={() => handleUserSelect(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user?._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || '/avatar.svg'}
                  alt={user.name}
                  className="size-12 object-cover rounded-full mr-0"
                />
                {user._id && onlineUserIds.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 bg-green-600 rounded-full size-3" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate mb-1">{user.name}</div>
                <div className="text-sm text-zinc-400 overflow-hidden">
                  {lastMessages && user._id && lastMessages[user._id] ? lastMessages[user._id] : ''}
                </div>
              </div>
            </button>
          ))}

        {filteredUsers.length === 0 && <div className="text-center text-zinc-500 py-4">No Online Users</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
