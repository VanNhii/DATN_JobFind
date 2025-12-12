# 📦 SUBSCRIPTION PLANS - CHI TIẾT ĐẦY ĐỦ

## ❓ TÓM TẮT NHANH

### **CANDIDATE (Ứng Cử Viên)**
```
❌ KHÔNG CÓ SUBSCRIPTION
├─ Hoàn toàn MIỄN PHÍ
├─ Không cần thanh toán gì
├─ Dùng tất cả tính năng không giới hạn
└─ Chỉ có 1 "gói": FREE (100%)
```

### **RECRUITER (Nhà Tuyển Dụng)**
```
✅ CÓ 5 GÓI SUBSCRIPTION
├─ Trial (0 VND - 14 ngày)
├─ Basic (0 VND - 30 ngày)
├─ Premium (500K VND - 30 ngày)
├─ Startup Special (250K VND - 30 ngày)
└─ Enterprise (1.5M VND - 30 ngày)
```

---

# 👤 CANDIDATE - CHI TIẾT

## **Candidate Có Gói Nào?**

```javascript
// Không có CandidateSubscription model
// Không có subscription logic trong Candidate controller
// Không có payment system cho candidate
```

### **Candidate Được Gì Miễn Phí?**

| Tính Năng | Candidate |
|-----------|-----------|
| **Tạo Profile** | ✅ Unlimited |
| **Upload CV** | ✅ Unlimited |
| **Add Skills** | ✅ Unlimited |
| **Add Education** | ✅ Unlimited |
| **Add Experience** | ✅ Unlimited |
| **Tìm Kiếm Job** | ✅ Unlimited |
| **Xem Chi Tiết Job** | ✅ Unlimited |
| **Ứng Tuyển Job** | ✅ Unlimited |
| **Lưu Job Yêu Thích** | ✅ Unlimited |
| **Chat với Recruiter** | ✅ Unlimited |
| **Nhận Notification** | ✅ Unlimited |
| **Xem Offer** | ✅ Unlimited |
| **Thanh toán** | ❌ $0 |

### **Kết Luận Candidate:**
```
✅ 100% FREE FOREVER
❌ Không có subscription gói
❌ Không có payment
❌ Không có premium/advanced features
```

---

# 💼 RECRUITER - CHI TIẾT

## **Recruiter Có Bao Nhiêu Gói?**

```
ĐÚNG! Recruiter có 5 gói (không phải 4)

Gói 1: Trial
Gói 2: Basic
Gói 3: Premium
Gói 4: Startup Special (Special offer)
Gói 5: Enterprise
```

### **Chi Tiết Từng Gói**

---

## 🎯 **GÓI 1: TRIAL**

```javascript
{
  name: 'Trial',
  price: 0,
  duration_days: 14,
  plan_type: 'basic',
  description: 'Free trial for new companies to test our platform',
  is_popular: false,
  color: '#ffc107'
}
```

| Feature | Trial |
|---------|-------|
| **Giá** | 0 VND |
| **Thời hạn** | 14 ngày |
| **Đăng tin job** | **1 job** |
| **Featured jobs** | 0 (không nổi bật) |
| **Tìm kiếm candidate** | ❌ Không |
| **Analytics nâng cao** | ❌ Không |
| **Hỗ trợ ưu tiên** | ❌ Không |
| **Tải CV** | 10 CVs |

**Dùng cho:** Tester, người mới muốn thử nền tảng

---

## 🎯 **GÓI 2: BASIC**

```javascript
{
  name: 'Basic',
  price: 0,
  duration_days: 30,
  plan_type: 'basic',
  description: 'Perfect for small companies and startups',
  is_popular: false,
  color: '#6c757d'
}
```

| Feature | Basic |
|---------|-------|
| **Giá** | 0 VND |
| **Thời hạn** | 30 ngày |
| **Đăng tin job** | **3 jobs** |
| **Featured jobs** | 0 (không nổi bật) |
| **Tìm kiếm candidate** | ✅ CÓ |
| **Analytics nâng cao** | ❌ Không |
| **Hỗ trợ ưu tiên** | ❌ Không |
| **Tải CV** | 50 CVs |

**Dùng cho:** Startup nhỏ, công ty mới, tuyển dụng ít

---

## 🎯 **GÓI 3: PREMIUM** ⭐ (Phổ Biến Nhất)

```javascript
{
  name: 'Premium',
  price: 500000,  // 500K VND
  duration_days: 30,
  plan_type: 'premium',
  description: 'Ideal for growing companies with regular hiring needs',
  is_popular: true,  // ← Được đánh dấu là popular
  color: '#007bff'
}
```

