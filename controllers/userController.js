import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { json } from "express";
import jwt from "jsonwebtoken";
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

export {
  signIn,
  signUp,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  profile,
};
