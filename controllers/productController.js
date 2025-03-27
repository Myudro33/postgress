import { PrismaClient } from "@prisma/client";
import pool from "../config/db.config.js";

const prisma = new PrismaClient();
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      include: { category: true },
    });
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return res.json({ message: "product doesnt found" });
    }
    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const createProduct = async (req, res) => {
  const { name, price, description, stock, category, slug } = req.body;
  try {
    const newProduct = await prisma.products.create({
      data: { name, price, category, description, slug, stock },
    });
    res.status(201).json({ data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, category, slug } = req.body;
  try {
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: { name, price, category, description, slug, stock },
    });
    if (!updateProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json({ data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    if (!deletedProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json({
      message: "product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const getCategoryStats = async (req, res) => {
  const result = await prisma.products.groupBy({
    by: ["category"],
    _count: true,
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
  });
  const formatedResult = result.map((item) => ({
    category: item.category,
    count: item._count,
    average: item._avg.price,
    min: item._min.price,
    max: item._max.price,
  }));
  res.json({ data: formatedResult });
};
const buyProduct = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const userProduct = await prisma.usersProducts.create({
      data: { productId: parseInt(id), userId: parseInt(userId) },
    });
    res.status(201).json({ data: userProduct });
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
  getCategoryStats,
  buyProduct,
};
