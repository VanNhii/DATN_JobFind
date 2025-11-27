const mongoose = require("mongoose");
const { use } = require("react");

const companyReviewSchema = new mongoose.Schema({
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },

  // Ai đánh giá công ty
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 
  overall_rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
    required: [true, "Please provide overall rating"],
  },

  work_life_balance_rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },

  salary_benefit_rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },

  career_growth_rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },

  management_rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },

  work_environment_rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },

  // Nội dung đánh giá và cả tiêu đề 
  review_title: {
    type: String,
    required: [true, "Please add review title"],
    trim: true,
    maxlength: [100, "Review title cannot be more than 100 characters"],
  },

  review_content: {
    type: String,
    required: [true, "Please add review content"],
    maxlength: [2000, "Review content cannot be more than 2000 characters"],
  },
        //Ưu điểm của công ty
  pros: [
    {
      type: String,
      trim: true,
      maxlength: [200, "Pros cannot be more than 200 characters"],
    },
  ],
        //Nhược điểm của công ty
  cons: [
    {
      type: String,
      trim: true,
      maxlength: [200, "Cons cannot be more than 200 characters"],
    },
  ],
    // Vị trí công việc của người đánh giá trong công ty
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot be more than 100 characters']
  },
  // Trạng thái công việc của người đánh giá trong công ty
  employment_status: {
    type: String,
    enum: ['current_employee', 'former_employee', 'intern', 'contractor'],
    required: [true, 'Please specify employment status']
  },
  // Thời gian làm việc của người đánh giá tại công ty
  employment_duration: {
    type: String,
    enum: ['less_than_1_year', '1_2_years', '2_5_years', '5_10_years', 'more_than_10_years'],
    default: null
  },

  is_verified: {
    type: Boolean,
    default: false
  },

  // Phương thức xác minh đánh giá
  verification_method: {
    type: String,
    enum: ['email', 'employment_proof', 'admin_verified'],
    default: null
  },
  // Trạng thái đánh giá
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },

  // Lý do từ chối đánh giá
  rejection_reason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  },

  // Thống kê tương tác số lượng người dùng thay đánh giá này có hữu ích hay không
  helpful_count: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },

  // Thống kê không hữu ích
  not_helpful_count: {
    type: Number,
    default: 0,
    min: [0, 'Not helpful count cannot be negative']
  },

  // Lượt xem đánh giá
  views_count: {
    type: Number,
    default: 0,
    min: [0, 'Views count cannot be negative']
  },

  // Danh sách người dùng đã đánh dấu đánh giá này là hữu ích hoặc không hữu ích
  helpful_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Người dùng đánh dấu không hữu ích
  not_helpful_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Moderation
  // Ai đã xem xét đánh giá này
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Thời gian xem xét đánh giá
  reviewed_at: {
    type: Date,
    default: null
  },

  // Đánh giá có ẩn danh hay không
  is_anonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Compound index - one user can only review one company once
// 1 người dùng chỉ được đánh giá một công ty một lần
companyReviewSchema.index({ recruiter_id: 1, reviewer_id: 1 }, { unique: true });

// Index for queries
// Tìm kiếm đánh giá theo công ty, trạng thái và thời gian tạo
companyReviewSchema.index({ recruiter_id: 1, status: 1, created_at: -1 });
companyReviewSchema.index({ overall_rating: -1 });
companyReviewSchema.index({ helpful_count: -1 });
1//Kiêm tra và populate dữ liệu liên quan trước các truy vấn find
companyReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'recruiter_id',
    select: 'company_name logo_url'
  });
  
  //Chỉ hiển thị thông tin người đánh giá nếu không ẩn danh
  if (!this.is_anonymous) {
    this.populate({
      path: 'reviewer_id',
      select: 'full_name avatar_url'
    });
  }
  
  next();
});

// Bảng ảo để tính điểm đánh giá chi tiết trung bình
companyReviewSchema.virtual('average_detailed_rating').get(function() {
  const ratings = [
    this.work_life_balance_rating,
    this.salary_benefit_rating,
    this.career_growth_rating,
    this.management_rating,
    this.work_environment_rating
  ].filter(r => r); // lọc bỏ các giá trị không xác định như null hoặc undefined
  
  if (ratings.length === 0) return this.overall_rating;
  
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return (sum / ratings.length).toFixed(1);
});

// Ensure virtual fields are serialized
companyReviewSchema.set('toJSON', { virtuals: true });
companyReviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("CompanyReview", companyReviewSchema);
