"use client";
import TransactionForm from "../../../components/TransactionForm";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function NewTransaction() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/transactions");
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-center">New Transaction</h1>
        </div>
        <TransactionForm onSubmit={handleSubmit} />
      </div>
    </ProtectedRoute>
  );
}
