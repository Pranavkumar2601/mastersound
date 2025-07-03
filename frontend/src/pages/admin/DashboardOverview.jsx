// // frontend/src/pages/admin/DashboardOverview.jsx
// import React, { useState, useEffect } from "react";
// import {
//   fetchWarrantyAdmin,
//   fetchCategories,
//   fetchProductsAdmin,
// } from "../../services/api";

// export default function DashboardOverview({ token }) {
//   const [reqCount, setReqCount] = useState(0);
//   const [catCount, setCatCount] = useState(0);
//   const [prodCount, setProdCount] = useState(0);

//   useEffect(() => {
//     // Load counts for dashboard cards
//     fetchWarrantyAdmin(token)
//       .then((data) => setReqCount(data.length))
//       .catch(() => {});
//     fetchCategories(token)
//       .then((data) => setCatCount(data.length))
//       .catch(() => {});
//     fetchProductsAdmin(token)
//       .then((data) => setProdCount(data.length))
//       .catch(() => {});
//   }, [token]);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <Card title="Warranty Requests" count={reqCount} />
//         <Card title="Categories" count={catCount} />
//         <Card title="Products" count={prodCount} />
//       </div>
//     </div>
//   );
// }

// function Card({ title, count }) {
//   return (
//     <div className="p-4 bg-white rounded shadow text-center">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-3xl font-semibold">{count}</p>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import {
  fetchWarrantyAdmin,
  fetchCategories,
  fetchProductsAdmin,
} from "../../services/api"; // Ensure these are correctly imported

export default function DashboardOverview({ token }) {
  const [reqCount, setReqCount] = useState(0);
  const [catCount, setCatCount] = useState(0);
  const [prodCount, setProdCount] = useState(0);
  const [loading, setLoading] = useState(true); // Added loading state for the whole overview
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [warrantyData, categoryData, productData] = await Promise.all([
          fetchWarrantyAdmin(token),
          fetchCategories(token),
          fetchProductsAdmin(token),
        ]);
        setReqCount(warrantyData.length);
        setCatCount(categoryData.length);
        setProdCount(productData.length);
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading)
    return (
      <div className="text-center py-8 text-gray-300">
        <p className="text-xl animate-pulse">Loading dashboard data…</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    );

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Dashboard <span className="text-orange-500">Overview</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Warranty Requests" count={reqCount} />
        <Card title="Categories" count={catCount} />
        <Card title="Products" count={prodCount} />
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

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

function Card({ title, count }) {
  return (
    <div className="p-6 bg-gray-700 rounded-xl shadow-lg border border-gray-600 text-center transform hover:-translate-y-1 transition-all duration-300">
      <p className="text-sm text-gray-300 mb-2">{title}</p>
      <p className="text-4xl font-bold text-orange-400">{count}</p>
    </div>
  );
}
