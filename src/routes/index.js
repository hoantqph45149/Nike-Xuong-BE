import express from "express";
import routerProduct from "./product.js";
import routerAuth from "./auth.js";
import routerCategory from "./categories.js";
import routerCart from "./cart.js";
const router = express.Router();

router.use("/products", routerProduct);
router.use("/auth", routerAuth);
router.use("/category", routerCategory);
router.use("/cart", routerCart);
export default router;
