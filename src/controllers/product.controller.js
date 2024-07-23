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
class ProductController {
  async getAll(req, res) {
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
              throw new ApiError(
                httpStatus.NOT_FOUND,
                "Slug category not found"
              );
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
  }
  async getDetail(req, res) {
    try {
      const { identifier } = req.params;
      let product;
      if (isValidObjectId(identifier)) {
        product = await productService.getProductByID(identifier);
      } else {
        product = await productService.getProductBySlug(identifier);
      }

      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
      }
      res.send(product);
    } catch (err) {
      errorMessage(res, err);
    }
  }
  async create(req, res) {
    try {
      const data = { ...req.body };
      const attributePromises = data.attributes.map(async (item) => {
        const result = await attributeService.create(item);
        return result;
      });
      const attributes = await Promise.all(attributePromises);
      const attributeIds = attributes.map((item) => item.values);
      const productVariants = replaceTierIndexWithIds(
        attributeIds,
        data.variants
      );
      const productVariantIds = await productVariantService.createMany(
        productVariants
      );
      data.attributes = attributes.map((attribute) => attribute._id);
      data.variants = productVariantIds;
      data.slug = slugify(data.name, { lower: true });
      const result = await productService.create(data);
      res.status(httpStatus.CREATED).json(result);
    } catch (err) {
      console.log(err);
      errorMessage(res, err);
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductByID(id);
      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Products not found");
      }
      await valueAttributesService.deleteMany(
        product.attributes.flatMap((item) => item.values)
      );
      await attributeService.deleteMany(
        product.attributes.map((item) => item.id)
      );
      await productVariantService.deleteMany(product.variants);

      // const data = { ...req.body };
      // data.slug = slugify(data.name, { lower: true });
      // const result = await productService.updateProducts(id, data);
      res.status(httpStatus.CREATED).json(product);
    } catch (err) {
      errorMessage(res, err);
    }
  }

  async remove(req, res) {
    try {
      await productService.deleteProductById(req.params.id);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (err) {
      errorMessage(res, err);
    }
  }
}

export default new ProductController();
