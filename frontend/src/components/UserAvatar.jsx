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
        "#3B82F6", // blue
        "#10B981", // green
        "#7C3AED", // purple
        "#EC4899", // pink
        "#F97316", // orange
        "#0EA5A4", // teal
        "#EF4444", // red
        "#64748B", // slate
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const UserAvatar = ({ user = {}, size = 40 }) => {
    const [imgError, setImgError] = useState(false);

    // Reset error if URL changes
    useEffect(() => {
        setImgError(false);
    }, [user?.profileImageUrl]);

    const shouldShowImage = user?.profileImageUrl &&
        user.profileImageUrl.trim() !== "" && !imgError;

    const initials = getInitials(user?.name);
    const bgColor = getColorFromSeed(user?._id ?? user?.name ?? "");

    return (
        <div
            style={{
                width: size,
                height: size,
                fontSize: Math.round(size * 0.44),
            }}
            className="inline-flex items-center justify-center rounded-full overflow-hidden"
        >
            {shouldShowImage
                ? (
                    <img
                        src={user.profileImageUrl}
                        alt={user?.name || "User"}
                        onError={() => setImgError(true)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                )
                : (
                    <div
                        style={{
                            backgroundColor: bgColor,
                            width: "100%",
                            height: "100%",
                        }}
                        className="flex items-center justify-center text-white font-semibold"
                    >
                        {initials}
                    </div>
                )}
        </div>
    );
};

export default UserAvatar;
