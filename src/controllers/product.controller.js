import productService from "../services/product/product.service.js";
import slugify from "slugify";
import { pickFilter, pickOption } from "../utils/pick.js";
import { isValidObjectId } from "mongoose";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { getCatgoryBySlug } from "../services/category.service.js";

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
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
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
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }
  async create(req, res) {
    try {
      const data = { ...req.body };
      data.slug = slugify(data.name, { lower: true });
      const result = await productService.create(data);
      res.status(httpStatus.CREATED).json(result);
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }
  async update(req, res) {
    try {
      const id = req.params.id;
      const data = { ...req.body };
      data.slug = slugify(data.name, { lower: true });
      const result = await productService.updateProducts(id, data);
      res.status(httpStatus.CREATED).json(result);
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async remove(req, res) {
    try {
      await productService.deleteProductById(req.params.id);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (err) {
      res.status(500).json({
        name: err.name,
        message: err.message,
      });
    }
  }
}

export default new ProductController();
