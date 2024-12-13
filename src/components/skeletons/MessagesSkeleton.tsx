const MessagesSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {skeletonMessages.map((_, i) => (
        <div
          key={i}
          className={`chat ${i % 2 === 0 ? 'chat-start' : 'chat-end'}`}
        >
          <div className="chat-header mb-1">
            <div className="skeleton w-16 h-4" />
          </div>

          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton w-[200px] h-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesSkeleton;
