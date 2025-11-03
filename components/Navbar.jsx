"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login" || pathname === "/register") return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={130}
            height={30}
            className="inline-block mr-2"
          />
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium hidden sm:block">
            {user?.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
