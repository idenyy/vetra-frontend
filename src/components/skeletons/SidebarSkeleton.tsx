import { Users } from 'lucide-react';

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/*Header*/}
      <div className="border-b border-b-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
        </div>
      </div>

      {/*Contacts*/}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, i) => (
          <div key={i} className="w-full p-3 flex items-center gap-3">
            {/*Avatar*/}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>
            {/*User Info*/}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton w-32 h-4 mb-2" />
              <div className="skeleton w-16 h-3" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
