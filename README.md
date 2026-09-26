# Product API - RESTful CRUD Service with Docker, MongoDB & CI/CD Pipeline

Dự án bài tập Lập trình hướng dịch vụ: Xây dựng dịch vụ RESTful API quản lý Sản phẩm (Product), áp dụng Dockerize, Docker Compose, Healthcheck, kiểm thử tự động CI trên GitHub Actions với MongoDB Service Container và quy trình tự động triển khai CD (Continuous Deployment) lên Docker Hub và Local Docker Engine.

---

## 1. Thông tin kiến trúc & Công nghệ sử dụng

- **Runtime**: Node.js v20+ / Express.js
- **Database**: MongoDB & ODM Mongoose
- **Containerization**: Docker & Docker Compose
- **Healthcheck**: Tích hợp sẵn endpoint `/health` và Docker Healthcheck directive (wget/mongosh)
- **Kiểm thử tự động (CI)**: Jest & Supertest
- **CI/CD Platform**: GitHub Actions
- **Container Registry**: Docker Hub

---

## 2. Cấu trúc thư mục dự án

```text
product-api/
├── .github/
│   └── workflows/
│       ├── test-productci.yml        # Workflow CI cơ bản thử nghiệm (Prompt 10)
│       └── test-productci-prod.yml   # Workflow CI/CD hoàn chỉnh với MongoDB service + Docker Hub (Prompt 11 & 12)
├── src/
│   ├── models/
│   │   └── Product.js                # Mongoose Schema: pid, pname, price, quantity
│   ├── routes/
│   │   ├── healthRoutes.js           # Route kiểm tra trạng thái sức khỏe /health
│   │   └── productRoutes.js          # RESTful API CRUD đầy đủ cho Product
│   └── app.js                        # Cấu hình Express App & Middleware
├── tests/
│   └── product.test.js               # Bộ kiểm thử tự động Jest & Supertest (Healthcheck + CRUD)
├── .dockerignore
├── .env.example                      # Mẫu biến môi trường
├── .gitignore
├── deploy-local.ps1                  # Script PowerShell tự động kéo image từ Docker Hub và chạy local
├── deploy-local.sh                   # Script Bash tự động triển khai local
├── Dockerfile                        # Dockerfile tối ưu Alpine với lệnh HEALTHCHECK
├── docker-compose.yml                # Docker Compose cho môi trường phát triển (build local)
├── docker-compose-prod.yaml          # Docker Compose cho môi trường triển khai (pull từ Docker Hub)
├── package.json
└── server.js                         # Điểm khởi chạy máy chủ Node.js & kết nối MongoDB
```

---

## 3. Danh sách RESTful API Endpoints

| Phương thức | Đường dẫn | Chức năng | Body / Tham số | Mã phản hồi |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Trang chào mừng & hướng dẫn API | Không | `200 OK` |
| `GET` | `/health` | Healthcheck (Trạng thái App & MongoDB) | Không | `200 OK` / `503 Service Unavailable` |
| `POST` | `/api/products` | Thêm mới 1 sản phẩm | `{ pid, pname, price, quantity }` | `201 Created` / `400` / `409` |
| `GET` | `/api/products` | Lấy danh sách tất cả sản phẩm | Không | `200 OK` |
| `GET` | `/api/products/:pid` | Lấy thông tin chi tiết sản phẩm theo `pid` | `:pid` trên URL | `200 OK` / `404 Not Found` |
| `PUT` | `/api/products/:pid` | Cập nhật thông tin sản phẩm | `{ pname, price, quantity }` | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/products/:pid` | Xóa sản phẩm theo `pid` | `:pid` trên URL | `200 OK` / `404 Not Found` |

---

## 4. Hướng dẫn chạy & Kiểm thử dự án

### Cách 1: Chạy trực tiếp trên máy chủ cục bộ (Local Node.js)
```bash
# 1. Cài đặt thư viện
npm install

# 2. Tạo file cấu hình .env
cp .env.example .env

# 3. Chạy kiểm thử tự động
npm test

# 4. Khởi chạy server
npm start
```

### Cách 2: Chạy với Docker Compose (Dev)
```bash
# Khởi động cả MongoDB và Product API
docker compose up -d --build

# Kiểm tra trạng thái và healthcheck
docker compose ps

# Xem log
docker compose logs -f product-api
```

### Cách 3: Chạy với Docker Compose Production (Kéo image từ Docker Hub)
```bash
# Kéo image và khởi chạy
docker compose -f docker-compose-prod.yaml up -d
```
