const request = require('supertest');

// Gọi trực tiếp đến server Express đang chạy bên trong container
const API_URL = 'http://127.0.0.1:3000';

describe('Product API Integration Tests', () => {
  const testProduct = {
    pid: 'TEST01',
    pname: 'Test Keyboard',
    price: 99,
    quantity: 10
  };

  // Dọn dẹp dữ liệu test trước và sau khi chạy qua API DELETE
  const cleanUp = async () => {
    try {
      await request(API_URL).delete(`/api/products/${testProduct.pid}`);
    } catch (_) {}
  };

  beforeAll(async () => {
    await cleanUp();
  });

  afterAll(async () => {
    await cleanUp();
  });

  it('GET /health - should return UP', async () => {
    const res = await request(API_URL).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('POST /api/products - should create a new product', async () => {
    const res = await request(API_URL)
      .post('/api/products')
      .send(testProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.pid).toBe(testProduct.pid);
  });

  it('GET /api/products/:pid - should retrieve the product', async () => {
    const res = await request(API_URL).get(`/api/products/${testProduct.pid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.pname).toBe(testProduct.pname);
  });

  it('DELETE /api/products/:pid - should remove the product', async () => {
    const res = await request(API_URL).delete(`/api/products/${testProduct.pid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });
});