| Feature | Premium |
|---------|---------|
| **Giá** | 500,000 VND/tháng |
| **Thời hạn** | 30 ngày |
| **Đăng tin job** | **15 jobs** |
| **Featured jobs** | **3 jobs nổi bật** |
| **Tìm kiếm candidate** | ✅ CÓ |
| **Analytics nâng cao** | ✅ CÓ |
| **Hỗ trợ ưu tiên** | ✅ CÓ |
| **Tải CV** | 200 CVs |

**Dùng cho:** Công ty trung bình, tuyển dụng thường xuyên

---

## 🎯 **GÓI 4: STARTUP SPECIAL** 🎁 (Ưu Đãi Đặc Biệt)

```javascript
{
  name: 'Startup Special',
  price: 250000,  // 250K VND (nửa giá Premium!)
  duration_days: 30,
  plan_type: 'premium',
  description: 'Special discounted plan for verified startups',
  is_popular: false,
  color: '#17a2b8'
}
```

| Feature | Startup Special |
|---------|-----------------|
| **Giá** | 250,000 VND/tháng |
| **Thời hạn** | 30 ngày |
| **Đăng tin job** | **8 jobs** |
| **Featured jobs** | **1 job nổi bật** |
| **Tìm kiếm candidate** | ✅ CÓ |
| **Analytics nâng cao** | ✅ CÓ |
| **Hỗ trợ ưu tiên** | ✅ CÓ |
| **Tải CV** | 100 CVs |

**Dùng cho:** Startup đã xác thực (verified), được giảm giá 50%

⚠️ **Lưu ý:** `plan_type: 'premium'` nhưng giá rẻ hơn. Còn tùy admin để verify startup hay không.

---

## 🎯 **GÓI 5: ENTERPRISE** 🚀

```javascript
{
  name: 'Enterprise',
  price: 1500000,  // 1.5M VND
  duration_days: 30,
  plan_type: 'enterprise',
  description: 'For large organizations with extensive hiring requirements',
  is_popular: false,
  color: '#28a745'
}
```

| Feature | Enterprise |
|---------|------------|
| **Giá** | 1,500,000 VND/tháng |
| **Thời hạn** | 30 ngày |
| **Đăng tin job** | **999 jobs** (∞ Unlimited) |
| **Featured jobs** | **999 jobs nổi bật** (∞ Unlimited) |
| **Tìm kiếm candidate** | ✅ CÓ (Unlimited) |
| **Analytics nâng cao** | ✅ CÓ (Full) |
| **Hỗ trợ ưu tiên** | ✅ CÓ (24/7) |
| **Tải CV** | 999 CVs (∞ Unlimited) |

**Dùng cho:** Công ty lớn, tuyển dụng hàng loạt, cần tất cả tính năng

---

# 📊 BẢNG SO SÁNH ĐẦY ĐỦ

```
╔════════════════════╦═══════╦═══════╦═════════╦══════════════╦════════════╗
║     Feature        ║ Trial ║ Basic ║Premium  ║ Startup Spec ║Enterprise  ║
╠════════════════════╬═══════╬═══════╬═════════╬══════════════╬════════════╣
║ Giá/tháng          ║  0K   ║  0K   ║  500K   ║    250K      ║   1.5M     ║
║ Thời hạn           ║ 14 d  ║ 30 d  ║  30 d   ║    30 d      ║   30 d     ║
║ Đăng tin job       ║  1    ║  3    ║   15    ║     8        ║    ∞       ║
║ Featured jobs      ║  0    ║  0    ║   3     ║     1        ║    ∞       ║
║ Tìm candidate      ║  ❌   ║  ✅   ║   ✅    ║     ✅       ║    ✅      ║
║ Analytics nâng cao ║  ❌   ║  ❌   ║   ✅    ║     ✅       ║    ✅      ║
║ Hỗ trợ ưu tiên     ║  ❌   ║  ❌   ║   ✅    ║     ✅       ║    ✅      ║
║ Tải CV             ║  10   ║  50   ║  200    ║    100       ║    ∞       ║
╚════════════════════╩═══════╩═══════╩═════════╩══════════════╩════════════╝
```

---

# 🔍 CODE DETAILS

## **Service Plan Schema**

```javascript
const servicePlanSchema = new mongoose.Schema({
  name: String,  // "Trial", "Basic", "Premium", "Startup Special", "Enterprise"
  description: String,
  price: Number,  // 0, 0, 500000, 250000, 1500000
  duration_days: Number,  // 14, 30, 30, 30, 30
  plan_type: String,  // enum: ['basic', 'premium', 'enterprise']
  
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
  is_popular: Boolean,  // Premium = true, others = false
  color: String,  // UI color
  created_at: Date,
  updated_at: Date
});
```

## **RecruiterSubscription Model** (Chỉ Recruiter Có)

