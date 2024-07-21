const allRoles = {
  admin: [
    "manageUsers",
    "manageProducts",
    "manageCategories",
    "manageOrders",
    "managePromotions",
    "writeReviews",
    "writeComemnts",
    "manageProfile",
  ],
  manager: [
    "manageUsers",
    "manageProducts",
    "manageCategories",
    "manageOrders",
    "managePromotions",
    "writeReviews",
    "writeComemnts",
    "manageProfile",
  ],
  staff: [
    "manageProducts",
    "manageCategories",
    "manageOrders",
    "managePromotions",
    "writeReviews",
    "writeComemnts",
    "manageProfile",
  ],
  customer: ["writeReviews", "writeComemnts", "manageProfile"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

export { roles, roleRights };
