const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    date_of_birth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },

    city: {
      type: String,
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
    },

    education_level: {
      type: String,
      enum: [
        "high_school",
        "associate",
        "bachelor",
        "master",
        "doctorate",
        "other",
      ],
      default: "other",
    },

    experience_years: {
      type: Number,
      min: [0, "Experience years cannot be negative"],
      max: [50, "Experience years seems too high"],
      default: 0,
    },

    bio: {
      type: String,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },

    cv_url: {
      type: String,
      default: null,
    },

    linkedin_url: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(v); // Kiểm tra định dạng URL LinkedIn
        },
        message: "Please enter a valid LinkedIn URL",
      },
    },

    github_url: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.*$/.test(v); // Kiểm tra định dạng URL GitHub
        },
        message: "Please enter a valid GitHub URL",
      },
    },

    portfolio_url: {
      type: String,
      validate: {
        validator: function (v) {
          return (
            !v ||
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(
              v
            )
          ); // Kiểm tra định dạng URL
        },
        message: "Please enter a valid portfolio URL",
      },
    },

    //Cho phép nhập mức lương mong muốn tối thiểu và tối đa
    // ví dụ name: "Nguyễn Văn A",
    //   salary_expectation: {
    //     min: 1000,
    //     max: 2000
    //   }
    salary_expectation: {
      type: Number,
      min: {
        type: Number,
        min: [0, "Salary expectation cannot be negative"],
      },
      max: {
        type: Number,
        min: [0, "Salary expectation cannot be negative"],
      },
    },

    job_status: {
      type: String,
      enum: ["seeking", "employed", "not_seeking"],
      default: "seeking",
    },

    // Thông tin học vấn theo mảng có thể học nhiều trường thay vì chỉ một trường
    education: [
      {
        school_name: {
          type: String,
          required: true,
          trim: true,
          maxlength: [150, "School name cannot be more than 150 characters"],
        },
        degree: {
          type: String,
          required: true,
          trim: true,
          maxlength: [100, "Degree cannot be more than 100 characters"],
        },
        major: {
          type: String,
          required: true,
          trim: true,
          maxlength: [100, "Major cannot be more than 100 characters"],
        },
        start_date: {
          type: Date,
          required: true,
        },
        end_date: {
          type: Date,
          validate: {
            validator: function (v) {
              return !v || v >= this.start_date;
            },
            message: "End date must be after start date",
          },
        },
        gpa: {
          type: Number,
          min: [0, "GPA cannot be negative"],
          max: [4.0, "GPA cannot be more than 4.0"],
        },
        description: {
          type: String,
          maxlength: [500, "Description cannot be more than 500 characters"],
        },
        is_current: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Thông tin kinh nghiệm làm việc theo mảng có thể làm nhiều công ty thay vì chỉ một công ty
    experience: [
      {
        company_name: {
          type: String,
          required: true,
          trim: true,
          maxlength: [100, "Company name cannot be more than 100 characters"],
        },
        position: {
          type: String,
          required: true,
          trim: true,
          maxlength: [100, "Position cannot be more than 100 characters"],
        },
        start_date: {
          type: Date,
          required: true,
        },
        end_date: {
          type: Date,
          validate: {
            validator: function (v) {
              return !v || v >= this.start_date;
            },
            message: "End date must be after start date",
          },
        },
        description: {
          type: String,
          maxlength: [1000, "Description cannot be more than 1000 characters"],
        },
        is_current: {
          type: Boolean,
          default: false,
        },
        technologies: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    // Kỹ năng với tên kỹ năng, mức độ và năm kinh nghiệm
    skills_detailed: [
      {
        skill_name: {
          type: String,
          required: true,
          trim: true,
          maxlength: [50, "Skill name cannot be more than 50 characters"],
        },
        skill_level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          required: true,
        },
        years_of_experience: {
          type: Number,
          min: [0, "Years of experience cannot be negative"],
          max: [50, "Years of experience cannot be more than 50"],
          default: 0,
        },
        is_primary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    cv_file_url: {
      type: String,
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

// pre/^find/ là trước khi thuưc hiện các lệnh tìm kiếm như find, findOne
// Mỗi khi truy vấn tìm kiếm Candidate, tự động populate thông tin User liên quan
candidateSchema.pre(/^find/, async function () {
  this.populate({
    path: "user_id",
    select: "username email full_name phone avatar_url is_verified is_active",
  });
});

// Virtual for applications để xem các ứng viên đã nộp đơn cho những công việc nào
candidateSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "candidate_id",
});

// Thiết lập tùy chọn để bao gồm các trường ảo khi chuyển đổi sang JSON hoặc Object
candidateSchema.set("toJSON", { virtuals: true });
candidateSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Candidate", candidateSchema);

//ĐÂY LÀ MẪU DỮ LIỆU CHO CANDIDATE
// {
//   "_id": "650a1b2c3d4e5f6789012345",
//   "first_name": "Nguyen",
//   "last_name": "Van A",
//   "email": "nguyenvana@example.com",
//   "password": "$2b$10$examplehashedpassword",
//   "role": "candidate",
//   "account_status": "approved",
//   "education": [
//     {
//       "school_name": "University of Example",
//       "degree": "Bachelor of Science",
//       "major": "Computer Science",
//       "start_date": "2015-09-01T00:00:00.000Z",
//       "end_date": "2019-06-30T00:00:00.000Z",
//       "gpa": 3.8,
//       "description": "Studied software engineering and algorithms",
//       "is_current": false
//     },
//     {
//       "school_name": "Example Tech Institute",
//       "degree": "Master of Science",
//       "major": "Artificial Intelligence",
//       "start_date": "2020-09-01T00:00:00.000Z",
//       "end_date": "2022-06-30T00:00:00.000Z",
//       "gpa": 3.9,
//       "description": "Specialized in machine learning and deep learning",
//       "is_current": false
//     }
//   ],
//   "createdAt": "2023-11-26T08:00:00.000Z",
//   "updatedAt": "2023-11-26T08:00:00.000Z"
// }
