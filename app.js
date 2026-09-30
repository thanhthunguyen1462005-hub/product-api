const { webcrypto } = require('node:crypto');
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/productdb';

// Health check endpoint
app.get('/health', (req, res) => {
  const isHealthy = mongoose.connection.readyState === 1;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DOWN',
    database: isHealthy ? 'connected' : 'disconnected',
    version: 'v2.0-auto-cd'
  });
});

// RESTful API endpoints for Product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chỉ tự động kết nối và lắng nghe cổng khi không phải môi trường test
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB');
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

module.exports = app;