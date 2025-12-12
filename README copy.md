
# Hệ thống Việc Làm IT

## Giới thiệu
Hệ thống Việc Làm IT là nền tảng kết nối giữa ứng viên, nhà tuyển dụng, hệ thống AI, quản trị viên và khách truy cập. Hệ thống hỗ trợ các chức năng tìm việc, quản lý tuyển dụng, gợi ý thông minh từ AI, và quản trị hệ thống.

## Sơ đồ Use Case
Sơ đồ use case chi tiết các chức năng và mối quan hệ giữa các đối tượng trong hệ thống được trình bày trong file `image.png`.

## Chức năng chính

### Ứng viên (Candidate)
- **Quản lý tài khoản:** 
  - Đăng ký tài khoản mới với xác thực email
  - Đăng nhập bằng email/mật khẩu hoặc Google OAuth
  - Xác minh thông tin cá nhân và khôi phục mật khẩu
- **Quản lý hồ sơ & CV:** 
  - Tạo/cập nhật thông tin cá nhân, kinh nghiệm làm việc, học vấn, kỹ năng
  - Đính kèm và cập nhật CV (PDF, DOC)
  - Theo dõi trạng thái hồ sơ: Chờ duyệt, Phỏng vấn, Kết quả
- **Tìm kiếm & gợi ý việc làm:** 
  - Tìm kiếm với bộ lọc nâng cao: ngành nghề, kỹ năng, vị trí, mức lương, remote/on-site
  - Nhận gợi ý việc làm từ AI (danh sách phù hợp, gửi qua email/thông báo)
  - Lưu bài viết/tin tuyển dụng yêu thích vào mục "Sở thích"
- **Ứng tuyển & tương tác:** 
  - Nộp đơn trực tuyến, đính kèm CV
  - Theo dõi trạng thái ứng tuyển
  - Nhắn tin trực tiếp với nhà tuyển dụng
  - Nhận thông báo khi nhà tuyển dụng xem CV hoặc từ chối
- **Phỏng vấn:** Nhận lời mời phỏng vấn, sắp lịch phỏng vấn, xem lịch phỏng vấn
- **Nhận phản hồi:** Xem đánh giá sau phỏng vấn
- **Báo cáo & tiện ích:** 
  - Báo cáo bài đăng vi phạm (lừa đảo, thông tin sai...)
  - Mua gói dịch vụ nâng cao để sử dụng thêm tính năng

### Nhà tuyển dụng (Recruiter)
- **Quản lý tài khoản:** 
  - Đăng ký tài khoản công ty nhanh chóng, xác minh thông tin minh bạch
  - Đăng nhập linh hoạt qua Email hoặc Google OAuth
  - Xây dựng và cập nhật hồ sơ nhà tuyển dụng chuyên nghiệp
- **Quản lý tin tuyển dụng:** 
  - Đăng tin tuyển dụng với đầy đủ thông tin: tiêu đề, mô tả công việc (JD), yêu cầu kỹ năng, mức lương, thời hạn nhận hồ sơ
  - Quản lý tin đăng: chỉnh sửa, gia hạn hoặc xóa tin chỉ trong vài thao tác
  - Tìm kiếm và sắp xếp tin tuyển dụng
- **Gói dịch vụ:** 
  - Đăng ký gói Premium để mở rộng số lượng tin đăng (ví dụ: từ 20 tin nâng lên 100 tin)
  - Quản lý subscription và tính năng nâng cao
- **Quản lý ứng viên:** 
  - Xem hồ sơ ứng viên, theo dõi danh sách ứng viên đã ứng tuyển
  - Kết hợp bộ lọc thông minh để đánh giá hồ sơ nhanh chóng
  - Duyệt đơn ứng tuyển và quản lý trạng thái
- **Phỏng vấn:** 
  - Tạo lịch phỏng vấn, gửi lời mời phỏng vấn
  - Chủ động gửi thư mời phỏng vấn, sắp xếp lịch và thông báo kết quả ngay trên hệ thống
  - Quản lý lịch phỏng vấn
