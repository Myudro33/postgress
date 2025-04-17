import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/emailService.js";
const prisma = new PrismaClient();
const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: { usersProducts: { include: { products: true } } },
    });
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const createUser = async (req, res) => {
  const { firstName, lastName, email, roleId = 1 } = req.body;
  try {
    const newUser = await prisma.users.create({
      data: { firstName, lastName, email, roleId },
    });
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, email, password: hashedPassword },
    });
    if (!updateUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({ data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.users.delete({
      where: { id: parseInt(id) },
    });
    if (!deletedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({
      message: "user deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.users.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
    res.json({ message: "user created", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: { email: email },
    include: { roles: true },
  });
  if (!user) {
    return res.status(500).json({ message: "incorect credentials" });
  }
  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    return res.status(401).json({ message: "wrong password" });
  }
  const token = jwt.sign(
    { id: user.id, role: user.roles.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  delete user.password;
  res.json({ message: "login success", token: token, data: user });
};
const profile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      include: { roles: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    delete user.password;
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.users.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  await prisma.otpCodes.create({
    data: {
      userId: user.id,
      code: otpCode,
      expiry: otpExpiry,
    },
  });
  try {
    const isEmailSent = await sendMail(
      email,
      "Password Reset OTP",
      `<h1>Password Reset OTP Code</h1>
        <p>You requested a password reset. Use the following OTP code to reset your password:</p>
        <h2 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center;">${otpCode}</h2>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>`
    );
    if (isEmailSent) {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          attempt: 0,
        },
      });
      res.json({ message: "OTP sent to email" });
    } else {
      res.status(500).json({ message: "server error", error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, otpCode, newPassword } = req.body;
  const user = await prisma.users.findUnique({
    where: { email: email },
    include: { otpCodes: true },
  });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  if (user.attempt == 5) {
    await prisma.otpCodes.deleteMany({
      where: { userId: user.id },
    });
    return res
      .status(400)
      .json({ message: "OTP deleted reason: too many attempts" });
  }
  if (user?.otpCodes[0]?.code !== otpCode) {
    await prisma.users.update({
      where: { id: user.id },
      data: {
        attempt: user.attempt + 1,
      },
    });
    return res.status(400).json({ message: "invalid OTP" });
  }
  const currentTime = new Date();
  if (user.otpCodes[0].expiry < currentTime) {
    return res.status(400).json({ message: "OTP expired" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: { password: hashedPassword, attempt: 0 },
  });
  await prisma.otpCodes.deleteMany({
    where: { userId: user.id },
  });
  if (!updatedUser) {
    return res.status(500).json({ message: "server error" });
  }
  res.json({ message: "password updated successfully" });
};

const uploadProfilePicture = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { profilePicture: file.path },
    });
    res.json({ message: "Profile picture updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};

export {
  signIn,
  signUp,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  profile,
  forgotPassword,
  resetPassword,
  uploadProfilePicture,
};
