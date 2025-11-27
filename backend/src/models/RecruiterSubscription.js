const mongoose = require("mongoose");

const recruiterSubscriptionSchema = new mongoose.Schema(
  {
    recruiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    service_plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePlan",
      required: true,
    },

    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    start_date: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },

    end_date: {
      type: Date,
      required: [true, "End date is required"],
    },

    subcription_status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending",
    },

    // Đây là Object lưu trữ số lượng tính năng đã sử dụng trong gói dịch vụ
    // Như là số lượng tin đăng đã sử dụng, số lượng tin nổi bật đã sử dụng, số lượt tải CV đã sử dụng, v.v.
    features_used: {
      job_posts_used: {
        type: Number,
        default: 0,
      },
      featured_jobs_used: {
        type: Number,
        default: 0,
      },
      cv_downloads_used: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Tạo các chỉ mục để tối ưu hóa truy vấn
// chỉ mục này giúp tìm kiếm các gói dịch vụ của nhà tuyển dụng theo thời gian kết thúc gần nhất
recruiterSubscriptionSchema.index({ recruiter_id: 1, end_date: -1 });
// chỉ mục này giúp tìm kiếm các gói dịch vụ theo trạng thái đăng ký
recruiterSubscriptionSchema.index({ subcription_status: 1 });
// chỉ mục này giúp tìm kiếm các gói dịch vụ theo gói dịch vụ cụ thể
recruiterSubscriptionSchema.index({ service_plan_id: 1 });

module.exports = mongoose.model(
  "RecruiterSubscription",
  recruiterSubscriptionSchema
);
