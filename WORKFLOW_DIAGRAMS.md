# 📊 ARCHITECTURE & WORKFLOW DIAGRAMS

## 🎯 CANDIDATE WORKFLOW - CHI TIẾT STEP BY STEP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CANDIDATE JOURNEY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: ACCOUNT SETUP
═════════════════════════════════════════════════════════════════════════════

1. REGISTER
   └─ POST /api/auth/register
      ├─ Input: firstName, email, password, phone, role="candidate"
      ├─ Create: User + Candidate profile
      ├─ Send: OTP via email
      └─ Status: account_status = "pending"

2. EMAIL VERIFICATION
   └─ POST /api/auth/verify-otp
      ├─ Check: OTP valid & not expired
      ├─ Update: account_status = "active"
      ├─ Update: email_verification.verified = true
      └─ Result: Account active ✓

3. LOGIN
   └─ POST /api/auth/login
      ├─ Verify: email + password
      ├─ Generate: JWT token
      ├─ Store: token in localStorage (frontend)
      └─ Return: { token, user }


PHASE 2: PROFILE COMPLETION
═════════════════════════════════════════════════════════════════════════════

4. UPDATE BASIC INFO
   └─ PUT /api/candidates/profile
      ├─ Update: bio, experience_years, city, etc.
      └─ Save: to Candidate collection

5. ADD EDUCATION (1 or more)
   └─ POST /api/candidates/education
      ├─ Add: school_name, degree, graduation_year
      ├─ Push: to education array
      └─ Can add multiple education records

6. ADD EXPERIENCE (1 or more)
   └─ POST /api/candidates/experience
      ├─ Add: company, position, description, dates
      ├─ Push: to experience array
      └─ Can add multiple jobs

7. ADD SKILLS (1 or more)
   └─ POST /api/candidates/skills
      ├─ Add: skill_name, proficiency_level
      ├─ Push: to skills array
      └─ Can add multiple skills

8. UPLOAD CV
   └─ POST /api/upload
      ├─ Upload: PDF file to server
      ├─ Save: URL to candidate.cv_url
      └─ Max size: As per server config


PHASE 3: JOB SEARCH
═════════════════════════════════════════════════════════════════════════════

9. BROWSE ALL JOBS
   └─ GET /api/jobs
      ├─ Filter by: category, location, salary, job_type, work_location
      ├─ Sort by: newest, most_viewed, most_applied
      ├─ Pagination: page=1, limit=10
      └─ Return: [{ id, title, company, salary, ... }]

10. VIEW JOB DETAILS
    └─ GET /api/jobs/:jobId
       ├─ Fetch: full job description, requirements, benefits
       ├─ Fetch: recruiter company info
       ├─ Increment: views_count
       ├─ Check: Can I apply? (requires CV)
       └─ Show: Application deadline, salary range


PHASE 4: APPLICATION & INTERVIEW
═════════════════════════════════════════════════════════════════════════════

11. APPLY FOR JOB
    └─ POST /api/candidates/apply
       ├─ Check: duplicate application? (prevented by unique index)
       ├─ Input: job_id, cover_letter, cv_url
       ├─ Create: Application document
       │  ├─ application_status: "pending"
       │  ├─ applied_at: Date.now()
       │  └─ cv_url: from candidate profile
       │
       ├─ Update: Job.applications_count +1
       ├─ Create: ApplicationStatusHistory (pending)
       ├─ Send: Notification to recruiter
       └─ Return: Success message

12. VIEW MY APPLICATIONS
    └─ GET /api/candidates/applications
       ├─ Filter by: status (pending, shortlisted, interviewed, etc.)
       ├─ Sort: by applied_at (newest first)
       └─ Return: [
            {
              job: { title, company, location, salary },
              status: "pending|shortlisted|interviewed|offered|rejected",
              applied_at: Date,
              ...
            }
          ]

13. RECEIVE SHORTLIST NOTIFICATION
    └─ Recruiter updates: application_status = "shortlisted"
       ├─ Database: Update Application.application_status
       ├─ Email: "Congratulations! You've been shortlisted"
       ├─ Notification: "TechViet Solutions shortlisted you!"
       └─ Candidate sees: Status changed to "shortlisted"

