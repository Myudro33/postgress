import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

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
  const { name, price, description, stock = 10, categoryId, slug } = req.body;
  try {
    const newProduct = await prisma.products.create({
      data: { name, price, categoryId, description, slug, stock },
    });
    res.status(201).json({ data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: req.body,
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
  const userId = req.user.id;
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    if (product.stock < 1) {
      return res.status(404).json({ message: "product is out of stock" });
    }
    await prisma.products.update({
      where: { id: parseInt(id) },
      data: { stock: product.stock - 1 },
    });
    const userProduct = await prisma.usersProducts.create({
      data: { productId: parseInt(id), userId: parseInt(userId) },
    });
    res
      .status(201)
      .json({ message: "You bought product successfully", data: userProduct });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};

const uploadProductExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  const products = data.map((item) => ({
    name: item.name,
    price: item.price,
    description: item.description,
    stock: item.stock,
    categoryId: item.categoryId,
    slug: item.slug,
  }));
  const createdProducts = await prisma.products.createMany({
    data: products,
  });
  res.status(201).json({
    message: "Products uploaded successfully",
    data: createdProducts,
  });
  const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
  buyProduct,
  uploadProductExcel,
};
