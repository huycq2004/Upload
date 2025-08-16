# ----- Giai đoạn 1: Build -----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ----- Giai đoạn 2: Serve -----
FROM nginx:stable-alpine

# Sao chép kết quả build từ giai đoạn 1 vào thư mục phục vụ web của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Xóa file cấu hình Nginx mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Sao chép file cấu hình Nginx của riêng bạn (sẽ tạo ở dưới)
COPY nginx.conf /etc/nginx/conf.d

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]