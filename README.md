# Upload Files Project

Một hệ thống quản lý và upload file bằng React (TailwindCSS) và Node.js (Express, MySQL). Người dùng có thể gửi nhiều tệp tin (ảnh, PDF, Word...), mỗi lượt upload sẽ được lưu trong thư mục riêng biệt và thông tin chi tiết sẽ được ghi vào database.

## 📁 Cấu trúc dự án

upload-files-project/
├── file-upload-frontend/ # React + Tailwind (Vite)
└── file-upload-backend/ # Node.js + Express + MySQL


## 🚀 Hướng dẫn chạy dự án

### Bước 1: Clone source code
git clone https://github.com/huycq2004/Upload.git
cd upload-files-project

### Bước 2: Setup Backend
cd file-upload-backend
npm install

### Bước 3: Cấu hình file .env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=upload_files_management
UPLOAD_DIR=D:/uploads
ADMIN_USERNAME=name
ADMIN_PASSWORD=password

### Bước 4: Tạo cơ sở dữ liệu
CREATE DATABASE upload_files_management;

-- Bảng user
CREATE TABLE user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  ho_ten VARCHAR(255),
  lop VARCHAR(100),
  upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  folder_name VARCHAR(255)
);

-- Bảng detail (file chi tiết)
CREATE TABLE detail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  file_name VARCHAR(255),
  file_path VARCHAR(255),
  file_type VARCHAR(100),
  file_size INT,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

### Bước 5: Chạy server
npm run dev
Mặc định backend sẽ chạy tại http://localhost:5000

### Bước 6: Setup Frontend
cd ../file-upload-frontend
npm install
npm run dev
Frontend sẽ chạy tại http://localhost:5173 (hoặc cổng Vite mặc định khác)
