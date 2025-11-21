import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinstance";
import moment from "moment";
import { IoMdCard } from "react-icons/io";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#BD51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
  const user = useUserAuth();
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

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const onSeeMore = () => {
    navigate("/user/my-tasks");
  };

  useEffect(() => {
    const init = async () => {
      try {
        await axiosInstance.post(API_PATHS.AUTH.REFRESH);
      } catch {
        // If refresh fails, axiosInstance will handle logout
      } finally {
        fetchDashboard();
      }
    };
    init();
  }, []);

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  const pieChartData = [
    { name: "Pending", value: dashboardData?.statistics?.pendingTasks ?? 0 },
    {
      name: "In Progress",
      value: dashboardData?.statistics?.inProgressTasks ?? 0,
    },
    {
      name: "Completed",
      value: dashboardData?.statistics?.completedTasks ?? 0,
    },
  ];

  // Build bar chart data for user (could show task progress or other metrics)
  const barChartData = [
    {
      category: "My Tasks",
      count: dashboardData?.statistics?.totalTasks ?? 0,
    },
    {
      category: "Completed",
      count: dashboardData?.statistics?.completedTasks ?? 0,
    },
    {
      category: "In Progress",
      count: dashboardData?.statistics?.inProgressTasks ?? 0,
    },
  ];

  return (
    <DashboardLayout>
      <div className="card my-5 border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <div>
          <div className="col-span-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Good{" "}
              <span
                className={`${gradient} bg-clip-text text-transparent bg-[length:200%_200%]`}
                style={{ animation: "gradient 6s ease infinite" }}
              >
                {text}
              </span>{" "}
              {user?.name}
            </h1>
            <p className="text-xs md:text-[13px] text-slate-500 mt-1.5 font-medium">
              {moment().format("dddd Do MMMM YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.totalTasks ?? 0
            )}
            color="bg-primary"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Pending Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.pendingTasks ?? 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="In-Progress Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.inProgressTasks ?? 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Completed Tasks"
            value={addThousandSeparator(
              dashboardData?.statistics?.completedTasks ?? 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-bold text-slate-800 text-lg">My Task Distribution</h5>
            </div>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        <div>
          <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-bold text-slate-800 text-lg">Task Progress Overview</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-bold text-slate-800">My Recent Tasks</h5>
              <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors" onClick={onSeeMore}>
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

export default UserDashboard;
