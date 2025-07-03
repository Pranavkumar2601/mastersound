// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // <— import the pool
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const warrantyRoutes = require("./routes/warrantyRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// console.log("categoryRoutes type:", typeof categoryRoutes, categoryRoutes);
app.use("/api/categories", categoryRoutes);
// console.log(
//   "subcategoryRoutes type:",
//   typeof subcategoryRoutes,
//   subcategoryRoutes
// );
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warranty", warrantyRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

// Health-check to verify DB connectivity
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ status: "ok", dbTest: rows[0].result });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// TODO: mount other routes here...

// backend/server.js
// const pool = require("./config/db");

app.get("/api/dbinfo", async (req, res) => {
  try {
    // Which database?
    const [[{ db }]] = await pool.query("SELECT DATABASE() AS db");
    // What columns does our table actually have?
    const [cols] = await pool.query("SHOW COLUMNS FROM warranty_registrations");
    res.json({ database: db, columns: cols.map((c) => c.Field) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
