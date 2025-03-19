import pool from "../config/db.config.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    res.json({ data: products.rows });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (products.rows.length === 0) {
      return res.json({ message: "product doesnt found" });
    }
    res.json({ data: products.rows });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};

export { getAllProducts, getProductById };
