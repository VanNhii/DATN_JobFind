# 📖 JOB PORTAL SYSTEM - QUICK START GUIDE

## 📂 Tài Liệu Đã Tạo

Mình đã tạo **3 tài liệu chi tiết** để giúp bạn hiểu rõ luồng hoạt động của dự án:

### 1. **WORKFLOW.md** - Luồng Hoạt Động Chi Tiết
- ✅ Tổng quan kiến trúc hệ thống
- ✅ Luồng CANDIDATE từ A-Z (20 bước chi tiết)
- ✅ Luồng RECRUITER từ A-Z (28 bước chi tiết)
- ✅ Luồng chung (Authentication, Notifications, Messages, Payment)
- ✅ Database Schema đầy đủ
- ✅ Key relationships giữa các collections

### 2. **WORKFLOW_DIAGRAMS.md** - Diagrams & Visual Flows
- ✅ Candidate Workflow - Step by step từng phase
- ✅ Recruiter Workflow - Step by step từng phase
- ✅ Data Flow Diagram - Kiến trúc request/response
- ✅ Authentication & Token Flow
- ✅ Subscription Lifecycle
- ✅ Application Lifecycle

### 3. **API_REFERENCE.md** - API Endpoints
- ✅ 40+ API endpoints với request/response examples
- ✅ Tất cả parameters và fields
- ✅ Error responses
- ✅ Authentication headers

---

## 🎯 MỤC TIÊU CỦA CÁC TÀI LIỆU

### **Học Code Tốt Hơn**
Khi bạn đọc code một method nào đó, giờ bạn có thể:
1. Xem file `WORKFLOW.md` để hiểu **luồng tổng thể**
2. Xem file `WORKFLOW_DIAGRAMS.md` để hiểu **cụ thể bước đó làm gì**
3. Xem file `API_REFERENCE.md` để hiểu **request/response**
4. Mở code lên và đọc **chi tiết implementation**

### **Code Lại Dự Án**
Khi bạn code lại từ đầu:
1. Tạo **Models** theo schema trong `WORKFLOW.md`
2. Tạo **Routes** theo endpoints trong `API_REFERENCE.md`
3. Tạo **Controllers** theo luồng trong `WORKFLOW_DIAGRAMS.md`
4. Tạo **Middleware** để enforce business logic
5. Tạo **Utils & Helpers** cho các common tasks

---

## 📊 CANDIDATE LUỒNG RÚT GỌN

```
1. REGISTER → Nhập info, gửi OTP
2. VERIFY OTP → Account active
3. LOGIN → Lấy JWT token
4. HOÀN THIỆN HỒ SƠ → Bio, skills, education, experience, CV
5. TÌM KIẾM JOB → Xem danh sách, filter, view details
6. ỨNG TUYỂN → Apply + cover letter + CV
7. THEO DÕI ỨNG DỤNG → Xem status (pending → shortlisted → interviewed → offered)
8. PHỎNG VẤN → Nhận invite → Tham gia
9. NHẬN OFFER → Accept/Reject
10. THÀNH CÔNG! 🎉
```

---

## 💼 RECRUITER LUỒNG RÚT GỌN

```
1. REGISTER → Nhập info, gửi OTP
2. VERIFY OTP → Account active
3. LOGIN → Lấy JWT token
4. HOÀN THIỆN HỒ SƠ → Company info, mission, vision, benefits
5. NÂNG CẤP SUBSCRIPTION → Chọn plan, thanh toán
6. ĐĂNG TIN JOB → Title, description, requirements, salary, deadline
7. XEM CANDIDATES → Danh sách ứng tuyển
8. SHORTLIST → Chọn candidates tiềm năng
9. PHỎNG VẤN → Tạo lịch, gửi invite
10. FEEDBACK → Rating, recommendation
11. OFFER → Gửi offer letter
12. QUẢN LÝ → Xem analytics, dashboard
```

---

## 🗂️ FOLDER STRUCTURE

