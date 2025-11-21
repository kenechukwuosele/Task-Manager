import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
// import { LuCheckCircle2, LuCircle } from "react-icons/lu";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, { text: option.trim(), completed: false }]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
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
        {todoList.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <p className="text-sm text-slate-700 truncate">
                {typeof item === "string" ? item : item.text}
              </p>
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
        <input
          type="text"
          placeholder="Add a new todo item..."
          value={option}
          onChange={(e) => setOption(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-slate-200 bg-slate-50 text-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm"
        />

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

export default TodoListInput;
