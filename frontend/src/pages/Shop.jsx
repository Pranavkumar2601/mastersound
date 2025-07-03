import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, BASE_URL } from "../services/api";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ← new state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white font-inter">
        <p className="text-xl animate-pulse">Loading products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white font-inter">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Filter products based on the search term (case-insensitive)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white font-inter antialiased py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Explore Our <span className="text-orange-500">Products</span>
      </h2>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Search products by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 hover:border-orange-500 transform hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
            >
              <Link to={`/shop/${p.id}`}>
                <img
                  src={
                    p.images && p.images.length > 0
                      ? `${BASE_URL}${p.images[0]}`
                      : "https://placehold.co/600x400/333333/FFFFFF?text=Product+Image"
                  }
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Found";
                  }}
                />
              </Link>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {p.name}
                </h3>
                <p className="mt-1 text-orange-500 font-bold text-2xl">
                  ₹{Number(p.price).toFixed(2)}
                </p>
                <Link
                  to={`/shop/${p.id}`}
                  className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No products found matching “{searchTerm}.”
          </p>
        )}
      </div>

      {/* Tailwind CSS custom animations and font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        .animate-pulse { animation: pulse 1.5s infinite; }
      `}</style>
    </div>
  );
}
