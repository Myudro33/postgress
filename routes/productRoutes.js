import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";
const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
// router.put('/:id',productController.updateProduct)
// router.delete('/:id',productController.deleteProduct)

export default router;
