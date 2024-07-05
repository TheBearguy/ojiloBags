// const {
//     getProducts,
//     getProduct,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//   } = require("../controller/product");
  
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
  //Invoked middleware.
//   const advanceResults = require("../middleware/advanceResults");
//   const { protect, permission } = require("../middleware/auth");
import { verifyJWT } from "../middlwares/auth.middleware.js ";
  //Product model
//   const Product = require("../models/Product");
import Product from "../models/product.model.js";
  
  //Include other resource Router
//   const reviewRouter = require("./review");
  
//   const router = require("express").Router();
import { Router } from "express";
const router = Router();

  
//   router
//     .route("/")
//     .get(
//       advanceResults(Product, {
//         path: "Reviews",
//         select: "title",
//       }),
//       getProducts
//     )
//     .post(protect, permission("admin"), createProduct);
  
  router.use("/:productId/reviews", reviewRouter);
  
  router
    .route("/:productId")
    .get(getProduct)
    .put(protect, permission("admin"), updateProduct)
    .delete(protect, permission("admin"), deleteProduct);
  
export default router;