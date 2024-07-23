import ProductVariant from "../../models/Product/ProductVariant.model.js";

const createMany = async (values) => {
  const result = await ProductVariant.insertMany(values);
  return result.map((value) => value._id);
};

const deleteMany = async (ids) => {
  return await ProductVariant.deleteMany({ _id: { $in: ids } });
};

const productVariantService = {
  createMany,
  deleteMany,
};

export default productVariantService;
