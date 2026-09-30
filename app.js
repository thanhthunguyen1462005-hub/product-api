require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

// Healthcheck endpoint
app.get('/health', (req, res) => {
  const isHealthy = mongoose.connection.readyState === 1;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DOWN',
    database: isHealthy ? 'connected' : 'disconnected',
    version: 'v2.0-auto-cd'
  });
});

// CREATE
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ ALL
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE
app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully', pid: req.params.pid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CHỈ khởi động server và kết nối DB khi file này được gọi trực tiếp bằng `node app.js`
if (require.main === module) {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productdb';
  const PORT = process.env.PORT || 3000;

  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });
}

module.exports = app;