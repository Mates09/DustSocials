import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import mongoDB from "./db/connectMonofDB.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server is running ", PORT);
  mongoDB();
});
