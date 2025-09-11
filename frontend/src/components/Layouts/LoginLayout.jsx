import React from "react";
import authImg from "../../assets/images/authImg.jpg";

const LoginLayout =  ({ children }) => {
  return <div className="flex">
    <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
    </div>
    <div className="hidden md:flex md:w-[40vw] h-screen items-center justify-center bg-blue-500 bg-[url('../../assets/images/authImg.jpg')] bg-cover bg-center">
        <img src={authImg} alt="" className="w-64 lg:w-[90%]" />
    </div>
  </div>
};

export default LoginLayout;
