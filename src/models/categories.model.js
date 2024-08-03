import mongoose from "mongoose";
import { paginate } from "./plugins/paninate.plugin.js";
import toJSON from "./plugins/toJSON.plugin.js";
import { connectPrimaryDB, connectSecondaryDB } from "../utils/db.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category Name is not empty"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    active: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  { collection: "Categories", timestamps: true, versionKey: false }
);

categorySchema.statics.isSlugTaken = async function (
  categorySlug,
  excludeCategoryId
) {
  const category = await this.findOne({
    slug: categorySlug,
    _id: { $ne: excludeCategoryId },
  });
  return !!category;
};

categorySchema.plugin(paginate);
categorySchema.plugin(toJSON);
const Categories = connectPrimaryDB.model("Categories", categorySchema);

export default Categories;
