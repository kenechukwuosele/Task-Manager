// utils/avatarHelpers.js
export const getInitials = (name = "") => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const getColorFromSeed = (seed) => {
    const colors = [
        "#3B82F6", // blue-500
        "#10B981", // green-500
        "#7C3AED", // purple-600
        "#EC4899", // pink-500
        "#F97316", // orange-500
        "#0EA5A4", // teal-500
        "#EF4444", // red-500
        "#64748B", // slate-500
    ];
    const s = String(seed || "");
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};
