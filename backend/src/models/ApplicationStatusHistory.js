const mongoose = require("mongoose");

const applicationStatusHistorySchema = new mongoose.Schema({
    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
    },

    old_status: {
        type: String,
        enum: ["pending", "reviewing", "shortlisted", "interviewed", "offered", "rejected", "withdrawn"],
        required: true
    },

    new_status: {
        type: String,
        enum: ["pending", "reviewing", "shortlisted", "interviewed", "offered", "rejected", "withdrawn"],
        required: true
    },

    changed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    change_reason: {
        type: String,
        maxlength: [500, "Change reason cannot exceed 500 characters"],
    },

    changed_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: {
        createdAt: 'changed_at',
        updatedAt: 'updated_at'
    }
});
//Để tìm kiếm lịch sử thay đổi trạng thái của một đơn ứng tuyển cụ thể theo thời gian gần nhất
applicationStatusHistorySchema.index({ application_id: 1, changed_at: -1 });

module.exports = mongoose.model("ApplicationStatusHistory", applicationStatusHistorySchema);