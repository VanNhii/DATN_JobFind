# 📚 API REFERENCE - COMPLETE GUIDE

## 🎯 Base URL
```
http://localhost:5000/api/v1
```

---

# 🔐 AUTHENTICATION ENDPOINTS

## 1. Register User
```http
POST /auth/register

Content-Type: application/json

{
  "firstName": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "0123456789",
  "role": "candidate|recruiter",
  
  // If role = "recruiter", add:
  "company_name": "TechViet Solutions",
  "industry": "Information Technology"
}

Response (201):
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
  "data": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com"
  }
}
```

---

## 2. Verify OTP
```http
POST /auth/verify-otp

Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "user_id": "507f1f77bcf86cd799439011"
  }
}
```

---

## 3. Login
```http
POST /auth/login

Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "candidate",
    "avatar_url": null
  }
}
```

---

## 4. Get Current User
```http
GET /auth/me

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "candidate",
    "phone": "0123456789"
  }
}
```

---

## 5. Logout
```http
GET /auth/logout

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 6. Forgot Password
```http
POST /auth/forgot-password

{
  "email": "john@example.com"
}

Response (200):
{
  "success": true,
  "message": "Reset password link sent to email"
}
```

---

## 7. Reset Password
```http
POST /auth/reset-password

{
  "resetToken": "token_from_email",
  "new_password": "NewPassword123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successful"
}
```

---

# 👤 CANDIDATE ENDPOINTS

## 8. Get Candidate Profile
```http
GET /candidates/profile

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user_id": "507f1f77bcf86cd799439011",
    "bio": "5 years of web development experience",
    "experience_years": 5,
    "address": "123 Main Street",
    "city": "Ho Chi Minh City",
    "education_level": "bachelor",
    "salary_expectation": {
      "min": 15000000,
      "max": 25000000
    },
    "job_status": "seeking",
    "cv_url": "https://storage/cv_john.pdf",
    "skills": [
      {
        "_id": "507f...",
        "skill_name": "JavaScript",
        "proficiency_level": "advanced",
        "years_of_experience": 5
      }
    ],
    "education": [
      {
        "_id": "507f...",
        "school_name": "University of Technology",
        "degree": "Bachelor of Computer Science",
        "graduation_year": 2020
      }
    ],
    "experience": [
      {
        "_id": "507f...",
        "company_name": "Tech Company",
        "position": "Senior Developer",
        "description": "Led team of 5 developers",
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "currently_working": false
      }
    ]
  }
}
```

---

## 9. Update Candidate Profile
```http
PUT /candidates/profile

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "5+ years of web development experience",
  "experience_years": 5,
  "address": "123 Main Street",
  "city": "Ho Chi Minh City",
  "education_level": "bachelor",
  "salary_expectation": {
    "min": 15000000,
    "max": 25000000
  },
  "job_status": "seeking"
}

Response (200):
{
  "success": true,
  "data": { ...updated profile... }
}
```

---

## 10. Add Skill
```http
POST /candidates/skills

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "skill_name": "ReactJS",
  "proficiency_level": "advanced",
  "years_of_experience": 3
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "507f...",
    "skill_name": "ReactJS",
    "proficiency_level": "advanced",
    "years_of_experience": 3
  }
}
```

---

## 11. Add Education
```http
POST /candidates/education

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "school_name": "University of Technology",
  "degree": "Bachelor of Computer Science",
  "field_of_study": "Computer Science",
  "graduation_year": 2020
}

Response (201):
{
  "success": true,
  "data": { ...education record... }
}
```

---

## 12. Add Experience
```http
POST /candidates/experience

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "company_name": "Tech Company",
  "position": "Senior Developer",
  "description": "Led team of 5 developers, developed React applications",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "currently_working": false
}

Response (201):
{
  "success": true,
  "data": { ...experience record... }
}
```

---

## 13. Apply for Job
```http
POST /candidates/apply

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "job_id": "507f1f77bcf86cd799439013",
  "cover_letter": "I am very interested in this position because...",
  "cv_url": "https://storage/cv_john.pdf"
}

Response (201):
{
  "success": true,
  "message": "Application submitted successfully!",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "job_id": "507f1f77bcf86cd799439013",
    "candidate_id": "507f1f77bcf86cd799439012",
    "application_status": "pending",
    "applied_at": "2024-12-10T10:30:00Z"
  }
}
```

---

## 14. Get My Applications
```http
GET /candidates/applications?page=1&limit=10&status=pending

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "job_id": {
        "title": "Senior Frontend Developer",
        "company_name": "TechViet Solutions",
        "salary_min": 15000000,
        "salary_max": 25000000
      },
      "application_status": "pending",
      "applied_at": "2024-12-10T10:30:00Z",
      "cover_letter": "I am interested...",
      "cv_url": "https://storage/cv.pdf"
    }
  ]
}
```

---

## 15. Withdraw Application
```http
DELETE /candidates/applications/:applicationId

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

