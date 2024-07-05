// const asyncHandler = require("../middleware/async");
// const ApiError = require("../utilis/ApiError");
// const path = require("path");
// const Product = require("../models/Product");

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnFirebaseStorageBucket } from "../config/firebase.js";
import { deleteFromFirebaseStorageBucket } from "../config/firebase.js";




const getProducts = asyncHandler(async (req, res, next) => {
  const keyWord = req.query.keyWord;

  if (keyWord) {
    const searchItem = keyWord
      ? { name: { $regex: keyWord, $options: "i" } }
      : {};

    const searchProduct = await Product.find(searchItem);

    res.status(200).send({
      status: "success",

      data: { results: searchProduct, count: searchProduct.length },
    });
  } else {
    res.status(200).send({ status: "success", data: res});
  }
});

const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate({
    path: "Reviews",
    select: "title text",
  });

  if (!product)
    throw ApiError(
      404,
      `Product is not found with id of ${req.params.productId}`
    );

  res.status(200).send({ status: "success", data: product });
});

const createProduct = asyncHandler(async (req, res, next) => {
  if (!req.files) throw ApiError(400, "Please add a photo");

  console.log(req.files);

  const file = req.files.productImage;

  //Check file type
  if (!file.mimetype.startsWith("image"))
    throw ApiError(400, "This file is not supported");

  //Check file size
//   if (file.size > process.env.FILE_UPLOAD_SIZE)
//     throw ApiError(
//       400,
//       `Please upload a image of size less than ${process.env.FILE_UPLOAD_SIZE}`
//     );

  uploadOnFirebaseStorageBucket(
    file.tempFilePath,
    `/products/${product._id}/images`,
    async function (error, result) {
      if (error) throw ApiError(409, `failed to create product`);
      const product = await Product.create({
        ...req.body,
        productImage: result.url,
      });
      res.status(200).send({ status: "success", data: product });
    }
  );
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const editProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editProduct)
    throw ApiError(
      404,
      `Product is not found with id of ${req.params.productId}`
    );

  const updatedProduct = await Product.findById(req.params.productId);

  res.status(201).send({ status: "success", data: updatedProduct });
});
const deleteProduct = asyncHandler(async (req, res, next) => {
  const deleteProduct = await Product.findById(req.params.productId);

  if (!deleteProduct)
    throw ApiError(
      404,
      `User is not found with id of ${req.params.productId}`
    );

  await deleteProduct.remove();

  res
    .status(204)
    .send({ status: "success", message: "Product Deleted Successfully" });
});
export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};