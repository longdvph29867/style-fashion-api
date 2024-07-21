import Attributes from "../../models/Product/Attributes.model.js";
import valueAttributesService from "./valueAttribute.service.js";

const getById = async (attributeID) => {
  return await Attributes.findById(attributeID);
};
const createMany = async (attributes) => {
  const valueAttributes = attributes.flatMap((attr) => attr.values);
  const valueAttributeIds = await valueAttributesService.createMany(
    valueAttributes
  );
  console.log(valueAttributeIds);
  return;
  return await Attributes.insertMany(attributes);
};
const deleteMany = async (attributes) => {
  return await Attributes.deleteMany({ _id: { $in: attributes } });
};

const attributeService = {
  getById,
  createMany,
  deleteMany,
};

export default attributeService;
