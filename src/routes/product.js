import express from "express";
import { checkPermission } from "./../middlewares/checkPermission.js";
import {
  create,
  getList,
  getOne,
  remove,
  update,
} from "../controllers/product.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import { productValidation } from "../validations/product.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkIsAdmin } from "../middlewares/checkIsAdmin.js";
const routerProduct = express.Router();
routerProduct.get("/", getList);
routerProduct.get("/:id", getOne);

routerProduct.use("/", checkAuth, checkIsAdmin); //middleware check admin or login
routerProduct.post(
  "/",
  validBodyRequest(productValidation),
  checkPermission,
  create
);
routerProduct.put(
  "/:id",
  validBodyRequest(productValidation),
  checkPermission,
  update
);
routerProduct.delete("/:id", checkPermission, remove);

export default routerProduct;