14. RECEIVE INTERVIEW INVITATION
    └─ Recruiter creates: Interview + sends invite
       ├─ GET: notification about interview
       ├─ Details: Date, Time, Type (video/phone/onsite)
       ├─ Info: Meeting link (if video)
       └─ Candidate: Can confirm attendance

15. ATTEND INTERVIEW
    └─ On interview date/time
       ├─ Join: via meeting link (video/phone)
       ├─ Duration: As scheduled
       ├─ Interview type: phone, video, onsite, or online_test
       └─ Status: Interview.status = "completed"

16. RECEIVE FEEDBACK
    └─ Recruiter submits: InterviewFeedback
       ├─ Rating: 1-5 stars
       ├─ Feedback: Text description
       ├─ Recommendation: "move_forward" or "reject"
       ├─ Candidate sees: Feedback notification
       └─ Next step: Wait for final decision

17. RECEIVE OFFER / REJECTION
    └─ Recruiter updates: Application.application_status
       ├─ If "offered":
       │  ├─ Email: "We're pleased to offer you..."
       │  ├─ Salary: salary_offered
       │  └─ Candidate can: Accept or Negotiate
       │
       └─ If "rejected":
          ├─ Email: "Thank you for your interest..."
          └─ Reason: rejection_reason (if provided)


PHASE 5: SAVED JOBS
═════════════════════════════════════════════════════════════════════════════

18. SAVE JOB FOR LATER
    └─ POST /api/candidates/saved-jobs/:jobId
       ├─ Create: FavoriteJob document
       ├─ Store: { candidate_id, job_id, saved_at }
       └─ Can review later

19. VIEW SAVED JOBS
    └─ GET /api/candidates/saved-jobs
       └─ Return: List of saved jobs

20. REMOVE SAVED JOB
    └─ DELETE /api/candidates/saved-jobs/:jobId
       └─ Remove from saved list


PHASE 6: COMMUNICATION
═════════════════════════════════════════════════════════════════════════════

21. SEND MESSAGE TO RECRUITER
    └─ POST /api/messages
       ├─ Send: Text message about a job
       ├─ Create: Message + Conversation
       └─ Recruiter gets: Notification

22. VIEW MESSAGES
    └─ GET /api/messages/conversations
       ├─ List: All conversations
       └─ Return: [{ recruiter_name, last_message, timestamp }]

23. OPEN CONVERSATION
    └─ GET /api/messages/:conversationId
       ├─ Load: All messages in conversation
       └─ Show: Chat history


