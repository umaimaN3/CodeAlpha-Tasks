const express = require("express");
const router = express.Router();
const { getProducts, getSingleProduct, addProduct } = require("../controllers/productController");

// Routes
router.get("/", getProducts);          // GET all products
router.get("/:id", getSingleProduct); // GET single product
router.post("/", addProduct);         // ADD new product

module.exports = router;