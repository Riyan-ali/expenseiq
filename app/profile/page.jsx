"use client";
import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import api from "../../lib/api";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, logout } = useAuth();
  const [changePw, setChangePw] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const router = useRouter();

  const handleChangePw = async (e) => {
    e.preventDefault();

    if (
      changePw.current.length < 6 ||
      changePw.new.length < 6 ||
      changePw.confirm.length < 6
    ) {
      toast.error("Passwords must be at least 6 characters long");
      return;
    }

    if (changePw.new === changePw.current) {
      toast.error("New password must be different from current password");
      return;
    }

    if (changePw.new !== changePw.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await api.put("/auth/change-password", changePw);
      toast.success("Password changed!");
      setChangePw({ current: "", new: "", confirm: "" });
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center gap-3 my-3">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md transition-colors"
        >
          Back
        </button>
        <h1 className="text-2xl font-semibold text-center">Profile</h1>
      </div>
      <div className="flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="mb-1">
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>

          <form onSubmit={handleChangePw}>
            <h2 className="text-xl font-medium mb-3 text-center">
              Change Password
            </h2>

            <div className="relative mb-4">
              <input
                type={showPw.current ? "text" : "password"}
                value={changePw.current}
                onChange={(e) =>
                  setChangePw({ ...changePw, current: e.target.value })
                }
                placeholder="Current Password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPw({ ...showPw, current: !showPw.current })
                }
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPw.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showPw.new ? "text" : "password"}
                value={changePw.new}
                onChange={(e) =>
                  setChangePw({ ...changePw, new: e.target.value })
                }
                placeholder="New Password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw({ ...showPw, new: !showPw.new })}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPw.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showPw.confirm ? "text" : "password"}
                value={changePw.confirm}
                onChange={(e) =>
                  setChangePw({ ...changePw, confirm: e.target.value })
                }
                placeholder="Confirm New Password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPw({ ...showPw, confirm: !showPw.confirm })
                }
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPw.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Update Password
            </button>
          </form>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