```
be/src/
├── controllers/           ← Business logic
│   ├── authController.js           (Login, Register, OTP)
│   ├── candidateController.js       (Candidate profile, apply, etc)
│   ├── recruiterController.js       (Recruiter profile, jobs, analytics)
│   ├── jobController.js             (Job CRUD, search)
│   ├── applicationController.js     (Update application status)
│   ├── interviewController.js       (Schedule interviews)
│   ├── servicePlanController.js     (Plans & subscriptions)
│   └── ... more controllers
│
├── models/                ← Database schemas
│   ├── User.js
│   ├── Candidate.js
│   ├── Recruiter.js
│   ├── Job.js
│   ├── Application.js
│   ├── Interview.js
│   ├── ServicePlan.js
│   ├── RecruiterSubscription.js
│   ├── Message.js
│   ├── Notification.js
│   └── ... more models
│
├── routes/                ← API endpoints
│   ├── authRoutes.js
│   ├── candidateRoutes.js
│   ├── recruiterRoutes.js
│   ├── jobRoutes.js
│   ├── applicationRoutes.js
│   ├── interviewRoutes.js
│   └── ... more routes
│
├── middleware/            ← Request processing
│   ├── auth.js            (Verify JWT token)
│   ├── subscription.js     (Check subscription limits)
│   ├── upload.js          (Handle file uploads)
│   └── errorHandler.js    (Error handling)
│
├── utils/                 ← Helper functions
│   ├── pagination.js      (Pagination logic)
│   ├── emailService.js    (Send emails)
│   ├── otpService.js      (Generate & verify OTP)
│   └── ... more utils
│
├── seeders/               ← Sample data
│   ├── userSeeder.js
│   ├── recruiterSeeder.js
│   ├── jobSeeder.js
│   ├── servicePlanSeeder.js
│   └── index.js          (Run all seeders)
│
├── config/
│   └── database.js        (MongoDB connection)
│
└── server.js              ← Main entry point
```

---

## 🔑 KEY CONCEPTS

### **1. Subscription System**
- **Recruiter** phải nâng cấp subscription để sử dụng tính năng
- Mỗi plan có **features** (job_posts_limit, cv_downloads, v.v.)
- Middleware kiểm tra limit trước khi cho phép action

```javascript
// Check job posting limit
const activeSubscription = await RecruiterSubscription.findOne({...});
const jobPostsLimit = activeSubscription.features.job_posts_limit;
if (currentJobs >= jobPostsLimit) {
  return res.status(403).json({ error: "Limit exceeded" });
}
```

### **2. Application Status Lifecycle**
```
pending 
  → reviewing 
  → shortlisted 
  → interviewed 
  → (offered | rejected)
```

### **3. Role-Based Access Control (RBAC)**
```javascript
// Middleware: authorize
router.put('/jobs/:id', protect, authorize('recruiter'), updateJob);
// Chỉ recruiter mới có quyền update job
```

### **4. JWT Token Authentication**
```javascript
// Token chứa: user_id, email, role
// Mỗi request gửi: Authorization: Bearer <token>
// Middleware extract token, verify, attach user vào req.user
```

### **5. Database Relationships**
```
User (1) ──→ (1) Candidate
User (1) ──→ (1) Recruiter
Recruiter (1) ──→ (many) Jobs
Job (1) ──→ (many) Applications
Candidate (1) ──→ (many) Applications
Application (1) ──→ (many) Interviews
Recruiter (1) ──→ (many) RecruiterSubscriptions
```

---

## 💻 CODE READING GUIDE

### **Khi bạn muốn hiểu một feature, làm theo steps này:**

#### **Example: How does job application work?**

**Step 1:** Đọc workflow diagram
```
WORKFLOW_DIAGRAMS.md → PHASE 4: APPLICATION & INTERVIEW → 5. ỨNG TUYỂN JOB
```

**Step 2:** Đọc API details
```
API_REFERENCE.md → 13. Apply for Job
Xem request body, response structure
```

**Step 3:** Đọc database schema
```
WORKFLOW.md → applicationSchema
Xem các fields trong Application collection
```

**Step 4:** Đọc code
```javascript
// routes/candidateRoutes.js
router.post('/apply', protect, authorize('candidate'), applyForJob);

// controllers/candidateController.js
exports.applyForJob = async (req, res, next) => {
  const { job_id, cover_letter, cv_url } = req.body;
  // ... implementation
}
```

