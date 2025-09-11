import React from "react";
import authBg from "../../assets/images/authBg.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left side (form) */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      {/* Right side (image) */}
      <div className="hidden md:flex md:w-[40vw] h-screen">
        <img
          src={authBg}
          alt="Auth background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
