const { get } = require("mongoose");
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Interview = require("../models/Interview");
const RecruiterSubscription = require("../models/RecruiterSubscription");
const {
  getPaginationParams,
  applyPagination,
  buildPaginationResponse,
  getSearchParams,
  getDateRangeFilter,
} = require("../utils/pagination");

// @desc    Get all recruiters
// @route   GET /api/v1/recruiters
// @access  Private/Admin
exports.getRecruiters = async (req, res, next) => {
  try {
    const recruiters = await Recruiter.find() // Lấy tất cả nhà tuyển dụng
      .populate(
        "user_id",
        "first_name last_name email phone avatar_url full_name is_verified is_active"
      ) // Lấy thông tin người dùng liên quan
      .populate("jobs subscriptions") // Lấy thông tin các công việc và gói đăng ký liên quan trong recruiterController
      .sort("-created_at"); // Sắp xếp theo ngày tạo giảm dần

    res.status(200).json({
      success: true,
      count: recruiters.length,
      data: recruiters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recruiter
// @route   GET /api/v1/recruiters/:id
// @access  Public
// của 1 ngươi dùng cụ thể recruiter cụ thể
exports.getRecruiter = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .populate(
        "user_id",
        "first_name last_name email phone avatar_url full_name is_verified is_active"
      )
      .populate("jobs subscriptions");
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }
    res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create recruiter
// @route   POST /api/v1/recruiters
// @access  Private
exports.createRecruiter = async (req, res, next) => {
  try {
    // Gán user_id từ người dùng đã xác thực từ Client đến người dùng mới tạo
    req.body.user_id = req.user.id;
    //"Hãy lấy cái ID của người đang đăng nhập, và nhét (gán) nó vào trong gói dữ liệu req.body dưới cái tên là user_id."
    const recruiter = await Recruiter.create(req.body);

    res.status(201).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruiter
// @route   PUT /api/v1/recruiters/:id
// @access  Private
exports.updateRecruiter = async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findById(req.params.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }

    // Kiểm tra quyền sở hữu
    // Điều kiện 1: !recruiter.user_id.equals(req.user.id) -> ID chủ sở hữu hồ sơ KHÁC ID của người đang đăng nhập. (Nghĩa là: Anh đang định sửa hồ sơ của người khác).
    // Điều kiện 2: req.user.role !== 'admin' -> Anh KHÔNG PHẢI là Admin.
    if (!recruiter.user_id.equals(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this recruiter",
      });
    }

    // Nên nhớ findByIdAndUpdate nhận vào 3 tham số: id, data để cập nhật, options
    recruiter = await Recruiter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // đảm bảo các validators trong schema được chạy khi cập nhật
    });

    res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recruiter
// @route   DELETE /api/v1/recruiters/:id
// @access  Private
exports.deleteRecruiter = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }
    // Kiểm tra quyền sở hữu chuyển đổi id sang chuỗi để so sánh
    if (
      recruiter.user_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this recruiter",
      });
    }

    await recruiter.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter profile (own profile)
// @route   GET /api/recruiters/profile
// @access  Private/Recruiter

exports.getRecruiterProfile = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id })
      .populate(
        "user_id",
            "first_name last_name email phone avatar_url full_name is_verified is_active"
      )
      .populate("jobs")
      .populate("subscriptions");
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private/Recruiter
exports.updateRecruiterProfile = async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    recruiter = await Recruiter.findByIdAndUpdate(recruiter._id, req.body, {
      new: true,
      runValidators: true
    }).populate('user_id', 'first_name last_name email phone avatar_url full_name is_verified is_active');
    
    res.status(200).json({
      success: true,
      data: recruiter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/recruiters/jobs
// @access  Private/Recruiter

exports.getRecruiterJobs = async (req, res, next) => {
    try {
        const { page , limit, skip} = getPaginationParams(req);
        const searchFilters = getSearchParams(req);
        const { status, is_active } = req.query;

        const recruiter = await Recruiter.findOne({ user_id: req.user.id });
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                error: "Recruiter profile not found",
            });
        }

        const query = { 
        recruiter_id: recruiter._id,
        ...searchFilters 
        };

        if (status) query.status = status;
        if (is_active !== undefined) query.is_active = is_active === 'true';
    } catch (error) {
        
    }
};
// Tạo API cho Job đã
// @desc    Get recruiter's jobs
// @route   GET /api/recruiters/jobs
// @access  Private/Recruiter

exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const searchFilters = getSearchParams(req);
    const { status, is_active } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const query = { 
      recruiter_id: recruiter._id,
      ...searchFilters 
    };
    
    if (status) query.status = status;
    if (is_active !== undefined) query.is_active = is_active === 'true';
    
    const jobsQuery = Job.find(query)
      .populate('category_id', 'name')
      .populate({
        path: 'applications',
        select: 'candidate_id application_status created_at',
        populate: {
          path: 'candidate_id',
          select: 'bio experience_years',
          populate: {
            path: 'user_id',
            select: 'first_name last_name email phone avatar_url full_name'
          }
        }
      });
    
    const jobs = await applyPagination(jobsQuery, page, limit, skip);
    const total = await Job.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(jobs, total, page, limit));
  } catch (error) {
    next(error);
  }
};

