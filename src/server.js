import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
const app = express();

app.use(cors());
dotenv.config();
const PORT = process.env.PORT;
const URL_DB = process.env.URL_DB;

mongoose
  .connect(URL_DB)
  .then(() => {
    console.log(`connect db successfully!`);
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api", router);

const errorNotFound = (req, res, next) => {
  const error = new Error(`Not Found`);
  error.status = 404;
  next(error);
};
const errorCommon = (error, req, res, next) => {
  return res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
};
app.use(errorNotFound, errorCommon);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
