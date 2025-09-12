import React, { useEffect, useState, useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinstance";
import moment from "moment";
import { IoMdCard } from "react-icons/io";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const greetings = {
    morning: {
      text: "Morning",
      gradient: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
    },
    afternoon: {
      text: "Afternoon",
      gradient: "bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600",
    },
    evening: {
      text: "Evening",
      gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
    },
  };

  const getGreeting = () => {
    const hour = moment().hour();
    if (hour < 12) return greetings.morning;
    if (hour < 18) return greetings.afternoon;
    return greetings.evening;
  };

  const { text, gradient } = getGreeting();

  // Fetch dashboard safely
  const fetchDashboard = async () => {
    try {
      const endpoint =
        user?.role === "admin"
          ? API_PATHS.TASKS.GET_DASHBOARD_DATA
          : API_PATHS.TASKS.GET_USER_DASHBOARD_DATA;

      const response = await axiosInstance.get(endpoint);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore  = async () => {
    navigate('/admin/tasks')
  }

  // On mount: attempt refresh first
  useEffect(() => {
    const init = async () => {
      try {
        await axiosInstance.post(API_PATHS.AUTH.REFRESH); // refresh access token if possible
      } catch {
        // If refresh fails, axiosInstance will handle logout
      } finally {
        fetchDashboard(); // only call dashboard after refresh attempt
      }
    };

    init();
  }, []);

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              Good{" "}
              <span
                className={`${gradient} bg-clip-text text-transparent bg-[length:200%_200%]`}
                style={{ animation: "gradient 6s ease infinite" }}
              >
                {text}
              </span>{" "}
              {user?.name}
            </h1>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.totalTasks ||
                dashboardData?.charts?.taskDistribution?.all ||
                0
            )}
            color="bg-primary"
          />

          <InfoCard
            icon={<IoMdCard />}
            label="Pending Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.pendingTasks ||
                dashboardData?.charts?.taskDistribution?.pending ||
                0
            )}
            color="bg-violet-500"
          />

          <InfoCard
            icon={<IoMdCard />}
            label="In-Progress Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.inProgressTasks ||
                dashboardData?.charts?.taskDistribution?.["in-progress"] ||
                0
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            icon={<IoMdCard />}
            label="Completed Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.completedTasks ||
                dashboardData?.charts?.taskDistribution?.completed ||
                0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