//TẠO API CHO ỨNG TUYỂN VÀ PHỎNG VẤN CỦA NHÀ TUYỂN DỤNG
// @desc    Get recruiter's applications
// @route   GET /api/recruiters/applications
// @access  Private/Recruiter
exports.getRecruiterApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { status } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    // Get all jobs by this recruiter
    const jobs = await Job.find({ recruiter_id: recruiter._id }).select('_id');
    const jobIds = jobs.map(job => job._id);
    
    const query = { job_id: { $in: jobIds } };
    if (status) query.application_status = status;
    
    const applicationsQuery = Application.find(query)
      .populate('job_id', 'title')
      .populate('candidate_id', 'bio experience_years')
      .populate({
        path: 'candidate_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email phone avatar_url full_name'
        }
      })
      .sort('-created_at');
    
    const applications = await applyPagination(applicationsQuery, page, limit, skip);
    const total = await Application.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(applications, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's interviews
// @route   GET /api/recruiters/interviews
// @access  Private/Recruiter
exports.getRecruiterInterviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const dateFilters = getDateRangeFilter(req);
    const { status } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const query = { 
      recruiter_id: recruiter._id,
      ...dateFilters 
    };
    
    if (status) query.status = status;
    
    const interviewsQuery = Interview.find(query)
      .populate({
        path: 'application_id',
        populate: {
          path: 'job_id',
          select: 'title'
        }
      })
      .populate({
        path: 'candidate_id',
        select: 'bio experience_years',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email phone avatar_url full_name'
        }
      })
      .sort('interview_date');
    
    const interviews = await applyPagination(interviewsQuery, page, limit, skip);
    const total = await Interview.countDocuments(query);
    
    res.status(200).json(buildPaginationResponse(interviews, total, page, limit));
  } catch (error) {
    next(error);
  }
};
// ------------------------- TRANG DASHBOARD NHÀ TUYỂN DỤNG ------------------------- //
// @desc    Get recruiter dashboard statistics
// @route   GET /api/recruiters/dashboard
// @access  Private/Recruiter
exports.getRecruiterDashboard = async (req, res, next) => {
  console.log('Fetching recruiter dashboard stats...',req.user);
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    // Get basic stats
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      totalInterviews,
      upcomingInterviews
    ] = await Promise.all([
      Job.countDocuments({ recruiter_id: recruiter._id }),
      Job.countDocuments({ recruiter_id: recruiter._id, is_active: true, status: 'approved' }),
      Application.countDocuments({ 
        job_id: { $in: await Job.find({ recruiter_id: recruiter._id }).select('_id') }
      }),
      Application.countDocuments({ 
        job_id: { $in: await Job.find({ recruiter_id: recruiter._id }).select('_id') },
        application_status: 'pending'
      }),
      Interview.countDocuments({ recruiter_id: recruiter._id }),
      Interview.countDocuments({ 
        recruiter_id: recruiter._id,
        interview_date: { $gte: new Date() },
        interview_status: 'scheduled'
      })
    ]);
    
    // Get recent applications
    const jobIds = await Job.find({ recruiter_id: recruiter._id }).select('_id');
    const recentApplications = await Application.find({ 
      job_id: { $in: jobIds }
    })
    .populate('job_id', 'title')
    .populate('candidate_id', 'bio experience_years')
    .sort('-created_at')
    .limit(5);
    
    // Get subscription status
    const subscriptionStatus = await getSubscriptionStatus(recruiter._id);
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          totalInterviews,
          upcomingInterviews
        },
        recentApplications,
        subscription: subscriptionStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- HELPER FUNCTION TO GET SUBSCRIPTION STATUS ------------- //

// @desc    Get recruiter's notifications
// @route   GET /api/recruiters/notifications
// @access  Private/Recruiter
exports.getRecruiterNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { is_read } = req.query;
    
    const query = { user_id: req.user.id };
    if (is_read !== undefined) query.is_read = is_read === 'true';
    
    const notificationsQuery = Notification.find(query)
      .sort('-created_at');
    
    const notifications = await applyPagination(notificationsQuery, page, limit, skip);
    const total = await Notification.countDocuments(query);
    
    // Mark as read if requested
    if (req.query.mark_as_read === 'true') {
      await Notification.updateMany(
        { user_id: req.user.id, is_read: false },
        { is_read: true, read_at: new Date() }
      );
    }
    
    res.status(200).json(buildPaginationResponse(notifications, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's subscription history
// @route   GET /api/recruiters/subscriptions
// @access  Private/Recruiter
exports.getRecruiterSubscriptions = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const subscriptions = await RecruiterSubscription.find({ 
      recruiter_id: recruiter._id 
    })
    .populate('service_plan_id')
    .sort('-created_at');
    
    console.log(subscriptions.length); 
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current active subscription
// @route   GET /api/recruiters/subscription/current
// @access  Private/Recruiter
exports.getCurrentSubscription = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    const currentSubscription = await RecruiterSubscription.findOne({ 
      recruiter_id: recruiter._id,
      subscription_status: 'active',
      end_date: { $gt: new Date() }
    })
    .populate('service_plan_id')
    .sort({ end_date: -1 });
    
    let usage = null;
    if (currentSubscription && currentSubscription.service_plan_id) {
      const plan = currentSubscription.service_plan_id;
      usage = {
        job_postings_used: currentSubscription.features_used?.job_posts_used || 0,
        job_postings_limit: plan.features?.job_posts_limit || 0,
        cv_download_used: currentSubscription.features_used?.cv_downloads_used || 0,
        cv_download_limit: plan.features?.cv_downloads || 0,
        candidate_search_used: 0, // Implement based on your tracking
        candidate_search_limit: plan.features?.candidate_search ? -1 : 0 // -1 means unlimited
      };
    }
    console.log(currentSubscription);
    res.status(200).json({
      success: true,
      data: currentSubscription ? {
        ...currentSubscription.toObject(),
        usage
      } : null
    });
  } catch (error) {
    next(error);
  }
};
