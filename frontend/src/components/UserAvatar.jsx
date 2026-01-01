import React, { useEffect, useState } from "react";

// Get initials from full name
const getInitials = (name = "") => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// Generate a background color based on user ID or name
const getColorFromSeed = (seed = "") => {
  const colors = [
    "#6264A7", // Teams Purple
    "#00B7C3", // Teams Teal
    "#0078D4", // Teams Blue
    "#EF4444", // Red
    "#F97316", // Orange
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EC4899", // Pink
  ];
  let hash = 0;
  for (let i = 0; i < (seed || "").length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const UserAvatar = ({ user = {}, size = 40, className = "" }) => {
  const [imgError, setImgError] = useState(false);

  // Reset error if URL changes
  useEffect(() => {
    setImgError(false);
  }, [user?.profileImageUrl]);

  const shouldShowImage =
    user?.profileImageUrl && user.profileImageUrl.trim() !== "" && !imgError;

  const initials = getInitials(user?.name);
  const bgColor = getColorFromSeed(user?._id ?? user?.name ?? "");

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4), // Slightly smaller font for Teams look
        minWidth: size, // Prevent squeezing
        minHeight: size,
      }}
      className={`inline-flex items-center justify-center rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
    >
      {shouldShowImage ? (
        <img
          src={user.profileImageUrl}
          alt={user?.name || "User"}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          style={{
            backgroundColor: bgColor,
          }}
          className="w-full h-full flex items-center justify-center text-white font-medium select-none"
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
