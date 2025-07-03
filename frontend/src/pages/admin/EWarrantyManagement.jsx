// src/pages/admin/EWarrantyManagement.jsx
import React, { useState, useEffect } from "react";
import {
  fetchWarrantyAdmin,
  updateWarrantyStatusAdmin,
  deleteWarrantyAdmin,
} from "../../services/api";

export default function EWarrantyManagement({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ← New search state
  const [searchTerm, setSearchTerm] = useState("");

  // Refetch helper
  const refetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWarrantyAdmin(token);
      setRequests(data);
    } catch (err) {
      setError("Failed to fetch warranty requests: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchRequests();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    try {
      setError(null);
      await updateWarrantyStatusAdmin(id, status, token);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      setError("Failed to update status: " + err.message);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try {
      setError(null);
      await deleteWarrantyAdmin(id, token);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError("Failed to delete request: " + err.message);
      console.error(err);
    }
  };

  // ← Filtered list by serial (case-insensitive)
  const filteredRequests = requests.filter((r) =>
    r.serial.toUpperCase().includes(searchTerm.toUpperCase())
  );

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-300">
        <p className="text-xl animate-pulse">Loading E-Warranty requests…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        E-Warranty <span className="text-orange-500">Requests</span>
      </h1>

      {/* ← Search Bar */}
      <div className="mb-6 max-w-xs">
        <input
          type="text"
          placeholder="Search serial…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
        />
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          No warranty requests matching “{searchTerm}.”
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                {[
                  "Serial",
                  "Product",
                  "Name",
                  "Email",
                  "Phone",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredRequests.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {r.serial}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {r.product_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {r.user_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {r.user_email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {r.user_phone || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {new Date(r.registered_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          r.status === "pending"
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                            : ""
                        }
                        ${
                          r.status === "accepted"
                            ? "bg-green-500 bg-opacity-20 text-green-300"
                            : ""
                        }
                        ${
                          r.status === "rejected"
                            ? "bg-red-500 bg-opacity-20 text-red-300"
                            : ""
                        }
                      `}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(r.id, "accepted")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(r.id, "rejected")}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tailwind custom animations & font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes pulse { 0%,100% { opacity:1;} 50% { opacity:0.5;} }
        .animate-pulse { animation: pulse 1.5s infinite; }
      `}</style>
    </div>
  );
}