════════════════════════════════════════════════════════════════════════════════
```

---

## 💼 RECRUITER WORKFLOW - CHI TIẾT STEP BY STEP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RECRUITER JOURNEY                                    │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: ACCOUNT SETUP
═════════════════════════════════════════════════════════════════════════════

1. REGISTER
   └─ POST /api/auth/register
      ├─ Input: firstName, email, password, phone, role="recruiter"
      ├─ Input: company_name, industry
      ├─ Create: User + Recruiter profile
      ├─ Send: OTP via email
      ├─ Recruiter fields:
      │  ├─ is_verified: false (not verified yet)
      │  └─ subscription_plan: null (no subscription)
      └─ Status: account_status = "pending"

2. EMAIL VERIFICATION
   └─ POST /api/auth/verify-otp
      ├─ Check: OTP valid
      ├─ Update: account_status = "active"
      └─ Next: Go to subscription

3. LOGIN
   └─ POST /api/auth/login
      ├─ Verify: credentials
      ├─ Generate: JWT token
      └─ Return: token


PHASE 2: COMPANY SETUP
═════════════════════════════════════════════════════════════════════════════

4. COMPLETE COMPANY PROFILE
   └─ PUT /api/recruiters/profile
      ├─ Update: company_logo_url
      ├─ Update: website, company_size
      ├─ Update: company_description
      ├─ Update: tax_id
      └─ Save: to Recruiter collection

5. ADD COMPANY INFO
   └─ PUT /api/recruiters/company-culture
      ├─ Add: mission, vision
      ├─ Add: company_culture description
      ├─ Add: benefits (array)
      └─ Example benefits: ["Health insurance", "13th month bonus"]

6. SOCIAL LINKS (Optional)
   └─ PUT /api/recruiters/social-links
      ├─ Add: LinkedIn URL
      ├─ Add: Facebook URL
      ├─ Add: Twitter URL
      └─ For company branding


PHASE 3: SUBSCRIPTION & PAYMENT
═════════════════════════════════════════════════════════════════════════════

7. VIEW AVAILABLE PLANS
   └─ GET /api/service-plans/available
      ├─ Return: [
      │  { name: "Trial", price: 0, features: {...} },
      │  { name: "Basic", price: 0, features: {...} },
      │  { name: "Premium", price: 500k, features: {...} },
      │  { name: "Enterprise", price: 1.5M, features: {...} }
      │]
      └─ Show: Features for each plan

8. CHOOSE & UPGRADE PLAN
   └─ PUT /api/recruiters/subscription/upgrade
      ├─ Input: planId
      ├─ Get: Plan details (features, duration)
      ├─ Cancel: Old subscription (if exists)
      ├─ Create: New RecruiterSubscription
      │  ├─ subscription_status: "pending"
      │  ├─ payment_status: "pending"
      │  └─ features_used: { job_posts_used: 0, ... }
      │
      └─ Return: "Please complete payment"

9. PROCESS PAYMENT
   └─ Payment gateway (Stripe, VNPay, etc.)
      ├─ User enters: card details / bank info
      ├─ Payment processed
      ├─ Update: RecruiterSubscription.payment_status = "paid"
      ├─ Update: subscription_status = "active"
      └─ Recruiter can now: Post jobs


PHASE 4: JOB POSTING
═════════════════════════════════════════════════════════════════════════════

10. ACCESS JOB POSTING FORM
    └─ GET /api/recruiters/jobs/form
       ├─ Frontend loads: Job creation form
       ├─ Show: Category dropdown, skill selector
       └─ Ready for input

11. CREATE JOB POST
    └─ POST /api/jobs
       ├─ Middleware: checkJobPostingLimit
       │  ├─ Get: Active subscription
       │  ├─ Get: job_posts_limit from plan
       │  │  └─ Basic: 3, Premium: 15, Enterprise: unlimited
       │  │
       │  ├─ Count: Current active jobs
       │  ├─ Check: current < limit?
       │  └─ If >= limit: return error 403
       │
       ├─ Create: Job document
       │  ├─ recruiter_id: recruiter._id
       │  ├─ title, description, requirements
       │  ├─ salary_min, salary_max
       │  ├─ job_type, work_location
       │  ├─ location: { address, city, country }
       │  ├─ skills_required: [...]
       │  ├─ status: "pending"  ← Needs admin approval
       │  ├─ is_active: true
       │  ├─ is_featured: (if plan allows)
       │  └─ application_deadline: Date
       │
       ├─ Update: RecruiterSubscription.features_used.job_posts_used +1
       │
       └─ Return: "Job posted! Awaiting admin approval"

12. ADMIN REVIEWS JOB
    └─ Admin dashboard
       ├─ View: Pending jobs
       ├─ Check: Job details, company info
       ├─ Approve or Reject
       └─ Update: Job.status = "approved" or "rejected"

13. JOB GOES LIVE
    └─ Once approved
       ├─ Job.status = "approved"
       ├─ Candidates can see it
       ├─ Send: Notification to recruiter
       └─ Recruiter can: Share job link


PHASE 5: MANAGE APPLICATIONS
═════════════════════════════════════════════════════════════════════════════

14. VIEW APPLICATIONS
    └─ GET /api/recruiters/applications
       ├─ Return: All applications for recruiter's jobs
       ├─ Show: Candidate name, job applied, status
       │  ├─ pending: just applied
       │  ├─ shortlisted: passed initial review
       │  ├─ interviewed: had interview
       │  ├─ offered: received offer
       │  └─ rejected: rejected
       │
       └─ Filter: by status, date, job

15. VIEW CANDIDATE DETAILS
    └─ GET /api/applications/:applicationId
       ├─ Show: Full candidate profile
       │  ├─ CV
       │  ├─ Education & experience
       │  ├─ Skills
       │  └─ Cover letter
       │
       └─ Actions: Shortlist, Reject, Schedule Interview

16. SHORTLIST CANDIDATE
    └─ PUT /api/applications/:applicationId/status
       ├─ Input: application_status = "shortlisted"
       ├─ Update: Application document
       ├─ Create: ApplicationStatusHistory entry
       ├─ Send: Email to candidate "You're shortlisted!"
       └─ Notification: To candidate

17. REJECT CANDIDATE
    └─ PUT /api/applications/:applicationId/status
       ├─ Input: application_status = "rejected"
       ├─ Input: rejection_reason (optional)
       ├─ Update: Application document
       ├─ Send: Thank you email to candidate
       └─ Notification: To candidate


PHASE 6: INTERVIEWS
═════════════════════════════════════════════════════════════════════════════

18. SCHEDULE INTERVIEW
    └─ POST /api/interviews
       ├─ Input: application_id
       ├─ Input: interview_type (phone, video, onsite, online_test)
       ├─ Input: interview_date, interview_time
       ├─ Input: location or meeting_link
       ├─ Input: interviewers (team members)
       │
       ├─ Create: Interview document
       │  ├─ status: "scheduled"
       │  └─ reminder_sent: false
       │
       ├─ Update: Application.application_status = "interviewed"
       ├─ Send: Interview invitation to candidate
       │  ├─ Date, time
       │  ├─ Meeting link (if video)
       │  └─ Contact info
       │
       └─ Candidate: Receives notification

19. SEND INTERVIEW REMINDER
    └─ 24 hours before interview
       ├─ Automatic: Email reminder
       ├─ Link: Meeting link included
       ├─ Update: Interview.reminder_sent = true
       └─ Candidate: Gets reminder

20. CONDUCT INTERVIEW
    └─ On interview date
       ├─ Recruiter marks: Interview.status = "in_progress"
       ├─ Interview happens
       └─ Update: Interview.status = "completed"

21. SUBMIT INTERVIEW FEEDBACK
    └─ POST /api/interview-feedbacks
       ├─ Input: interview_id
       ├─ Input: rating (1-5 stars)
       ├─ Input: feedback_text
       ├─ Input: recommendation
       │  ├─ "move_forward": Good candidate
       │  ├─ "reject": Not suitable
       │  └─ "need_another_round": Needs more evaluation
       │
       ├─ Create: InterviewFeedback document
       └─ Can have multiple feedbacks (from different interviewers)


PHASE 7: MAKING OFFERS
═════════════════════════════════════════════════════════════════════════════

22. MAKE OFFER
    └─ PUT /api/applications/:applicationId/status
       ├─ Input: application_status = "offered"
       ├─ Input: salary_offered
       ├─ Update: Application document
       ├─ Send: Offer letter email
       │  ├─ Position, salary, benefits
       │  ├─ Acceptance deadline
       │  └─ Contact: For negotiation
       │
       └─ Candidate: Receives offer notification

23. TRACK OFFER STATUS
    └─ GET /api/applications/:applicationId
       ├─ Show: Offer details
       ├─ Show: Candidate response (pending, accepted, rejected)
       └─ Track: Until acceptance/rejection


PHASE 8: ANALYTICS & REPORTS
═════════════════════════════════════════════════════════════════════════════

24. VIEW DASHBOARD
    └─ GET /api/recruiters/dashboard
       ├─ Overview: Total jobs, active jobs, applications, interviews
       ├─ Recent: Latest applications
       ├─ Subscription: Current plan info, days remaining
       └─ Quick stats: Pending reviews, upcoming interviews

25. VIEW DETAILED ANALYTICS
    └─ GET /api/recruiters/analytics?period=30
       ├─ Application trend: Graph showing applications over time
       ├─ Applications by status: Pie chart
       │  ├─ Pending: 10
       │  ├─ Shortlisted: 5
       │  ├─ Interviewed: 3
       │  ├─ Offered: 1
       │  └─ Rejected: 8
       │
       ├─ Top performing jobs: Which jobs get most applications
       └─ Conversion rate: Applied → Shortlisted → Interviewed → Offered


PHASE 9: RECRUITER SUBSCRIPTION RENEWAL
═════════════════════════════════════════════════════════════════════════════

26. SUBSCRIPTION EXPIRATION
    └─ Day 25 (before expiry): 5 days remaining
       ├─ Email reminder: "Renew your subscription"
       └─ Dashboard alert: "Plan expires in 5 days"

27. RENEWAL
    └─ Day 30: Current subscription expires
       ├─ OLD subscription status: "expired"
       ├─ NEW subscription status: "active"
       │  ├─ If renewed same plan: features reset
       │  └─ If upgraded: features reset to new plan limits
       │
       └─ features_used reset: { job_posts_used: 0, ... }

28. EXPIRED SUBSCRIPTION
    └─ If recruiter doesn't renew
       ├─ Subscription status: "expired"
       ├─ Can't post: New jobs
       ├─ Can still: View applications, conduct interviews
       ├─ Downgrade to: Free plan (3 jobs)
       └─ Call to action: "Renew to continue posting"


════════════════════════════════════════════════════════════════════════════════
```

