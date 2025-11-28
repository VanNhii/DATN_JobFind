const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Tiêu đề tin nhắn
  subject: {
    type: String,
    required: [true, 'Please add message subject'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  // Nội dung tin nhắn
  content: {
    type: String,
    required: [true, 'Please add message content'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  // Trạng thái đã đọc
  is_read: {
    type: Boolean,
    default: false
  },
  // Loại tin nhắn (ví dụ tin nhắn chung, mời phỏng vấn, hỏi về công việc…)
  message_type: {
    type: String,
    enum: ['general', 'interview_invitation', 'job_inquiry', 'application_followup', 'offer_negotiation'],
    default: 'general'
  },
  // Tin nhắn liên quan đến đơn ứng tuyển 
  related_application_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    default: null
  },
  // Tin nhắn liên quan đến công việc cụ thể
  related_job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    default: null
  },
  // Tệp đính kèm
  attachments: [{
    file_name: {
      type: String,
      required: true
    },
    file_url: {
      type: String,
      required: true
    },
    file_size: {
      type: Number,
      required: true
    }
  }],
  // Thời gian gửi và đọc tin nhắn
  sent_at: {
    type: Date,
    default: Date.now
  },
  // Thời gian đọc tin nhắn
  read_at: {
    type: Date,
    default: null
  },
  // Nếu tin nhắn này là trả lời một tin nhắn khác, lưu ID tin nhắn đó.
  replied_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Populate sender and receiver data
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender_id',
    select: 'full_name email avatar_url role'
  }).populate({
    path: 'receiver_id',
    select: 'full_name email avatar_url role'
  });
  next();
});

// Index for message queries
messageSchema.index({ receiver_id: 1, sent_at: -1 });
messageSchema.index({ sender_id: 1, sent_at: -1 });
messageSchema.index({ is_read: 1 });
messageSchema.index({ message_type: 1 });

module.exports = mongoose.model('Message', messageSchema);
