import mongoose from "mongoose";
import { paginate } from "./plugins/paninate.plugin.js";
import { connectPrimaryDB } from "../utils/db.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      unique: true,
      requried: true,
    },
    products_cart: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
          },
          quantity: {
            type: Number,
            required: [true, "Quantity cannot be blank"],
            min: [1, "The quantity must be greater than 0"],
          },
          variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariants",
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { collection: "Carts", timestamps: true, versionKey: false }
);
cartSchema.index({ user: 1 });

const Carts = connectPrimaryDB.model("Carts", cartSchema);

export default Carts;
