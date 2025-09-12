import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        {/* Colored circle */}
        <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />

        {/* Optional icon */}
        {icon && <span className="text-lg">{icon}</span>}

        {/* Text content */}
        <p className="text-xs md:text-[14px] text-gray-500">
          <span className="text-sm md:text-[15px] text-black font-semibold">
            {value}
          </span>{" "}
          {label}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
