import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="glass-card p-5 hover:-translate-y-1 border border-slate-100">
      <div className="flex items-center gap-4">
        {/* Colored icon background */}
        <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
          {icon && <span className="text-xl">{icon}</span>}
        </div>

        {/* Text content */}
        <div>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
