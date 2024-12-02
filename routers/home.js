// packages
const express = require("express");

// imports
const {
  allProducts,
  allSuppliers,
  getProduct,
  getSupplier,
  allBrands,
  allBanners,
  allCategories,
  allTopSearch,
} = require("../controllers/home/show");

// init
const homeRouter = express.Router();

// routers
homeRouter.get("/products", allProducts);
homeRouter.get("/suppliers", allSuppliers);
homeRouter.get("/product", getProduct);
homeRouter.get("/supplier", getSupplier);
homeRouter.get("/categories", allCategories);
homeRouter.get("/brands", allBrands);
homeRouter.get("/banners", allBanners);
homeRouter.get("/topSearch", allTopSearch);

module.exports = homeRouter;
