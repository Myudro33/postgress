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
const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/signup").post(signUp);
router.route("/signIn").post(signIn);
router.route("/profile").get(profile);
export default router;
