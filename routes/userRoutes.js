import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  profile,
  signIn,
  signUp,
  updateUser,
} from "../controllers/userController.js";
import { auth, isAdmin, isCostumer } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").get(auth, isAdmin, getUsers).post(auth, isAdmin, createUser);
router
  .route("/:id")
  .put(auth, isAdmin, updateUser)
  .delete(auth, isAdmin, deleteUser);
router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
router.route("/profile").get(auth, isCostumer, profile);

export default router;