**Step 5:** Trace the flow
```
Frontend form → POST /api/candidates/apply
  → Middleware: protect (verify JWT)
  → Controller: applyForJob
    → Check: duplicate application?
    → Create: Application document
    → Update: Job.applications_count
    → Send: notification to recruiter
  → Response: success
→ Frontend: show success message
```

---

## 🚀 GETTING STARTED

### **1. Setup Database**
```bash
# Start MongoDB
mongod

# Seed sample data
npm run seed
```

### **2. Run Server**
```bash
npm install
npm run dev
```

### **3. Test APIs**
```bash
# Use Postman or curl
POST /api/v1/auth/register
{
  "firstName": "John",
  "email": "john@example.com",
  "password": "secure123",
  "role": "candidate"
}
```

### **4. Understand a Flow**
- Pick a feature from WORKFLOW.md
- Read the detailed steps
- Check API in API_REFERENCE.md
- Look at the code
- Try it in Postman

---

## 📝 DEVELOPMENT WORKFLOW

### **When Adding a New Feature:**

1. **Update Schema** (models/)
   ```javascript
   // Thêm field mới vào model
   const mySchema = new Schema({
     new_field: { type: String, required: true }
   });
   ```

2. **Update Routes** (routes/)
   ```javascript
   // Thêm route mới
   router.post('/my-endpoint', protect, authorize('role'), myController);
   ```

3. **Update Controller** (controllers/)
   ```javascript
   // Implement business logic
   exports.myEndpoint = async (req, res, next) => {
     // Logic here
   };
   ```

4. **Update Middleware** (middleware/)
   ```javascript
   // Add checks/validations if needed
   exports.myMiddleware = async (req, res, next) => {
     // Check something
     next();
   };
   ```

5. **Update Documentation**
   ```markdown
   // Add to WORKFLOW.md, WORKFLOW_DIAGRAMS.md, API_REFERENCE.md
   ```

---

## 🔗 USEFUL LINKS

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express.js:** https://expressjs.com/
- **Mongoose:** https://mongoosejs.com/
- **JWT:** https://jwt.io/

---

## 🎓 LEARNING TIPS

1. **Đọc từ big picture → chi tiết**
   - Trước tiên hiểu overall flow
   - Sau đó đi vào từng component

2. **Trace the request**
   - Frontend → Route → Middleware → Controller → Model → Database
   - Response ngược lại: Database → Model → Controller → Route → Frontend

3. **Understand relationships**
   - Xem diagram relationships giữa collections
   - Hiểu populate/populate flow

4. **Test with Postman**
   - Send requests
   - See responses
   - Understand data structures

5. **Read code comments**
   - Code comments giải thích **WHY**
   - Docs giải thích **WHAT**

---

## ❓ FAQ

**Q: Recruiter có subscription, candidate có không?**
A: Không. Candidate miễn phí 100%. Chỉ recruiter cần subscription để sử dụng premium features.

**Q: JWT token hết hạn thì sao?**
A: User phải login lại để lấy token mới. Frontend sẽ automatic redirect tới login page.

**Q: Subscription expired thì recruiter có thể gì?**
A: Không thể post job mới. Nhưng vẫn có thể xem applications, interviews, analytics.

**Q: Làm sao để track features usage?**
A: Dùng `features_used` field trong RecruiterSubscription. Increment mỗi khi recruiter dùng feature.

**Q: Database indices là gì?**
A: Tăng query performance. Ví dụ: `{ job_id: 1, candidate_id: 1, unique: true }` prevent duplicate applications.

---

## 🎯 NEXT STEPS

1. ✅ Đọc `WORKFLOW.md` - hiểu big picture
2. ✅ Đọc `WORKFLOW_DIAGRAMS.md` - hiểu detailed flows
3. ✅ Đọc `API_REFERENCE.md` - hiểu endpoints
4. ✅ Setup database & seed data
5. ✅ Test APIs với Postman
6. ✅ Trace một feature từ frontend → backend
7. ✅ Code một feature mới
8. ✅ Profit! 🎉

---

**Good Luck với coding! Chúc bạn học tốt!** 🚀
