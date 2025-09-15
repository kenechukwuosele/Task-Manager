import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomPieChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"   
          nameKey="name"   
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          label={({ name, value }) => `${name} (${value})`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`} // 👈 also updated
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value, entry) =>
            `${entry.payload.name} (${entry.payload.value})`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
