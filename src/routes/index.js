import express from "express";
import routerProduct from "./product.js";
import routerAuth from "./auth.js";
import routerCategory from "./categories.js";
import routerImage from "./upload.js";
const router = express.Router();

router.use("/products", routerProduct);
router.use("/auth", routerAuth);
router.use("/category", routerCategory);
router.use("/image", routerImage);
export default router;