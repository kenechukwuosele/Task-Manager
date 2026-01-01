import UserAvatar from "../UserAvatar"; // Add this to imports

// ...
      <div className="flex flex-col items-center justify-center mb-8 px-4">
        <div className="relative group cursor-pointer">
          <UserAvatar 
            user={user} 
            size={80} 
            className="border-4 border-slate-100 shadow-lg transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
import { useNavigate, useLocation } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext.jsx";
import nullp from "../../assets/images/nullp.jpg";

const SideMenu = () => {
  const { user, logout } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation(); // get current URL
  const currentPath = location.pathname;

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-slate-200 sticky top-[61px] z-20 flex flex-col py-6 transition-colors duration-300">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center mb-8 px-4">
        <div className="relative group cursor-pointer">
          <img
            src={
              user?.profileImageUrl && user.profileImageUrl.trim() !== ""
                ? user.profileImageUrl
                : nullp
            }
            alt="Profile Image"
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          </div>
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-secondary px-3 py-0.5 rounded-full mt-3 shadow-sm">
            Admin
          </div>
        )}

        <h5 className="text-slate-900 font-bold text-lg mt-3 text-center tracking-tight">
          {user?.name || ""}
        </h5>
        <p className="text-xs text-slate-500 text-center font-medium">{user?.email || ""}</p>
      </div>


      {/* Menu Items */}
      <div className="flex-1 px-3 space-y-1">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-3.5 text-[14px] font-medium transition-all duration-200 ${
              currentPath === item.path
                ? "text-primary bg-primary/5 border-r-4 border-primary"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-r-4 border-transparent"
            } py-3 px-4 rounded-l-xl`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className={`text-xl ${currentPath === item.path ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="px-6 py-4">
        <p className="text-[10px] text-slate-400 text-center">
            Task Manager v1.0
        </p>
      </div>
    </div>
  );
};

export default SideMenu;
