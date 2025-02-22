1. Công cụ & Môi trường phát triển
  Frontend: Visual Studio Code
  Backend: Visual Studio
  RunPythonAI: Visual Studio
  Database: MS SQL Server
2. Các bước để chạy chương trình
  Bước 1: Clone source code từ GitHub
     - Trước tiên, hãy sao chép mã nguồn của dự án từ GitHub về máy.
  Bước 2: Cài đặt và chạy Frontend
     - Cài đặt các package cần thiết: npm install
     - Build và chạy ứng dụng:
         + Build dự án: npm run build
         + Chạy dự án ở chế độ phát triển: npm run dev
  Bước 3: Cấu hình và chạy RunPythonAI
     - Cập nhật thông tin cần thiết (nếu có).
     - Chạy lệnh sau để tải lại dữ liệu FAISS: python faiss_index.py
     - Khởi động API Python: python api.py
  Bước 4: Cấu hình và khởi tạo Database
     - Chạy file db.sql để thêm các bảng và dữ liệu vào
  Bước 5: Cấu hình và chạy Backend
     - Mở Visual Studio và tải dự án Backend.
     - Cập nhật connection string trong file appsettings.json để kết nối với Database.
         + Tool -> Connect to database -> ......
     - Chạy ứng dụng Backend bình thường bằng Visual Studio.
