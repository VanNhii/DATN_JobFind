const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    recruiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    interview_type: {
      type: String,
      enum: ["phone", "video", "onsite", "online-test"],
      required: [true, "Please specify interview type"],
    },

    interview_date: {
      type: Date,
      required: [true, "Please provide interview date"],
    },

    interview_time: {
      type: String,
      required: [true, "Please provide interview time"],
      match: [
        /^([0-1]\d|2[0-3]):([0-5]\d)$/,
        "Please provide time in HH:MM 24-hour format(HH:MM)",
      ],
    },

    duration_minutes: {
      type: Number,
      min: [15, "Duration must be at least 15 minutes"],
      max: [400, "Duration cannot exceed 8 hours"],
      default: 60,
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot be more than 200 characters"],
    },

    meeting_link: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Please provide a valid meeting link",
      },
    },

    notes: {
      type: String,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },

    interviewers: [
      {
        // thông tin người phỏng vấn
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          trim: true,
        },

        email: {
          type: String,
          trim: true,
        },
        // vai trò trong buổi phỏng vấn: người phỏng vấn chính, người hỗ trợ, v.v.
        role: {
          type: String,
          trim: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "canceled", "no_show"],
      default: "scheduled",
    },
    // Đánh dấu đã gửi email nhắc nhở phỏng vấn
    reminder_sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
// Truoc khi thuc hien find thi populate cac thong tin lien quan den application, recruiter va candidate
interviewSchema.pre(/^find/, function (next) {
  //
  this.populate({
    path: "application_id", //okk đuonwfg d
    select: "job_id candidate_id application_status",
  })
    .populate({
      path: "recruiter_id",
      select: "company_name user_id",
      populate: {
        path: "user_id",
        select: "full_name email",
      },
    })
    .populate({
      path: "candidate_id",
      select: "user_id",
      populate: {
        path: "user_id",
        select: "full_name email phone",
      },
    });
  next();
});
// Tạo trường ảo để xem phản hồi phỏng vấn liên quan đến cuộc phỏng vấn
interviewSchema.virtual("feedback", {
  ref: "InterviewFeedback",
  localField: "_id",
  foreignField: "interview_id",
});
// Tạo index để tối ưu hóa truy vấn theo ngày phỏng vấn và trạng thái
// Sắp xếp các cuộc phỏng vấn theo ngày phỏng vấn gần nhất
interviewSchema.index({ interview_date: 1 });
// Tối ưu hóa truy vấn theo ứng viên và ngày phỏng vấn
interviewSchema.index({ candidate_id: 1, interview_date: -1 });
// Tối ưu hóa truy vấn theo nhà tuyển dụng và ngày phỏng vấn
interviewSchema.index({ recruiter_id: 1, interview_date: -1 });

// Xuất dữ liệu bao gồm các trường ảo khi chuyển đổi sang JSON hoặc Object
interviewSchema.set("toJSON", { virtuals: true });
interviewSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Interview", interviewSchema);
