import express from "express";
import {
  createCategory,
  getAllCategory,
  getCategoryProduct,
  getOneCategory,
  removeCategory,
  updateCategory,
} from "../controllers/categories.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import { categoryValidation } from "../validations/category.js";
import { checkPermission } from "./../middlewares/checkPermission.js";

const routerCategory = express.Router();
routerCategory.get("/", getAllCategory);
routerCategory.get("/:id/products", getCategoryProduct);
routerCategory.get("/:id", getOneCategory);
routerCategory.post(
  "/",
  checkPermission,
  validBodyRequest(categoryValidation),
  createCategory
);
routerCategory.put(
  "/:id",
  checkPermission,
  validBodyRequest(categoryValidation),
  updateCategory
);
routerCategory.delete("/:id", checkPermission, removeCategory);

export default routerCategory;
