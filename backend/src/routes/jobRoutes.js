const express = require('express');
const { protect, authorize, optionalAuth } = require('../middlewares/auth');
const { checkJobPostingLimit } = require('../middleware/subcriptions');
const { getJobs, createJob, getJob, deleteJob, updateJob } = require('../controllers/jobController');

const router = express.Router();

router
    .route('/')
    .get(optionalAuth, getJobs) // Lấy danh sách công việc với tùy chọn xác thực
    .post(protect, authorize("recruiter", "admin"),checkJobPostingLimit, createJob); 
router
    .route('/:id')
    .get(optionalAuth, getJob)
    .put(protect, authorize("recruiter", "admin"), updateJob)
    .delete(protect, authorize("recruiter", "admin"), deleteJob);
    
module.exports = router;

