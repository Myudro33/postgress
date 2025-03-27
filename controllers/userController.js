import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const newUser = await prisma.users.create({
      data: { firstName, lastName, email },
    });
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.stack });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  try {
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, email },
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

export { getUsers, createUser, updateUser, deleteUser };
