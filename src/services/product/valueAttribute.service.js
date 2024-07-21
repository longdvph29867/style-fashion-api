import ValueAttributes from "../../models/Product/ValueAttribute.model.js";

const getById = async (attributeID) => {
  return await ValueAttributes.findById(attributeID);
};
const createMany = async (data) => {
  return await ValueAttributes.insertMany(data);
};
const deleteMany = async (attributes) => {
  return await ValueAttributes.deleteMany({ _id: { $in: attributes } });
};

const valueAttributesService = {
  getById,
  createMany,
  deleteMany,
};

export default valueAttributesService;
