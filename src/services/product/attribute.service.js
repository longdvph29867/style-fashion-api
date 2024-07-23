import Attributes from "../../models/Product/Attribute.model.js";
import valueAttributesService from "./valueAttribute.service.js";

const getById = async (attributeID) => {
  return await Attributes.findById(attributeID);
};
const create = async (attribute) => {
  const valueAttributeIds = await valueAttributesService.createMany(
    attribute.values
  );
  return await Attributes.create({ ...attribute, values: valueAttributeIds });
};
const deleteMany = async (attributes) => {
  return await Attributes.deleteMany({ _id: { $in: attributes } });
};

const attributeService = {
  getById,
  create,
  deleteMany,
};

export default attributeService;
