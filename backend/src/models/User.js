const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: function () {
        return !this.social_id; // Bắt buộc nếu không đăng nhập bằng Google
      },
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Không trả về trường mật khẩu trong các truy vấn mặc định
    },

  social_id: {
    type: String,
    // do not set `unique` here alone because we'll create a partial unique index below
    // that only indexes documents where `social_id` exists and is not null.
  },

    provider: {
      type: String,
      enum: ["local", "google", "facebook", "linkedin", "github"],
      default: "local",
    },

    social_profile: {
      type: mongoose.Schema.Types.Mixed, // Lưu trữ thông tin profile từ mạng xã hội dưới dạng đối tượng linh hoạt
      default: null,
    },

    role: {
      type: String,
      enum: ["recruiter", "candidate", "admin"],
      default: "candidate",
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^\+?[1-9]\d{1,14}$/.test(v); // Kiểm tra định dạng số điện thoại quốc tế
        },
        message: "Please enter a valid phone number",
      },
    },

    first_name: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    last_name: {
      type: String,
      required: [true, "Please enter your last name"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    avatar_url: {
      type: String,
      default: null,
    },

    account_status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    status_reason: {
      type: String,
      default: null,
    },

    status_updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status_updated_at: {
      type: Date,
      default: null,
    },

    last_login: {
      type: Date,
      default: null,
    },

    // Token đặt lại mật khẩu
    resetPasswordToken: {
      type: String,
      default: null,
    },

    // Thời gian hết hạn của token đặt lại mật khẩu
    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    // Email xác minh người dùng có 3 type để gửi code, thời gian hết hạn và số lần thử
    email_verification: {
      code: {
        type: String,
        default: null,
      },
      expires_at: {
        type: Date,
        default: null,
      },
      attempts: {
        type: Number,
        default: 0,
        max: 5,
      },
    },
    // SĐT xác minh người dùng có 3 type để gửi code, thời gian hết hạn và số lần thử
    phone_verification: {
      code: {
        type: String,
        default: null,
      },
      expires_at: {
        type: Date,
        default: null,
      },
      attempts: {
        type: Number,
        default: 0,
        max: 5,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ảo quan hệ với mô hình CandidateProfile || dùng trong userController.js
userSchema.virtual("candidate_profile", {
  ref: "CandidateProfile",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

// Ảo quan hệ với mô hình RecruiterProfile || dùng trong userController.js
userSchema.virtual("recruiter_profile", {
  ref: "Recruiter",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

// Ảo trường full name
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`.trim();
});

// Ảo trường is_verified
userSchema.virtual("is_verified").get(function () {
  return (
    this.email_verification &&
    this.email_verification.code === null &&
    this.account_status === "approved"
  );
});

// Tạo trường ảo xác nhận hoạt động tài khoản is_active dựa trên account_status
userSchema.virtual("is_active").get(function () {
  return this.account_status === "approved";
});

// isModified cho phép kiểm tra xem hoạt động nào đó có bị thay đổi hay không hàm của mongoose
userSchema.pre("save", async function () {
  if (!this.isModified("password")) { // Bỏ next đi 
    return; // nothing to do
  }
  // Nếu password bị thay đổi thì hash mật khẩu với bcrypt trước khi lưu vào cơ sở dữ liệu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Đăng nhập với JWT và trả về id người dùng -- trả về tạo token với jwt từ authController.js
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// So sánh mật khẩu đã nhập với mật khẩu đã băm trong cơ sở dữ liệu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo mật khẩu mới để reset token và trả về token chưa băm
userSchema.methods.getResetPasswordToken = function () {
  // Tạo token đặt lại mật khẩu
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Băm token và lưu vào cơ sở dữ liệu
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Sau khi set xong PasswordToken thì set thời gian hết hạn của token (10 phút)
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
  return resetToken;
};

//Xoá hồ sơ liên quan khi xóa người dùng

userSchema.pre("remove", async function () {
  // Xoá hồ sơ ứng viên liên quan
  if (this.role === "candidate") {
    await this.model("Candidate").deleteOne({ user_id: this._id });
  } else if (this.role === "recruiter") {
    // Xoá hồ sơ nhà tuyển dụng liên quan
    await this.model("Recruiter").deleteOne({ user_id: this._id });
  }
});

module.exports = mongoose.model("User", userSchema);

// Create a partial unique index on social_id so that only documents with a
// non-null social_id are indexed as unique. This prevents duplicate key errors
// when multiple users do not have social_id set (or it's null).
userSchema.index(
  { social_id: 1 },
  { unique: true, partialFilterExpression: { social_id: { $exists: true, $ne: null } } }
);


