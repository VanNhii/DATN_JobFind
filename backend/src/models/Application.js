const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    cover_letter: {
      type: String,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },

    cv_url: {
      type: String,
      required: [true, "CV URL is required"],
    },

    application_status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "shortlisted",
        "interviewed",
        "offered",
        "rejected",
        "withdrawn",
      ],
      default: "pending",
    },

    applied_at: {
      type: Date,
      default: Date.now,
    },

    reviewed_at: {
      type: Date,
      default: null,
    },

    interviewer_notes: {
      type: String,
      maxlength: [
        1000,
        "Interviewer notes cannot be more than 1000 characters",
      ],
    },

    salary_offered: {
      type: Number,
      min: [0, "Salary offered cannot be negative"],
    },

    rejection_reason: {
      type: String,
      maxlength: [500, "Rejection reason cannot be more than 500 characters"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Tạo index để tránh ứng viên nộp đơn nhiều lần cho cùng một công việc
applicationSchema.index({ job_id: 1, candidate_id: 1 }, { unique: true });

// Tự động populate thông tin công việc và ứng viên khi truy vấn đơn ứng tuyển
applicationSchema.pre(/^find/, function () {
  this.populate({
    path: "job_id",
    select: "title company_name location job_type salary_min salary_max",
    populate: {
      path: "recruiter_id",
      select: "company_name company_logo_url",
    },
  }).populate({
    path: "candidate_id",
    select: "user_id skills experience_years",
    populate: {
      path: "user_id",
      select: "full_name email phone avatar_url",
    },
  });
});

// tạo trường ảo để xem lịch sử trạng thái ứng tuyển
applicationSchema.virtual("status_history", {
  ref: "ApplicationStatusHistory",
  localField: "_id",
  foreignField: "application_id",
});

// Virtual để xem các cuộc phỏng vấn liên quan đến đơn ứng tuyển
applicationSchema.virtual("interviews", {
  ref: "Interview",
  localField: "_id",
  foreignField: "application_id",
});

// Cập nhật số lượng đơn ứng tuyển trong Job khi có đơn mới hoặc đơn bị xóa
applicationSchema.post("save", async function () {
  await this.model("Job").findByIdAndUpdate(
    this.job_id,
    // Toán tử $inc để tăng số lượng đơn ứng tuyển lên 1
    { $inc: { applications_count: 1 } }
  );
});

applicationSchema.post("remove", async function () {
  await this.model("Job").findByIdAndUpdate(
    this.job_id,
    // Toán tử $inc để giảm số lượng đơn ứng tuyển đi 1
    { $inc: { applications_count: -1 } }
  );
});

// Ensure virtual fields are serialized
applicationSchema.set("toJSON", { virtuals: true });
applicationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Application", applicationSchema);
