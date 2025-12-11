const express = require("express");
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateProfile,
  updateCandidateProfile,
  getCandidateApplications,
  getCandidateInterviews,
  searchJobs,
  getCandidateDashboard,
  getCandidateNotifications,
  getCandidateExperiences,
  addCandidateExperience,
  updateCandidateExperience,
  deleteCandidateExperience,
  getCandidateEducations,
  addCandidateEducation,
  updateCandidateEducation,
  deleteCandidateEducation,
  getCandidateSkills,
  addCandidateSkill,
  updateCandidateSkill,
  deleteCandidateSkill,
  applyForJob,
  withdrawApplication,
  getSavedJobs,
  saveJob,
  unsaveJob,
  updateSalaryExpectation,
  updateJobStatus,
} = require("../controllers/candidateController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // Bảo vệ tất cả các route bên dưới

// Routes cụ thể phải đặt TRƯỚC routes có parameter (:id)
router.get("/profile", authorize("candidate"), getCandidateProfile); // Ứng viên xem hồ sơ của chính họ
router.put("/profile", authorize("candidate"), updateCandidateProfile); // Ứng viên cập nhật hồ sơ của chính họ
router.get("/applications", authorize("candidate"), getCandidateApplications); // Ứng viên xem các đơn ứng tuyển của họ
router.get("/interviews", authorize("candidate"), getCandidateInterviews); // Ứng viên xem các lịch phỏng vấn của họ
router.get("/jobs/search", authorize("candidate"), searchJobs); // Ứng viên tìm kiếm công việc
router.get("/dashboard", authorize("candidate"), getCandidateDashboard); // Ứng viên xem dashboard của họ
router.get("/notifications", authorize("candidate"), getCandidateNotifications); // Ứng viên xem thông báo của họ
router.get("/experiences", authorize("candidate"), getCandidateExperiences); // Ứng viên xem kinh nghiệm làm việc của họ
router.post("/experiences", authorize("candidate"), addCandidateExperience); // Ứng viên thêm kinh nghiệm làm việc của họ
router.put(
  "/experiences/:experienceId",
  authorize("candidate"),
  updateCandidateExperience
); // Ứng viên cập nhật kinh nghiệm làm việc của họ
router.delete(
  "/experiences/:experienceId",
  authorize("candidate"),
  deleteCandidateExperience
); // Ứng viên xóa kinh nghiệm làm việc của họ
router.get("/educations", authorize("candidate"), getCandidateEducations); // Ứng viên xem trình độ học vấn của họ
router.post("/educations", authorize("candidate"), addCandidateEducation); // Ứng viên thêm trình độ học vấn của họ
router.put(
  "/educations/:educationId",
  authorize("candidate"),
  updateCandidateEducation
); // Ứng viên cập nhật trình độ học vấn của họ
router.delete(
  "/educations/:educationId",
  authorize("candidate"),
  deleteCandidateEducation
); // Ứng viên xóa trình độ học vấn của họ
router.get("/skills", authorize("candidate"), getCandidateSkills); // Ứng viên xem kỹ năng của họ
router.post("/skills", authorize("candidate"), addCandidateSkill); // Ứng viên thêm kỹ năng của họ
router.put("/skills/:skillId", authorize("candidate"), updateCandidateSkill); // Ứng viên cập nhật kỹ năng của họ
router.delete("/skills/:skillId", authorize("candidate"), deleteCandidateSkill); // Ứng viên xóa kỹ năng của họ
router.post("/jobs/:jobId/apply", authorize("candidate"), applyForJob); // Ứng viên nộp đơn ứng tuyển cho công việc
router.post(
  "/applications/:applicationId/withdraw",
  authorize("candidate"),
  withdrawApplication
); // Ứng viên rút đơn ứng tuyển
router.get("/jobs/saved", authorize("candidate"), getSavedJobs); // Ứng viên xem công việc đã lưu
router.post("/jobs/:jobId/save", authorize("candidate"), saveJob); // Ứng viên lưu công việc
router.post("/jobs/:jobId/unsave", authorize("candidate"), unsaveJob); // Ứng viên bỏ lưu công việc
router.put(
  "/salary-expectation",
  authorize("candidate"),
  updateSalaryExpectation
); // Ứng viên cập nhật mong muốn lương của họ
router.put("/job-status", authorize("candidate"), updateJobStatus); // Ứng viên cập nhật trạng thái tìm việc của họ

// Routes CRUD cho Candidate
router
  .route("/")
  .get(authorize("recruiter", "admin"), getCandidates) // Chỉ recruiter và admin mới được xem danh sách ứng viên
  .post(authorize("admin"), createCandidate); // Chỉ admin mới được tạo ứng viên

router
  .route("/:id")
  .get(getCandidate) // Tất cả người dùng đã xác thực đều có thể xem chi tiết ứng viên
  .put(authorize("candidate"), updateCandidate) // Chỉ candidate mới được cập nhật ứng viên
  .delete(authorize("admin", "candidate"), deleteCandidate); // Chỉ admin, candidate mới được xóa ứng viên

module.exports = router;
