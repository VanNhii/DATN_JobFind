const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

      category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Job description cannot exceed 5000 characters"],
    },

    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
      // Yêu cầu phải đúng định dạng danh sách, ví dụ: "- Yêu cầu 1\n- Yêu cầu 2\n- Yêu cầu 3"
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "At least one job requirement is required",
      },
    },

    benefits: {
      type: String,
      default: [],
      maxlength: [5000, "Job benefits cannot exceed 5000 characters"],
    },

    salary_min: {
      type: Number,
      min: [0, "Minimum salary cannot be negative"],
    },

    salary_max: {
      type: Number,
      min: [0, "Maximum salary cannot be negative"],
      // Yêu cầu phải lớn hơn hoặc bằng salary_min
      validate: {
        validator: function (v) {
          return !this.salary_min || v >= this.salary_min;
        },
        message:
          "Maximum salary must be greater than or equal to minimum salary",
      },
    },

    job_type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      required: [true, "Job type is required"],
    },

    work_location: {
      type: String,
      required: [true, "Work location is required"],
      enum: ["On-site", "Remote", "Hybrid"],
    },

    positions_available: {
      type: Number,
      min: [1, "There must be at least one position available"],
      default: 1,
    },

    seniority_level: {
      type: String,
      enum: ["Entry", "Mid", "Senior", "Junior", "Lead", "Executive"],
      required: [true, "Seniority level is required"],
      default: "Mid",
    },

    location: {
      address: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      country: {
        type: String,
        default: "Vietnam",
        trim: true,
      },
    },

    experience_required: {
      min: {
        type: Number,
        min: [0, "Minimum experience cannot be negative"],
        default: 0,
      },

      max: {
        type: Number,
        min: [0, "Maximum experience cannot be negative"],
        default: 0,
      },
    },

    education_required: {
      type: String,
      enum: [
        "high_school",
        "associate",
        "bachelor",
        "master",
        "doctorate",
        "not_required",
      ],
      default: "not_required",
    },

    skills_required: [
      {
        skill_name: {
          type: String,
          reuired: true,
          trim: true,
        },
        is_required: {
          type: Boolean,
          default: true,
        },
        weight: {
          type: Number,
          min: 1,
          max: 15,
          default: 5,
        },
      },
    ],

    application_deadline: {
      type: Date,
      valicdate: {
        validator: function (v) {
          return v > new Date();
        },
        message: "Application deadline must be a future date",
      },
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended", "expired"],
      default: "pending",
    },

    admin_notes: {
      type: String,
      trim: true,
      maxlength: [500, "Admin notes cannot be more than 500 characters"],
    },

    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewed_at: {
      type: Date,
      default: null,
    },

    company_name: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    is_featured: {
      type: Boolean,
      default: false,
    },

    views_count: {
      type: Number,
      default: 0,
    },

    applications_count: {
      type: Number,
      default: 0,
    },

    is_hot: {
      type: Boolean,
      default: false,
    },

    is_urgent: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    nice_to_have_skills: [
      {
        skill_name: {
          type: String,
          required: true,
          trim: true,
        },

        weight: {
          type: Number,
          min: 1,
          max: 10,
          default: 3,
        },
      },
    ],

    working_conditions: {
      working_hours: {
        type: String,
        trim: true,
        default: "8:00 - 17:30 (Thứ 2 - Thứ 6)",
      },
      working_model: {
        type: String,
        enum: ["onsite", "remote", "hybrid"],
        default: "onsite",
      },
      probation_period: {
        type: String,
        trim: true,
        default: "2 tháng",
      },
      start_date: {
        type: String,
        trim: true,
        default: "Thỏa thuận",
      },
    },

    job_highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCategory",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// trước mỗi lần thực hiện truy vấn tìm kiếm, tự động populate thông tin nhà tuyển dụng và danh mục công việc
jobSchema.pre(/^find/,async function () { // Phải xoá next đi mới chạy đượcA
  this.populate({
    path: "recruiter_id",
    select: "company_name company_logo_url is_verified",
    populate: {
      path: "user_id",
      select: "full_name email",
    },
  }).populate({
    path: "categories",
    select: "category_name description",
  });
  //
});

// Tạo bảng ảo với mô hình Application
jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "job_id",
});

// Index for search performance
// Hỗ trợ cho tìm kiếm toàn văn bản trên tiêu đề và mô tả công việc
jobSchema.index({ title: "text", description: "text" });
// Hỗ trợ cho tìm kiếm theo thành phố
jobSchema.index({ "location.city": 1 });
// Hỗ trợ cho tìm kiếm theo loại công việc
jobSchema.index({ job_type: 1 });
// Hỗ trợ cho tìm kiếm theo mức lương khi chọn lương từ như 10 triệu đến 20 triệu
jobSchema.index({ salary_min: 1, salary_max: 1 });
// Index để lấy các job mới đăng gần đây
jobSchema.index({ created_at: -1 });
// Lấy danh sách các job còn hạn chế
jobSchema.index({ is_active: 1, application_deadline: 1 });

// Ensure virtual fields are serialized
jobSchema.set("toJSON", { virtuals: true });
jobSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Job", jobSchema);
