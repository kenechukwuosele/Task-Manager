import React, { useState, useContext, useRef, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuSettings, LuUser, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import nullp from "../../assets/images/nullp.jpg";
import SideMenu from "./SideMenu";

const NavBar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    const profilePath = user?.role === "admin" ? "/admin/profile-settings" : "/user/profile-settings";
    navigate(profilePath);
    setOpenProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpenProfileMenu(false);
  };

  return (
    <>
      <div className="flex items-center justify-between glass px-7 py-4 sticky top-0 z-30 transition-all duration-300">
        <div className="flex items-center gap-5">
          {/* Mobile Menu Button */}
          <button
            className="block lg:hidden text-slate-700 hover:bg-slate-100 rounded-lg p-2 transition-colors duration-200"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>

          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Task Manager</h2>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          {/* User Profile Section */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenProfileMenu(!openProfileMenu)}
                className="flex items-center gap-3 hover:bg-slate-100 rounded-full p-1 pr-3 transition-all duration-200 border border-transparent hover:border-slate-200"
              >
                <img
                  src={
                    user?.profileImageUrl && user.profileImageUrl.trim() !== ""
                      ? user.profileImageUrl
                      : nullp
                  }
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <LuSettings className="w-5 h-5 text-slate-600" />
              </button>

              {/* Profile Dropdown */}
              {openProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-card py-2 z-50 animate-fade-in origin-top-right">
                  <div className="px-5 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
  
                  <div className="p-2">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                    >
                      <LuUser className="w-4 h-4" />
                      Profile Settings
                    </button>
    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LuLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          )}
        </div>
      </div>

      {/* Mobile Side Menu */}
      {openSideMenu && (
        <div className="absolute top-0 left-0 h-screen w-72 glass-card z-40 rounded-none border-r border-slate-200">
          <SideMenu />
        </div>
      )}
    </>
  );
};

export default NavBar;
