// // src/pages/ProductDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { fetchProductById, BASE_URL } from "../services/api";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchProductById(id)
//       .then((data) => setProduct(data))
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <p className="text-center py-8">Loading product…</p>;
//   if (error) return <p className="text-center py-8 text-red-600">{error}</p>;
//   if (!product) return <p className="text-center py-8">Product not found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <Link to="/shop" className="text-indigo-600 hover:underline text-sm">
//         &larr; Back to Shop
//       </Link>

//       <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>
//       <p className="mt-2 text-2xl text-indigo-600 font-semibold">
//         ${Number(product.price).toFixed(2)}
//       </p>

//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {product.images && product.images.length > 0 ? (
//           product.images.map((src, idx) => (
//             <img
//               key={idx}
//               src={`${BASE_URL}${src}`} // full URL
//               alt={`${product.name} ${idx + 1}`}
//               className="w-full h-64 object-cover rounded-lg shadow"
//             />
//           ))
//         ) : (
//           <div className="col-span-full w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
//             <span className="text-gray-500">No images available</span>
//           </div>
//         )}
//       </div>

//       <div className="mt-6 space-y-4">
//         <p className="text-gray-700">{product.description}</p>
//         <Link
//           to={`/ewarranty?product_id=${product.id}`}
//           className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
//         >
//           Register Warranty
//         </Link>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById, BASE_URL } from "../services/api"; // Assuming these are defined in ../services/api

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white font-inter">
        <p className="text-xl animate-pulse">Loading product…</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white font-inter">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white font-inter">
        <p className="text-xl text-gray-400">Product not found.</p>
      </div>
    );

  return (
    // Main container with dark background and Inter font
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Link
          to="/shop"
          className="text-orange-400 hover:text-orange-500 transition-colors duration-300 text-sm font-medium flex items-center mb-6"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Shop
        </Link>

        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {product.name}
          </h1>
          <p className="text-3xl md:text-4xl text-orange-500 font-bold">
            ${Number(product.price).toFixed(2)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.images && product.images.length > 0 ? (
              product.images.map((src, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL}${src}`} // full URL
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found";
                  }} // Fallback
                />
              ))
            ) : (
              <div className="col-span-full w-full h-64 bg-gray-700 flex items-center justify-center rounded-xl border border-gray-600 text-gray-400">
                <span>No images available</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed text-lg">
              {product.description}
            </p>
            <Link
              to={`/ewarranty?product_id=${product.id}`}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
            >
              Register Warranty
            </Link>
          </div>
        </div>
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
