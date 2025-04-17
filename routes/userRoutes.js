import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  profile,
  signIn,
  signUp,
  updateUser,
  forgotPassword,
  resetPassword,
  uploadProfilePicture,
} from "../controllers/userController.js";
import upload from "../middlewares/uploadFile.js";
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
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router
  .route("/upload-profile-picture/:id")
  .post(auth, upload.single("profilePicture"), uploadProfilePicture);

export default router;
