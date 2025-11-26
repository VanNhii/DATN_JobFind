const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    company_name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    company_description: {
      type: String,
      maxlength: [2000, "Company description cannot exceed 2000 characters"],
    },

    company_size: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1001-5000",
        "5001+",
      ],
      default: null,
    },

    industry: {
      type: String,
      maxlength: [100, "Industry cannot exceed 100 characters"],
    },

    website: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\//.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid URL. It should start with http:// or https://`,
      },
    },

    company_email: {
      type: String,
      required: [true, "Company email is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },

    company_phone: {
      type: String,
      trim: true,
    },

    company_address: {
      type: String,
      trim: true,
      maxlength: [200, "Company address cannot exceed 200 characters"],
    },

    founded_year: {
      type: Number,
      min: [1800, "Founded year cannot be before 1800"],
      max: [new Date().getFullYear(), "Founded year cannot be in the future"],
    },

    company_locations: [
      {
        city: {
          type: String,
          required: true,
          trim: true,
        },

        address: {
          type: String,
          trim: true,
        },

        is_headquarters: {
          type: Boolean,
          default: false,
        },
      },
    ],

    logo_url: {
      type: String,
      default: null,
    },

    cover_image_url: {
      type: String,
      default: null,
    },

    // Giá trị và văn hoá công ty
    mission: {
      type: String,
      maxlength: [2000, "Mission cannot exceed 2000 characters"],
    },

    vision: {
      type: String,
      maxlength: [2000, "Vision cannot exceed 2000 characters"],
    },

    company_culture: {
      type: String,
      maxlength: [2000, "Company culture cannot exceed 2000 characters"],
    },

    benefits: {
      type: String,
      maxlength: [2000, "Benefits cannot exceed 2000 characters"],
    },

    //Thông tin người liên hệ
    contact_person_name: {
      type: String,
      trim: true,
      maxlength: [100, "Contact person name cannot exceed 100 characters"],
    },

    contact_email: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },

    contact_phone: {
      type: String,
      trim: true,
    },

    position: {
      type: String,
      trim: true,
      maxlength: [100, "Position cannot exceed 100 characters"],
    },

    department: {
      type: String,
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [100, "Bio cannot exceed 100 characters"],
    },

    avartar_url: {
      type: String,
      default: null,
    },

    skills: [
      {
        type: String,
        trim: true,
        maxlength: [500, "Skills cannot exceed 500 characters"],
      },
    ],

    languages: [
      {
        type: String,
        trim: true,
        maxlength: [500, "Languages cannot exceed 500 characters"],
      },
    ],

    // Mạng xã hội
    social_links: {
      linkedin: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\//.test(v);
          },
          message: "Please provide a valid URL",
        },
      },
      facebook: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\//.test(v);
          },
          message: "Please provide a valid URL",
        },
      },
      twitter: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\//.test(v);
          },
          message: "Please provide a valid URL",
        },
      },
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    subscription_plan: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      default: "basic",
    },

    plan_expires_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Trước khi thực hiện truy vấn tìm kiếm nhà tuyển dụng, tự động tìm kiếm thông tin user
recruiterSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user_id",
    select: "username email full_name phone avatar_url is_verified is_active",
  });
  next();
});

// Tạo bảng ảo với mô hình Jobs
recruiterSchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "recruiter_id",
});

// Tạo bảng ảo với mô hình RecruiterSubscription
recruiterSchema.virtual("subscriptions", {
  ref: "RecruiterSubscription",
  localField: "_id",
  foreignField: "recruiter_id",
});

// Để bao gồm các trường ảo khi chuyển đổi sang JSON hoặc đối tượng
recruiterSchema.set("toJSON", { virtuals: true });
recruiterSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Recruiter", recruiterSchema);
