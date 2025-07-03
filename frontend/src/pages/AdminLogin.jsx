import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api"; // Keep existing import

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission
    setError("");
    try {
      const { token } = await loginAdmin(credentials);
      localStorage.setItem("ms_token", token);
      navigate("/admin/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); // Set loading to false after submission (success or error)
    }
  };

  // Common Tailwind CSS classes for inputs and buttons
  const commonInputClasses =
    "mt-1 w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400";
  const commonButtonClasses =
    "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out";

  return (
    // Main container with dark background and Inter font
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white font-inter antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 space-y-6 animate-fade-in">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-6">
          <span className="text-orange-500">Admin</span> Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className={commonInputClasses}
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className={commonInputClasses}
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center animate-fade-in">
              {error}
            </p>
          )}
          <div>
            <button
              type="submit"
              className={commonButtonClasses}
              disabled={loading || !credentials.email || !credentials.password} // Disable if fields are empty or loading
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>

      {/* Tailwind CSS custom animations and font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
