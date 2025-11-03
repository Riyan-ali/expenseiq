"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export default function CategorySelector({ type, value, onChange }) {
  const [newCat, setNewCat] = useState("");
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      api
        .get("/categories")
        .then((res) => res.data.categories.filter((cat) => cat.type === type)),
    enabled: !!type,
  });

  const addNew = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;

    try {
      const res = await api.post("/categories", { name: newCat.trim(), type });

      await queryClient.invalidateQueries(["categories", type]);

      const newCategoryId = res.data.category._id;
      onChange(newCategoryId);
      setNewCat("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category"
          className="p-2 border flex-1 rounded"
        />
        <button
          onClick={addNew}
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}
