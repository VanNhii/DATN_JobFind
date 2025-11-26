const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
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
    validate: {
      validator: function (v) {
        return !this.salary_min || v >= this.salary_min;
      },
      message: "Maximum salary must be greater than or equal to minimum salary",
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
});

module.exports = mongoose.model("Job", jobSchema);
