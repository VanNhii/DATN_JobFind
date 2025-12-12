const Job = require("../models/Job");
const JobCategory = require("../models/JobCategory");
const Recruiter = require("../models/Recruiter");
const {
  getPaginationParams,
  getSearchParams,
  applyPagination,
  buildPaginationResponse,
} = require("../utils/pagination");

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const searchFilters = getSearchParams(req);

    // chỉ lấy các công việc đang hoạt động và đã được phê duyệt
    // Sau đó áp dụng các bộ lọc tìm kiếm bổ sung nếu có
    const query = { is_active: true, status: "approved", ...searchFilters };

    // Additional filters
    if (req.query.category) {
      query.category_id = req.query.category;
    }

    if (req.query.job_type) {
      query.job_type = req.query.job_type;
    }

    if (req.query.work_location) {
      query.work_location = req.query.work_location;
    }

    if (req.query.salary_min) {
      query.salary_min = { $gte: parseInt(req.query.salary_min) };
    }

    if (req.query.salary_max) {
      query.salary_max = { $lte: parseInt(req.query.salary_max) };
    }

    // Location filter
    if (req.query.location) {
      query["location.city"] = { $regex: req.query.location, $options: "i" };
    }

    const jobsQuery = Job.find(query)
      .populate("category_id", "name")
      .populate("recruiter_id", "company_name company_logo_url industry")
      .select("-applications -interviews")
      .sort("-created_at");

    const jobs = await applyPagination(jobsQuery, page, limit, skip);
    const total = await Job.countDocuments(query); // Hàm đếm tổng số tài liệu phù hợp với truy vấn

    res.status(200).json(buildPaginationResponse(jobs, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("category_id", "name")
      .populate(
        "recruiter_id",
        "company_name company_description company_logo_url industry website company_size"
      )
      .populate({
        path: "applications",
        select: "candidate_id application_status created_at",
        populate: {
          path: "candidate_id",
          select: "full_name",
        },
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Chỉ hiển thị ứng tuyển cho chủ sở hữu tin tuyển dụng hoặc admin
    if (
      req.user &&
      (req.user.role === "admin" ||
        (req.user.role === "recruiter" &&
          job.recruiter_id.user_id.toString() === req.user.id))
    ) {
      // Giữ lại applications (đã được populate)
    } else {
      // Ẩn applications khỏi chế độ xem công khai
      job.applications = undefined;
    }

    // Tăng số lượt xem views_count khi có người xem chi tiết công việc
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views_count: 1 } });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/v1/jobs
// @access  Private/Recruiter
exports.createJob = async (req, res, next) => {
  try {
    // cho phép chỉ recruiter đã đăng ký mới được đăng tin tuyển dụng
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    req.body.recruiter_id = recruiter._id;
    req.body.status = "pending"; // Mặc định trạng thái là pending chờ duyệt cho job mới

    const job = await Job.create(req.body);

    // Lấy thông tin job với thông tin của recruiter
    await job.populate("category_id", "name");
    await job.populate("recruiter_id", "company_name ");

    res.status(201).json({
      success: true,
      data: job,
      subscriptionInfo: req.jobStats, // Thông tin về gói đăng ký và giới hạn bài đăng công việc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private/Recruiter
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Kiểm tra quyền sở hữu của recruiter với job này
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    // Nếu không phải chủ sở hữu hoặc không phải admin thì không được phép cập nhật
    if (
      job.recruiter_id.toString() !== recruiter._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("category_id", "name")
      .populate("recruiter_id", "company_name ");

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private/Recruiter

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Kiểm tra quyền sở hữu của recruiter với job này
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    // Nếu không phải chủ sở hữu hoặc không phải admin thì không được phép xóa
    if (
      job.recruiter_id.toString() !== recruiter._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }
    await job.deleteOne();
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
