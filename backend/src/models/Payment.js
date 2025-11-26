const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    recruiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    subscription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecruiterSubscription",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },

    payment_method: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
      required: [true, "Payment method is required"],
    },

    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    // Thông tin phản hồi từ cổng thanh toán
    gateway_response: {
      // Ví dụ: Mã giao dịch từ cổng thanh toán tên cổng thanh toán
      gateway: {
        type: String,
        trim: true,
      },
      // Mã giao dịch do cổng thanh toán cung cấp
      transaction_ref: {
        type: String,
        trim: true,
      },
      // Mã phản hồi từ cổng thanh toán
      response_code: {
        type: String,
        trim: true,
      },
      // Thông điệp phản hồi từ cổng thanh toán
      response_message: {
        type: String,
        trim: true,
      },
      //Có thể lưu trữ toàn bộ phản hồi thô từ cổng thanh toán để tham khảo sau này, Loại dữ liệu nào cũng được
      raw_response: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
    // Chi tiết thanh toán bổ sung tùy thuộc vào phương thức thanh toán
    payment_details: {
      // 4 số cuối của thẻ tín dụng nếu thanh toán bằng thẻ
      card_last_four: {
        type: String,
        match: [/^\d{4}$/, "Card last four must be 4 digits"],
      },
      // Loại thẻ tín dụng: visa, mastercard, amex, discover, jcb
      card_brand: {
        type: String,
        enum: ["visa", "mastercard", "amex", "discover", "jcb"],
      },
      // Tên ngân hàng nếu thanh toán bằng chuyển khoản ngân hàng
      bank_name: {
        type: String,
        trim: true,
      },
    },
    // Thời gian xử lý thanh toán
    processed_at: {
      type: Date,
      default: null,
    },
    // Lý do thất bại nếu thanh toán không thành công
    failed_reason: {
      type: String,
      default: null,
      maxlength: [300, "Failed reason cannot exceed 300 characters"],
    },
    // Thông tin hoàn tiền nếu có
    refund_amount: {
      type: Number,
      default: 0,
      min: [0, "Refund amount cannot be negative"],
      default: null,
    },

    // Thời gian hoàn tiền nếu có
    refunded_at: {
      type: Date,
      default: null,
    },

    //Xác định xem thanh toán có phải là định kỳ hay không
    is_recurring: {
      type: Boolean,
      default: false,
    },
    // Chu kỳ thanh toán định kỳ: hàng tháng, hàng quý, hàng năm
    billing_cycle: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
    },
    // Ngày thanh toán tiếp theo cho thanh toán định kỳ
    next_billing_date: {
      type: Date,
      default: null,
    },
    // Tự động gia hạn thanh toán định kỳ
    auto_renew: {
      type: Boolean,
      default: false,
    },

    //Lưu Thông tin hóa đơn liên quan đến thanh toán
    invoice: {
      // Số hóa đơn
      invoice_number: {
        type: String,
        unique: true,
        sparse: true,
      },
      // Ngày phát hành hóa đơn
      invoice_date: {
        type: Date,
        default: null,
      },
      // URL tải hóa đơn
      invoice_url: {
        type: String,
        trim: true,
      },
      // Số tiền thuế
      tax_amount: {
        type: Number,
        min: [0, "Tax amount cannot be negative"],
        default: 0,
      },
      // Tỷ lệ thuế áp dụng
      tax_rate: {
        type: Number,
        min: [0, "Tax rate cannot be negative"],
        max: [100, "Tax rate cannot exceed 100%"],
        default: 10, // 10% VAT default for Vietnam
      },
      // Trạng thái hóa đơn
      invoice_status: {
        type: String,
        enum: ["not_issued", "issued", "sent", "cancelled"],
        default: "not_issued",
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
// Tạo các chỉ mục để tối ưu hóa truy vấn
// chỉ mục này giúp tìm kiếm các thanh toán của nhà tuyển dụng theo thời gian tạo gần nhất
paymentSchema.index({ recruiter_id: 1, created_at: -1 });
// chỉ mục này giúp tìm kiếm các thanh toán theo trạng thái thanh toán
paymentSchema.index({ payment_status: 1 });
// chỉ mục này giúp tìm kiếm các thanh toán theo thời gian xử lý
paymentSchema.index({ processed_at: -1 });

// Populate recruiter data
paymentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'recruiter_id',
    select: 'company_name user_id',
    populate: {
      path: 'user_id',
      select: 'full_name email'
    }
  }).populate({
    path: 'subscription_id',
    select: 'plan_type start_date end_date'
  });
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);