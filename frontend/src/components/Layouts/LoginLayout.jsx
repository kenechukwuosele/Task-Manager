import React from "react";
import authImg from "../../assets/images/authImg.jpg";

const LoginLayout =  ({ children }) => {
  return <div className="flex min-h-screen bg-slate-50">
    <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white transition-colors duration-300 flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Task Manager</h2>
        {children}
    </div>
    <div className="hidden md:flex md:w-[40vw] h-screen items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 transition-colors duration-300">
        <div className="relative w-full h-full">
          <img src={authImg} alt="" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-violet-700/90"></div>
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="text-center text-white">
               <h3 className="text-3xl font-bold mb-4">Welcome Back</h3>
               <p className="text-lg text-indigo-100">Streamline your workflow and boost productivity with our premium task management solution.</p>
            </div>
          </div>
        </div>
    </div>
  </div>
};

export default LoginLayout;
