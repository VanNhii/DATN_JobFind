const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: [true, 'Please add notification title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },

  message: {
    type: String,
    required: [true, 'Please add notification message'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  // Loại thông báo
  notification_type: {
    type: String,
    enum: ['application_update', 'interview_reminder', 'job_recommendation', 'candidate_recommendation', 'system_announcement', 'payment_reminder'],
    required: [true, 'Please specify notification type']
  },
  is_read: {
    type: Boolean,
    default: false
  },
  // Liên quan đến đối tượng nào
  related_entity_type: {
    type: String,
    enum: ['Job', 'Application', 'Interview', 'AIJobRecommendation', 'AICandidateRecommendation', 'Payment', 'User'],
    default: null
  },
  // ID của đối tượng liên quan có thể là Job ID, Application ID, v.v.
  related_entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  //URL khi user click vào thông báo Cho phép chuyển hướng tùy chỉnh
  action_url: {
    type: String,
    trim: true
  },
  // Mức độ ưu tiên của thông báo
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Nhóm các thông báo tương tự lại với nhau dựa trên user và loại thông báo
  group_id: {
    type: String,
    trim: true,
    default: null
  },
  // Số lượng thông báo đã gộp nhiều tbao lại chưa
  is_grouped: {
    type: Boolean,
    default: false
  },
  // Số lượng thông báo nhóm đã được gộp lại
  group_count: {
    type: Number,
    default: 1,
    min: [1, 'Group count must be at least 1']
  },

  read_at: {
    type: Date,
    default: null
  },

  expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Index for notification queries
// Lấy tất cả thông báo của user, sắp xếp theo thời gian tạo mới nhất
notificationSchema.index({ user_id: 1, created_at: -1 });
// Lấy tất cả thông báo chưa đọc của user
notificationSchema.index({ user_id: 1, is_read: 1 });
// Lấy thông báo theo loại
notificationSchema.index({ notification_type: 1 });
// Lấy thông báo theo thời gian hết hạn
notificationSchema.index({ expires_at: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