- **Đánh giá ứng viên:** Tạo phản hồi sau phỏng vấn
- **AI hỗ trợ:** Nhận gợi ý ứng viên phù hợp từ AI
- **Tìm kiếm chủ động:** Chủ động tìm kiếm và tiếp cận nhân sự tiềm năng
- **Thanh toán:** 
  - Quản lý thanh toán cho các gói dịch vụ
  - Tích hợp thanh toán online và hóa đơn điện tử
- **Thông báo:** Nhận thông báo về đơn ứng tuyển mới
- **Tin nhắn:** Trao đổi trực tiếp qua tính năng nhắn tin tích hợp
- **Báo cáo:** Xem thống kê tuyển dụng

### Hệ thống AI
- **Gợi ý công việc:** Phân tích hồ sơ ứng viên và đề xuất công việc phù hợp
- **Gợi ý ứng viên:** Phân tích yêu cầu công việc và đề xuất ứng viên phù hợp
- **Học tùy chọn người dùng:** Lưu trữ và phân tích preferences của người dùng
- **Phản hồi AI:** Cung cấp feedback thông minh cho quá trình tuyển dụng

### Quản trị viên (Admin)
- **Quản lý người dùng:** 
  - Xem danh sách tất cả người dùng (ứng viên, nhà tuyển dụng)
  - Duyệt, khóa/mở khóa tài khoản người dùng
  - Phê duyệt/từ chối đăng ký tài khoản mới
  - Tạm ngưng tài khoản vi phạm
  - Xuất dữ liệu người dùng (CSV, JSON)
  - Theo dõi hoạt động người dùng

- **Quản lý tin tuyển dụng:** 
  - Xem tất cả tin tuyển dụng trong hệ thống
  - Duyệt, ẩn/hiện tin tuyển dụng
  - Phê duyệt/từ chối tin đăng mới
  - Tạm ngưng tin tuyển dụng vi phạm
  - Thống kê tin đăng theo danh mục, địa điểm

- **Quản lý danh mục công việc:** 
  - Thêm, sửa, xóa danh mục việc làm
  - Quản lý danh mục con
  - Sắp xếp thứ tự hiển thị
  - Theo dõi số lượng việc làm theo danh mục

- **Xử lý báo cáo:** 
  - Xem danh sách báo cáo vi phạm từ người dùng
  - Phân loại báo cáo theo mức độ ưu tiên
  - Giải quyết báo cáo và thực hiện hành động
  - Gửi phản hồi đến người báo cáo

- **Thống kê hệ thống:** 
  - Dashboard tổng quan với số liệu chính
  - Báo cáo chi tiết theo thời gian
  - Thống kê người dùng, việc làm, đơn ứng tuyển
  - Phân tích xu hướng và tăng trưởng
  - Xuất báo cáo hệ thống

- **Quản lý thanh toán:** 
  - Theo dõi tất cả giao dịch thanh toán
  - Thống kê doanh thu theo thời gian
  - Quản lý hoàn tiền và tranh chấp
  - Báo cáo tài chính chi tiết

- **Quản lý template email:** 
  - Tạo và chỉnh sửa mẫu email tự động
  - Quản lý biến động trong template
  - Gửi email hàng loạt
  - Theo dõi tỷ lệ mở email và click

- **Quản lý thông báo:** 
  - Gửi thông báo hệ thống tới tất cả người dùng
  - Gửi thông báo theo vai trò cụ thể
  - Tạo thông báo tự động
  - Quản lý lịch sử thông báo

- **Quản lý gói dịch vụ:**
  - Xem danh sách gói dịch vụ
  - Thêm, sửa, xóa gói dịch vụ
  - Quản lý tính năng và giá cả

- **Quản lý nội dung Blog/News:** 
  - Duyệt và tổ chức các bài viết chia sẻ kiến thức
  - Quản lý tin tức tuyển dụng và xu hướng ngành
  - Thiết lập nội dung giáo dục và hướng dẫn nghề nghiệp

