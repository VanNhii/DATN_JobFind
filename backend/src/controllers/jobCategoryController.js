const JobCategory = require("../models/JobCategory");
const Job = require("../models/Job");

const { getPaginationParams, getSearchParams, applyPagination, buildPaginationResponse } = require("../utils/pagination");

// @desc    Get all job categories
// @route   GET /api/v1/job-categories
// @access  Public
exports.getJobCategories = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const searchFilters = getSearchParams(req);
    const { parent_only, include_subcategories, is_active } = req.query;
    
    let query = { ...searchFilters };
    
    // Lọc với trạng thái is_active nếu được cung cấp
    if (is_active !== undefined) {
      query.is_active = is_active === 'true'; // so sánh chuỗi với 'true' để chuyển đổi thành boolean 
    } else {
      query.is_active = true; // Mặc định chỉ lấy các danh mục đang hoạt động
    }
    
    // Lọc chỉ lấy danh mục cha nếu parent_only được đặt
    if (parent_only === 'true') {
      query.parent_category_id = null;
    }
    
    // Danh sách đơn giản không phân trang (cho dropdown, v.v.)
    if (req.query.simple === 'true') {
      const categories = await JobCategory.find(query)
        .select('category_name _id parent_category_id')
        .sort('sort_order category_name');
      
      return res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    }
    // Danh sách đầy đủ với phân trang
    let categoriesQuery = JobCategory.find(query);
    
    // Bao gồm danh mục con nếu được yêu cầu
    if (include_subcategories === 'true') {
      categoriesQuery = categoriesQuery.populate('subcategories');
    }
    
    // Bao gồm số lượng công việc
    categoriesQuery = categoriesQuery.populate('jobs_count');
    
    const categories = await applyPagination(categoriesQuery, page, limit, skip);
    const total = await JobCategory.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(categories, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job category
// @route   GET /api/v1/job-categories/:id
// @access  Public
exports.getJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findById(req.params.id)
      .populate('subcategories jobs_count');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Job category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job category
// @route   POST /api/v1/job-categories
// @access  Private/Admin
exports.createJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.create(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job category
// @route   PUT /api/v1/job-categories/:id
// @access  Private/Admin
exports.updateJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Job category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job category
// @route   DELETE /api/v1/job-categories/:id
// @access  Private/Admin
exports.deleteJobCategory = async (req, res, next) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Job category not found'
      });
    }
    
    // Kiểm tra nếu danh mục có danh mục con
    const subcategories = await JobCategory.find({ parent_category_id: category._id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete subcategories first.'
      });
    }
    
    // Kiểm tra nếu danh mục có công việc liên quan
    const jobsCount = await Job.countDocuments({ category_id: category._id });
    if (jobsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${jobsCount} associated jobs. Please reassign jobs first.`
      });
    }
    
    await category.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Job category deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};


