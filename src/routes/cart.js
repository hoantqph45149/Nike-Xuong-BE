import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controllers/cart.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const routerCart = Router();

routerCart.get("/", checkAuth, getCart);
routerCart.post("/", checkAuth, addToCart);
routerCart.post("/remove", checkAuth, removeFromCart);
routerCart.post("/update", checkAuth, updateCart);

export default routerCart;
