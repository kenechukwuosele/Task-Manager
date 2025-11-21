import React, { useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { LuDownload, LuFileText, LuUsers, LuBarcode } from "react-icons/lu";

const Reports = () => {
  const [loading, setLoading] = useState({
    tasks: false,
    users: false,
  });

  const handleExportTasks = async () => {
    setLoading((prev) => ({ ...prev, tasks: true }));
    try {
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_TASKS, {
        responseType: "blob", // Important for file downloads
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Tasks report downloaded successfully");
    } catch (error) {
      console.error("Error exporting tasks:", error);
      toast.error("Failed to export tasks report");
    } finally {
      setLoading((prev) => ({ ...prev, tasks: false }));
    }
  };

  const handleExportUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USERS, {
        responseType: "blob", // Important for file downloads
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Users report downloaded successfully");
    } catch (error) {
      console.error("Error exporting users:", error);
      toast.error("Failed to export users report");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const reportCards = [
    {
      title: "Tasks Report",
      description:
        "Export all tasks with details including status, priority, assignments, and due dates",
      icon: <LuFileText size={24} />,
      color: "bg-blue-500",
      onClick: handleExportTasks,
      loading: loading.tasks,
      buttonText: "Export Tasks",
    },
    {
      title: "Users Report",
      description:
        "Export user information with task statistics, roles, and activity metrics",
      icon: <LuUsers size={24} />,
      color: "bg-green-500",
      onClick: handleExportUsers,
      loading: loading.users,
      buttonText: "Export Users",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mt-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-slate-500 mt-2">
            Export comprehensive reports for tasks and users in Excel format
          </p>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reportCards.map((card, index) => (
            <div
              key={index}
              className="glass-card p-6 border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    card.color
                  } text-white shadow-lg shadow-${
                    card.color.split("-")[1]
                  }-500/30`}
                >
                  {card.icon}
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <LuBarcode size={20} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">
                {card.title}
              </h3>

              <p className="text-slate-600 text-sm mb-6 leading-relaxed min-h-[40px]">
                {card.description}
              </p>

              <button
                onClick={card.onClick}
                disabled={card.loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${
                  card.loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                }`}
              >
                {card.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <LuDownload size={18} />
                    <span>{card.buttonText}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="glass-card p-8 border border-slate-100 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Report Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Tasks Report Includes
              </h4>
              <ul className="text-sm text-slate-600 space-y-2 pl-4 border-l-2 border-slate-100">
                <li>Task ID and Name</li>
                <li>Description and Status</li>
                <li>Assigned Users</li>
                <li>Due Dates and Priority</li>
                <li>Creation Date</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Users Report Includes
              </h4>
              <ul className="text-sm text-slate-600 space-y-2 pl-4 border-l-2 border-slate-100">
                <li>User ID and Name</li>
                <li>Email and Role</li>
                <li>Total Tasks Assigned</li>
                <li>Task Status Breakdown</li>
                <li>Overdue Tasks Count</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-800 mb-3">
            How to Use Reports
          </h3>
          <div className="text-blue-700/80 text-sm space-y-2">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Click the "Export" button for the desired report type
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              The Excel file will automatically download to your device
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Reports are generated in real-time with the latest data
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Use these reports for analysis, backups, or external systems
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
