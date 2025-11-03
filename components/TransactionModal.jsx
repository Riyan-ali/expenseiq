"use client";
import TransactionForm from "./TransactionForm";
import { X } from "lucide-react";

export default function TransactionModal({ transaction, onClose, onUpdated }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>

        <TransactionForm
          existingData={transaction}
          isEdit
          onSubmit={onUpdated}
        />
      </div>
    </div>
  );
}
