const Product = require("../models/Product");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // MongoDB se saare products fetch
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // id ke basis pe fetch
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD product
exports.addProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const product = new Product({ name, price, description });

  try {
    const savedProduct = await product.save(); // MongoDB me save
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};