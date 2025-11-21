import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    switch (s) {
      case "completed":
        return "bg-green-50 text-green-600 border border-green-100";
      case "pending":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "in-progress":
      case "in progress":
        return "bg-cyan-50 text-cyan-600 border border-cyan-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    const p = String(priority || "")
      .trim()
      .toLowerCase();
    switch (p) {
      case "high":
        return "bg-red-50 text-red-600 border border-red-100";
      case "medium":
        return "bg-orange-50 text-orange-600 border border-orange-100";
      case "low":
        return "bg-green-50 text-green-600 border border-green-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  return (
    <div className="overflow-x-auto mt-4 rounded-xl border border-slate-100">
      <table className="min-w-full">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
              Name
            </th>
            <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
              Status
            </th>
            <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
              Priority
            </th>
            <th className="py-4 px-4 text-left text-slate-700 font-semibold text-sm">
              Created On
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tableData && tableData.length > 0 ? (
            tableData.map((task, index) => (
              <tr
                key={task._id}
                className="hover:bg-slate-50/80 transition-colors duration-200"
              >
                <td className="py-4 px-4 text-slate-700 text-sm font-medium truncate max-w-[200px]">
                  {task.title}
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadgeColor(
                      task.status
                    )}`}
                  >
                    {task.status ?? "N/A"}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority ?? "N/A"}
                  </span>
                </td>

                <td className="py-4 px-4 text-slate-500 text-sm whitespace-nowrap hidden md:table-cell">
                  {task.createdAt
                    ? moment(task.createdAt).format("Do MMM YYYY")
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center py-12 text-slate-400 text-sm italic"
              >
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
