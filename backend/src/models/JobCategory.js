const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema(
  {
    // Tên danh mục công việc
    category_name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot be more than 50 characters"],
    },
    // bí danh viết tắt cho category_name alias
    name: {
      type: String,
      get: function () {
        return this.category_name;
      },
      set: function (value) {
        this.category_name = value;
      },
    },
    // Mô tả danh mục công việc liên quan đến category_name
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },

    // Biểu tượng đại diện cho danh mục công việc
    icon: {
      type: String,
      trim: true,
      maxlength: [100, "Icon cannot be more than 100 characters"],
    },
    // Màu sắc đại diện cho danh mục công việc
    color: {
      type: String,
      trim: true,
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Please provide a valid hex color",
      ],
    },
    // Đệ quy tham chiếu chính mình để tạo cấu trúc danh mục con
    parent_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCategory",
      default: null,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
    // Thứ tự sắp xếp danh mục công việc
    sort_order: {
      type: Number,
      default: 0,
    },
    // SEO fields tiêu đề và mô tả cho danh mục công việc
    meta_title: {
      type: String,
      trim: true,
      maxlength: [60, "Meta title cannot be more than 60 characters"],
    },
    // Mô tả meta cho SEO
    meta_description: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot be more than 160 characters"],
    },
    //Ví dụ: "Công Nghệ Thông Tin" → "cong-nghe-thong-tin".
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Thiết lập quan hệ 1-n với chính nó để lấy danh mục con
jobCategorySchema.virtual("subcategories", {
  ref: "JobCategory",
  localField: "_id",
  foreignField: "parent_category_id",
  justOne: false,
});

// Đếm số lượng công việc trong mỗi danh mục
jobCategorySchema.virtual('jobs_count', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'category_id',
  count: true
});

// Middleware để tự động tạo slug từ category_name trước khi lưu
jobCategorySchema.pre('save', function(next) {
  if (this.isModified('category_name') || this.isNew) {
    this.slug = this.category_name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Index for better performance (category_name and slug already have unique: true)
jobCategorySchema.index({ parent_category_id: 1 });
jobCategorySchema.index({ is_active: 1, sort_order: 1 });

// Ensure virtual fields are serialized
jobCategorySchema.set('toJSON', { virtuals: true, getters: true });
jobCategorySchema.set('toObject', { virtuals: true, getters: true });


module.exports = mongoose.model("JobCategory", jobCategorySchema);
