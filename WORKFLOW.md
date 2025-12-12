# 🚀 JOB PORTAL SYSTEM - LUỒNG HOẠT ĐỘNG CHI TIẾT

## 📋 Mục Lục
1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [Luồng CANDIDATE](#luồng-candidate)
3. [Luồng RECRUITER](#luồng-recruiter)
4. [Luồng CHUNG](#luồng-chung)
5. [Database Schema](#database-schema)

---

## 🏗️ TỔNG QUAN KIẾN TRÚC

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React/Vue)                       │
│  - Candidate App   │   Recruiter App    │   Admin Dashboard  │
└─────────────────┬───────────────────────────────────────────┘
                  │
         HTTP/REST API Calls
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                  │
│  ┌──────────────┬─────────────────┬──────────────────────┐  │
│  │ Routes       │ Controllers     │ Models               │  │
│  │ (API paths)  │ (Business Logic)│ (Database Schema)    │  │
│  └──────────────┴─────────────────┴──────────────────────┘  │
│  ┌──────────────┬─────────────────┬──────────────────────┐  │
│  │ Middleware   │ Utils           │ Config               │  │
│  │ (Auth, etc)  │ (Helpers)       │ (Database conn)      │  │
│  └──────────────┴─────────────────┴──────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
         Database Queries (MongoDB)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│  Collections: Users, Candidates, Recruiters, Jobs, etc.     │
└─────────────────────────────────────────────────────────────┘
```

---

# 👤 LUỒNG CANDIDATE

## 1️⃣ ĐĂNG KÝ CANDIDATE

### **API Endpoint:**
```
POST /api/v1/auth/register
Body: {
  firstName: "John",
  last_name: "Doe",
  email: "john@example.com",
  password: "secure123",
  phone: "0123456789",
  role: "candidate"  ← Đặt role = "candidate"
}
```

### **Luồng Chi Tiết:**

```
1. Frontend gửi form đăng ký
   ↓
2. authController.register() 
   ├─ Kiểm tra email tồn tại? Nếu có → return error
   ├─ Hash password bằng bcrypt
   ├─ Tạo User document:
   │  ├─ first_name: "John"
   │  ├─ last_name: "Doe"
   │  ├─ email: "john@example.com"
   │  ├─ password: "hashed_password"
   │  ├─ role: "candidate"
   │  ├─ account_status: "pending"
   │  └─ email_verification: { code: OTP, expires_at: ... }
   │
   ├─ Tạo Candidate profile document:
   │  └─ user_id: reference_to_user
   │
   └─ Gửi email chứa OTP để xác thực
       ↓
3. Candidate nhập OTP từ email
   ↓
4. POST /api/v1/auth/verify-otp
   ├─ Kiểm tra OTP có hợp lệ?
   ├─ Kiểm tra OTP hết hạn?
   ├─ Update User: account_status = "active"
   └─ Return success message
       ↓
5. Candidate có tài khoản → Login
```

### **Database Changes:**
```
Before:
users collection: { empty }
candidates collection: { empty }

After:
users collection:
├─ _id: ObjectId
├─ first_name: "John"
├─ last_name: "Doe"
├─ email: "john@example.com"
├─ password: "hashed_secure123"
├─ role: "candidate"
├─ account_status: "active"
└─ email_verification: { verified: true }

candidates collection:
├─ _id: ObjectId
├─ user_id: reference_to_user._id
├─ bio: null
├─ experience_years: null
└─ skills: []
```

---

## 2️⃣ LOGIN CANDIDATE

### **API Endpoint:**
```
POST /api/v1/auth/login
Body: {
  email: "john@example.com",
  password: "secure123"
}
```

### **Luồng Chi Tiết:**

```
1. Frontend gửi email + password
   ↓
2. authController.login()
   ├─ Tìm user bằng email
   ├─ So sánh password (bcrypt.compare)
   ├─ Kiểm tra account_status = "active"?
   ├─ Tạo JWT token:
   │  └─ Chứa: user_id, email, role
   │
   └─ Return JWT token + user info
       ↓
3. Frontend lưu token vào localStorage/cookie
   ↓
4. Mỗi request sau đây gửi token:
   Authorization: Bearer <jwt_token>
```

### **Token Structure:**
```javascript
JWT Token: {
  iss: "job-portal",
  sub: user_id,
  email: "john@example.com",
  role: "candidate",
  iat: 1702210000,
  exp: 1702296400
}
```

---

## 3️⃣ HOÀN THIỆN HỒ SƠ CANDIDATE

### **API Endpoints:**
```
PUT /api/v1/candidates/profile
Body: {
  bio: "5 years experienced developer",
  experience_years: 5,
  address: "123 Main Street",
  city: "Ho Chi Minh City",
  education_level: "bachelor",
  salary_expectation: { min: 15000000, max: 25000000 },
  job_status: "seeking"
}

POST /api/v1/candidates/skills
Body: {
  skill_name: "JavaScript",
  proficiency_level: "advanced",
  years_of_experience: 5
}

POST /api/v1/candidates/education
Body: {
  school_name: "University of Technology",
  degree: "Bachelor of Computer Science",
  field_of_study: "Computer Science",
  graduation_year: 2020
}

POST /api/v1/candidates/experience
Body: {
  company_name: "Tech Company",
  position: "Senior Developer",
  description: "Led team of 5 developers",
  start_date: "2020-01-01",
  end_date: "2023-12-31",
  currently_working: false
}
```

### **Luồng Chi Tiết:**

```
Candidate điền thông tin hồ sơ
   ↓
1. PUT /api/v1/candidates/profile
   └─ Update Candidate document: bio, experience_years, etc.
   
2. POST /api/v1/candidates/skills (có thể thêm nhiều)
   └─ Push vào Candidate.skills array
   
3. POST /api/v1/candidates/education (có thể thêm nhiều)
   └─ Push vào Candidate.education array
   
4. POST /api/v1/candidates/experience (có thể thêm nhiều)
   └─ Push vào Candidate.experience array
   
5. POST /api/v1/upload (upload CV file)
   ├─ Upload file lên server
   └─ Update Candidate.cv_url = URL_của_file
```

### **Database After:**
```
candidates collection:
├─ user_id: ObjectId
├─ bio: "5 years experienced developer"
├─ experience_years: 5
├─ address: "123 Main Street"
├─ city: "Ho Chi Minh City"
├─ cv_url: "https://storage/cv_john.pdf"
├─ skills: [
│  ├─ { skill_name: "JavaScript", proficiency_level: "advanced", years: 5 }
│  ├─ { skill_name: "React", proficiency_level: "intermediate", years: 3 }
│  └─ { skill_name: "MongoDB", proficiency_level: "intermediate", years: 2 }
├─ education: [
│  └─ { school_name: "University of Technology", degree: "Bachelor", ... }
├─ experience: [
│  └─ { company_name: "Tech Company", position: "Senior Developer", ... }
└─ salary_expectation: { min: 15000000, max: 25000000 }
```

---

## 4️⃣ TÌM KIẾM & DUYỆT JOB

### **API Endpoints:**
```
GET /api/v1/jobs
Query Params:
  ?page=1
  &limit=10
  &search=developer
  &category=frontend
  &job_type=full_time
  &work_location=remote
  &salary_min=15000000
  &salary_max=25000000
  &location=Ho%20Chi%20Minh

GET /api/v1/jobs/:jobId
```

### **Luồng Chi Tiết:**

```
1. Candidate truy cập trang "Tìm Việc"
   ↓
2. GET /api/v1/jobs (with filters)
   ├─ Query: { is_active: true, status: "approved", ...filters }
   ├─ Populate job data từ Job collection
   ├─ Populate recruiter info từ Recruiter collection
   ├─ Sort theo created_at (mới nhất)
   ├─ Pagination: page=1, limit=10
   └─ Return: array of jobs [{ id, title, company, salary, ... }, ...]
       ↓
3. Candidate click vào job để xem chi tiết
   ↓
4. GET /api/v1/jobs/:jobId
   ├─ Lấy job đầy đủ (description, requirements, benefits, etc.)
   ├─ Populate recruiter profile (company_name, website, etc.)
   ├─ Increment views_count: +1 (để tính trending)
   └─ Return job details
       ↓
5. Candidate quyết định ứng tuyển hoặc lưu job
```

### **Job Detail Structure:**
```javascript
{
  _id: ObjectId,
  recruiter_id: {
    company_name: "TechViet Solutions",
    company_logo_url: "...",
    industry: "Information Technology"
  },
  title: "Senior Frontend Developer (ReactJS)",
  description: "We are looking for...",
  requirements: "3+ years of experience...",
  benefits: "Competitive salary, Health insurance...",
  salary_min: 15000000,
  salary_max: 25000000,
  salary_currency: "VND",
  job_type: "full_time",
  work_location: "hybrid",
  location: {
    address: "123 Nguyễn Huệ, Quận 1",
    city: "Ho Chi Minh",
    country: "Vietnam"
  },
  experience_required: { min: 3, max: 7 },
  education_required: "bachelor",
  skills_required: [
    { skill_name: "ReactJS", is_required: true, weight: 10 },
    { skill_name: "JavaScript", is_required: true, weight: 9 }
  ],
  application_deadline: Date,
  views_count: 145,
  applications_count: 23,
  is_featured: true,
  status: "approved",
  is_active: true
}
```

---

## 5️⃣ ỨNG TUYỂN JOB

### **API Endpoint:**
```
POST /api/v1/candidates/apply
Body: {
  job_id: "ObjectId_của_job",
  cover_letter: "I am interested in this position because...",
  cv_url: "https://storage/cv_john.pdf"
}
```

### **Luồng Chi Tiết:**

```
1. Candidate click nút "Ứng Tuyển"
   ↓
2. POST /api/v1/candidates/apply
   ├─ Kiểm tra candidate đã ứng tuyển job này chưa?
   │  └─ Application index: { job_id: 1, candidate_id: 1, unique: true }
   │     (Ngăn ứng tuyển trùng)
   │
   ├─ Kiểm tra CV có hợp lệ?
   ├─ Tạo Application document:
   │  ├─ job_id: reference_to_job
   │  ├─ candidate_id: reference_to_candidate
   │  ├─ cover_letter: "I am interested..."
   │  ├─ cv_url: "https://storage/cv_john.pdf"
   │  ├─ application_status: "pending"
   │  ├─ applied_at: Date.now()
   │  └─ created_at: Date.now()
   │
   ├─ Update Job.applications_count: +1
   │
   ├─ Tạo ApplicationStatusHistory:
   │  └─ Ghi lại: application_id, status="pending", timestamp
   │
   ├─ Gửi notification cho recruiter:
   │  └─ "John Doe ứng tuyển vào Senior Frontend Developer"
   │
   └─ Return success: "Ứng tuyển thành công!"
       ↓
3. Candidate có thể xem danh sách ứng tuyển của mình:
   GET /api/v1/candidates/applications
   └─ Return: [{ job: {...}, status: "pending", applied_at: ... }, ...]
```

### **Database Changes:**
```
applications collection:
├─ _id: ObjectId
├─ job_id: reference_to_job._id
├─ candidate_id: reference_to_candidate._id
├─ cover_letter: "I am interested in..."
├─ cv_url: "https://storage/cv_john.pdf"
├─ application_status: "pending"
├─ applied_at: 2024-12-10T10:00:00Z
└─ created_at: 2024-12-10T10:00:00Z

applicationstatushistories collection:
├─ _id: ObjectId
├─ application_id: reference_to_application._id
├─ status: "pending"
├─ changed_by: recruiter_id
├─ reason: null
├─ timestamp: 2024-12-10T10:00:00Z
└─ created_at: 2024-12-10T10:00:00Z
```

---

## 6️⃣ RECRUITER REVIEW & PHỎNG VẤN

### **Recruiter xem candidates ứng tuyển:**
```
GET /api/recruiters/applications
└─ Return candidates ứng tuyển vào các job của recruiter này
```

### **Recruiter thay đổi trạng thái ứng tuyển:**
```
PUT /api/v1/applications/:applicationId/status
Body: {
  application_status: "shortlisted",  // or "rejected", "offered", etc.
  interviewer_notes: "Great skills, potential candidate"
}
```

### **Recruiter tạo lịch phỏng vấn:**
```
POST /api/v1/interviews
Body: {
  application_id: ObjectId,
  interview_type: "video",
  interview_date: "2024-12-20",
  interview_time: "14:00",
  meeting_link: "https://zoom.us/...",
  duration_minutes: 60,
  notes: "Tech interview about React"
}
```

### **Luồng Phỏng Vấn:**
```
1. Recruiter xem ứng dụng → chọn "shortlisted"
   ├─ Update Application.application_status = "shortlisted"
   └─ Gửi email/notification cho candidate
       ↓
2. Recruiter tạo lịch phỏng vấn
   ├─ Tạo Interview document
   ├─ Update Application.application_status = "interviewed"
   ├─ Gửi email lời mời phỏng vấn cho candidate
   │  ├─ Date, time, meeting_link
   │  └─ Candidate nhận notification
   │
   └─ Candidate confirm tham gia
       ↓
3. Ngày phỏng vấn
   ├─ Recruiter mark: Interview.status = "in_progress"
   ├─ Phỏng vấn diễn ra
   └─ Update Interview.status = "completed"
       ↓
4. Sau phỏng vấn
   ├─ Recruiter viết feedback:
   │  ├─ InterviewFeedback: { interview_id, rating, feedback_text, ... }
   │  └─ Điểm đánh giá: 1-5 stars
   │
   ├─ Update Application.application_status:
   │  ├─ "offered" (nếu pass)
   │  └─ "rejected" (nếu fail)
   │
   └─ Gửi kết quả cho candidate
```

---

## 7️⃣ LƯUTRỮ JOB YÊU THÍCH

### **API Endpoints:**
```
POST /api/candidates/saved-jobs/:jobId
└─ Lưu job yêu thích

DELETE /api/candidates/saved-jobs/:jobId
└─ Bỏ lưu job

GET /api/candidates/saved-jobs
└─ Xem danh sách jobs đã lưu
```

### **Database:**
```
favoriteJobs collection (hoặc savedSearch):
├─ _id: ObjectId
├─ candidate_id: reference_to_candidate._id
├─ job_id: reference_to_job._id
├─ saved_at: Date.now()
└─ notes: "Follow up later" (optional)
```

---

# 💼 LUỒNG RECRUITER

## 1️⃣ ĐĂNG KÝ RECRUITER

### **API Endpoint:**
```
POST /api/v1/auth/register
Body: {
  firstName: "Jane",
  last_name: "Smith",
  email: "jane@techviet.com",
  password: "secure123",
  phone: "0987654321",
  role: "recruiter",     ← role = "recruiter"
  company_name: "TechViet Solutions",
  industry: "Information Technology"
}
```

### **Luồng Chi Tiết:**

```
1. Recruiter điền form đăng ký
   ↓
2. authController.register()
   ├─ Tạo User document (giống candidate)
   ├─ Tạo Recruiter profile document:
   │  ├─ user_id: reference_to_user
   │  ├─ company_name: "TechViet Solutions"
   │  ├─ industry: "Information Technology"
   │  ├─ company_logo_url: null
   │  ├─ website: null
   │  ├─ company_size: null
   │  ├─ company_description: null
   │  ├─ is_verified: false  ← Chưa xác thực công ty
   │  ├─ subscription_plan: null
   │  └─ plan_expires_at: null
   │
   └─ Gửi OTP xác thực email
       ↓
3. Recruiter nhập OTP
   ├─ Verify email
   └─ account_status = "active"
```

### **Database:**
```
users collection:
├─ first_name: "Jane"
├─ last_name: "Smith"
├─ email: "jane@techviet.com"
├─ role: "recruiter"
└─ account_status: "active"

recruiters collection:
├─ user_id: reference_to_user._id
├─ company_name: "TechViet Solutions"
├─ industry: "Information Technology"
├─ is_verified: false  ← Cần verify công ty
└─ subscription_plan: null  ← Chưa có subscription
```

---

## 2️⃣ HOÀN THIỆN HỒ SƠ CÔNG TY

### **API Endpoints:**
```
PUT /api/recruiters/profile
Body: {
  company_logo_url: "https://...",
  website: "https://techviet-solutions.com",
  company_size: "100-500",
  company_description: "Leading software development company...",
  tax_id: "TV001234567"
}

PUT /api/recruiters/company-culture
Body: {
  mission: "To deliver high-quality software solutions",
  vision: "To be a leading IT company",
  company_culture: "Innovation, Teamwork, Excellence",
  benefits: ["Health insurance", "13th month bonus", "Flexible hours"]
}
```

### **Luồng Chi Tiết:**

```
1. Recruiter hoàn thiện thông tin công ty
   ├─ Tải logo
   ├─ Nhập website
   ├─ Viết mission & vision
   ├─ Thêm benefits
   └─ Update Recruiter document
       ↓
2. Admin xác thực công ty (optional)
   ├─ Kiểm tra thông tin tax_id
   ├─ Update Recruiter.is_verified = true
   └─ Recruiter được ưu tiên trên platform
```

---

## 3️⃣ NÂNG CẤP SUBSCRIPTION

### **API Endpoints:**
```
GET /api/v1/service-plans/available
└─ Xem danh sách plans (Trial, Basic, Premium, Enterprise)

PUT /api/recruiters/subscription/upgrade
Body: {
  planId: "ObjectId_của_plan",
  payment_method: "credit_card"
}
```

### **Luồng Chi Tiết:**

```
1. Recruiter truy cập trang "Nâng Cấp"
   ↓
2. GET /api/v1/service-plans/available
   └─ Return: [
        { name: "Trial", price: 0, features: {...} },
        { name: "Basic", price: 0, features: {...} },
        { name: "Premium", price: 500000, features: {...} },
        { name: "Enterprise", price: 1500000, features: {...} }
      ]
       ↓
3. Recruiter chọn plan (e.g., Premium)
   ├─ Xem chi tiết features
   └─ Click "Upgrade"
       ↓
4. PUT /api/recruiters/subscription/upgrade
   ├─ Lấy ServicePlan document
   ├─ Hủy subscription cũ (nếu có):
   │  └─ Update old subscription: status = "cancelled"
   │
   ├─ Tạo RecruiterSubscription bới:
   │  ├─ recruiter_id: recruiter._id
   │  ├─ service_plan_id: plan._id
   │  ├─ start_date: Date.now()
   │  ├─ end_date: start_date + 30 days
   │  ├─ subscription_status: "pending"
   │  ├─ payment_status: "pending"
   │  └─ features_used: { job_posts_used: 0, ... }
   │
   └─ Return: "Please complete payment"
       ↓
5. Recruiter thanh toán (via payment gateway)
   ├─ Tạo Payment record
   ├─ Update RecruiterSubscription.payment_status = "paid"
   └─ subscription_status = "active"
```

### **Database:**
```
recruitersubscriptions collection:
├─ _id: ObjectId
├─ recruiter_id: reference_to_recruiter._id
├─ service_plan_id: reference_to_serviceplan._id
├─ start_date: 2024-12-10T10:00:00Z
├─ end_date: 2025-01-10T10:00:00Z (30 days later)
├─ subscription_status: "active"
├─ payment_status: "paid"
└─ features_used: {
     job_posts_used: 0,
     featured_jobs_used: 0,
     cv_downloads_used: 0
   }
```

---

## 4️⃣ ĐĂNG TIN JOB

### **API Endpoint:**
```
POST /api/v1/jobs
Body: {
  title: "Senior Frontend Developer (ReactJS)",
  description: "We are looking for...",
  requirements: "3+ years of experience...",
  benefits: "Competitive salary...",
  salary_min: 15000000,
  salary_max: 25000000,
  salary_currency: "VND",
  job_type: "full_time",
  work_location: "hybrid",
  location: {
    address: "123 Nguyễn Huệ, Quận 1",
    city: "Ho Chi Minh",
    country: "Vietnam"
  },
  experience_required: { min: 3, max: 7 },
  education_required: "bachelor",
  skills_required: [
    { skill_name: "ReactJS", is_required: true, weight: 10 },
    { skill_name: "JavaScript", is_required: true, weight: 9 }
  ],
  application_deadline: "2024-12-31",
  category_id: "ObjectId_của_category",
  is_featured: true
}
```

### **Luồng Chi Tiết:**

```
1. Recruiter click "Đăng Tin Job"
   ↓
2. Middleware: checkJobPostingLimit
   ├─ Lấy active subscription của recruiter
   ├─ Get job_posts_limit từ plan features
   │  ├─ Trial: 1 job
   │  ├─ Basic: 3 jobs
   │  ├─ Premium: 15 jobs
   │  └─ Enterprise: unlimited
   │
   ├─ Đếm active jobs hiện tại
   ├─ Check: current_jobs < limit?
   │  ├─ Nếu < → cho phép tiếp tục
   │  └─ Nếu >= → return error "Limit exceeded"
   │
   └─ next()
       ↓
3. POST /api/v1/jobs
   ├─ Tạo Job document:
   │  ├─ recruiter_id: recruiter._id
   │  ├─ title: "Senior Frontend Developer..."
   │  ├─ description, requirements, benefits: ...
   │  ├─ salary_min, salary_max: ...
   │  ├─ location: { address, city, country }
   │  ├─ skills_required: [...]
   │  ├─ status: "pending"  ← Chờ admin approve
   │  ├─ is_active: true
   │  ├─ is_featured: true (nếu plan cho phép)
   │  ├─ views_count: 0
   │  ├─ applications_count: 0
   │  ├─ created_at: Date.now()
   │  └─ application_deadline: ...
   │
   ├─ Update RecruiterSubscription.features_used.job_posts_used: +1
   │
   └─ Return: "Job posted successfully! Pending admin approval."
       ↓
4. Admin xem danh sách pending jobs
   ├─ Review thông tin job
   └─ Approve hoặc reject
       ↓
5. Nếu approved:
   ├─ Update Job.status = "approved"
   ├─ Candidates có thể thấy job
   └─ Gửi notification cho recruiter
```

### **Database:**
```
jobs collection:
├─ _id: ObjectId
├─ recruiter_id: reference_to_recruiter._id
├─ category_id: reference_to_jobcategory._id
├─ title: "Senior Frontend Developer (ReactJS)"
├─ description: "We are looking for..."
├─ requirements: "3+ years of experience..."
├─ benefits: "Competitive salary..."
├─ salary_min: 15000000
├─ salary_max: 25000000
├─ salary_currency: "VND"
├─ job_type: "full_time"
├─ work_location: "hybrid"
├─ location: { address, city, country }
├─ experience_required: { min: 3, max: 7 }
├─ education_required: "bachelor"
├─ skills_required: [{ skill_name, is_required, weight }, ...]
├─ status: "approved"
├─ is_active: true
├─ is_featured: true
├─ views_count: 0
├─ applications_count: 0
├─ application_deadline: "2024-12-31"
├─ created_at: 2024-12-10T10:00:00Z
└─ updated_at: null
```

---

## 5️⃣ XEMỨNG TUYỂN & QUẢN LÝ CANDIDATES

### **API Endpoints:**
```
GET /api/recruiters/applications
└─ Xem tất cả ứng tuyển vào các job của recruiter

GET /api/recruiters/jobs/:jobId/applications
└─ Xem ứng tuyển vào 1 job cụ thể

PUT /api/v1/applications/:applicationId/status
Body: {
  application_status: "shortlisted|interviewed|offered|rejected",
  interviewer_notes: "..."
}
```

### **Luồng Chi Tiết:**

```
1. Recruiter truy cập Dashboard
   ├─ GET /api/recruiters/applications
   └─ Xem danh sách candidates:
      ├─ Tên, vị trí ứng tuyển
      ├─ Trạng thái: pending, reviewing, shortlisted, interviewed, offered, rejected
      ├─ Ngày ứng tuyển
      └─ CV link
       ↓
2. Recruiter click vào 1 candidate
   ├─ Xem full profile:
   │  ├─ Bio, experience, education
   │  ├─ Skills & proficiency level
   │  ├─ Previous experience
   │  └─ CV file
   │
   └─ Đánh giá ứng viên
       ↓
3. Recruiter thay đổi trạng thái:
   ├─ Nếu "shortlisted":
   │  ├─ Update Application.application_status = "shortlisted"
   │  ├─ Create ApplicationStatusHistory
   │  └─ Gửi email: "Congratulations! You're shortlisted"
   │
   ├─ Nếu "rejected":
   │  ├─ Update Application.application_status = "rejected"
   │  ├─ Nhập rejection_reason
   │  └─ Gửi email: "Thank you for applying..."
   │
   └─ Nếu "offered":
       ├─ Update Application.application_status = "offered"
       ├─ Nhập salary_offered
       └─ Gửi email: "We're pleased to offer you..."
```

### **ApplicationStatusHistory Recording:**
```
applicationstatushistories collection:
├─ application_id: reference_to_application._id
├─ status: "shortlisted"
├─ changed_by: recruiter_id
├─ previous_status: "pending"
├─ reason: "Strong match for role"
├─ timestamp: Date.now()
└─ created_at: Date.now()
```

---

## 6️⃣ PHỎNG VẤN VÀ FEEDBACK

### **API Endpoints:**
```
POST /api/v1/interviews
Body: {
  application_id: ObjectId,
  interview_type: "phone|video|onsite|online_test",
  interview_date: "2024-12-20",
  interview_time: "14:00",
  duration_minutes: 60,
  location: "Conference Room A",
  meeting_link: "https://zoom.us/...",
  interviewers: [
    { user_id: ObjectId, name: "Jane Smith", email: "jane@...", role: "Hiring Manager" }
  ],
  notes: "Technical interview"
}

PUT /api/v1/interviews/:interviewId/status
Body: {
  status: "completed"
}

POST /api/v1/interview-feedbacks
Body: {
  interview_id: ObjectId,
  rating: 4,
  feedback_text: "Good communication skills, solid technical knowledge",
  recommendation: "move_forward|reject|need_another_round"
}
```

### **Luồng Chi Tiết:**

```
1. Sau khi shortlist, recruiter tạo lịch phỏng vấn
   ├─ POST /api/v1/interviews
   ├─ Chọn: type (video/onsite), date, time
   ├─ Thêm interviewers (team members)
   ├─ Tạo Interview document
   │
   ├─ Update Application.application_status = "interviewed"
   │
   └─ Gửi email + notification cho candidate
       ├─ "Your interview is scheduled for..."
       ├─ Meeting link (nếu video)
       ├─ Location (nếu onsite)
       └─ Candidate confirm tham dự
           ↓
2. Ngày phỏng vấn
   ├─ Recruiter update: Interview.status = "in_progress"
   ├─ Phỏng vấn diễn ra
   └─ Update: Interview.status = "completed"
       ↓
3. Sau phỏng vấn, recruiter viết feedback
   ├─ POST /api/v1/interview-feedbacks
   ├─ Rating: 1-5 stars
   ├─ Feedback text: "Technical knowledge good..."
   ├─ Recommendation: "move_forward" or "reject"
   │
   ├─ Tạo InterviewFeedback document
   │
   └─ Có thể có nhiều feedback từ nhiều interviewers
       ↓
4. Recruiter quyết định
   ├─ Nếu "move_forward":
   │  ├─ Tạo offer
   │  └─ Update Application.application_status = "offered"
   │
   └─ Nếu "reject":
       ├─ Update Application.application_status = "rejected"
       └─ Gửi email: "Thank you for interviewing..."
```

### **Database:**
```
interviews collection:
├─ application_id: reference_to_application._id
├─ recruiter_id: reference_to_recruiter._id
├─ candidate_id: reference_to_candidate._id
├─ interview_type: "video"
├─ interview_date: 2024-12-20
├─ interview_time: "14:00"
├─ duration_minutes: 60
├─ meeting_link: "https://zoom.us/..."
├─ interviewers: [{ user_id, name, email, role }, ...]
├─ status: "completed"
└─ notes: "Tech interview"

interviewfeedbacks collection:
├─ interview_id: reference_to_interview._id
├─ rating: 4
├─ feedback_text: "Good communication skills..."
├─ recommendation: "move_forward"
├─ feedback_by: recruiter_id
└─ created_at: Date.now()
```

---

## 7️⃣ ANALYTICS & DASHBOARD

### **API Endpoints:**
```
GET /api/recruiters/dashboard
└─ Xem dashboard với stats toàn bộ

GET /api/recruiters/analytics
Query: ?period=30
└─ Xem analytics chi tiết theo khoảng thời gian
```

### **Dashboard Data:**
```javascript
{
  overview: {
    totalJobs: 5,
    activeJobs: 4,
    totalApplications: 47,
    pendingApplications: 12,
    totalInterviews: 8,
    upcomingInterviews: 2
  },
  recentApplications: [
    { candidate: {...}, job: {...}, status: "pending", applied_at: ... },
    ...
  ],
  subscription: {
    planType: "premium",
    isActive: true,
    features: {
      job_posts_limit: 15,
      featured_jobs: 3,
      candidate_search: true,
      cv_downloads: 200
    },
    daysRemaining: 20
  }
}
```

---

# 🔄 LUỒNG CHUNG

## A. AUTHENTICATION FLOW

```
                    REGISTER
                       ↓
            ┌──────────────────────┐
            │   Email Verification │
            │   (Send OTP via email)│
            └──────────────────────┘
                       ↓
            ┌──────────────────────┐
            │  Verify OTP → Active │
            └──────────────────────┘
                       ↓
                    LOGIN
                       ↓
         ┌──────────────────────────┐
         │ Verify email + password   │
         │ Generate JWT Token        │
         └──────────────────────────┘
                       ↓
         ┌──────────────────────────┐
         │ Return Token to Frontend  │
         │ Frontend: localStorage    │
         └──────────────────────────┘
                       ↓
         ┌──────────────────────────┐
         │ Every API call            │
         │ Header: Authorization:    │
         │         Bearer <token>    │
         └──────────────────────────┘
                       ↓
         ┌──────────────────────────┐
         │ Middleware: protect()     │
         │ Verify & decode JWT       │
         │ Attach user info to req   │
         └──────────────────────────┘
```

---

## B. NOTIFICATION SYSTEM

### **Khi có event, hệ thống gửi notifications:**

```
CANDIDATE:
├─ Ứng tuyển thành công → "Application submitted"
├─ Recruiter shortlist → "You're shortlisted!"
├─ Interview scheduled → "Interview invitation"
├─ Interview feedback → "Interview feedback received"
└─ Offer → "Job offer!"

RECRUITER:
├─ Candidate ứng tuyển → "New application from John Doe"
├─ Candidate confirm interview → "Candidate confirmed interview"
└─ New job posted → "Your job is now live"
```

### **Notification Model:**
```javascript
{
  _id: ObjectId,
  user_id: reference_to_user._id,
  type: "application|interview|offer|job_posted",
  title: "New application from John Doe",
  message: "He applied for Senior Frontend Developer position",
  related_id: reference_to_application._id,
  is_read: false,
  created_at: Date.now(),
  read_at: null
}
```

---

## C. MESSAGE SYSTEM (Chat)

### **API Endpoints:**
```
POST /api/messages
Body: {
  receiver_id: ObjectId,
  content: "Hi, I'm interested in your job posting",
  related_id: job_id (optional)
}

GET /api/messages/conversations
└─ Xem danh sách cuộc trò chuyện

GET /api/messages/:conversationId
└─ Xem messages trong 1 cuộc trò chuyện
```

### **Luồng:**
```
Candidate muốn hỏi recruiter về job
   ↓
POST /api/messages
├─ Tạo Message document
│  ├─ sender_id: candidate._id
│  ├─ receiver_id: recruiter._id
│  ├─ content: "Hi, I'm interested..."
│  └─ related_id: job_id (reference)
│
├─ Create/Update Conversation
│  └─ participants: [candidate_id, recruiter_id]
│
└─ Gửi notification cho recruiter
    └─ "New message from John Doe"
       ↓
Recruiter nhận message
├─ GET /api/messages/:conversationId
└─ Xem toàn bộ chat history
    ↓
Recruiter trả lời
├─ POST /api/messages
└─ Message được thêm vào conversation
```

---

## D. PAYMENT & SUBSCRIPTION LIFECYCLE

```
RECRUITER JOURNEY:

Day 1: Subscribe Premium (500K/month)
├─ Create RecruiterSubscription
├─ subscription_status: "pending"
├─ payment_status: "pending"
└─ Redirect to payment gateway
       ↓
Day 1: Payment processed
├─ Update: payment_status = "paid"
├─ subscription_status = "active"
├─ features_used = { job_posts_used: 0, ... }
└─ Can start using premium features
       ↓
Day 10: Post 10 jobs (limit = 15)
├─ job_posts_used: 10
├─ remaining: 5
└─ Notification: "5 jobs left in your plan"
       ↓
Day 25: Subscription expires in 5 days
├─ Send reminder email
└─ "Renew your subscription to continue posting"
       ↓
Day 30: Subscription expired
├─ subscription_status = "expired"
├─ Can't post new jobs
└─ Must renew or use free plan (3 jobs)
       ↓
Day 31: Renew with Enterprise (1.5M)
├─ Previous: subscription_status = "expired"
├─ Create new RecruiterSubscription
├─ subscription_status = "active"
└─ job_posts_limit = 999 (unlimited)
```

---

# 📊 DATABASE SCHEMA

## **Core Collections:**

### 1. **users**
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar_url: String,
  role: "candidate|recruiter|admin",
  account_status: "pending|active|suspended",
  is_verified: Boolean,
  email_verification: {
    verified: Boolean,
    verified_at: Date
  },
  is_active: Boolean,
  last_login: Date,
  created_at: Date,
  updated_at: Date
}
```

### 2. **candidates**
```javascript
{
  user_id: ObjectId (ref User),
  bio: String,
  date_of_birth: Date,
  gender: String,
  address: String,
  city: String,
  education_level: String,
  experience_years: Number,
  cv_url: String,
  salary_expectation: { min, max },
  job_status: "seeking|employed|not_seeking",
  linkedin_url: String,
  github_url: String,
  portfolio_url: String,
  skills: [{ skill_name, proficiency_level, years_of_experience }],
  education: [{ school_name, degree, graduation_year }],
  experience: [{ company_name, position, description, start_date, end_date }],
  created_at: Date,
  updated_at: Date
}
```

### 3. **recruiters**
```javascript
{
  user_id: ObjectId (ref User),
  company_name: String,
  company_logo_url: String,
  website: String,
  company_size: String,
  industry: String,
  company_description: String,
  tax_id: String,
  company_address: String,
  is_verified: Boolean,
  subscription_plan: String,
  plan_expires_at: Date,
  mission: String,
  vision: String,
  company_culture: String,
  benefits: [String],
  social_links: { linkedin, facebook, twitter },
  created_at: Date,
  updated_at: Date
}
```

### 4. **jobs**
```javascript
{
  recruiter_id: ObjectId (ref Recruiter),
  category_id: ObjectId (ref JobCategory),
  title: String,
  description: String,
  requirements: String,
  benefits: String,
  salary_min: Number,
  salary_max: Number,
  salary_currency: String,
  job_type: "full_time|part_time|contract|internship",
  work_location: "onsite|remote|hybrid",
  location: { address, city, country },
  experience_required: { min, max },
  education_required: String,
  skills_required: [{ skill_name, is_required, weight }],
  application_deadline: Date,
  is_active: Boolean,
  status: "pending|approved|rejected",
  is_featured: Boolean,
  views_count: Number,
  applications_count: Number,
  created_at: Date,
  updated_at: Date
}
```

### 5. **applications**
```javascript
{
  job_id: ObjectId (ref Job),
  candidate_id: ObjectId (ref Candidate),
  cover_letter: String,
  cv_url: String,
  application_status: "pending|reviewing|shortlisted|interviewed|offered|rejected|withdrawn",
  applied_at: Date,
  reviewed_at: Date,
  interviewer_notes: String,
  salary_offered: Number,
  rejection_reason: String,
  created_at: Date,
  updated_at: Date
}
```

### 6. **recruitersubscriptions**
```javascript
{
  recruiter_id: ObjectId (ref Recruiter),
  service_plan_id: ObjectId (ref ServicePlan),
  payment_id: ObjectId (ref Payment),
  start_date: Date,
  end_date: Date,
  subscription_status: "pending|active|expired|cancelled",
  payment_status: "pending|paid|failed",
  features_used: {
    job_posts_used: Number,
    featured_jobs_used: Number,
    cv_downloads_used: Number
  },
  created_at: Date,
  updated_at: Date
}
```

### 7. **serviceplans**
```javascript
{
  name: String ("Trial", "Basic", "Premium", "Enterprise"),
  description: String,
  price: Number,
  duration_days: Number,
  plan_type: "basic|premium|enterprise",
  features: {
    job_posts_limit: Number,
    featured_jobs: Number,
    candidate_search: Boolean,
    advanced_analytics: Boolean,
    priority_support: Boolean,
    cv_downloads: Number
  },
  is_active: Boolean,
  sort_order: Number,
  is_popular: Boolean,
  color: String,
  created_at: Date,
  updated_at: Date
}
```

### 8. **interviews**
```javascript
{
  application_id: ObjectId (ref Application),
  recruiter_id: ObjectId (ref Recruiter),
  candidate_id: ObjectId (ref Candidate),
  interview_type: "phone|video|onsite|online_test",
  interview_date: Date,
  interview_time: String,
  duration_minutes: Number,
  location: String,
  meeting_link: String,
  notes: String,
  interviewers: [{ user_id, name, email, role }],
  status: "scheduled|in_progress|completed|cancelled|no_show",
  reminder_sent: Boolean,
  created_at: Date,
  updated_at: Date
}
```

---

## **Key Relationships:**

```
User (1) ──→ (1) Candidate
User (1) ──→ (1) Recruiter

Recruiter (1) ──→ (many) Jobs
JobCategory (1) ──→ (many) Jobs

Candidate (1) ──→ (many) Applications
Job (1) ──→ (many) Applications

Application (1) ──→ (many) Interviews
Application (1) ──→ (many) ApplicationStatusHistory
Application (1) ──→ (many) InterviewFeedbacks

Recruiter (1) ──→ (many) RecruiterSubscriptions
ServicePlan (1) ──→ (many) RecruiterSubscriptions

Recruiter (1) ──→ (many) Messages
Candidate (1) ──→ (many) Messages

User (1) ──→ (many) Notifications
```

---

## 📌 **SUMMARY - LUỒNG HOẠT ĐỘNG TÓM TẮT**

### **CANDIDATE:**
```
Đăng ký → Login → Hoàn thiện hồ sơ → Tìm việc → Ứng tuyển → 
Nhận phỏng vấn → Phỏng vấn → Nhận offer → Accept/Reject
```

### **RECRUITER:**
```
Đăng ký → Login → Hoàn thiện hồ sơ công ty → Nâng cấp subscription → 
Đăng tin job → Xem candidates → Shortlist → Phỏng vấn → Offer → 
Theo dõi analytics
```

### **ADMIN:**
```
Quản lý users → Approve jobs → Verify recruiters → Quản lý reports
```

---

Hy vọng tài liệu này giúp bạn hiểu rõ hơn về luồng hoạt động của dự án! 🎉
