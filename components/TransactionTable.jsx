"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import TransactionModal from "./TransactionModal";

export default function TransactionTable() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: "",
    category: "",
    from: "",
    to: "",
    q: "",
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () =>
      api.get("/transactions", { params: filters }).then((res) => res.data),
    keepPreviousData: true,
  });

  const handleTempChange = (key, value) =>
    setTempFilters((prev) => ({ ...prev, [key]: value }));

  const applyFilters = () => setFilters(tempFilters);
  const resetFilters = () => {
    setTempFilters({
      page: 1,
      limit: 10,
      type: "",
      category: "",
      from: "",
      to: "",
      q: "",
    });
    setFilters({
      page: 1,
      limit: 10,
      type: "",
      category: "",
      from: "",
      to: "",
      q: "",
    });
  };

  const handlePageChange = (page) => setFilters((prev) => ({ ...prev, page }));

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted!");
      refetch();
    } catch (err) {
      toast.error("Error deleting transaction");
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Search
          </label>
          <input
            value={tempFilters.q}
            onChange={(e) => handleTempChange("q", e.target.value)}
            placeholder="Description..."
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Type
          </label>
          <select
            value={tempFilters.type}
            onChange={(e) => handleTempChange("type", e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            From
          </label>
          <input
            type="date"
            value={tempFilters.from}
            onChange={(e) => handleTempChange("from", e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">To</label>
          <input
            type="date"
            value={tempFilters.to}
            onChange={(e) => handleTempChange("to", e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <input
            value={tempFilters.category}
            onChange={(e) => handleTempChange("category", e.target.value)}
            placeholder="Category"
            className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex gap-2 mt-5 sm:mt-0">
          <button
            onClick={applyFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded transition"
          >
            Reset
          </button>
          <button
            onClick={() => (window.location.href = "/transactions/new")}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="border p-3 text-left">Date</th>
              <th className="border p-3 text-left">Type</th>
              <th className="border p-3 text-left">Amount</th>
              <th className="border p-3 text-left">Description</th>
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3 text-left">Priority</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.length ? (
              data.data.map((t, index) => (
                <tr
                  key={t._id}
                  className={`text-sm hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="border p-3">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold capitalize ${
                        t.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="border p-3 font-medium text-gray-800">
                    ₹{t.amount}
                  </td>
                  <td className="border p-3 text-gray-700">{t.description}</td>
                  <td className="border p-3 text-gray-700">{t.categoryName}</td>
                  <td className="border p-3 text-gray-700">
                    {t.priority || "-"}
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    <button
                      onClick={() => setEditingTransaction(t)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 inline-flex"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 inline-flex"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border p-4 text-center text-gray-500"
                  colSpan="7"
                >
                  {isFetching
                    ? "Loading transactions..."
                    : "No transactions found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded shadow text-sm mt-4">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          >
            Prev
          </button>

          <span className="my-2 sm:my-0 text-gray-700">
            Page <strong>{data.meta.page}</strong> of{" "}
            <strong>{data.meta.totalPages}</strong> (Total: {data.meta.total})
          </span>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === data.meta.totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          >
            Next
          </button>
        </div>
      )}

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdated={() => {
            setEditingTransaction(null);
            refetch();
          }}
        />
      )}
    </>
  );
}
