const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skill_name: {
      type: String,
      required: [true, "Skill name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"],
    },
    // Slug dùng để tạo URL thân thiện với SEO
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Danh mục kỹ năng
    category: {
      type: String,
      required: [true, "Skill category is required"],
      enum: [
        "programming_language",
        "framework",
        "database",
        "devops",
        "cloud",
        "mobile",
        "web",
        "testing",
        "design",
        "project_management",
        "soft_skill",
        "tool",
        "other",
      ],
    },
    // Loại kỹ năng con của danh mục kỹ năng
    subcategory: {
      type: String,
      trim: true,
      maxlength: [50, "Subcategory cannot exceed 50 characters"],
    },

    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    aliases: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    related_skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    polularity_score: {
      type: Number,
      default: 0,
      min: [0, "Popularity score cannot be negative"],
    },

    jobs_count: {
      type: Number,
      default: 0,
      min: [0, "Job count cannot be negative"],
    },

    candidates_count: {
      type: Number,
      default: 0,
      min: [0, "Candidate count cannot be negative"],
    },

    icon: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    official_url: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid URL. It should start with http:// or https://`,
      },
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_trending: {
      type: Boolean,
      default: false,
    },

    sort_order: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    average_proficiency_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

//Trước khi lưu, tạo slug từ skill_name để sử dụng trong URL thân thiện với SEO
skillSchema.pre("save", function (next) {
  if (this.isModified("skill_name") || this.isNew) {
    this.slug = this.skill_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

skillSchema.index({ skill_name: "text", aliases: "text", slug: "text" });
skillSchema.index({ category: 1, subcategory: 1 });
skillSchema.index({ popularity_score: -1 });
skillSchema.index({ is_trending: -1 });
skillSchema.index({ tags: 1 });

// Phương thức tĩnh để tìm kỹ năng theo tên hoặc bí danh
skillSchema.statics.findByNameOrAlias = function (name) {
  const searchName = name.toLowerCase().trim();
  return this.findOne({
    $or: [
      // Toán tử OR để tìm kiếm theo tên kỹ năng hoặc bí danh 1 trong 2
      { skill_name: new RegExp(`^${searchName}$`, "i") }, //Dùng regex để tìm chính xác không phân biệt hoa thường
      { aliases: searchName },
    ],
    is_active: true, // Trả về khi kỹ năng đang kích hoạt
  });
};

// Phương thức tĩnh để lấy kỹ năng phổ biến nhất
// Statics là phương thức tĩnh, có thể gọi trực tiếp từ mô hình mà không cần một thể hiện
// TÁC ĐỘNG VÀO 1 BẢN GHI CỤ THỂ
skillSchema.statics.getPopularSkills = function (limit = 20) {
  return this.find({ is_active: true })
    .sort({ popularity_score: -1 })
    .limit(limit)
    .select("skill_name category icon color popularity_score");
};

// Phương thức tĩnh để lấy kỹ năng thịnh hành
skillSchema.statics.getTrendingSkills = function (limit = 10) {
  return this.find({ is_active: true, is_trending: true })
    .sort({ popularity_score: -1 })
    .limit(limit)
    .select("skill_name category icon color popularity_score");
};

// Phương thức để tăng điểm phổ biến
//methods là phương thức của thể hiện, tác động vào 1 bản ghi cụ thể
// TÁC ĐỘNG VÀO 1 DBẢN GHI CỤ THỂ
skillSchema.methods.incrementPopularity = function (points = 1) {
  this.popularity_score += points;
  return this.save();
};

// Ảo hóa trường hiển thị tên kỹ năng
skillSchema.virtual("display_name").get(function () {
  return this.skill_name;
});

// Trước mỗi truy vấn tìm kiếm, tự động populate trường related_skills
skillSchema.pre(/^find/, function (next) {
  this.populate({
    path: "related_skills",
    select: "skill_name slug category icon color",
  });
  next();
});

// Ensure virtual fields are serialized
skillSchema.set("toJSON", { virtuals: true });
skillSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Skill", skillSchema);
