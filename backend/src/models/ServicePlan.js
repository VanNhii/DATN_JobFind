const mongoose = require("mongoose");

const servicePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add plan name'],
    unique: true,
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Please add plan description']
  },

  price: {
    type: Number,
    required: [true, 'Please add price'],
    min: [0, 'Price cannot be negative']
  },

  //
  duration_days: {
    type: Number,
    required: [true, 'Please add duration in days'],
    min: [1, 'Duration must be at least 1 day']
  },

  plan_type: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: [true, 'Please specify plan type']
  },
  // Object chứa các tính năng của gói dịch vụ
  features: {
    // Số lượng bài đăng tuyển dụng được phép 
    job_posts_limit: {
      type: Number,
      required: true,
      min: [1, 'Job posts limit must be at least 1']
    },
    // Số lượng bài đăng tuyển dụng được làm nổi bật
    featured_jobs: {
      type: Number,
      default: 0,
      min: [0, 'Featured jobs cannot be negative']
    },
    // Tính năng tìm kiếm ứng viên
    candidate_search: {
      type: Boolean,
      default: false
    },
    // Tính năng phân tích nâng cao
    advanced_analytics: {
      type: Boolean,
      default: false
    },
    // Hỗ trợ ưu tiên
    priority_support: {
      type: Boolean,
      default: false
    },
    // Số lượt tải CV được phép
    cv_downloads: {
      type: Number,
      default: 0,
      min: [0, 'CV downloads cannot be negative']
    }
  },
// xác định tính năng của gói dịch vụ còn hiệu lực hay không
  is_active: {
    type: Boolean,
    default: true
  },
  // thứ tự sắp xếp gói dịch vụ trên giao diện người dùng
  sort_order: {
    type: Number,
    default: 0
  },
  // gói dịch vụ phổ biến
  is_popular: {
    type: Boolean,
    default: false
  },
  // màu sắc đại diện cho gói dịch vụ
  color: {
    type: String,
    default: '#007bff'
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for plan queries
servicePlanSchema.index({ is_active: 1, sort_order: 1 });
servicePlanSchema.index({ plan_type: 1 });

module.exports = mongoose.model('ServicePlan', servicePlanSchema);
