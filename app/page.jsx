"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
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
    setDateRange({ from, to });
  }, []);

  const { data: summary, isLoading } = useQuery({
    queryKey: ["summary", dateRange],
    queryFn: () =>
      api
        .get(`/reports/summary?from=${dateRange.from}&to=${dateRange.to}`)
        .then((res) => res.data),
  });

  const income = summary?.totals?.find((t) => t._id === "income")?.total || 0;
  const expense = summary?.totals?.find((t) => t._id === "expense")?.total || 0;
  const balance = income - expense;

  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Date Range Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              From
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              To
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        {isLoading ? (
          <p>Loading summary...</p>
        ) : (
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
        )}

        {/* Quick Links */}
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="📊 Reports"
            desc="View detailed income & expense analytics."
            href="/reports"
            color="bg-blue-100 hover:bg-blue-200"
          />
          <DashboardCard
            title="💰 Transactions"
            desc="See and manage all your transactions."
            href="/transactions"
            color="bg-purple-100 hover:bg-purple-200"
          />
          <DashboardCard
            title="➕ Add Transaction"
            desc="Record a new income or expense."
            href="/transactions/new"
            color="bg-green-100 hover:bg-green-200"
          />
          <DashboardCard
            title="🗂️ Category Management"
            desc="Create/Edit categories for better tracking."
            href="/categories"
            color="bg-yellow-100 hover:bg-yellow-200"
          />
          <DashboardCard
            title="👤 Profile"
            desc="View or update your profile and password."
            href="/profile"
            color="bg-pink-100 hover:bg-pink-200"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function DashboardCard({ title, desc, href, color }) {
  return (
    <Link
      href={href}
      className={`${color} block p-5 rounded-lg shadow transition-all duration-200 hover:shadow-md`}
    >
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-700 text-sm">{desc}</p>
    </Link>
  );
}
