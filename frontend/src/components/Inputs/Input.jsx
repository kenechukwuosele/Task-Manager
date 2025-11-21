import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
  return (

    <div className="input-group">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder=" "
        className="input-field"
        value={value}
        onChange={onChange}
      />
      <label className="input-label">{label}</label>

      {type === "password" && (
        <div className="absolute right-4 top-3.5 cursor-pointer text-slate-400 hover:text-primary transition-colors">
          {showPassword ? (
            <FaRegEye size={20} onClick={togglePasswordVisibility} />
          ) : (
            <FaRegEyeSlash size={20} onClick={togglePasswordVisibility} />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
