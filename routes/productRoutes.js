import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
// router.delete('/:id',productController.deleteProduct)

export default router;
