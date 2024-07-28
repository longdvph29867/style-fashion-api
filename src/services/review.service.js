import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import Review, { reviewStatus } from "../models/Review.model.js";
import productService from "./product/product.service.js";

const createReview = async (body) => {
  return await Review.create(body);
};

const queryReviewByProduct = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

// approve
const approveReview = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }
  await productService.updateScoreReviewProduct(
    review.productId,
    review.score,
    "update"
  );
  Object.assign(review, { status: reviewStatus.reviewed });
  await review.save();
  return review;
};

// approve
const restoreReview = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }
  // await productService.updateScoreReviewProduct(
  //   review.productId,
  //   review.score,
  //   "update"
  // );
  Object.assign(review, { status: reviewStatus.offline });
  await review.save();
  return review;
};

const getReviewById = async (id) => {
  return Review.findById(id);
};

const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }
  if (review.status == reviewStatus.reviewed) {
    await productService.updateScoreReviewProduct(
      review.productId,
      review.score,
      "delete"
    );
  }
  Object.assign(review, { status: reviewStatus.deleted });
  await review.save();
  return review;
};

const reviewService = {
  createReview,
  queryReviewByProduct,
  approveReview,
  restoreReview,
  deleteReviewById,
};

export default reviewService;
