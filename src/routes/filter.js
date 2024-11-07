import { Router } from "express";
import { filterCategoryProduct } from "../controllers/filter.js";

const filterRouter = Router();

filterRouter.get("/category/product", filterCategoryProduct);

export default filterRouter;
