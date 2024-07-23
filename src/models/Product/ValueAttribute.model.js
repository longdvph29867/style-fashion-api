import { Schema } from "mongoose";
import toJSON from "../plugins/toJSON.plugin.js";
import { connectPrimaryDB } from "../../utils/db.js";

const valueAttributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { collection: "ValueAttributes", timestamps: false, versionKey: false }
);

valueAttributeSchema.plugin(toJSON);
const ValueAttribute = connectPrimaryDB.model(
  "ValueAttributes",
  valueAttributeSchema
);

export default ValueAttribute;
