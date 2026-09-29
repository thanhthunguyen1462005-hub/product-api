const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productdb_test';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
}, 30000);

afterAll(async () => {
  await Product.deleteMany({ pid: 'TEST01' });
  await mongoose.connection.close();
}, 30000);

afterEach(async () => {
  await Product.deleteMany({ pid: 'TEST01' });
});

describe('Product API Integration Tests', () => {
  it('GET /health - should return UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('POST /api/products - should create a new product', async () => {
    const newProduct = {
      pid: 'TEST01',
      pname: 'Test Keyboard',
      price: 99,
      quantity: 10
    };
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.pid).toBe('TEST01');
  });

  it('GET /api/products/:pid - should retrieve the product', async () => {
    await Product.create({
      pid: 'TEST01',
      pname: 'Test Keyboard',
      price: 99,
      quantity: 10
    });
    const res = await request(app).get('/api/products/TEST01');
    expect(res.statusCode).toBe(200);
    expect(res.body.pname).toBe('Test Keyboard');
  });

  it('DELETE /api/products/:pid - should remove the product', async () => {
    await Product.create({
      pid: 'TEST01',
      pname: 'Test Keyboard',
      price: 99,
      quantity: 10
    });
    const res = await request(app).delete('/api/products/TEST01');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });
});