import { useChat } from '../store/useChat.store.ts';
import Sidebar from '../components/Sidebar.tsx';
import Chat from '../components/Chat.tsx';
import NoChat from '../components/NoChat.tsx';

const Home = () => {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChat /> : <Chat />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
