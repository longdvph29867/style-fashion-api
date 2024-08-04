import Product from "../../models/Product/Product.model.js";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "http-status";
import attributeService from "./attribute.service.js";

const getAllProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id })
    .populate({ path: "attributes", populate: "values" })
    .populate({ path: "categories", select: "-active" })
    .select("-active");
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

// ///
const getById = async (id) => {
  const data = await Product.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return data;
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug })
    .populate("attributes")
    .populate({ path: "categories", select: "-active" })
    .select("-active");
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

const create = async (body) => {
  if (await Product.isSlugTaken(body.slug)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product already exists");
  }
  return await Product.create(body);
};

const updateProduct = async (id, body) => {
  const product = await getById(id);
  if (body.slug && (await Product.isSlugTaken(body.slug, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already exists");
  }
  Object.assign(product, body);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  await Product.findByIdAndUpdate(product.id, { active: false });
  return product;
};

const updateScoreReviewProduct = async (productId, score, type) => {
  if (!["update", "delete"].includes(type)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid type specified");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  let numReviews = product.numReviews;
  let scoreReview = product.scoreReview;

  if (type === "update") {
    numReviews += 1;
    scoreReview += score;
  } else if (type === "delete") {
    numReviews -= 1;
    scoreReview -= score;
    if (scoreReview < 0 || numReviews <= 0) {
      numReviews = 0;
      scoreReview = 0;
    }
  }
  const finalScoreReview = numReviews === 0 ? 0 : scoreReview / numReviews;
  product.numReviews = numReviews;
  product.scoreReview = scoreReview;
  product.finalScoreReview = finalScoreReview;
  await product.save();
  return product;
};
const productService = {
  getAllProducts,
  create,
  getById,
  updateProduct,
  getProductById,
  getProductBySlug,
  deleteProductById,
  updateScoreReviewProduct,
};
export default productService;