---

## 16. Save Job
```http
POST /candidates/saved-jobs/:jobId

Headers:
Authorization: Bearer <token>

Response (201):
{
  "success": true,
  "message": "Job saved successfully"
}
```

---

## 17. Get Saved Jobs
```http
GET /candidates/saved-jobs?page=1&limit=10

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "job_id": { ...job details... },
      "saved_at": "2024-12-10T10:30:00Z"
    }
  ]
}
```

---

## 18. Get Candidate Dashboard
```http
GET /candidates/dashboard

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "profile_completion": 85,
    "total_applications": 5,
    "pending_applications": 2,
    "shortlisted": 1,
    "interviews": 1,
    "recent_applications": [
      { ...application details... }
    ],
    "upcoming_interviews": [
      { ...interview details... }
    ]
  }
}
```

---

# 💼 RECRUITER ENDPOINTS

## 19. Get Recruiter Profile
```http
GET /recruiters/profile

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "user_id": "507f1f77bcf86cd799439011",
    "company_name": "TechViet Solutions",
    "company_logo_url": "https://storage/logo.png",
    "website": "https://techviet-solutions.com",
    "company_size": "100-500",
    "industry": "Information Technology",
    "company_description": "Leading software development company...",
    "is_verified": false,
    "subscription_plan": "premium",
    "plan_expires_at": "2025-01-10T10:00:00Z"
  }
}
```

---

## 20. Update Recruiter Profile
```http
PUT /recruiters/profile

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "company_logo_url": "https://storage/logo.png",
  "website": "https://techviet-solutions.com",
  "company_size": "100-500",
  "company_description": "Leading software development company..."
}

Response (200):
{
  "success": true,
  "data": { ...updated profile... }
}
```

---

## 21. Get Recruiter Subscription Status
```http
GET /recruiters/subscription/current

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "recruiter_id": "507f1f77bcf86cd799439016",
    "service_plan_id": {
      "name": "Premium",
      "price": 500000,
      "features": {
        "job_posts_limit": 15,
        "featured_jobs": 3,
        "candidate_search": true,
        "advanced_analytics": true,
        "priority_support": true,
        "cv_downloads": 200
      }
    },
    "subscription_status": "active",
    "payment_status": "paid",
    "start_date": "2024-12-10T10:00:00Z",
    "end_date": "2025-01-10T10:00:00Z",
    "usage": {
      "job_postings_used": 5,
      "job_postings_limit": 15,
      "cv_download_used": 30,
      "cv_download_limit": 200,
      "candidate_search_used": 0,
      "candidate_search_limit": -1
    }
  }
}
```

---

## 22. Upgrade Subscription
```http
PUT /recruiters/subscription/upgrade

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "507f1f77bcf86cd799439018",
  "payment_method": "credit_card"
}

Response (200):
{
  "success": true,
  "message": "Subscription upgraded successfully. Please complete payment to activate.",
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "service_plan_id": { ...plan details... },
    "subscription_status": "pending",
    "payment_status": "pending"
  }
}
```

---

## 23. Cancel Subscription
```http
PUT /recruiters/subscription/cancel

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "No longer need the service"
}

Response (200):
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": { ...subscription details... }
}
```

---

# 📋 JOB ENDPOINTS

## 24. Get All Jobs (Public)
```http
GET /jobs?page=1&limit=10&search=developer&category=frontend&job_type=full_time&salary_min=15000000&salary_max=25000000&location=Ho%20Chi%20Minh

Response (200):
{
  "success": true,
  "count": 45,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "recruiter_id": {
        "company_name": "TechViet Solutions",
        "company_logo_url": "https://..."
      },
      "title": "Senior Frontend Developer (ReactJS)",
      "description": "We are looking for...",
      "salary_min": 15000000,
      "salary_max": 25000000,
      "job_type": "full_time",
      "work_location": "hybrid",
      "location": {
        "city": "Ho Chi Minh",
        "country": "Vietnam"
      },
      "is_featured": true,
      "views_count": 145,
      "applications_count": 23,
      "created_at": "2024-12-10T10:00:00Z"
    }
  ]
}
```

---

