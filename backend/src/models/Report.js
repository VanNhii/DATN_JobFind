const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Loại đối tượng bị báo cáo: User, Job, Application, Message, Review
    reported_entity_type: {
      type: String,
      enum: ["User", "Job", "Application", "Message", "Review"],
      required: [true, "Please provide the type of the reported entity"],
    },

    // Đối tượng bị báo cáo (Tham chiếu đến ID của đối tượng bị báo cáo) như User ID, Job ID, v.v.
    reported_entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    //Loại báo cáo cái đối tượng bị báo cáo đó
    report_type: {
      type: String,
      enum: [
        "spam",
        "inappropriate_content",
        "fake_job",
        "harassment",
        "discrimination",
        "scam",
        "other",
      ],
      required: [true, "Please specify report type"],
    },

    // Lý do báo cáo
    reason: {
      type: String,
      required: [true, "Please provide reason for the report"],
      trim: true,
      maxlength: [100, "Reason cannot be more than 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "dismissed"],
      default: "pending",
    },

    admin_notes: {
      type: String,
      maxlength: [1000, "Admin notes cannot be more than 1000 characters"],
    },
    // bằng chứng đính kèm liên quan đến báo cáo (nếu có) cưa người báo cáo
    evidence_files: [
      {
        file_name: {
          type: String,
          required: true,
        },
        file_url: {
          type: String,
          required: true,
        },
        file_type: {
          type: String,
          required: true,
        },
      },
    ],
    // mức độ ưu tiên xử lý báo cáo
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    resolved_at: {
      type: Date,
      default: null,
    },
    //ID của admin/mod đã xử lý báo cáo.
    resolved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    //Hành động mà admin đã thực hiện sau khi xử lý.
    resolution_action: {
      type: String,
      enum: [
        "no_action",
        "warning_sent",
        "content_removed",
        "account_suspended",
        "account_banned",
      ],
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

// Indexes để tối ưu hóa truy vấn
// Theo trạng thái và thời gian tạo để dễ dàng lọc các báo cáo mới hoặc theo trạng thái
reportSchema.index({ status: 1, created_at: -1 });
// Xem tất cả các báo cáo liên quan đến một đối tượng cụ thể
reportSchema.index({ reporter_id: 1 });
// Xem tất cả các báo cáo liên quan đến một đối tượng cụ thể
reportSchema.index({ reported_entity_type: 1, reported_entity_id: 1 });
// Ưu tiên xử lý báo cáo
reportSchema.index({ priority: 1 });

reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: "reporter_id",
    select: "full_name email role",
  }).populate({
    path: "resolved_by",
    select: "full_name email",
  });
  next();
});
module.exports = mongoose.model("Report", reportSchema);
