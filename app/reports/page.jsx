"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Chart from "../../components/Chart";

export default function Reports() {
  const router = useRouter();
  const [range, setRange] = useState({ from: "", to: "" });
  const now = new Date();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const from = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const to = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    setRange({ from, to });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["reports", range],
    queryFn: () =>
      api
        .get(`/reports/summary?from=${range.from}&to=${range.to}`)
        .then((res) => res.data),
    enabled: !!range.from && !!range.to,
  });

  const handleCurrentMonth = () => {
    const from = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const to = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    setRange({ from, to });
  };

  const income = data?.totals?.find((t) => t._id === "income")?.total || 0;
  const expense = data?.totals?.find((t) => t._id === "expense")?.total || 0;
  const balance = income - expense;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold">Reports Summary</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          type="date"
          value={range.from}
          onChange={(e) => setRange({ ...range, from: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={range.to}
          onChange={(e) => setRange({ ...range, to: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={handleCurrentMonth}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Current Month
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-green-700">Income</h3>
              <p className="text-2xl font-bold text-green-800">₹{income}</p>
            </div>
            <div className="bg-red-100 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-red-700">Expense</h3>
              <p className="text-2xl font-bold text-red-800">₹{expense}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-yellow-700">Balance</h3>
              <p className="text-2xl font-bold text-yellow-800">₹{balance}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Income vs Expense</h2>
              <Chart data={data?.timeSeries || []} type="line" />
            </div>
            <div className="flex-1 bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">By Category</h2>
              <Chart data={[]} byCategory={data?.byCategory || []} type="pie" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
