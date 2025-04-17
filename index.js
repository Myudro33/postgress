import dotenv from "dotenv";
import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swaggerUI from "swagger-ui-express";
import specs from "./models/swagger.js";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/uploads", express.static("./uploads"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.get("/", (req, res) => {
  res.json({ message: "welcome to postgress" });
});
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("server is running on", port);
});
