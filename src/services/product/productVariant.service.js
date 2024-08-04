import ProductVariant from "../../models/Product/ProductVariant.model.js";

const createMany = async (values) => {
  const result = await ProductVariant.insertMany(values);
  return result.map((value) => value._id);
};

const getByProduct = async (id) => {
  const result = await ProductVariant.find({ product: id });
  return result;
};

const deleteMany = async (id) => {
  return await ProductVariant.deleteMany({ product: id });
};

const productVariantService = {
  createMany,
  getByProduct,
  deleteMany,
};

export default productVariantService;
