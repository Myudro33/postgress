import express from "express";
import upload from "../middlewares/uploadFile.js";
import SlugifyMiddleware from "../middlewares/SlugifyMiddleware.js";
import {
  buyProduct,
  createProduct,
  deleteProduct,
  getAllProducts,
  getCategoryStats,
  getProductById,
  updateProduct,
  uploadProductExcel,
} from "../controllers/productController.js";
import { auth, isManager, isCostumer } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("")
  .get(auth, isCostumer, getAllProducts)
  .post(auth, isManager, SlugifyMiddleware, createProduct);
router.route("/stats").get(auth, isManager, getCategoryStats);
router.route("/buyProduct/:id").post(auth, isCostumer, buyProduct);
router
  .route("/:id")
  .get(auth, isCostumer, getProductById)
  .put(SlugifyMiddleware, auth, isManager, updateProduct)
  .delete(auth, isManager, deleteProduct);
router
  .route("/upload-product-excel")
  .post(upload.single("products"), uploadProductExcel);
export default router;
