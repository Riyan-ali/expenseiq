import { AuthProvider } from "../components/AuthContext";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "../components/QueryProvider";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "ExpenseIQ",
  description: "Next.js + React Query setup",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
