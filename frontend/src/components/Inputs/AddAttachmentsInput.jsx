import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip, LuLink } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {attachments.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-lg">
                <LuPaperclip size={16} />
              </div>
              <a
                href={item}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate"
              >
                {item}
              </a>
            </div>

            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <LuLink
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Add a file link or URL..."
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-slate-200 bg-slate-50 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/25 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddOption}
          disabled={!option.trim()}
        >
          <HiMiniPlus size={20} />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
