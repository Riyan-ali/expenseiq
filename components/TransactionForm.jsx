"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";
import CategorySelector from "./CategorySelector";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

export default function TransactionForm({ onSubmit, existingData, isEdit }) {
  const [selectedType, setSelectedType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      amount: "",
      description: "",
      categoryId: "",
      date: "",
      priority: "",
    },
  });

  useEffect(() => {
    if (existingData) {
      reset({
        ...existingData,
        categoryId: existingData.categoryId._id || "",
      });
      setSelectedType(existingData.type);
      setSelectedCategory(existingData.categoryId._id || "");
    }
  }, [existingData, reset]);

  const onFormSubmit = async (data) => {
    console.log("Form Data:", data);
    const payload = { ...data, type: selectedType };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") delete payload[key];
    });

    try {
      if (isEdit) {
        await api.put(`/transactions/${existingData._id}`, payload);
        toast.success("Transaction updated!");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transaction added!");
      }

      reset();
      setSelectedCategory("");
      onSubmit?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
    >
      <select
        value={selectedType}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedType(value);
          setValue("type", value);
        }}
        className="block w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        {...register("amount")}
        type="number"
        placeholder="Amount"
        className="block w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}

      <input
        {...register("description")}
        placeholder="Description"
        className="block w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <CategorySelector
        type={selectedType}
        value={selectedCategory}
        onChange={(value) => {
          setSelectedCategory(value);
          setValue("categoryId", value);
        }}
      />

      <input
        {...register("date")}
        type="date"
        className="block w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
      />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

      <select
        {...register("priority")}
        className="block w-full p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
        defaultValue=""
      >
        <option value="">Select Priority (optional)</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
      >
        {isEdit ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}
