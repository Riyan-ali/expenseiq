"use client";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import TransactionTable from "../../components/TransactionTable";

export default function Transactions() {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
          >
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        </div>
        <TransactionTable />
      </div>
    </ProtectedRoute>
  );
}
