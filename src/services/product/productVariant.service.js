import ProductVariant from "../../models/Product/ProductVariant.model.js";

const createMany = async (values) => {
  const result = await ProductVariant.insertMany(values);
  return result.map((value) => value._id);
};

const productVariantService = {
  createMany,
};

export default productVariantService;
