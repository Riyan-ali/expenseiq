"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Categories() {
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", type: "expense" });
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 New state for search

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
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      setEditId(null);
      setEditData({ name: "", type: "expense" });
      toast.success("Category updated!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category deleted!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(newCategory);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({ id: editId, data: editData });
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditData({ name: cat.name, type: cat.type });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this category?")) {
      deleteMutation.mutate(id);
    }
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
        <h1 className="text-2xl font-bold mb-4">Categories</h1>

        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full md:w-1/2 p-2 border rounded mb-4"
        />

        <button
          onClick={() => setShowAdd(true)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>

        {showAdd && (
          <form
            onSubmit={handleCreate}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Name"
              className="block w-full p-2 border mb-2"
            />
            <select
              value={newCategory.type}
              onChange={(e) =>
                setNewCategory({ ...newCategory, type: e.target.value })
              }
              className="block w-full p-2 border mb-2"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </form>
        )}

        {editId && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
              className="block w-full p-2 border mb-2"
            />
            <select
              value={editData.type}
              onChange={(e) =>
                setEditData({ ...editData, type: e.target.value })
              }
              className="block w-full p-2 border mb-2"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </form>
        )}

        <table className="w-full border-collapse border bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Slug</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((cat) => (
                <tr key={cat._id}>
                  <td className="border p-2">{cat.name}</td>
                  <td className="border p-2">{cat.type}</td>
                  <td className="border p-2">{cat.slug}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-yellow-500 text-white px-2 py-1 mr-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
