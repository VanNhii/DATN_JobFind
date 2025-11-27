const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //Lưu loại hoạt động của người dùng
    activity_type: {
      type: String,
      enum: [
        "login",
        "logout",
        "profile_update",
        "password_change",
        "application_submitted",
        "interview_scheduled",
      ],
      required: true,
    },
    //Lưu đối tượng liên quan đến hoạt động của người dùng
    entity_type: {
      type: String,
      enum: ["Job", "Application", "User", "Message", "Interview", "Search"],
      default: null,
    },
    // ID của đối tượng liên quan đến hoạt động của người dùng
    // Ví dụ: nếu activity_type là "application_submitted" thì entity_type sẽ là "Application" và entity_id sẽ là ID của đơn ứng tuyển đó
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    activity_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    ip_address: {
      type: String,
      validate: {
        validator: function (v) {
          // Nếu không có giá trị thì bỏ qua việc kiểm tra
          if (!v) return true;
          // IPv4 kiểu chuẩn
          const ipv4Pattern =
            /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          // IPv6 kiểu chuẩn
          const ipv6Pattern =
            /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
          // Một số trường hợp đặc biệt cho localhost
          const specialCases = /^(localhost|127\.0\.0\.1|::1|::ffff:.+)$/;

          return (
            ipv4Pattern.test(v) || ipv6Pattern.test(v) || specialCases.test(v)
          );
        },
        message: "Please provide a valid IP address",
      },
    },
    //Trình duyệt hoặc thiết bị người dùng sử dụng
    user_agent: {
      type: String,
      trim: true,
    },
    // Id phiên làm việc của người dùng
    session_id: {
      type: String,
      trim: true,
    },
    // Thời gian thực hiện hoạt động
    duration_seconds: {
      type: Number,
      min: [0, "Duration cannot be negative"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Index for activity queries
// Tìm kiếm hoạt động của người dùng theo user_id và thời gian tạo gần nhất
userActivitySchema.index({ user_id: 1, created_at: -1 });
// Tìm kiếm hoạt động của người dùng theo loại hoạt động và thời gian tạo gần nhất
userActivitySchema.index({ activity_type: 1, created_at: -1 });
// Tìm kiếm hoạt động của người dùng theo loại đối tượng và ID đối tượng
userActivitySchema.index({ entity_type: 1, entity_id: 1 });
// Tìm kiếm hoạt động của người dùng theo thời gian tạo gần nhất
userActivitySchema.index({ created_at: -1 });

// Tự động xóa các bản ghi hoạt động người dùng sau 6 tháng
// TTTL: 6 months = 6 * 30 * 24 * 60 * 60 = 15552000 seconds
userActivitySchema.index({ created_at: 1 }, { expireAfterSeconds: 15552000 }); // 6 months

module.exports = mongoose.model("UserActivity", userActivitySchema);