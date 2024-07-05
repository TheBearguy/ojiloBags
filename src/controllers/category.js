const asyncHandler = require("../middleware/async");
const ApiError = require("../utilis/ApiError");
const Category = require("../models/Category");
const { ApiError } = require("../utils/ApiError");

const getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).send({ status: "success", data: res });
});

const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category)
    throw ApiError(
      404,
      `Category is not found with id of ${req.params.categoryId}`
    );

  res.status(200).send({ status: "success", data: category });
});
const addCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).send({ status: "success", data: category });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const editCategory = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editCategory)
    throw ApiError(
      404,
      `Category is not found with id of ${req.params.categoryId}`
    );

  const updatedUser = await Category.findById(req.params.categoryId);

  res.status(201).send({ status: "success", data: updatedUser });
});

const removeCategory = asyncHandler(async (req, res, next) => {
  const findCategory = await Category.findByIdAndDelete(req.params.categoryId);

  if (!findCategory)
    throw ApiError(
      404,
      `Category is not found with id of ${req.params.categoryId}`
    );

  res
    .status(204)
    .send({ status: "success", message: "Category Deleted Successfully" });
});
export {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
};