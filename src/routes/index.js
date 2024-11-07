import express from "express";
import routerProduct from "./product.js";
import routerAuth from "./auth.js";
import routerCategory from "./categories.js";
import routerCart from "./cart.js";
import routerSearch from "./search.js";
import filterRouter from "./filter.js";
import routerOrder from "./order.js";
const router = express.Router();

router.use("/products", routerProduct);
router.use("/auth", routerAuth);
router.use("/category", routerCategory);
router.use("/cart", routerCart);
router.use("/search", routerSearch);
router.use("/filter", filterRouter);
router.use("/orders", routerOrder);
export default router;
