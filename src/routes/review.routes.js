// const {
//     getReview,
//     getReviews,
//     createReview,
//     updateReview,
//     deleteReview,
//     updateRating,
//   } = require("../controller/review");
  
import { getReview, getReviews, createReview, updateReview, deleteReview, updateRating } from "../controllers/review.controller.js";
//   const router = require("express").Router({ mergeParams: true });
import { Router } from "express";
const router = Router({ mergeParams: true });
  
  //Invoked middleware
//   const advanceResults = require("../middleware/advanceResults");
//   const { protect } = require("../middleware/auth");
  import { verifyJWT } from "../middlwares/auth.middleware.js ";
  //Review model
//   const Review = require("../models/Review");
import Review from "../models/review.model.js";
  
//   router
//     .route("/")
//     .get(
//       advanceResults(Review, {
//         path: "productId",
//         select: "name brand",
//       }),
//       getReviews
//     )
//     .post(protect, createReview);
  
  router
    .route("/:id")
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview);
  router.route("/update-rating/:id").put(protect, updateRating);
  
export default router;