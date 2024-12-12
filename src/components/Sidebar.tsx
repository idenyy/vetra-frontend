import { useEffect } from 'react';
import { useChat } from '../store/useChat.store.ts';

import SidebarSkeleton from './skeletons/SidebarSkeleton.tsx';
import { Users } from 'lucide-react';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChat();

  const onlineUsers: string[] = [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/*Online Filter*/}
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user?.id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?.id === user.id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || '/avatar.svg'}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {user.id && onlineUsers.includes(user.id) && (
                <span className="absolute bottom-0 right-0 bg-success/50 ring-2 ring-zinc-900 rounded-full size-3" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {user.id && onlineUsers.includes(user.id)
                  ? 'Online'
                  : 'Offline'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
