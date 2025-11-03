"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export default function Categories() {
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", type: "expense" });
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data.categories),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setShowAdd(false);
      setNewCategory({ name: "", type: "expense" });
      toast.success("Category added!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Error adding category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditId(null);
      setEditData({ name: "", type: "expense" });
      toast.success("Category updated!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Error updating category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category deleted!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Error deleting category"),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim())
      return toast.error("Category name is required!");
    createMutation.mutate(newCategory);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editData.name.trim()) return toast.error("Category name is required!");
    updateMutation.mutate({ id: editId, data: editData });
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditData({ name: cat.name, type: cat.type });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this category?")) deleteMutation.mutate(id);
  };

  const filteredCategories = categories?.filter((cat) => {
    const search = searchTerm.toLowerCase();
    return (
      cat.name.toLowerCase().includes(search) ||
      cat.type.toLowerCase().includes(search) ||
      cat.slug?.toLowerCase().includes(search)
    );
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
            >
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition"
          >
            Add Category
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {showAdd && (
          <form
            onSubmit={handleCreate}
            className="bg-white p-4 rounded-lg shadow mb-6 space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Category Name"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <select
                value={newCategory.type}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, type: e.target.value })
                }
                className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {editId && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-4 rounded-lg shadow mb-6 space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Category Name"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <select
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
                className="p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Slug</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories?.length > 0 ? (
                filteredCategories.map((cat, index) => (
                  <tr
                    key={cat._id}
                    className={`text-sm hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border p-3 text-gray-800">{cat.name}</td>
                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold capitalize ${
                          cat.type === "income" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {cat.type}
                      </span>
                    </td>
                    <td className="border p-3 text-gray-700">{cat.slug}</td>
                    <td className="border p-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs inline-flex items-center gap-1"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border p-4 text-center text-gray-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
