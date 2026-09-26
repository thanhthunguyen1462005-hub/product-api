const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. CREATE: POST /api/products
router.post('/', async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;

    if (!pid || !pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields (pid, pname, price, quantity) are required',
      });
    }

    const existingProduct = await Product.findOne({ pid });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: `Product with pid '${pid}' already exists`,
      });
    }

    const newProduct = new Product({ pid, pname, price, quantity });
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
});

// 2. READ ALL: GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
});

// 3. READ ONE: GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with pid '${req.params.pid}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
});

// 4. UPDATE: PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const updateData = {};
    if (pname !== undefined) updateData.pname = pname;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;

    const updatedProduct = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with pid '${req.params.pid}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
});

// 5. DELETE: DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with pid '${req.params.pid}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product with pid '${req.params.pid}' deleted successfully`,
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
});

module.exports = router;