---

## 🔄 DATA FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│ │  Candidate   │  │  Recruiter   │  │    Admin Dashboard   │   │
│ │   Pages      │  │    Pages     │  │                      │   │
│ └──────────────┘  └──────────────┘  └──────────────────────┘   │
└──────────────────┬───────────────────────────────────────────────┘
                   │
         HTTP Request with JWT Token
         Authorization: Bearer <token>
                   │
┌──────────────────▼───────────────────────────────────────────────┐
│             API ROUTES & MIDDLEWARE LAYER                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /api/auth/               → authController.js                   │
│  /api/candidates/         → candidateController.js              │
│  /api/recruiters/         → recruiterController.js              │
│  /api/jobs/               → jobController.js                    │
│  /api/applications/       → applicationController.js            │
│  /api/interviews/         → interviewController.js              │
│  /api/service-plans/      → servicePlanController.js            │
│  /api/messages/           → messageController.js                │
│  /api/notifications/      → notificationController.js           │
│                                                                  │
│  MIDDLEWARE:                                                    │
│  ├─ protect          → Check JWT token                         │
│  ├─ authorize        → Check user role                         │
│  ├─ checkJobPostingLimit  → Check subscription limit           │
│  ├─ checkCandidateSearchPermission → Premium only             │
│  ├─ checkCVDownloadPermission  → Check CV download limit       │
│  └─ upload           → Handle file uploads                     │
│                                                                  │
└──────────────────┬───────────────────────────────────────────────┘
                   │
         MongoDB Queries / Updates
                   │
