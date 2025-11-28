const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Tên file lưu trên hệ thống
  file_name: {
    type: String,
    required: [true, 'Please add file name'],
    trim: true,
    maxlength: [255, 'File name cannot be more than 255 characters']
  },
  // Tên file gốc khi người dùng tải lên
  original_name: {
    type: String,
    required: [true, 'Please add original file name'],
    trim: true
  },
  // Đường dẫn lưu trữ file
  file_path: {
    type: String,
    required: [true, 'Please add file path'],
    trim: true
  },
  // Kích thước file tính bằng bytes
  file_size: {
    type: Number,
    required: [true, 'Please add file size'],
    min: [0, 'File size cannot be negative']
  },
  // Loại file: image, document, video, audio, archive
  file_type: {
    type: String,
    required: [true, 'Please specify file type'],
    enum: ['image', 'document', 'video', 'audio', 'archive'],
  },
  // MIME type của file (ví dụ: image/png, application/pdf).
  mime_type: {
    type: String,
    required: [true, 'Please add mime type'],
    trim: true
  },
  // Phần mở rộng của file (ví dụ: .png, .pdf)
  file_extension: {
    type: String,
    required: [true, 'Please add file extension'],
    trim: true,
    lowercase: true
  },
  // Mục đích tải lên: cv, cover_letter, portfolio, company_logo, profile_avatar, certificate, report_evidence
  upload_purpose: {
    type: String,
    enum: ['cv', 'cover_letter', 'portfolio', 'company_logo', 'profile_avatar', 'certificate', 'report_evidence'],
    required: [true, 'Please specify upload purpose']
  },
  // File có phải là tạm thời không (sẽ tự động xóa sau một thời gian)
  is_temporary: {
    type: Boolean,
    default: false
  },
  // File có công khai không
  is_public: {
    type: Boolean,
    default: false
  },
  // Số lần tải xuống file
  download_count: {
    type: Number,
    default: 0
  },
  // Thời gian hết hạn của file tạm thời
  expires_at: {
    type: Date,
    default: null
  },
  // Liên quan đến đối tượng nào (User, Job, Application, Message, Report)
  related_entity_type: {
    type: String,
    enum: ['User', 'Job', 'Application', 'Message', 'Report'],
    default: null
  },
  // ID của đối tượng liên quan có thể là User ID, Job ID, v.v.
  related_entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  // Hash checksum của file để kiểm tra tính toàn vẹn.
  checksum: {
    type: String,
    trim: true
  },
  // Nhà cung cấp lưu trữ file
  storage_provider: {
    type: String,
    enum: ['local', 'aws_s3', 'google_cloud', 'azure'],
    default: 'local'
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for file queries
// Lấy tất cả file của user, sắp xếp theo thời gian tạo mới nhất
fileUploadSchema.index({ user_id: 1, created_at: -1 });
// Lấy file theo mục đích tải lên
fileUploadSchema.index({ upload_purpose: 1 });
// Lấy file tạm thời để dễ dàng xóa định kỳ
fileUploadSchema.index({ is_temporary: 1, expires_at: 1 });
// Lấy file theo đối tượng liên quan
fileUploadSchema.index({ related_entity_type: 1, related_entity_id: 1 });

// TTL index for temporary files
// Tự động xóa file tạm thời khi đến thời gian hết hạn
fileUploadSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('FileUpload', fileUploadSchema);
