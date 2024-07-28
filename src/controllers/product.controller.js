import productService from "../services/product/product.service.js";
import slugify from "slugify";
import { pickFilter, pickOption } from "../utils/pick.js";
import { isValidObjectId } from "mongoose";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { getCatgoryBySlug } from "../services/category.service.js";
import attributeService from "../services/product/attribute.service.js";
import errorMessage from "../config/error.js";
import productVariantService from "../services/product/productVariant.service.js";
import valueAttributesService from "../services/product/valueAttribute.service.js";
const replaceTierIndexWithIds = (result, map) => {
  return map.map((item) => {
    const newTierIndex = item.tier_index.map((index, i) => result[i][index]);
    return { ...item, tier_index: newTierIndex };
  });
};
const getAll = async (req, res) => {
  try {
    if (req.query.categories) {
      const listCategory = req.query.categories.split(",");
      req.query.categories = await Promise.all(
        listCategory.map(async (category) => {
          if (isValidObjectId(category)) {
            return category;
          }
          const isCategory = await getCatgoryBySlug(category);
          if (!isCategory) {
            throw new ApiError(httpStatus.NOT_FOUND, "Slug category not found");
          }
          return isCategory._id;
        })
      );
    }
    const filter = pickFilter(req.query, [
      "search",
      "categories",
      "gte",
      "lte",
    ]);
    const options = pickOption(req.query, ["sortBy", "limit", "page"]);
    options.populate = "attributes,categories";
    const result = await productService.getAllProducts(filter, options);
    res.status(httpStatus.OK).json(result);
  } catch (err) {
    errorMessage(res, err);
  }
};
const getDetail = async (req, res) => {
  try {
    const { identifier } = req.params;
    let product;
    if (isValidObjectId(identifier)) {
      product = await productService.getProductByID(identifier);
    } else {
      product = await productService.getProductBySlug(identifier);
    }
    res.send(product);
  } catch (err) {
    errorMessage(res, err);
  }
};
const create = async (req, res) => {
  try {
    const data = { ...req.body };
    const attributePromises = data.attributes.map(async (item) => {
      const result = await attributeService.create(item);
      return result;
    });
    const attributes = await Promise.all(attributePromises);
    const attributeIds = attributes.map((item) => item.values);
    data.attributes = attributes.map((attribute) => attribute._id);
    data.slug = slugify(data.name, { lower: true });
    const variants = data.variants;
    delete data.variants;
    const newProduct = await productService.create(data);
    const productVariants = replaceTierIndexWithIds(attributeIds, variants).map(
      (item) => {
        return { ...item, product: newProduct._id };
      }
    );
    await productVariantService.createMany(productVariants);
    res.status(httpStatus.CREATED).json(newProduct);
  } catch (err) {
    errorMessage(res, err);
  }
};
const update = async (req, res) => {
  try {
    const { body } = req;
    if (body.name) {
      body.slug = slugify(body.name, { lower: true });
    }
    const product = await productService.updateProduct(req.params.id, body);
    res.status(httpStatus.CREATED).json(product);
  } catch (err) {
    errorMessage(res, err);
  }
};

const updateAttributeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const product = await productService.getProductById(id);

    // delete valueAttributes
    await valueAttributesService.deleteMany(
      product.attributes.flatMap((item) => item.values)
    );

    // delete attributes
    await attributeService.deleteMany(
      product.attributes.map((item) => item.id)
    );

    // delete productVariant
    await productVariantService.deleteMany(id);

    // create valueAttributes
    const attributePromises = body.attributes.map(async (item) => {
      const result = await attributeService.create(item);
      return result;
    });
    const attributes = await Promise.all(attributePromises);
    // create productVariant
    const attributeIds = attributes.map((item) => item.values);
    body.attributes = attributes.map((attribute) => attribute._id);
    const variants = body.variants;
    delete body.variants;
    const productVariants = replaceTierIndexWithIds(attributeIds, variants).map(
      (item) => {
        return { ...item, product: id };
      }
    );
    await productVariantService.createMany(productVariants);
    const newProduct = await productService.updateProduct(id, body);
    res.status(httpStatus.CREATED).json(newProduct);
  } catch (err) {
    console.log(err);
    errorMessage(res, err);
  }
};

const remove = async (req, res) => {
  try {
    await productService.deleteProductById(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (err) {
    errorMessage(res, err);
  }
};
const productController = {
  create,
  getAll,
  getDetail,
  update,
  updateAttributeProduct,
  remove,
};

export default productController;
