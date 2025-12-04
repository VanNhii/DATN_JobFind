const express = require("express");
const {
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

const router = express.Router();

router.use(protect); // Bảo vệ tất cả các route bên dưới bằng middleware xác thực

// Định nghĩa các route cho ứng viên
// route: GET /api/v1/candidates
// access: private, admin, recruiter
router.route("/").get(authorize("admin", "recruiter"), getCandidates);

// route: GET, PUT, DELETE /api/v1/candidates/:id
router
  .route("/:id")
  .get(getCandidateById)
  .put(authorize("candidate", "admin"), updateCandidate)
  .delete(authorize("admin", "candidate"), deleteCandidate);

module.exports = router;
