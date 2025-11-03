"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import TransactionTable from "../../components/TransactionTable";

export default function Transactions() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Transactions</h1>
        <TransactionTable />
      </div>
    </ProtectedRoute>
  );
}