```javascript
const recruiterSubscriptionSchema = new mongoose.Schema({
  recruiter_id: ObjectId,  // Reference to recruiter
  service_plan_id: ObjectId,  // Reference to ServicePlan
  payment_id: ObjectId,
  
  start_date: Date,
  end_date: Date,
  
  subscription_status: String,  // "pending", "active", "expired", "cancelled"
  payment_status: String,  // "pending", "paid", "failed"
  
  features_used: {
    job_posts_used: Number,
    featured_jobs_used: Number,
    cv_downloads_used: Number
  },
  
  created_at: Date,
  updated_at: Date
});
```

❌ **Candidate KHÔNG CÓ** subscription model

---

# 🚀 HOW IT WORKS

## **Recruiter Nâng Cấp Gói**

```
1. Recruiter truy cập "Nâng Cấp"
   └─ GET /api/service-plans/available
      └─ Hiển thị 5 gói: Trial, Basic, Premium, Startup Special, Enterprise

2. Recruiter chọn gói (e.g., Premium)
   └─ PUT /api/recruiters/subscription/upgrade
      ├─ Gửi: planId (Premium plan ID)
      └─ Backend tạo RecruiterSubscription
         ├─ subscription_status: "pending"
         └─ payment_status: "pending"

3. Thanh toán
   └─ Redirect tới payment gateway
      ├─ User nhập card details
      └─ Payment processed

4. Payment callback
   └─ Update RecruiterSubscription
      ├─ payment_status: "paid"
      ├─ subscription_status: "active"
      └─ features_used reset = 0

5. Recruiter có thể
   ├─ Đăng 15 job posts (Premium limit)
   ├─ Nổi bật 3 job posts
   ├─ Tải 200 CVs
   ├─ Xem analytics
   └─ Được hỗ trợ ưu tiên
```

## **Candidate Không Cần Làm Gì**

```
1. Candidate đăng ký → Hoàn toàn free
2. Candidate không thấy gì về subscription
3. Candidate dùng tất cả feature miễn phí
4. Không cần payment, không cần nâng cấp
5. Tất cả feature được unlock mặc định
```

---

# 💡 KEY POINTS

## **Recruiter**
```
✅ Có 5 gói subscription
✅ 2 gói free (Trial, Basic)
✅ 3 gói paid (Startup Special, Premium, Enterprise)
✅ Mỗi gói có features khác nhau
✅ Phải thanh toán để nâng cấp
✅ Subscription tự động hết hạn sau duration_days
✅ Hạn chế tính năng dựa vào gói
```

## **Candidate**
```
❌ Không có subscription
❌ Không có gói
❌ Không cần thanh toán
❌ 100% free
✅ Dùng tất cả feature
✅ Không có giới hạn
✅ Hoàn toàn miễn phí
```

---

# ❓ FAQ

**Q: Recruiter mới đăng ký được dùng gói nào?**
A: Mặc định là gói Trial (14 ngày, 1 job). Sau đó nâng cấp hoặc dùng Basic free.

**Q: Startup Special khác gì Premium?**
A: Giá rẻ hơn (250K vs 500K), nhưng cần xác thực startup. Features gần tương đương Premium nhưng giới hạn job posts ít hơn (8 vs 15).

**Q: Candidate có thể nâng cấp được không?**
A: KHÔNG. Candidate không có subscription system. Hoàn toàn free 100%.

**Q: Subscription hết hạn thì sao?**
A: Recruiter không thể post job mới. Phải renew subscription hoặc downgrade về Basic/Trial.

**Q: Có thể upgrade plan giữa chừng được không?**
A: Có thể. Subscription cũ sẽ bị hủy, tạo subscription mới. (Tùy thiết kế, có thể prorate refund hoặc không)

**Q: Trial → Basic → Premium có cần thanh toán lại không?**
A: Có. Trial → Basic: Không cần (cả 2 free). Basic → Premium: Cần thanh toán 500K VND.

**Q: Recruiter hết tiền không thể thanh toán thì sao?**
A: Subscription giữ nguyên "paid" status. Lần tới khi muốn renew → upgrade → tính toán lại.

---

# 📝 SUMMARY

```
┌─────────────────────────────────────────────────────┐
│         RECRUITER: 5 GÓI SUBSCRIPTION              │
├─────────────────────────────────────────────────────┤
│ Trial (0 VND)                                       │
│ Basic (0 VND)                                       │
│ Premium (500K VND) ⭐ Popular                       │
│ Startup Special (250K VND) 🎁 Discount             │
│ Enterprise (1.5M VND) 🚀                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          CANDIDATE: KHÔNG CÓ SUBSCRIPTION           │
├─────────────────────────────────────────────────────┤
│ 100% FREE                                           │
│ Không cần thanh toán                                │
│ Không có gói                                        │
│ Dùng tất cả feature unlimited                       │
└─────────────────────────────────────────────────────┘
```

---

Đúng! **Recruiter có 5 gói** (không phải 4), và **Candidate không có bất kỳ gói nào** (100% free). 🎉
