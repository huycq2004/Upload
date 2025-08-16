# Sử dụng một image Node.js chính thức, phiên bản 18, loại alpine cho nhẹ
FROM node:18-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào trước
# Tận dụng cơ chế cache của Docker, bước này chỉ chạy lại khi 2 file này thay đổi
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --only=production

# Sao chép toàn bộ code của backend vào
COPY . .

# Mở cổng mà ứng dụng backend của bạn đang chạy (ví dụ 5000)
EXPOSE 5000

# Lệnh để khởi chạy ứng dụng khi container bắt đầu
# Thay 'src/index.js' bằng file khởi động chính của bạn nếu khác
CMD ["node", "src/index.js"]