- **Bảo trì hệ thống:**
  - Kiểm tra tình trạng hệ thống
  - Dọn dẹp dữ liệu cũ
  - Sao lưu dữ liệu
  - Giám sát hiệu suất hệ thống

### Khách truy cập (Visitor)
- **Xem tin tuyển dụng:** Duyệt các tin tuyển dụng công khai
- **Tìm kiếm công việc:** Tìm kiếm việc làm theo từ khóa
- **Xem thông tin doanh nghiệp:** Xem profile các công ty tuyển dụng

## Công nghệ sử dụng
- **Frontend:** ReactJS, React Redux, React Router, Vite, TailwindCSS
- **Backend:** NodeJS (Express), RESTful API
- **AI:** Python (Machine Learning, gợi ý công việc/ứng viên)
- **Database:** MongoDB
- **Authentication:** JWT Token
- **File Upload:** Multer
- **Email Service:** NodeMailer
- **Payment:** Momo, VNPay (tích hợp thanh toán online và hóa đơn điện tử)

## Cấu trúc thư mục

```text
job_totnghiep/
├── fe/                    # ReactJS Frontend
│   ├── src/
│   │   ├── components/    # Các component UI
│   │   ├── pages/         # Các trang chính (admin, auth, candidate, recruiter, jobs)
│   │   ├── services/      # API calls
│   │   ├── store/         # Redux store và slices
│   │   ├── router/        # React Router config
│   │   └── utils/         # Utility functions
│   └── public/
├── be/                    # NodeJS Backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Authentication, error handling
│   │   ├── config/        # Database config
│   │   └── utils/         # Email, OTP services
│   └── public/uploads/    # File uploads
├── ai/                    # Python AI/ML (chưa implement)
├── image.png             # Sơ đồ use case
└── README.md
```

## Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone <repo_url>
cd job_totnghiep
```

### 2. Cài đặt dependencies

#### Frontend
```bash
cd fe
npm install
```

#### Backend
```bash
cd be
npm install
```

#### AI (sẽ được phát triển)
```bash
cd ai
pip install -r requirements.txt
```

### 3. Cấu hình environment
- Tạo file `.env` trong thư mục `be/` với các biến:
  ```env
  NODE_ENV=development
  PORT=5000
  DB_CONNECTION_STRING=mongodb://localhost:27017/job_platform
  JWT_SECRET=your_jwt_secret
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASSWORD=your_email_password
  ```

- Tạo file `.env` trong thư mục `fe/` nếu cần:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 4. Khởi tạo database
```bash
cd be
npm run seed  # Nếu có seed script
```

### 5. Chạy ứng dụng

#### Chạy Backend (Port 5000)
```bash
cd be
npm start
# hoặc npm run dev (development mode)
```

#### Chạy Frontend (Port 3000/5173)
```bash
cd fe
npm run dev
```

### 6. Truy cập ứng dụng
- Frontend: http://localhost:5173 (Vite) hoặc http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (nếu có Swagger)

## API Endpoints chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/auth/verify-email` - Xác minh email
- `POST /api/auth/forgot-password` - Quên mật khẩu

### Jobs
- `GET /api/jobs` - Danh sách việc làm (hỗ trợ bộ lọc: ngành nghề, kỹ năng, vị trí, mức lương, remote/on-site)
- `POST /api/jobs` - Tạo tin tuyển dụng (Recruiter)
- `GET /api/jobs/:id` - Chi tiết việc làm
- `POST /api/jobs/:id/favorite` - Lưu việc yêu thích
- `DELETE /api/jobs/:id/favorite` - Bỏ lưu việc yêu thích
- `GET /api/jobs/favorites` - Danh sách việc yêu thích của user

### Applications
- `POST /api/applications` - Nộp đơn ứng tuyển
- `GET /api/applications` - Danh sách đơn ứng tuyển

