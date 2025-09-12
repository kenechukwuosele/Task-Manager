import React from "react";
import moment from "moment";

const TaskListTable = ({ tableData = [] }) => {
  const getStatusBadgeColor = (status) => {
    const s = String(status || "").trim().toLowerCase();
    switch (s) {
      case "completed":
        return "bg-green-100 text-green-600 border border-green-200 font-medium";
      case "pending":
        return "bg-purple-100 text-purple-600 border border-purple-200 font-medium";
      case "in-progress":
      case "in progress":
        return "bg-cyan-100 text-cyan-600 border border-cyan-200 font-medium";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200 font-medium";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    const p = String(priority || "").trim().toLowerCase();
    switch (p) {
      case "high":
        return "bg-red-100 text-red-600 border border-red-200 font-medium";
      case "medium":
        return "bg-orange-100 text-orange-600 border border-orange-200 font-medium";
      case "low":
        return "bg-green-100 text-green-600 border border-green-200 font-medium";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200 font-medium";
    }
  };

  return (
    <div className="overflow-x-auto mt-4 shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="py-3 px-4 text-left text-gray-800 font-semibold text-sm">
              Name
            </th>
            <th className="py-3 px-4 text-left text-gray-800 font-semibold text-sm">
              Status
            </th>
            <th className="py-3 px-4 text-left text-gray-800 font-semibold text-sm">
              Priority
            </th>
            <th className="py-3 px-4 text-left text-gray-800 font-semibold text-sm">
              Created On
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData && tableData.length > 0 ? (
            tableData.map((task, index) => (
              <tr
                key={task._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="py-3 px-4 text-gray-700 text-sm font-medium truncate max-w-[200px]">
                  {task.title}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusBadgeColor(
                      task.status
                    )}`}
                  >
                    {task.status ?? "N/A"}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority ?? "N/A"}
                  </span>
                </td>

                <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap hidden md:table-cell">
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
                className="text-center p-6 text-gray-500 text-sm italic"
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
