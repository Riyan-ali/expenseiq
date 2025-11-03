"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#FF6384",
];

export default function Chart({ data, type = "line", byCategory = [] }) {
  if (type === "pie" && byCategory.length > 0) {
    const formattedData = byCategory.map((item) => ({
      categoryName: item._id.categoryName,
      total: item.total,
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(2)}%`
            }
            outerRadius={90}
            fill="#8884d8"
            dataKey="total"
            nameKey="categoryName"
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `₹${value}`,
              props.payload.categoryName,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const grouped = {};
  data.forEach((item) => {
    const date = item._id;
    if (!grouped[date]) grouped[date] = { date, income: 0, expense: 0 };
    if (item.type === "income") grouped[date].income = item.total;
    else grouped[date].expense = item.total;
  });

  const processedData = Object.values(grouped);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#FF8042"
          name="Expense"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
