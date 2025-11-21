import React from "react";
import { LuChevronDown } from "react-icons/lu";
import { useState } from "react";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = async (option) => {
    onChange(option);
    setIsOpen(false);
  };
  return (
    <div>
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
          <span className="ml-2">
            {isOpen ? (
              <LuChevronDown className="rotate-180" />
            ) : (
              <LuChevronDown />
            )}
          </span>
        </button>

        {isOpen && (
          <div className="absolute w-full bg-white border border-slate-200 rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDropdown;
