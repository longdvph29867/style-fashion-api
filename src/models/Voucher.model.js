import { Schema } from "mongoose";
import toJSON from "./plugins/toJSON.plugin.js";
import { paginate } from "./plugins/paninate.plugin.js";
import { connectPrimaryDB } from "../utils/db.js";

const voucherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minCartPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
    },
    exclude_promotions: {
      type: Boolean,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  {
    timestamps: true,
    collection: "Vouchers",
  }
);

voucherSchema.index({ code: 1 }, { unique: true });

voucherSchema.plugin(paginate);
voucherSchema.plugin(toJSON);

const Voucher = connectPrimaryDB.model("Vouchers", voucherSchema);

export default Voucher;
