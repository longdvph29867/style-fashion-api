import { Schema } from "mongoose";
import toJSON from "../plugins/toJSON.plugin.js";
import { connectPrimaryDB } from "../../utils/db.js";

const valueAttributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  { collection: "ValueAttributes", timestamps: false, versionKey: false }
);

valueAttributeSchema.plugin(toJSON);
const ValueAttributes = connectPrimaryDB.model(
  "ValueAttributes",
  valueAttributeSchema
);

export default ValueAttributes;
