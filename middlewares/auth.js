import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "only admin can access this route" });
};

export const isCostumer = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json({ message: "only customer can access this route" });
  }
  next();
};
export const isManager = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json({ message: "only manager can access this route" });
  }
  next();
};
