const express = require("express");
const {
  getCandidates,
  createCandidate,
  getCandidate,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

const { authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(authorize("recruiter", "admin"), getCandidates)
  .post(authorize("candidate"), createCandidate);

router
  .route("/:id")
  .get(getCandidate)
  .put(authorize("candidate", "admin"), updateCandidate)
  .delete(authorize("candidate", "admin"), deleteCandidate);

module.exports = router;
