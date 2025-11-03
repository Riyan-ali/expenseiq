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
        <h1 className="text-2xl font-bold mb-4 text-center">New Transaction</h1>
        <TransactionForm onSubmit={handleSubmit} />
      </div>
    </ProtectedRoute>
  );
}
