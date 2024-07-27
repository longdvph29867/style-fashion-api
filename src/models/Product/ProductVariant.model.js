import { Schema } from "mongoose";
import toJSON from "../plugins/toJSON.plugin.js";
import { connectPrimaryDB } from "../../utils/db.js";

const productVariantSchema = new Schema(
  {
    tier_index: [
      {
        type: Schema.Types.ObjectId,
        ref: "ValueAttributes",
      },
    ],
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
  },
  { collection: "ProductVariants", timestamps: false, versionKey: false }
);

productVariantSchema.index({ tier_index: 1 });
productVariantSchema.index({ product: 1 });

productVariantSchema.plugin(toJSON);
const ProductVariant = connectPrimaryDB.model(
  "ProductVariants",
  productVariantSchema
);

export default ProductVariant;
