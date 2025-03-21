import pool from "../config/db.config.js";
import slugify from "slugify";

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
const createProduct = async (req, res) => {
  const { name, price, description, stock, category } = req.body;
  try {
    const slug = slugify(name, {
      lower: true,
      strict: true,
      replacement: "-",
    });
    const newProduct = await pool.query(
      "INSERT INTO products (name, price, description, stock, category,slug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, price, description, stock, category, slug]
    );
    res.status(201).json({ data: newProduct.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, category } = req.body;
  try {
    const slug = name
      ? slugify(name, { lower: true, strict: true, replacement: "-" })
      : undefined;
    const updatedProduct = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name), 
           price = COALESCE($2, price), 
           description = COALESCE($3, description), 
           stock = COALESCE($4, stock), 
           category = COALESCE($5, category), 
           slug = COALESCE($6, slug)
       WHERE id = $7 
       RETURNING *`,
      [name, price, description, stock, category, slug, id]
    );
    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json({ data: updatedProduct.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedProduct.rows.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json({
      message: "product deleted successfully",
      data: deletedProduct.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