┌──────────────────▼───────────────────────────────────────────────┐
│              MODELS & DATABASE LAYER                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collections:                                                   │
│  ├─ users              (User authentication)                    │
│  ├─ candidates         (Candidate profiles)                     │
│  ├─ recruiters         (Recruiter & company info)              │
│  ├─ jobs               (Job postings)                           │
│  ├─ applications       (Job applications)                       │
│  ├─ interviews         (Interview schedules)                    │
│  ├─ interviewfeedbacks (Interview feedback)                     │
│  ├─ recruitersubscriptions  (Subscription info)                │
│  ├─ serviceplans       (Plan types & features)                 │
│  ├─ messages           (Chat messages)                          │
│  ├─ notifications      (User notifications)                     │
│  ├─ payments           (Payment records)                        │
│  └─ ... more collections                                       │
│                                                                  │
└──────────────────┬───────────────────────────────────────────────┘
                   │
           MongoDB Database
                   │
┌──────────────────▼───────────────────────────────────────────────┐
│                    MONGODB (Data Storage)                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📱 REQUEST/RESPONSE FLOW EXAMPLE

### **Example: Candidate Applies for Job**

```
FRONTEND (React)
│
│ POST /api/candidates/apply
│ {
│   job_id: "507f1f77bcf86cd799439011",
│   cover_letter: "I'm very interested...",
│   cv_url: "https://storage/cv.pdf"
│ }
├─ Header: Authorization: Bearer eyJhbGc...
│
▼
BACKEND (Node/Express)
│
│ Route: POST /api/candidates/apply
├─ Middleware: protect
│  └─ Verify JWT token, extract user_id
│
├─ Middleware: authorize('candidate')
│  └─ Check role = "candidate"
│
├─ Controller: candidateController.applyForJob()
│  │
│  ├─ Verify: CV exists
│  ├─ Verify: Job exists & is_active
│  ├─ Check: No duplicate application
│  │   └─ Query: applications collection
│  │       └─ filter: {job_id, candidate_id}
│  │       └─ If exists → return error 400
│  │
│  ├─ Create: Application document
│  │  └─ Insert: applications collection
│  │
│  ├─ Update: Job.applications_count +1
│  │  └─ Increment: jobs collection
│  │
│  ├─ Create: ApplicationStatusHistory
│  │  └─ Insert: applicationstatushistories collection
│  │
│  ├─ Create: Notification to recruiter
│  │  └─ Insert: notifications collection
│  │
│  └─ Response: res.status(201).json({ success: true, ... })
│
▼
RESPONSE TO FRONTEND
{
  success: true,
  message: "Application submitted successfully!",
  data: {
    application_id: "507f1f77bcf86cd799439012",
    job_id: "507f1f77bcf86cd799439011",
    status: "pending",
    applied_at: "2024-12-10T10:30:00Z"
  }
}
│
▼
FRONTEND (React)
├─ Store: response data in state
├─ Show: Success message to candidate
├─ Navigate: To applications list
└─ UI Update: Show application in "My Applications"


BACKGROUND PROCESSES:
═════════════════════════════════════════════════════════════════

1. Email Service (Async)
   └─ Send email to recruiter: "New application from John Doe"

2. Notification Service (Async)
   └─ Create in-app notification for recruiter

3. Analytics Service (Async)
   └─ Update: Job statistics, candidate matching scores
```

