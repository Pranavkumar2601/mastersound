// src/pages/admin/CategoryManagement.jsx
import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../../services/api";

export default function CategoryManagement({ token }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [editCatId, setEditCatId] = useState(null);
  const [editSubId, setEditSubId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        fetchCategories(token),
        fetchSubcategories(token),
      ]);
      setCategories(cats);
      setSubcategories(subs);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const resetForm = () => {
    setName("");
    setParentId("");
    setEditCatId(null);
    setEditSubId(null);
    setError(null);
  };

  const handleCatSave = async () => {
    setFormLoading(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error("Name required");
      if (editCatId) await updateCategory(editCatId, { name }, token);
      else await createCategory({ name }, token);
      resetForm();
      loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubSave = async () => {
    setFormLoading(true);
    setError(null);
    try {
      if (!name.trim() || !parentId)
        throw new Error("Name and category required");
      const data = { name, category_id: parentId };
      if (editSubId) await updateSubcategory(editSubId, data, token);
      else await createSubcategory(data, token);
      resetForm();
      loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveCat = async (id) => {
    if (window.confirm("Delete this category?")) {
      setFormLoading(true);
      try {
        await deleteCategory(id, token);
        loadData();
      } catch (e) {
        setError(e.message);
      } finally {
        setFormLoading(false);
      }
    }
  };
  const handleRemoveSub = async (id) => {
    if (window.confirm("Delete this subcategory?")) {
      setFormLoading(true);
      try {
        await deleteSubcategory(id, token);
        loadData();
      } catch (e) {
        setError(e.message);
      } finally {
        setFormLoading(false);
      }
    }
  };

  if (loading)
    return <p className="py-8 text-center text-gray-300">Loading…</p>;

  return (
    <div className="space-y-8">
      {error && <p className="text-red-500">{error}</p>}

      {/* Category Form */}
      <div className="bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl text-white mb-4">
          {editCatId ? "Edit Category" : "Add Category"}
        </h2>
        <div className="flex gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            disabled={formLoading}
          />
          <button
            onClick={handleCatSave}
            className="bg-orange-600 px-4 py-2 rounded text-white"
            disabled={formLoading}
          >
            {editCatId ? "Update" : "Create"}
          </button>
          {editCatId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 text-white rounded"
              disabled={formLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="bg-gray-800 p-4 rounded shadow overflow-x-auto">
        <h3 className="text-lg text-white mb-2">Categories</h3>
        <table className="min-w-full text-left text-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-gray-700">
                <td className="px-2 py-1">{c.id}</td>
                <td className="px-2 py-1">{c.name}</td>
                <td className="px-2 py-1 space-x-2">
                  <button
                    onClick={() => {
                      setEditCatId(c.id);
                      setName(c.name);
                    }}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveCat(c.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subcategory Form */}
      <div className="bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl text-white mb-4">
          {editSubId ? "Edit Subcategory" : "Add Subcategory"}
        </h2>
        <div className="flex gap-4">
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
            disabled={formLoading}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subcategory name"
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            disabled={formLoading}
          />
          <button
            onClick={handleSubSave}
            className="bg-orange-600 px-4 py-2 rounded text-white"
            disabled={formLoading}
          >
            {editSubId ? "Update" : "Create"}
          </button>
          {editSubId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 text-white rounded"
              disabled={formLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Subcategory List */}
      <div className="bg-gray-800 p-4 rounded shadow overflow-x-auto">
        <h3 className="text-lg text-white mb-2">Subcategories</h3>
        <table className="min-w-full text-left text-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Category</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sc) => (
              <tr key={sc.id} className="border-b border-gray-700">
                <td className="px-2 py-1">{sc.id}</td>
                <td className="px-2 py-1">{sc.name}</td>
                <td className="px-2 py-1">
                  {categories.find((c) => c.id === sc.category_id)?.name ||
                    "N/A"}
                </td>
                <td className="px-2 py-1 space-x-2">
                  <button
                    onClick={() => {
                      setEditSubId(sc.id);
                      setName(sc.name);
                      setParentId(sc.category_id);
                    }}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveSub(sc.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   fetchCategories,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// } from "../../services/api"; // Ensure these are correctly imported

// export default function CategoryManagement({ token }) {
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true); // Added loading state for initial fetch
//   const [formLoading, setFormLoading] = useState(false); // Loading state for form actions
//   const [error, setError] = useState(null); // Added error state

//   // Function to load categories
//   const loadCategories = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchCategories(token);
//       setCategories(data);
//     } catch (err) {
//       setError("Failed to fetch categories: " + err.message);
//       console.error("Error fetching categories:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, [token]);

//   const handleSave = async () => {
//     setFormLoading(true);
//     setError(null); // Clear previous errors
//     try {
//       if (!name.trim()) {
//         throw new Error("Category name cannot be empty.");
//       }
//       if (editId) {
//         await updateCategory(editId, { name }, token);
//       } else {
//         await createCategory({ name }, token);
//       }
//       setName("");
//       setEditId(null);
//       loadCategories(); // Reload data after save
//     } catch (e) {
//       setError("Failed to save category: " + e.message);
//       console.error("Error saving category:", e);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleRemove = async (id) => {
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       // Using window.confirm for simplicity in admin panel
//       setFormLoading(true); // Indicate action is in progress
//       setError(null);
//       try {
//         await deleteCategory(id, token);
//         loadCategories(); // Reload data after delete
//       } catch (e) {
//         setError("Failed to delete category: " + e.message);
//         console.error("Error deleting category:", e);
//       } finally {
//         setFormLoading(false);
//       }
//     }
//   };

//   const commonInputClasses =
//     "w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400";
//   const commonButtonClasses =
//     "bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out";

//   if (loading)
//     return (
//       <div className="text-center py-8 text-gray-300">
//         <p className="text-xl animate-pulse">Loading categories…</p>
//       </div>
//     );

//   return (
//     <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 animate-fade-in">
//       <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
//         Category <span className="text-orange-500">Management</span>
//       </h1>

//       {/* Add/Edit Category Form */}
//       <div className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-lg">
//         <h2 className="text-2xl font-bold text-white mb-6">
//           {editId ? "Edit Category" : "Add New Category"}
//         </h2>
//         <div className="flex flex-col sm:flex-row gap-4 mb-4">
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Category name"
//             className={`${commonInputClasses} flex-1`}
//             disabled={formLoading}
//           />
//           <button
//             onClick={handleSave}
//             className={commonButtonClasses}
//             disabled={formLoading || !name.trim()}
//           >
//             {formLoading
//               ? editId
//                 ? "Updating..."
//                 : "Adding..."
//               : editId
//               ? "Update Category"
//               : "Add Category"}
//           </button>
//           {editId && (
//             <button
//               onClick={() => {
//                 setName("");
//                 setEditId(null);
//                 setError(null); // Clear form-related error when canceling edit
//               }}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
//               disabled={formLoading}
//             >
//               Cancel Edit
//             </button>
//           )}
//         </div>
//         {error && (
//           <p className="text-red-500 text-center mt-4 animate-fade-in">
//             {error}
//           </p>
//         )}
//       </div>

//       {/* Category List */}
//       {categories.length === 0 ? (
//         <p className="text-center text-gray-400 py-8">No categories found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
//           <table className="min-w-full divide-y divide-gray-700">
//             <thead className="bg-gray-700">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
//                   ID
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-gray-800 divide-y divide-gray-700">
//               {categories.map((c) => (
//                 <tr
//                   key={c.id}
//                   className="hover:bg-gray-700 transition-colors duration-200"
//                 >
//                   <td className="px-4 py-3 text-sm text-gray-200">{c.id}</td>
//                   <td className="px-4 py-3 text-sm text-gray-200">{c.name}</td>
//                   <td className="px-4 py-3 text-sm space-x-2">
//                     <button
//                       onClick={() => {
//                         setEditId(c.id);
//                         setName(c.name);
//                       }}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleRemove(c.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Tailwind CSS custom animations and font import */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

//         .font-inter {
//           font-family: 'Inter', sans-serif;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.5s ease-out forwards;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
//         .animate-pulse {
//           animation: pulse 1.5s infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
