process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');

// =====================================================================
// TUYỆT KỸ CI/CD: MOCK DATABASE LÝ TƯỞNG CHO MÔI TRƯỜNG JEST
// Loại bỏ hoàn toàn lỗi "Missing driver" và xung đột kết nối mạng
// =====================================================================
jest.mock('./models/Product', () => {
  class MockProduct {
    constructor(data) {
      Object.assign(this, data);
    }
    // Giả lập lưu thành công
    async save() { return this; }
    // Giả lập hàm tạo dữ liệu
    static async create(data) { return new MockProduct(data); }
    // Giả lập hàm tìm kiếm
    static async findOne(query) {
      if (query.pid === 'TEST01') return { pid: 'TEST01', pname: 'Test Keyboard', price: 99, quantity: 10 };
      return null;
    }
    // Giả lập hàm xóa
    static async findOneAndDelete(query) {
      if (query.pid === 'TEST01') return { pid: 'TEST01', pname: 'Test Keyboard', price: 99, quantity: 10 };
      return null;
    }
    static async deleteMany() { return { deletedCount: 1 }; }
  }
  return MockProduct;
});

const app = require('./app');
const Product = require('./models/Product');

beforeAll(() => {
  // Giả lập Mongoose đã kết nối thành công để API /health trả về 200 UP
  Object.defineProperty(mongoose.connection, 'readyState', { value: 1, writable: true });
});

afterAll(() => {
  jest.clearAllMocks(); // Dọn dẹp bộ nhớ sau khi test xong
});

describe('Product API Integration Tests', () => {
  it('GET /health - should return UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('POST /api/products - should create a new product', async () => {
    const newProduct = { pid: 'TEST01', pname: 'Test Keyboard', price: 99, quantity: 10 };
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body.pid).toBe('TEST01');
  });

  it('GET /api/products/:pid - should retrieve the product', async () => {
    await Product.create({ pid: 'TEST01', pname: 'Test Keyboard', price: 99, quantity: 10 });
    const res = await request(app).get('/api/products/TEST01');
    expect(res.statusCode).toBe(200);
    expect(res.body.pname).toBe('Test Keyboard');
  });

  it('DELETE /api/products/:pid - should remove the product', async () => {
    await Product.create({ pid: 'TEST01', pname: 'Test Keyboard', price: 99, quantity: 10 });
    const res = await request(app).delete('/api/products/TEST01');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });
});