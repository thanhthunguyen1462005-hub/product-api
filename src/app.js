const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Only log in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/health', healthRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Product RESTful API',
    endpoints: {
      health: 'GET /health',
      products: {
        create: 'POST /api/products',
        getAll: 'GET /api/products',
        getOne: 'GET /api/products/:pid',
        update: 'PUT /api/products/:pid',
        delete: 'DELETE /api/products/:pid',
      },
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

module.exports = app;
