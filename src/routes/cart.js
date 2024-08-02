import { Router } from "express";
import { addToCart, getCart, removeFormCart } from "../controllers/cart.js";

const routerCart = Router();

routerCart.get("/", getCart);
routerCart.post("/", addToCart);
routerCart.post("/remote", removeFormCart);

export default routerCart;
