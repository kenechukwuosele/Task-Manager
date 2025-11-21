import React from "react";
import { LuX } from "react-icons/lu";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-slate-900/20 backdrop-blur-sm transition-all duration-300">
      <div className="relative p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal container */}
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <LuX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
