import httpStatus from "http-status";
import Categories from "../models/categories.model.js";
import ApiError from "../utils/ApiError.js";

export const createCategory = async (categoryBody) => {
  if (await Categories.isSlugTaken(categoryBody.slug)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category already exists");
  }
  return await Categories.create(categoryBody);
};

export const getCatgoryBySlug = async (categorySlug) => {
  return await Categories.findOne({ slug: categorySlug });
};

export const getCategoryById = async (id) => {
  return await Categories.findById(id);
};

export const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Categories not found");
  }
  if (
    updateBody.slug &&
    (await Categories.isSlugTaken(updateBody.slug, categoryId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Categories already exists");
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

export const deleteCatgoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }
  await Categories.findByIdAndUpdate(category.id, { active: false });
  return category;
};

export const queryCategories = async (filter, options) => {
  const categories = await Categories.paginate(filter, options);
  return categories;
};
