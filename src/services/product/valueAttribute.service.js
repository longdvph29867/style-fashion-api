import ValueAttribute from "../../models/Product/ValueAttribute.model.js";

const getById = async (attributeID) => {
  return await ValueAttribute.findById(attributeID);
};
const createMany = async (values) => {
  const result = await ValueAttribute.insertMany(values);
  return result.map((value) => value._id);
};
const deleteMany = async (attributes) => {
  return await ValueAttribute.deleteMany({ _id: { $in: attributes } });
};

const valueAttributesService = {
  getById,
  createMany,
  deleteMany,
};

export default valueAttributesService;
