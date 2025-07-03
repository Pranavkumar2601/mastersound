// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAllProducts,
  getProductById,
  createProduct,
  addProductImage,
  addSerialNumber,
  updateProduct,
  deleteProduct,
} = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");

// Configure multer

// ─── Ensure uploads/products exists ──────────────────────────
const uploadDir = path.join(__dirname, "..", "uploads", "products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// ──────────────────────────────────────────────────────────────

// Now configure Multer to use that folder with sanitized filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${cleanName}`);
  },
});
const upload = multer({ storage });

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products
// Expects multipart/form-data with fields:
//   name, description, price, quantity, category_id, subcategory_id, serials (JSON array string)
//   files under 'images'
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        quantity,
        category_id,
        subcategory_id,
      } = req.body;
      // console.log("🔍 [DEBUG] req.body:", req.body);
      // console.log("🔍 [DEBUG] req.files:", req.files);

      // Parse serial numbers array
      let serials = [];
      try {
        serials = JSON.parse(req.body.serials || "[]");
      } catch {
        return res.status(400).json({ message: "Invalid serials format" });
      }

      // 1) Create product
      const productId = await createProduct({
        name,
        description,
        price,
        quantity,
        category_id,
        subcategory_id,
      });

      // 2) Save images
      for (const file of req.files) {
        const relativePath = path.join("/uploads/products", file.filename);
        await addProductImage(productId, relativePath);
      }

      // 3) Save serial numbers
      for (let s of serials) {
        s = s.trim().toUpperCase();
        if (!/^[A-Z0-9]+$/.test(s)) {
          return res.status(400).json({ message: `Invalid serial: ${s}` });
        }
        await addSerialNumber(productId, s);
      }

      res.status(201).json({ id: productId });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/products/:id
// Similar to POST: can update fields, add new images or serials if provided
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        quantity,
        category_id,
        subcategory_id,
      } = req.body;
      const productId = req.params.id;

      // 1) Update core fields
      await updateProduct(productId, {
        name,
        description,
        price,
        quantity,
        category_id,
        subcategory_id,
      });

      // 2) Save any new images
      for (const file of req.files) {
        const relativePath = path.join("/uploads/products", file.filename);
        await addProductImage(productId, relativePath);
      }

      // 3) Optionally parse & add any new serials
      if (req.body.serials) {
        let serials = JSON.parse(req.body.serials);
        for (let s of serials) {
          s = s.trim().toUpperCase();
          if (!/^[A-Z0-9]+$/.test(s)) {
            return res.status(400).json({ message: `Invalid serial: ${s}` });
          }
          await addSerialNumber(productId, s);
        }
      }

      res.json({ id: productId });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/products/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
