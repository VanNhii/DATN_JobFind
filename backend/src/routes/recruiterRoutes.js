const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getRecruiters,
  createRecruiter,
  updateRecruiter,
  deleteRecruiter,
  getRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
} = require("../controllers/recruiterController");

const router = express.Router();

router.get("/profile", protect, authorize("recruiter"), getRecruiterProfile);
router.put("/profile", protect, authorize("recruiter"), updateRecruiterProfile);
// Tổng quan routes
router
  .route("/")
  .get(protect, authorize("admin"), getRecruiters) // Lấy tất cả nhà tuyển dụng
  .post(protect, authorize("recruiter"), createRecruiter); // Tạo nhà tuyển dụng mới admin kh có quyềnh truy cập vì
// Ở đây đang theo logic là chỉ có người dùng với vai trò 'recruiter' mới có thể tạo hồ sơ nhà tuyển dụng của riêng họ.
//Lấy id từ người dùng đã đăng nhập và gán nó vào trường user_id của hồ sơ nhà tuyển dụng mới tạo.
// Routes cho các thao tác trên nhà tuyển dụng cụ thể
router
  .route("/:id")
  .get(getRecruiter) // Lấy thông tin nhà tuyển dụng cụ thể
  .put(protect, authorize("recruiter", "admin"), updateRecruiter)
  .delete(protect, authorize("recruiter", "admin"), deleteRecruiter);

module.exports = router;
