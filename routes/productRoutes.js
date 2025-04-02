import express from "express";
import SlugifyMiddleware from "../middlewares/SlugifyMiddleware.js";
import {
  buyProduct,
  createProduct,
  deleteProduct,
  getAllProducts,
  getCategoryStats,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.route("").get(getAllProducts).post(SlugifyMiddleware, createProduct);
router.route("/stats").get(getCategoryStats);
router.route("/buyProduct/:id").post(auth, buyProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(SlugifyMiddleware, updateProduct)
  .delete(deleteProduct);
export default router;
