import express from "express";
import SlugifyMiddleware from "../middlewares/SlugifyMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
const router = express.Router();

router.route("").get(getAllProducts).post(SlugifyMiddleware, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(SlugifyMiddleware, updateProduct)
  .delete(deleteProduct);

export default router;
