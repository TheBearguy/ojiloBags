// const {
//     getOrders,
//     authOrder,
//     getOrder,
//     createOrder,
//     updateOrder,
//     deleteOrder,
//     payment,
//     deliverOrder,
//   } = require("../controller/order");

import {getOrders, authOrder, getOrder, createOrder, updateOrder, deleteOrder, payment, deliverOrder} from "../controllers/order.controller.js";
  
//   //Invoked middleware.
//   const advanceResults = require("../middleware/advanceResults");
//   const { protect } = require("../middleware/auth");
  
import { verifyJWT } from "../middlwares/auth.middleware.js ";
  //Product model
//   const Order = require("../models/Order");
import Order from "../models/order.model.js";
//   const router = require("express").Router();
import { Router } from "express";
const router = Router();

  router.use(protect);
  
//   router
//     .route("/")
//     .get(
//       permission("admin"),
//       advanceResults(Order, {
//         path: "userId",
//         select: "name email",
//       }),
  
//       getOrders
//     )
//     .post(createOrder);
  router.route("/auth-orders").get(authOrder);
  
  router.route("/:orderId").get(getOrder).put(updateOrder).delete(deleteOrder);
  
  router.route("/:orderId/pay").post(payment);
  router.route("/:orderId/deliver").post(deliverOrder);
  
  export default router;