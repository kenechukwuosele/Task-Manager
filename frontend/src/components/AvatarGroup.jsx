import React from 'react';
import UserAvatar from './UserAvatar'; // Adjust path as needed

const AvatarGroup = ({ users = [], maxVisible = 3 }) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2"> {/* Overlap with Tailwind */}
      {visibleUsers.map((user) => (
        <UserAvatar
          key={user._id}
          user={user}
          size={32} // Adjust size as needed for your UI
        />
      ))}
      {remaining > 0 && (
        <div
          className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-400 rounded-full border-2 border-white"
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;