---

## 🔐 AUTHENTICATION & TOKEN FLOW

```
┌──────────────────────────────────────────────────────────────┐
│              1. USER REGISTERS & LOGS IN                      │
└──────────────────────────────────────────────────────────────┘

Frontend Form:
  email: "john@example.com"
  password: "secure123"
  │
  ▼
POST /api/auth/register
  │
  ▼
Backend:
  ├─ Hash password: bcrypt.hash(password, 10)
  ├─ Create User document
  ├─ Generate OTP
  └─ Send OTP email
  │
  ▼
Frontend: User opens email link or enters OTP
  │
  ▼
POST /api/auth/verify-otp
  │
  ▼
Backend:
  ├─ Verify OTP
  ├─ Update account_status = "active"
  └─ Ready to login
  │
  ▼
POST /api/auth/login
  │
  ▼
Backend:
  ├─ Find user by email
  ├─ Compare password: bcrypt.compare(inputPassword, hashedPassword)
  ├─ Generate JWT token:
  │  {
  │    iss: "job-portal",
  │    sub: user_id,
  │    email: "john@example.com",
  │    role: "candidate",
  │    iat: 1702210000,
  │    exp: 1702296400  (expires in 24 hours)
  │  }
  │
  └─ Return: { success: true, token, user }
  │
  ▼
Frontend: Store token
  ├─ localStorage.setItem('token', token)
  └─ Ready for authenticated requests


┌──────────────────────────────────────────────────────────────┐
│          2. AUTHENTICATED API REQUESTS                        │
└──────────────────────────────────────────────────────────────┘

Every request from frontend:
  │
  ▼
GET /api/candidates/profile
├─ Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│
▼
Backend Middleware: protect()
  │
  ├─ Extract token from header
  ├─ Verify JWT signature
  ├─ Check expiration
  ├─ If valid:
  │  ├─ Decode token
  │  ├─ Extract user_id
  │  ├─ req.user = { id: user_id, role: "candidate", email: ... }
  │  └─ next()  → proceed to controller
  │
  └─ If invalid/expired:
     └─ res.status(401).json({ error: "Unauthorized" })
  │
  ▼
Controller: candidateController.getCandidateProfile()
  │
  ├─ Access: req.user.id (from decoded JWT)
  ├─ Query: Candidate.findOne({ user_id: req.user.id })
  └─ Return: Candidate profile
  │
  ▼
Response to Frontend: Candidate data


┌──────────────────────────────────────────────────────────────┐
│             3. ROLE-BASED ACCESS CONTROL                     │
└──────────────────────────────────────────────────────────────┘

Middleware: authorize('recruiter')

GET /api/recruiters/profile
├─ Middleware: protect() → Verify JWT
├─ Middleware: authorize('recruiter') → Check role
│  │
│  └─ if (req.user.role !== 'recruiter')
│     └─ res.status(403).json({ error: "Forbidden" })
│
└─ Controller: Can only be accessed by recruiters


Middleware: authorize(['admin', 'recruiter'])

GET /api/jobs/:jobId/applications
├─ Middleware: protect() → Verify JWT
├─ Middleware: authorize(['admin', 'recruiter']) → Check roles
│  │
│  └─ if (!['admin', 'recruiter'].includes(req.user.role))
│     └─ res.status(403).json({ error: "Forbidden" })
│
└─ Controller: Can be accessed by admin or recruiter
```

