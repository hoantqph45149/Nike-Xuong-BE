import { Router } from "express";
import { searchProduct } from "../controllers/search.js";

const routerSearch = Router();

routerSearch.get("/product", searchProduct);

export default routerSearch;
