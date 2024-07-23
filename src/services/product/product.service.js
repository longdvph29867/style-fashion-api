import Products from "../../models/Product/Product.model.js";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "http-status";
import attributeService from "./attribute.service.js";

const getAllProducts = async(filter, options) => {
    const products = await Products.paginate(filter, options);
    return products;
};

const getProductByID = async(idProduct) => {
    const product = await Products.findOne({ _id: idProduct })
        .populate("attributes")
        .populate({ path: "categories", select: "-active" })
        .select("-active");
    return product;
};

const getProductBySlug = async(slugProduct) => {
    const product = await Products.findOne({ slug: slugProduct })
        .populate("attributes")
        .populate({ path: "categories", select: "-active" })
        .select("-active");
    return product;
};

const createProducts = async(bodyProduct) => {
    if (await Products.isSlugTaken(bodyProduct.slug)) {
        throw new ApiError(httpStatus.NOT_FOUND, "Products already exists");
    }
    const newAttrbutes = await attributeService.createAttributeMany(
        bodyProduct.attributes
    );
    if (!newAttrbutes) {
        throw new ApiError(httpStatus.NOT_FOUND, "Attribute create failed");
    }
    bodyProduct.minPrice = Math.min(
        ...newAttrbutes.map((attr) => attr.discount == 0 ? attr.price : attr.discount)
    );
    bodyProduct.maxPrice = Math.max(
        ...newAttrbutes.map((attr) => attr.discount == 0 ? attr.price : attr.discount)
    );
    const insertedIds = newAttrbutes.map((doc) => doc._id);
    const dataProduct = {...bodyProduct, attributes: insertedIds };
    const newProduct = await Products.create(dataProduct);
    if (!newProduct) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Create Products failed"
        );
    }
    return newProduct;
};

const updateProducts = async(idProduct, bodyProduct) => {
    try {
        if (await Products.isSlugTaken(bodyProduct.slug, idProduct)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Products already exists");
        }
        const product = await Products.findById(idProduct);
        if (!product) {
            throw new ApiError(httpStatus.NOT_FOUND, "Products not found");
        }

        await attributeService.deleteAttributeMany(product.attributes);
        const newAttrbutes = await attributeService.createAttributeMany(
            bodyProduct.attributes
        );
        bodyProduct.minPrice = Math.min(
            ...newAttrbutes.map((attr) => attr.discount == 0 ? attr.price : attr.discount)
        );
        bodyProduct.maxPrice = Math.max(
            ...newAttrbutes.map((attr) => attr.discount == 0 ? attr.price : attr.discount)
        );
        const insertedIds = newAttrbutes.map((doc) => doc._id);
        const dataProduct = {...bodyProduct, attributes: insertedIds };
        const updatedProduct = await Products.findByIdAndUpdate(
            idProduct, { $set: dataProduct }, { new: true, runValidators: true }
        );

        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

const deleteProductById = async(productId) => {
    const product = await getProductByID(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    await Products.findByIdAndUpdate(product.id, { active: false });
    return product;
};

const updateScoreReviewProduct = async(productId, score, type) => {
    if (!["update", "delete"].includes(type)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid type specified");
    }
    const product = await Products.findById(productId);
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
    createProducts,
    updateProducts,
    getProductByID,
    getProductBySlug,
    deleteProductById,
    updateScoreReviewProduct,
};
export default productService;