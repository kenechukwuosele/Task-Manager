import React, { useContext } from "react";
import { UserContext } from "../../context/userContext.jsx";
import NavBar from "../../components/Layouts/NavBar.jsx";
import SideMenu from "../../components/Layouts/SideMenu.jsx";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout min-h-screen bg-slate-50 transition-colors duration-300">
      <NavBar /> {/* no more activeMenu */}

      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu /> {/* no more activeMenu */}
        </div>

        <main className="grow mx-5 py-6 bg-slate-50 transition-colors duration-300">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
