// const {
//     getCategories,
//     getCategory,
//     addCategory,
//     updateCategory,
//     removeCategory,
//   } = require("../controller/category");
  import { getCategories, getCategory, addCategory, updateCategory, removeCategory } from "../controllers/category.controller.js";
  //Invoked middleware.
//   const advanceResults = require("../middleware/advanceResults");
//   const { protect, permission } = require("../middleware/auth");
  import { verifyJWT } from "../middlwares/auth.middleware.js ";
  //User model
//   const Category = require("../models/Category");
import Category from "../models/category.model.js";
  
//   const router = require("express").Router();
import { Router } from "express";       
const router = Router();
  
//   router
//     .route("/")
//     .get(advanceResults(Category), getCategories)
//     .post(protect, permission("admin"), addCategory);
  
  router
    .route("/:categoryId")
    .get(getCategory)
    .put(protect, permission("admin"), updateCategory)
    .delete(protect, permission("admin"), removeCategory);
  
    export default router;