### Interviews
- `GET /api/interviews` - Danh sách lịch phỏng vấn
- `POST /api/interviews` - Tạo lịch phỏng vấn (Recruiter/Admin)
- `GET /api/interviews/:id` - Chi tiết lịch phỏng vấn
- `PUT /api/interviews/:id` - Cập nhật lịch phỏng vấn
- `DELETE /api/interviews/:id` - Xóa lịch phỏng vấn

### Messages
- `GET /api/messages` - Tất cả tin nhắn
- `POST /api/messages` - Gửi tin nhắn
- `GET /api/messages/inbox` - Hộp thư đến
- `GET /api/messages/sent` - Tin nhắn đã gửi
- `GET /api/messages/:id` - Chi tiết tin nhắn
- `POST /api/messages/:id/reply` - Trả lời tin nhắn
- `DELETE /api/messages/:id` - Xóa tin nhắn

### Notifications
- `GET /api/notifications` - Danh sách thông báo
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc

### Payments
- `GET /api/payments` - Lịch sử thanh toán
- `POST /api/payments` - Tạo thanh toán mới

### Upload
- `POST /api/upload/cv` - Upload CV
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/company-logo` - Upload logo công ty

### Reports
- `GET /api/reports` - Danh sách báo cáo
- `POST /api/reports` - Tạo báo cáo mới

### Service Plans (Public)
- `GET /api/service-plans` - Danh sách gói dịch vụ công khai
- `GET /api/service-plans/:id` - Chi tiết gói dịch vụ

### Subscriptions (Recruiter)
- `GET /api/subscriptions` - Danh sách subscription của recruiter
- `GET /api/subscriptions/current` - Subscription hiện tại
- `POST /api/subscriptions` - Tạo subscription mới
- `PUT /api/subscriptions/:id/payment` - Cập nhật trạng thái thanh toán

### AI (Coming Soon)
- `GET /api/ai` - AI service status
- `POST /api/ai/recommend-jobs` - Gợi ý việc làm cho ứng viên
- `POST /api/ai/recommend-candidates` - Gợi ý ứng viên cho nhà tuyển dụng
- `GET /api/ai/preferences` - Lấy preferences AI của user
- `PUT /api/ai/preferences` - Cập nhật preferences AI

### Candidates & Recruiters
- `GET /api/candidates/profile` - Hồ sơ ứng viên
- `PUT /api/recruiters/profile` - Cập nhật hồ sơ nhà tuyển dụng

### Admin
- `GET /api/admin/dashboard` - Dashboard thống kê tổng quan
- `GET /api/admin/analytics` - Phân tích hệ thống chi tiết
- `GET /api/admin/health` - Kiểm tra tình trạng hệ thống

**User Management:**
- `GET /api/admin/users` - Danh sách người dùng
- `PUT /api/admin/users/:id/status` - Cập nhật trạng thái người dùng
- `GET /api/admin/export/users` - Xuất dữ liệu người dùng
- `GET /api/admin/activities` - Lịch sử hoạt động người dùng

**Job Management:**
- `GET /api/admin/jobs` - Danh sách việc làm
- `PUT /api/admin/jobs/:id/status` - Duyệt/từ chối tin tuyển dụng

**Job Category Management:**
- `GET /api/admin/job-categories` - Danh sách danh mục (có phân trang)
- `GET /api/admin/job-categories/stats` - Thống kê danh mục
- `POST /api/admin/job-categories` - Tạo danh mục mới
- `PUT /api/admin/job-categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/job-categories/:id` - Xóa danh mục
- `PUT /api/admin/job-categories/:id/toggle-status` - Bật/tắt danh mục
- `PUT /api/admin/job-categories/reorder` - Sắp xếp lại thứ tự

**Public Job Categories:**
- `GET /api/job-categories` - Danh sách danh mục công khai
- `GET /api/job-categories/:id` - Chi tiết danh mục
- `GET /api/job-categories?simple=true` - Danh sách đơn giản (cho dropdown)
- `GET /api/job-categories?parent_only=true` - Chỉ danh mục cha

**Report Management:**
- `GET /api/admin/reports` - Danh sách báo cáo
- `PUT /api/admin/reports/:id/resolve` - Giải quyết báo cáo
- `GET /api/admin/reports/system/:type` - Tạo báo cáo hệ thống

**Payment Management:**
- `GET /api/admin/payments` - Quản lý giao dịch

**Service Plan Management:**
- `GET /api/admin/service-plans` - Danh sách gói dịch vụ (có phân trang)
- `POST /api/admin/service-plans` - Tạo gói dịch vụ mới
- `PUT /api/admin/service-plans/:id` - Cập nhật gói dịch vụ
- `DELETE /api/admin/service-plans/:id` - Xóa gói dịch vụ
- `PUT /api/admin/service-plans/:id/toggle-status` - Bật/tắt gói dịch vụ

**Subscription Management:**
- `GET /api/admin/subscriptions` - Danh sách subscription (có phân trang)
- `GET /api/admin/subscriptions/stats` - Thống kê subscription
- `PUT /api/admin/subscriptions/:id/status` - Cập nhật trạng thái subscription

**Email & Notification:**
- `GET /api/admin/email-templates` - Quản lý template email
- `POST /api/admin/email-templates` - Tạo template email
- `PUT /api/admin/email-templates/:id` - Cập nhật template
- `DELETE /api/admin/email-templates/:id` - Xóa template
- `POST /api/admin/emails/bulk` - Gửi email hàng loạt
- `POST /api/admin/notifications/broadcast` - Gửi thông báo hệ thống

**Blog/News Management:**
- `GET /api/admin/blog-posts` - Danh sách bài viết blog
- `POST /api/admin/blog-posts` - Tạo bài viết mới
- `PUT /api/admin/blog-posts/:id` - Cập nhật bài viết
- `DELETE /api/admin/blog-posts/:id` - Xóa bài viết
- `PUT /api/admin/blog-posts/:id/publish` - Xuất bản bài viết
- `GET /api/admin/news` - Quản lý tin tức tuyển dụng
- `POST /api/admin/news` - Tạo tin tức mới

**System Maintenance:**
- `POST /api/admin/maintenance/cleanup` - Dọn dẹp dữ liệu
- `POST /api/admin/maintenance/backup` - Sao lưu hệ thống
- `GET /api/admin/settings` - Cài đặt hệ thống

## Tính năng nổi bật

### 🤖 AI Integration
- Gợi ý công việc thông minh cho ứng viên
- Gợi ý ứng viên phù hợp cho nhà tuyển dụng
- Phân tích tương thích dựa trên skills và kinh nghiệm

### 💼 Quản lý toàn diện
- Dashboard riêng cho từng loại người dùng
- Hệ thống thông báo real-time
- Quản lý lịch phỏng vấn tích hợp

### 💰 Monetization
- Gói Premium cho nhà tuyển dụng
- Tích hợp payment gateway
- Subscription management

### 📊 Analytics & Reporting
- Thống kê chi tiết cho admin
- Báo cáo hiệu suất tuyển dụng
- Tracking user activity

## Roadmap phát triển

### Phase 1 ✅ (Hoàn thành)
- [x] Authentication system
- [x] Basic job posting & application
- [x] User profiles
- [x] Admin panel

### Phase 2 🔄 (Đang phát triển)
- [ ] AI recommendation system
- [ ] Real-time messaging
- [ ] Interview scheduling
- [ ] Payment integration

### Phase 3 📋 (Sắp tới)
- [ ] Mobile application
- [ ] Advanced analytics
- [ ] Video interview integration
- [ ] Company verification system

## Contributing

### Commit Convention
- `feat:` Tính năng mới
- `fix:` Sửa lỗi
- `docs:` Cập nhật documentation
- `refactor:` Refactor code
- `test:` Thêm test
- `chore:` Maintenance

### Pull Request
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License
MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Contact
- Email: contact@jobplatform.com
- Documentation: [Link to detailed docs]
- Bug Reports: [GitHub Issues]

---
*Dự án này được phát triển như một hệ thống việc làm IT toàn diện với tích hợp AI thông minh.*
