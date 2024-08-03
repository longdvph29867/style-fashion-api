import Attributes from "../models/Product/Attribute.model.js";

const getAttributeByID = async(attributeID) => {
    return await Attributes.findById(attributeID);
};
const createAttributeMany = async(attributes) => {
    return await Attributes.insertMany(attributes);
};

const updateAttributeMany = async(attributes) => {
    return await Attributes.bulkWrite(attributes);
};
const deleteAttributeMany = async(attributes) => {
    return await Attributes.deleteMany({ _id: { $in: attributes } });
};

const attributeService = {
    getAttributeByID,
    createAttributeMany,
    deleteAttributeMany,
    updateAttributeMany
};

export default attributeService;