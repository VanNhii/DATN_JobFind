const mongoose = require("mongoose");

// Định nghĩa schema cho Content
const contentSchema = new mongoose.Schema({
  // Tiêu đề nội dung
  title: {
    type: String,
    required: [true, "Please provide content title"],
    trim: true,
    maxlength: [200, "Content title cannot exceed 200 characters"],
  },

  // Đường dẫn cho nội dung, tự động sinh từ title
  slug: {
    type: String,
    required: [true, "Please provide content slug"],
    unique: true,
    trim: true,
    maxlength: [200, "Content slug cannot exceed 200 characters"],
    lowercase: true,
  },

  // Nội dung chính của bài viết
  content: {
    type: String,
    required: [true, "Please provide content body"],
    maxlength: [50000, "Content body cannot exceed 50000 characters"],
  },

  // Đoạn trích ngắn mô tả nội dung
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, "Content excerpt cannot exceed 500 characters"],
  },

  // Đường dẫn ảnh đại diện cho nội dung
  featured_image_url: {
    type: String,
    trim: true,
    default: null,
  },

  // Tham chiếu đến người tạo nội dung (User)
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide author ID"],
  },

  // Loại nội dung: bài viết, tin tức, thông báo
  content_type: {
    type: String,
    enum: ["blog_post", "news_article", "announcement"],
    required: [true, "Please provide content type"],
  },

  // Danh mục nội dung, phụ thuộc vào content_type
  category: {
    type: String,
    required: [true, "Please provide content category"],

    validate: {
      validator: function (v) {
        // Kiểm tra danh mục hợp lệ dựa trên loại nội dung
        const validCategories = {
          // các danh mục hợp lệ cho từng loại nội dung
          blog_post: [
            "technology",
            "career",
            "company_news",
            "industry_trends",
          ],
          news_article: ["press_release", "media_coverage", "event_news"],
          announcement: ["product_launch", "partnership", "awards"],
        };
        return validCategories[this.content_type].includes(v);
      },
      message: "Invalid category for the given content type",
    },
  },

  // Danh sách thẻ (tags) liên quan đến nội dung
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],

  // Trạng thái: nháp, đã xuất bản, đã lưu trữ
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },

  // Thời gian xuất bản
  published_at: {
    type: Date,
    default: null,
  },

  // Đánh dấu là nổi bật
  is_featured: {
    type: Boolean,
    default: false,
  },

  // Đánh dấu là khẩn cấp
  is_urgent: {
    type: Boolean,
    default: false,
  },

  // Đánh dấu là ghim lên đầu
  is_pinned: {
    type: Boolean,
    default: false,
  },

  // Số lượt xem
  views_count: {
    type: Number,
    default: 0,
  },

  // Thời gian đọc ước tính (phút)
  reading_time: {
    type: Number,
    default: 1,
  },

  // Thông tin nguồn bài viết (nếu có)
  source: {
    // Tên nguồn
    name: {
      type: String,
      trim: true,
    },

    // Đường dẫn nguồn
    url: {
      type: String,
      trim: true,
    },

    // Danh sách công ty liên quan
    related_companies: [
      {
        type: String,
        trim: true,
      },
    ],

    // Tiêu đề SEO
    meta_title: {
      type: String,
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },

    // Mô tả SEO
    meta_description: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },

    // Thời gian lên lịch xuất bản
    scheduled_publish_at: {
      type: Date,
      default: null,
    },

    // Cho phép bình luận
    allowed_comments: {
      type: Boolean,
      default: true,
    },

    // Gửi thông báo khi xuất bản
    send_notifications: {
      type: Boolean,
      default: false,
    },
  },

  // Tự động lưu thời gian tạo và cập nhật
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

// Tiền xử lý trước khi lưu:
// - Tạo slug từ title
// - Gán ngày xuất bản nếu status là published
// - Tính thời gian đọc dựa trên số từ
contentSchema.pre("save", function (next) {
  // tiền xử lý trước khi lưu
  if (this.isModified("title")) {
    // Tạo slug nếu title thay đổi
    this.slug = this.title
      .toLowerCase() // Chuyển thành chữ thường
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // Thay thế ký tự không hợp lệ bằng dấu gạch ngang
      .replace(/^-+|-+$/g, ""); // Loại bỏ dấu gạch ngang ở đầu và cuối
  }

  if (
    this.isModified("status") && // Gán ngày xuất bản nếu status thay đổi
    this.status === "published" && // Kiểm tra nếu trạng thái là đã xuất bản
    !this.published_at // Chưa có ngày xuất bản
  ) {
    this.published_at = new Date(); // Gán ngày xuất bản hiện tại
  }

  if (this.isModified("content")) {
    // Tính thời gian đọc nếu nội dung thay đổi
    const wordsPerMinute = 200; // Giả sử tốc độ đọc trung bình là 200 từ/phút
    const wordCount = this.content.split(/\s+/).length; // Đếm số từ
    this.reading_time = Math.max(1, Math.ceil(wordCount / wordsPerMinute)); // Tính thời gian đọc
  }
  next();
});

// Tự động populate thông tin tác giả khi truy vấn
contentSchema.pre(/^find/, function (next) {
  // hàm này chạy trước các truy vấn bắt đầu bằng "find"
  this.populate({
    // populate thông tin tác giả
    path: "author_id",
    select: "full_name avatar_url",
  });
  next();
});

// Tạo các chỉ mục để tối ưu tìm kiếm
contentSchema.index({ title: "text", content: "text", excerpt: "text" }); // Tìm kiếm toàn văn bản trên tiêu đề, nội dung và đoạn trích
contentSchema.index({ tags: 1 }); // Tìm kiếm theo thẻ
contentSchema.index({ content_type: 1, category: 1 }); // Tìm kiếm theo loại và danh mục nội dung
contentSchema.index({ status: 1, published_at: -1 }); // Tìm kiếm theo trạng thái và ngày xuất bản
contentSchema.index({ is_featured: 1, is_urgent: 1, is_pinned: 1 }); // Tìm kiếm theo các cờ nổi bật
contentSchema.index({ author_id: 1, created_at: -1 }); // tăng tốc truy vấn theo tác giả và ngày tạo

// Cho phép trả về các trường ảo khi chuyển sang JSON hoặc Object
contentSchema.set("toJSON", { virtuals: true });
contentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Content", contentSchema);
