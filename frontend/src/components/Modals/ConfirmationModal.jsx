import React from "react";
import Modal from "../Modal";
import { LuBadgeAlert } from "react-icons/lu";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <LuBadgeAlert className="text-red-500 w-12 h-12 mx-auto" />;
      case "warning":
        return (
          <LuBadgeAlert className="text-orange-500 w-12 h-12 mx-auto" />
        );
      default:
        return <LuBadgeAlert className="text-blue-500 w-12 h-12 mx-auto" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500";
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center p-4">
        <div className="mb-4">{getIcon()}</div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all focus:ring-2 focus:ring-offset-2 ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
