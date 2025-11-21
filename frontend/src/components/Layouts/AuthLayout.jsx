import React from "react";
import authBg from "../../assets/images/authBg.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300">
      {/* Left side (form) */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white transition-colors duration-300 flex flex-col overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-auto">Task Manager</h2>
        <div className="my-auto">
            {children}
        </div>
      </div>

      {/* Right side (image) */}
      <div className="hidden md:flex md:w-[40vw] h-screen bg-gradient-to-br from-indigo-600 to-violet-700 transition-all duration-300 sticky top-0">
        <div className="relative w-full h-full">
          <img
            src={authBg}
            alt="Auth background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-violet-700/90"></div>
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold mb-4">Join Us Today</h3>
              <p className="text-lg text-indigo-100">Start organizing your life and work with the most intuitive task manager.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
