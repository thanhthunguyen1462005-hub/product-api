const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Product = require('../src/models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_testdb';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({});
});

afterAll(async () => {
  await Product.deleteMany({});
  await mongoose.connection.close();
});

describe('1. Health Check Endpoint', () => {
  it('GET /health - should return status UP and connected database', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.database).toBe('connected');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET / - should return welcome message and api documentation endpoints', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('endpoints');
  });
});

describe('2. Product RESTful API CRUD', () => {
  const sampleProduct = {
    pid: 'P001',
    pname: 'Laptop Dell XPS 15',
    price: 1500,
    quantity: 10,
  };

  it('POST /api/products - should create a new product', async () => {
    const res = await request(app).post('/api/products').send(sampleProduct);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pid).toBe(sampleProduct.pid);
    expect(res.body.data.pname).toBe(sampleProduct.pname);
    expect(res.body.data.price).toBe(sampleProduct.price);
    expect(res.body.data.quantity).toBe(sampleProduct.quantity);
  });

  it('POST /api/products - should fail when creating duplicate pid', async () => {
    const res = await request(app).post('/api/products').send(sampleProduct);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/products - should fail when required fields are missing', async () => {
    const res = await request(app).post('/api/products').send({
      pid: 'P002',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/products - should return list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/products/:pid - should return product by pid', async () => {
    const res = await request(app).get(`/api/products/${sampleProduct.pid}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pid).toBe(sampleProduct.pid);
  });

  it('GET /api/products/:pid - should return 404 for non-existent pid', async () => {
    const res = await request(app).get('/api/products/P999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/products/:pid - should update product details', async () => {
    const updatePayload = {
      pname: 'Laptop Dell XPS 15 (Updated)',
      price: 1650,
      quantity: 15,
    };
    const res = await request(app)
      .put(`/api/products/${sampleProduct.pid}`)
      .send(updatePayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pname).toBe(updatePayload.pname);
    expect(res.body.data.price).toBe(updatePayload.price);
    expect(res.body.data.quantity).toBe(updatePayload.quantity);
  });

  it('DELETE /api/products/:pid - should delete product by pid', async () => {
    const res = await request(app).delete(`/api/products/${sampleProduct.pid}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const verifyRes = await request(app).get(`/api/products/${sampleProduct.pid}`);
    expect(verifyRes.status).toBe(404);
  });
});