---

## 💳 SUBSCRIPTION & PAYMENT FLOW

```
┌──────────────────────────────────────────────────────────────┐
│           RECRUITER SUBSCRIPTION LIFECYCLE                   │
└──────────────────────────────────────────────────────────────┘

Timeline: 30-day subscription

Day 1:
  │
  ├─ GET /api/service-plans/available
  │  └─ Display plans to recruiter
  │
  ├─ PUT /api/recruiters/subscription/upgrade
  │  ├─ planId: "507f..."  (Premium plan)
  │  └─ Create RecruiterSubscription (status: "pending")
  │
  └─ Frontend: Redirect to payment gateway
     │
     ▼
   PAYMENT GATEWAY (Stripe/VNPay/etc.)
     │
     ├─ User enters payment details
     ├─ Payment processed
     └─ Webhook → Backend
        │
        ▼
   Backend handles webhook:
     ├─ Verify payment success
     ├─ Update RecruiterSubscription:
     │  ├─ payment_status: "paid"
     │  ├─ subscription_status: "active"
     │  └─ features_used: { job_posts_used: 0, ... }
     │
     ├─ Update Recruiter:
     │  ├─ subscription_plan: "premium"
     │  └─ plan_expires_at: Date + 30 days
     │
     └─ Send confirmation email
        │
        ▼
   Frontend: Show success message
        │
        ▼
   Recruiter can now: Post jobs, download CVs, etc.


Day 10:
  │
  └─ Recruiter posts 5 jobs
     │
     ├─ Each job post triggers: checkJobPostingLimit
     │  ├─ Query: Active subscription
     │  ├─ Get limit: 15 (from Premium plan)
     │  ├─ Get current: 5 jobs
     │  └─ Check: 5 < 15 ✓ Allowed
     │
     └─ Update: features_used.job_posts_used = 5


Day 25:
  │
  └─ Subscription expires in 5 days
     │
     ├─ Cron job sends email reminder
     └─ Dashboard shows: "Renew in 5 days"


Day 30:
  │
  ├─ Subscription expires
  ├─ Update: subscription_status = "expired"
  ├─ Recruiter can't post new jobs
  └─ Downgrade to Free plan (limit: 3 jobs)


Day 31 - Recruiter renews:
  │
  └─ Same process repeats
     ├─ Choose plan
     ├─ Payment
     ├─ Update subscription
     └─ features_used reset to 0
```

---

## 🎯 APPLICATION LIFECYCLE

```
CANDIDATE APPLIES → RECRUITER REVIEWS → HIRE

┌────────────────────────────────────────────────────────┐
│                    APPLICATION STATUS                  │
└────────────────────────────────────────────────────────┘

pending
  │
  ├─ Candidate just applied
  ├─ Recruiter sees notification
  └─ Initial status = "pending"
      │
      ▼
  Recruiter reviews CV
      │
      ├─ REJECT PATH:
      │  │
      │  ▼
      │ rejected
      │  │
      │  ├─ Send email: "Thank you for..."
      │  └─ Status history recorded
      │
      └─ SHORTLIST PATH:
         │
         ▼
      shortlisted
         │
         ├─ Send email: "Congratulations! You're shortlisted"
         ├─ Notification to candidate
         └─ Status history recorded
             │
             ▼
         Recruiter schedules interview
             │
             ▼
         interviewed
             │
             ├─ Send interview invitation
             ├─ Candidate attends
             ├─ Recruiter submits feedback
             └─ Status history recorded
                 │
                 ├─ REJECT PATH:
                 │  │
                 │  ▼
                 │ rejected
                 │  │
                 │  ├─ Send: "Thank you for interviewing"
                 │  └─ Move to next candidate
                 │
                 └─ OFFER PATH:
                    │
                    ▼
                 offered
                    │
                    ├─ Send offer letter: salary, benefits, deadline
                    ├─ Candidate receives notification
                    ├─ Candidate can: Accept or Reject
                    └─ Status history recorded
                        │
                        ├─ Candidate accepts:
                        │  └─ HIRE ✓
                        │
                        └─ Candidate rejects:
                           └─ Move to next candidate
```

---

Tài liệu này sẽ giúp bạn hiểu rõ luồng hoạt động từng bước! 🎉
