const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET /health
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isHealthy = dbState === 1;
  const status = isHealthy ? 'UP' : 'DOWN';
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status,
    database: stateMap[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
