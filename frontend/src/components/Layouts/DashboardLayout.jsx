import React, { useContext } from "react";
import { UserContext } from "../../context/userContext.jsx";
import NavBar from "../../components/Layouts/NavBar.jsx";
import SideMenu from "../../components/Layouts/SideMenu.jsx";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <NavBar /> {/* no more activeMenu */}

      <div className="flex">
        <div className="max-[1080px]:hidden">
          <SideMenu /> {/* no more activeMenu */}
        </div>

        <main className="grow mx-5">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
