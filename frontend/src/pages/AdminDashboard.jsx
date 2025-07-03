import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardOverview from "./admin/DashboardOverview";
import EWarrantyManagement from "./admin/EWarrantyManagement";
import CategoryManagement from "./admin/CategoryManagement";
import ProductManagement from "./admin/ProductManagement";

export default function AdminDashboard() {
  const [section, setSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile sidebar
  const navigate = useNavigate();
  const token = localStorage.getItem("ms_token");

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ms_token");
    navigate("/admin/login");
  };

  const handleSectionChange = (sec) => {
    setSection(sec);
    setMobileMenuOpen(false); // Close mobile menu on section selection
  };

  return (
    // Main container with dark background and Inter font
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter antialiased">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-75 sm:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl border-r border-gray-700 p-6 flex flex-col justify-between
                   transform transition-transform duration-300 ease-in-out
                   ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                   sm:relative sm:translate-x-0 sm:flex`} // Always visible on sm and larger screens
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-orange-500 text-center">
              MasterSound Admin
            </h2>
            {/* Close button for mobile sidebar */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="sm:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {["dashboard", "ewarranty", "categories", "products"].map((sec) => (
            <button
              key={sec}
              onClick={() => handleSectionChange(sec)}
              className={`block w-full text-left px-4 py-3 mb-3 rounded-xl transition-all duration-300 ease-in-out font-medium
                ${
                  section === sec
                    ? "bg-orange-600 text-white shadow-lg transform scale-100 hover:scale-105"
                    : "text-gray-300 hover:bg-gray-800 hover:text-orange-400"
                }`}
            >
              {sec === "ewarranty"
                ? "E-Warranty"
                : sec.charAt(0).toUpperCase() + sec.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out mt-8"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 bg-black bg-opacity-50 relative overflow-auto">
        {/* Hamburger menu for mobile */}
        <div className="flex justify-end sm:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
            aria-label="Open menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Background gradient circles for visual flair in main content area */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 animate-fade-in">
          {section === "dashboard" && <DashboardOverview token={token} />}
          {section === "ewarranty" && <EWarrantyManagement token={token} />}
          {section === "categories" && <CategoryManagement token={token} />}
          {section === "products" && <ProductManagement token={token} />}
        </div>
      </main>

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

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.0, 0.99);
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
