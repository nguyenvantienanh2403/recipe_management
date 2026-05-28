# =====================================================
# HƯỚNG DẪN CHẠY PROJECT - Recipe Management System
# BTL Lập trình Java nâng cao nhóm 24-HaUI
# =====================================================

## 📋 YÊU CẦU HỆ THỐNG

1. **Java JDK 21+** (tải tại: https://adoptium.net/)
2. **PostgreSQL 15+** (tải tại: https://www.postgresql.org/download/)
3. **Node.js 18+** (tải tại: https://nodejs.org/)
4. **Maven 3.9+** (hoặc dùng mvnw trong project)

---

## 🗄️ BƯỚC 1: TẠO DATABASE POSTGRESQL

Mở pgAdmin hoặc psql và chạy:

```sql
CREATE DATABASE recipe_db;
```

> Cấu hình mặc định: user=`postgres`, password=`postgres`, port=`5432`
> Nếu khác, sửa trong file `backend-recipe/src/main/resources/application.properties`

---

## ⚙️ BƯỚC 2: CHẠY BACKEND (Quarkus)

```bash
# Mở terminal, di chuyển vào thư mục backend
cd backend-recipe

# Chạy ở chế độ dev (tự động reload khi sửa code)
./mvnw quarkus:dev
```

**Windows (PowerShell):**
```powershell
cd backend-recipe
.\mvnw.cmd quarkus:dev
```

> Backend sẽ chạy tại: http://localhost:8080
> Swagger UI: http://localhost:8080/swagger-ui
> Lần đầu chạy sẽ tự tạo bảng + seed data mẫu

---

## 🎨 BƯỚC 3: CHẠY FRONTEND (React + Vite)

Mở terminal MỚI (giữ terminal backend chạy):

```bash
# Di chuyển vào thư mục frontend
cd frontend-recipe-catalog

# Cài dependencies (chỉ lần đầu)
npm install

# Chạy dev server
npm run dev
```

> Frontend sẽ chạy tại: http://localhost:5173

---

## 🔑 BƯỚC 4: ĐĂNG NHẬP THỬ

Mở trình duyệt tại http://localhost:5173

**Tài khoản demo:**

| Role  | Email            | Mật khẩu |
|-------|------------------|-----------|
| Admin | admin@gmail.com  | 123456    |
| User  | user@gmail.com   | 123456    |
| User  | user2@gmail.com  | 123456    |

---

## 📡 DANH SÁCH API ENDPOINT

### Authentication
| Method | URL                  | Mô tả              | Auth |
|--------|----------------------|---------------------|------|
| POST   | /api/auth/register   | Đăng ký             | ❌    |
| POST   | /api/auth/login      | Đăng nhập           | ❌    |
| POST   | /api/auth/refresh    | Refresh token       | ✅    |
| GET    | /api/auth/profile    | Lấy profile         | ✅    |
| POST   | /api/auth/logout     | Đăng xuất           | ❌    |

### Recipes
| Method | URL                  | Mô tả                      | Auth |
|--------|----------------------|-----------------------------|------|
| GET    | /api/recipes         | Tìm kiếm + phân trang      | ❌    |
| GET    | /api/recipes/all     | Lấy tất cả (cho dashboard) | ❌    |
| GET    | /api/recipes/{id}    | Chi tiết recipe             | ❌    |
| POST   | /api/recipes         | Tạo recipe mới              | ✅    |
| PUT    | /api/recipes/{id}    | Cập nhật recipe             | ✅    |
| DELETE | /api/recipes/{id}    | Xóa recipe                  | ✅    |

### Categories
| Method | URL                    | Mô tả              | Auth  |
|--------|------------------------|---------------------|-------|
| GET    | /api/categories        | Lấy tất cả         | ❌     |
| GET    | /api/categories/{id}   | Chi tiết            | ❌     |
| POST   | /api/categories        | Tạo mới             | Admin |
| PUT    | /api/categories/{id}   | Cập nhật            | Admin |
| DELETE | /api/categories/{id}   | Xóa                 | Admin |

### Comments
| Method | URL                           | Mô tả              | Auth |
|--------|-------------------------------|---------------------|------|
| GET    | /api/comments/recipe/{id}     | Comments của recipe | ❌    |
| POST   | /api/comments                 | Thêm comment        | ✅    |
| DELETE | /api/comments/{id}            | Xóa comment         | ✅    |

### Favorites
| Method | URL                         | Mô tả              | Auth |
|--------|-----------------------------|---------------------|------|
| GET    | /api/favorites              | DS yêu thích        | ✅    |
| POST   | /api/favorites/{recipeId}   | Toggle yêu thích    | ✅    |
| GET    | /api/favorites/check/{id}   | Kiểm tra yêu thích  | ✅    |

---

## 🏗️ CẤU TRÚC PROJECT

```
Programming/
├── backend-recipe/                    # Java Quarkus Backend
│   └── src/main/java/com/N24_LTJavaNangCao/
│       ├── config/                    # DataInitializer (seed data)
│       ├── controllers/               # REST API endpoints
│       │   ├── AuthResource.java
│       │   ├── RecipeResource.java
│       │   ├── CategoryResource.java
│       │   ├── CommentResource.java
│       │   └── FavoriteResource.java
│       ├── dto/                       # Data Transfer Objects
│       ├── entity/                    # JPA Entities
│       │   ├── User.java
│       │   ├── Recipe.java
│       │   ├── Category.java
│       │   ├── Comment.java
│       │   ├── Favorite.java
│       │   └── Role.java
│       ├── exception/                 # Global Exception Handler
│       └── services/                  # Business Logic
│
├── frontend-recipe-catalog/           # React + Vite Frontend
│   └── src/
│       ├── context/AuthContext.jsx     # Auth state management
│       ├── layouts/MainLayout.jsx     # Navbar + Footer
│       ├── pages/                     # Các trang
│       │   ├── LoginPage.jsx
│       │   ├── FavoritesPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── AdminPage.jsx
│       │   └── recipes/
│       │       ├── HomePage.jsx
│       │       ├── RecipeDetailPage.jsx
│       │       └── RecipeFormPage.jsx
│       ├── routes/ProtectedRoute.jsx
│       └── services/api.js           # Axios API calls
```

---

## 🔐 FLOW JWT AUTHENTICATION

```
1. User gửi email + password → POST /api/auth/login
2. Server kiểm tra BCrypt hash → Tạo JWT token (24h) + Refresh token (7 ngày)
3. Frontend lưu token vào localStorage
4. Mỗi request sau đó, Axios interceptor tự gắn header:
   Authorization: Bearer <token>
5. Backend kiểm tra token qua SmallRye JWT → Cho phép/từ chối
6. Khi token hết hạn → 401 → Frontend redirect về /login
```

---

## 🗃️ DATABASE RELATIONSHIP

```
roles (1) ──── (N) users
users (1) ──── (N) recipes
users (1) ──── (N) comments
users (1) ──── (N) favorites
categories (1) ──── (N) recipes
recipes (1) ──── (N) comments
recipes (1) ──── (N) favorites
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Lần đầu chạy**: `quarkus.hibernate-orm.database.generation=drop-and-create`
   → Tự tạo bảng + seed data
2. **Sau lần đầu**: Đổi thành `update` để giữ data:
   ```
   quarkus.hibernate-orm.database.generation=update
   ```
3. **CORS**: Frontend mặc định ở port 5173, backend ở 8080
4. **JWT Keys**: RSA keys đã có sẵn trong `src/main/resources/`
