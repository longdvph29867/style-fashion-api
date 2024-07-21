import { Schema } from "mongoose";
import toJSON from "../plugins/toJSON.plugin.js";
import { connectPrimaryDB } from "../../utils/db.js";

const attributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    values: [
      {
        type: Schema.Types.ObjectId,
        ref: "ValueAttributes",
      },
    ],
  },
  { collection: "Attributes", timestamps: false, versionKey: false }
);

attributeSchema.plugin(toJSON);
const Attributes = connectPrimaryDB.model("Attributes", attributeSchema);

export default Attributes;
