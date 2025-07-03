// src/pages/admin/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import {
  fetchProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  fetchSubcategories,
} from "../../services/api";

export default function ProductManagement({ token }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
    subcategory_id: "",
    images: [],
    serials: [],
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, subsData] = await Promise.all([
        fetchProductsAdmin(token),
        fetchCategories(token),
        fetchSubcategories(token),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSubcategories(subsData);
    } catch (e) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm((f) => ({ ...f, images: files }));
    } else if (name === "quantity") {
      const qty = Number(value) || 0;
      setForm((f) => ({
        ...f,
        quantity: value,
        serials: Array(qty).fill(""),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSerialChange = (idx, val) => {
    setForm((f) => {
      const copy = [...f.serials];
      copy[idx] = val.trim().toUpperCase();
      return { ...f, serials: copy };
    });
  };

  const handleSave = async () => {
    setFormLoading(true);
    setError(null);
    try {
      if (
        form.serials.length !== Number(form.quantity) ||
        form.serials.some((s) => !s)
      ) {
        throw new Error(
          `Please enter exactly ${form.quantity} serial number(s).`
        );
      }
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("category_id", form.category_id);
      formData.append("subcategory_id", form.subcategory_id);
      Array.from(form.images).forEach((file) =>
        formData.append("images", file)
      );
      formData.append("serials", JSON.stringify(form.serials));

      if (editProductId) await updateProduct(editProductId, formData, token);
      else await createProduct(formData, token);

      setForm({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category_id: "",
        subcategory_id: "",
        images: [],
        serials: [],
      });
      setEditProductId(null);
      loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditProductId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: String(p.quantity),
      category_id: p.category_id || "",
      subcategory_id: p.subcategory_id || "",
      images: [],
      serials: Array.isArray(p.serials) ? p.serials : [],
    });
  };

  const handleRemove = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteProduct(id, token);
        loadData();
      } catch (e) {
        setError("Failed to delete product: " + e.message);
      }
    }
  };

  if (loading)
    return <p className="text-center py-8 text-gray-300">Loading…</p>;

  const rows = products.flatMap((p) => {
    const seqs =
      Array.isArray(p.serials) && p.serials.length ? p.serials : [null];
    return seqs.map((s, i) => ({
      ...p,
      displaySerial: s,
      rowKey: `${p.id}-${i}`,
    }));
  });

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl text-white mb-4">
          {editProductId ? "Edit" : "Add New"} Product
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={form.name}
            onChange={handleChange}
            disabled={formLoading}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={form.price}
            onChange={handleChange}
            disabled={formLoading}
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={form.quantity}
            onChange={handleChange}
            disabled={formLoading}
          />
          <select
            name="category_id"
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={form.category_id}
            onChange={handleChange}
            disabled={formLoading}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="subcategory_id"
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={form.subcategory_id}
            onChange={handleChange}
            disabled={formLoading || !form.category_id}
          >
            <option value="">None</option>
            {subcategories
              .filter((sc) => sc.category_id.toString() === form.category_id)
              .map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
          </select>
          <textarea
            name="description"
            rows="2"
            placeholder="Description"
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={form.description}
            onChange={handleChange}
            disabled={formLoading}
          />
          <div>
            <label className="text-white">Images</label>
            <input
              name="images"
              type="file"
              multiple
              onChange={handleChange}
              className="mt-1 text-sm text-gray-300"
              disabled={formLoading}
            />
          </div>
          {Array.from({ length: Number(form.quantity) || 0 }).map((_, i) => (
            <input
              key={i}
              placeholder={`Serial #${i + 1}`}
              className="w-full p-2 bg-gray-700 text-white rounded"
              value={form.serials[i] || ""}
              onChange={(e) => handleSerialChange(i, e.target.value)}
              disabled={formLoading}
            />
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="bg-orange-600 px-4 py-2 text-white rounded"
            disabled={formLoading}
          >
            Save
          </button>
          {editProductId && (
            <button
              onClick={() => {
                setEditProductId(null);
                setForm({
                  name: "",
                  description: "",
                  price: "",
                  quantity: "",
                  category_id: "",
                  subcategory_id: "",
                  images: [],
                  serials: [],
                });
              }}
              className="ml-2 bg-gray-600 px-4 py-2 text-white rounded"
              disabled={formLoading}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="bg-gray-800 p-4 rounded shadow overflow-x-auto">
        <table className="min-w-full text-gray-200">
          <thead className="border-b border-gray-700">
            <tr>
              {[
                "ID",
                "Name",
                "Price",
                "Qty",
                "Category",
                "Subcategory",
                "Serial",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-sm">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.rowKey}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="px-4 py-2 text-sm">{r.id}</td>
                <td className="px-4 py-2 text-sm">{r.name}</td>
                <td className="px-4 py-2 text-sm">
                  ${Number(r.price).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-sm">{r.quantity}</td>
                <td className="px-4 py-2 text-sm">
                  {categories.find((c) => c.id === r.category_id)?.name ||
                    "N/A"}
                </td>
                <td className="px-4 py-2 text-sm">
                  {subcategories.find((sc) => sc.id === r.subcategory_id)
                    ?.name || "-"}
                </td>
                <td className="px-4 py-2 text-sm">
                  {r.displaySerial || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(r.id)}
                    className="text-red-400 hover:underline"
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