## 25. Get Job Details
```http
GET /jobs/:jobId

Response (200):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "recruiter_id": {
      "company_name": "TechViet Solutions",
      "company_logo_url": "https://...",
      "website": "https://techviet.com"
    },
    "title": "Senior Frontend Developer (ReactJS)",
    "description": "We are looking for an experienced Frontend Developer...",
    "requirements": "3+ years of experience with ReactJS...",
    "benefits": "Competitive salary, Health insurance, 13th month bonus...",
    "salary_min": 15000000,
    "salary_max": 25000000,
    "job_type": "full_time",
    "work_location": "hybrid",
    "location": {
      "address": "123 Nguyễn Huệ, Quận 1",
      "city": "Ho Chi Minh",
      "country": "Vietnam"
    },
    "experience_required": { "min": 3, "max": 7 },
    "education_required": "bachelor",
    "skills_required": [
      { "skill_name": "ReactJS", "is_required": true, "weight": 10 },
      { "skill_name": "JavaScript", "is_required": true, "weight": 9 }
    ],
    "application_deadline": "2024-12-31",
    "views_count": 145,
    "applications_count": 23,
    "is_featured": true
  }
}
```

---

## 26. Create Job (Recruiter Only)
```http
POST /jobs

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Frontend Developer (ReactJS)",
  "description": "We are looking for an experienced Frontend Developer to join our team...",
  "requirements": "3+ years of experience with ReactJS, proficiency in JavaScript ES6+...",
  "benefits": "Competitive salary 15-25M VND, Health insurance, 13th month bonus...",
  "salary_min": 15000000,
  "salary_max": 25000000,
  "salary_currency": "VND",
  "job_type": "full_time",
  "work_location": "hybrid",
  "location": {
    "address": "123 Nguyễn Huệ, Quận 1",
    "city": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "experience_required": { "min": 3, "max": 7 },
  "education_required": "bachelor",
  "skills_required": [
    { "skill_name": "ReactJS", "is_required": true, "weight": 10 },
    { "skill_name": "JavaScript", "is_required": true, "weight": 9 }
  ],
  "application_deadline": "2024-12-31",
  "category_id": "507f1f77bcf86cd799439020",
  "is_featured": true
}

Response (201):
{
  "success": true,
  "message": "Job posted successfully! Pending admin approval.",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "pending",
    "is_active": true
  }
}
```

---

## 27. Update Job
```http
PUT /jobs/:jobId

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Frontend Developer (ReactJS) - Updated",
  "salary_max": 30000000,
  ...
}

Response (200):
{
  "success": true,
  "data": { ...updated job... }
}
```

---

## 28. Get Recruiter's Jobs
```http
GET /recruiters/jobs?page=1&limit=10&status=approved

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    { ...job details... }
  ]
}
```

---

# 📝 APPLICATION ENDPOINTS

## 29. Get Recruiter's Applications
```http
GET /recruiters/applications?page=1&limit=10&status=pending

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "job_id": {
        "title": "Senior Frontend Developer",
        "company_name": "TechViet"
      },
      "candidate_id": {
        "user_id": {
          "full_name": "John Doe",
          "email": "john@example.com",
          "avatar_url": "https://..."
        },
        "bio": "5 years experience",
        "skills": [...]
      },
      "application_status": "pending",
      "applied_at": "2024-12-10T10:30:00Z",
      "cv_url": "https://storage/cv.pdf",
      "cover_letter": "I am interested..."
    }
  ]
}
```

---

## 30. Update Application Status
```http
PUT /applications/:applicationId/status

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_status": "shortlisted|interviewed|offered|rejected|withdrawn",
  "interviewer_notes": "Great CV, strong technical background",
  "salary_offered": 20000000,
  "rejection_reason": "Already filled the position"
}

Response (200):
{
  "success": true,
  "message": "Application status updated",
  "data": {
    "application_status": "shortlisted",
    "reviewed_at": "2024-12-10T11:00:00Z"
  }
}
```

---

# 🎤 INTERVIEW ENDPOINTS

## 31. Schedule Interview
```http
POST /interviews

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": "507f1f77bcf86cd799439014",
  "interview_type": "video",
  "interview_date": "2024-12-20",
  "interview_time": "14:00",
  "duration_minutes": 60,
  "location": "Conference Room A",
  "meeting_link": "https://zoom.us/j/...",
  "interviewers": [
    {
      "user_id": "507f1f77bcf86cd799439021",
      "name": "Jane Smith",
      "email": "jane@techviet.com",
      "role": "Hiring Manager"
    }
  ],
  "notes": "Technical interview, focus on React"
}

Response (201):
{
  "success": true,
  "message": "Interview scheduled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439022",
    "status": "scheduled",
    "interview_date": "2024-12-20",
    "interview_time": "14:00"
  }
}
```

---

## 32. Submit Interview Feedback
```http
POST /interview-feedbacks

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "interview_id": "507f1f77bcf86cd799439022",
  "rating": 4,
  "feedback_text": "Good communication skills, solid technical knowledge, needs improvement in system design",
  "recommendation": "move_forward|need_another_round|reject"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439023",
    "rating": 4,
    "feedback_text": "...",
    "recommendation": "move_forward"
  }
}
```

