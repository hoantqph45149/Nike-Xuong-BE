import { Router } from "express";
import {
  getOderbyId,
  getOrderByUserId,
  getOrders,
  searchOrders,
  updateOrder,
} from "../controllers/order.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const routerOrder = Router();

routerOrder.get("/", checkAuth, getOrders);
routerOrder.get("/user", checkAuth, getOrderByUserId);
routerOrder.get("/search", checkAuth, searchOrders);
routerOrder.get("/:id", checkAuth, getOderbyId);
routerOrder.patch("/:id", checkAuth, updateOrder);

export default routerOrder;
