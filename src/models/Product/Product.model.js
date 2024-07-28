import { Schema } from "mongoose";
import slugify from "slugify";
import { paginate } from "../plugins/paninate.plugin.js";
import toJSON from "../plugins/toJSON.plugin.js";
import { connectPrimaryDB } from "../../utils/db.js";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    thumbnail: { type: String, required: true },
    gallery: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length >= 1 && val.length <= 9;
        },
        message: "Gallery must have between 1 and 9 items",
      },
    },
    attributes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Attributes",
        },
      ],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 1 && val.length <= 10;
        },
        message: "Attribute must have between 1 and 9 items",
      },
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Categories",
        },
      ],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    scoreReview: {
      type: Number,
      default: 0,
    },
    finalScoreReview: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: false,
    },
    // variants: {
    //   type: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: "ProductVariants",
    //     },
    //   ],
    //   required: true,
    // },
    purchases: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  { collection: "Products", timestamps: true, versionKey: false }
);

productSchema.index({ name: 1 });
productSchema.index({ attributes: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ categories: 1 });

productSchema.statics.isSlugTaken = async function (
  productSlug,
  excludeproductId
) {
  const products = await this.findOne({
    slug: productSlug,
    _id: { $ne: excludeproductId },
  });
  return !!products;
};
productSchema.plugin(paginate);
productSchema.plugin(toJSON);
const Product = connectPrimaryDB.model("Products", productSchema);

export default Product;
