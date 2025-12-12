const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getJobCategories);
router.get('/:id', getJobCategory);

// áp dụng bảo vệ và ủy quyền cho các tuyến đường bên dưới
router.use(protect);
router.use(authorize('admin'));

// không cần middleware riêng vì đã áp dụng ở trên
router.post('/', logAdminAction('create_job_category'), createJobCategory);
router.put('/:id', logAdminAction('update_job_category'), updateJobCategory);
router.delete('/:id', logAdminAction('delete_job_category'), deleteJobCategory);

module.exports = router;