---

# 📊 SERVICE PLAN ENDPOINTS

## 33. Get Available Plans
```http
GET /service-plans/available

Response (200):
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439024",
      "name": "Trial",
      "price": 0,
      "duration_days": 14,
      "features": {
        "job_posts_limit": 1,
        "featured_jobs": 0,
        "candidate_search": false,
        "cv_downloads": 10
      }
    },
    {
      "_id": "507f1f77bcf86cd799439025",
      "name": "Basic",
      "price": 0,
      "duration_days": 30,
      "features": {
        "job_posts_limit": 3,
        "featured_jobs": 0,
        "candidate_search": true,
        "cv_downloads": 50
      }
    },
    {
      "_id": "507f1f77bcf86cd799439026",
      "name": "Premium",
      "price": 500000,
      "duration_days": 30,
      "features": {
        "job_posts_limit": 15,
        "featured_jobs": 3,
        "candidate_search": true,
        "advanced_analytics": true,
        "priority_support": true,
        "cv_downloads": 200
      }
    },
    {
      "_id": "507f1f77bcf86cd799439027",
      "name": "Enterprise",
      "price": 1500000,
      "duration_days": 30,
      "features": {
        "job_posts_limit": 999,
        "featured_jobs": 999,
        "candidate_search": true,
        "advanced_analytics": true,
        "priority_support": true,
        "cv_downloads": 999
      }
    }
  ]
}
```

---

# 💬 MESSAGE ENDPOINTS

## 34. Send Message
```http
POST /messages

Headers:
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiver_id": "507f1f77bcf86cd799439011",
  "content": "Hi, I'm interested in your job posting for Senior Developer",
  "related_id": "507f1f77bcf86cd799439013"  // Optional: job_id
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439028",
    "sender_id": "507f1f77bcf86cd799439012",
    "receiver_id": "507f1f77bcf86cd799439011",
    "content": "...",
    "created_at": "2024-12-10T10:30:00Z"
  }
}
```

---

## 35. Get Conversations
```http
GET /messages/conversations?page=1&limit=10

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439029",
      "participants": [
        {
          "user_id": "507f1f77bcf86cd799439011",
          "full_name": "Jane Smith",
          "avatar_url": "https://..."
        }
      ],
      "last_message": "Thanks for your interest!",
      "last_message_at": "2024-12-10T10:30:00Z",
      "unread_count": 2
    }
  ]
}
```

---

## 36. Get Messages in Conversation
```http
GET /messages/:conversationId?page=1&limit=20

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439028",
      "sender_id": {
        "full_name": "John Doe",
        "avatar_url": "https://..."
      },
      "content": "Hi, I'm interested...",
      "created_at": "2024-12-10T10:30:00Z",
      "is_read": true
    }
  ]
}
```

---

# 🔔 NOTIFICATION ENDPOINTS

## 37. Get Notifications
```http
GET /notifications?page=1&limit=10&is_read=false

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "type": "application",
      "title": "New application from John Doe",
      "message": "He applied for Senior Frontend Developer position",
      "related_id": "507f1f77bcf86cd799439014",
      "is_read": false,
      "created_at": "2024-12-10T10:30:00Z"
    }
  ]
}
```

---

## 38. Mark Notification as Read
```http
PUT /notifications/:notificationId/read

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "is_read": true,
    "read_at": "2024-12-10T11:00:00Z"
  }
}
```

---

# 📊 ANALYTICS ENDPOINTS

## 39. Get Recruiter Dashboard
```http
GET /recruiters/dashboard

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 5,
      "activeJobs": 4,
      "totalApplications": 47,
      "pendingApplications": 12,
      "totalInterviews": 8,
      "upcomingInterviews": 2
    },
    "recentApplications": [
      { ...application details... }
    ],
    "subscription": {
      "planType": "premium",
      "isActive": true,
      "features": { ...features... },
      "daysRemaining": 20
    }
  }
}
```

---

## 40. Get Recruiter Analytics
```http
GET /recruiters/analytics?period=30

Headers:
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "period": "30 days",
    "applicationTrend": [
      { _id: "2024-12-10", count: 5 },
      { _id: "2024-12-11", count: 7 },
      ...
    ],
    "applicationsByStatus": [
      { _id: "pending", count: 12 },
      { _id: "shortlisted", count: 5 },
      { _id: "interviewed", count: 3 },
      { _id: "offered", count: 1 }
    ],
    "topJobs": [
      {
        title: "Senior Frontend Developer",
        applicationCount: 23,
        views_count: 145
      }
    ]
  }
}
```

---

## 📌 ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Please login first"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔑 AUTHENTICATION HEADERS

All protected endpoints require:

```
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

---

Tài liệu này bao gồm tất cả các API endpoints chính của dự án! 🎉
