const RecruiterSubscription = require('../models/RecruiterSubscription');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');

// Kiểm tra xem recruiter có đăng ký gói dịch vụ hay không
exports.checkActiveSubscription = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return next();
    }

    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Kiểm tra gói đăng ký đang hoạt động
    const activeSubscription = await RecruiterSubscription.findOne({
      recruiter_id: recruiter._id,
      payment_status: 'paid',
      end_date: { $gt: new Date() }
    }).sort({ end_date: -1 });

    if (!activeSubscription) {
      return res.status(403).json({     
        success: false,
        message: 'No active subscription found. Please upgrade your plan to continue.',
        code: 'SUBSCRIPTION_REQUIRED' // Mã lỗi tùy chỉnh
      });
    }

    req.subscription = activeSubscription;
    req.recruiter = recruiter;
    next();
  } catch (error) {
    next(error);
  }
};

// Check job posting limits
exports.checkJobPostingLimit = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return next();
    }

    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Get active subscription or use basic plan limits
    let jobPostsLimit = 3; // Free plan limit
    // let planType = 'basic', cần nên xem lại có chỉnh sửa trong models/ServicePlan.js
    let planType = 'free'; // Nên thay bằng 'basic' nếu cần đồng bộ với các loại gói khác
    // Kiểm tra gói premium
    const activeSubscription = await RecruiterSubscription.findOne({
      recruiter_id: recruiter._id,
      payment_status: 'paid',
      end_date: { $gt: new Date() }
    }).sort({ end_date: -1 });
    //Nếu có activeSubscription thì sẽ ghi đè giới hạn bài đăng công việc
    if (activeSubscription) {
      jobPostsLimit = activeSubscription.features.job_posts_limit;
      planType = activeSubscription.plan_type;
    }

    // Count current active jobs
    const currentJobsCount = await Job.countDocuments({
      recruiter_id: recruiter._id,
      is_active: true,
      status: { $in: ['approved', 'pending'] }
    });

    if (currentJobsCount >= jobPostsLimit) {
      return res.status(403).json({
        success: false,
        message: `You have reached your job posting limit (${jobPostsLimit} jobs for ${planType} plan). Please upgrade your subscription or deactivate some jobs.`,
        code: 'JOB_LIMIT_EXCEEDED',
        data: {
          currentJobs: currentJobsCount,
          limit: jobPostsLimit,
          planType: planType
        }
      });
    }

    req.recruiter = recruiter;
    req.subscription = activeSubscription;
    req.jobStats = {
      currentJobs: currentJobsCount,
      limit: jobPostsLimit,
      planType: planType,
      remaining: jobPostsLimit - currentJobsCount
    };

    next();
  } catch (error) {
    next(error);
  }
};

// được xem ứng viên khi đăng ký gói 
exports.checkCandidateSearchPermission = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return next();
    }

    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Check for active subscription with candidate search feature
    const activeSubscription = await RecruiterSubscription.findOne({
      recruiter_id: recruiter._id,
      payment_status: 'paid',
      end_date: { $gt: new Date() },
      'features.candidate_search': true
    }).sort({ end_date: -1 });

    if (!activeSubscription) {
      return res.status(403).json({
        success: false,
        message: 'Candidate search feature requires a premium subscription. Please upgrade your plan.',
        code: 'PREMIUM_FEATURE_REQUIRED'
      });
    }

    req.subscription = activeSubscription;
    req.recruiter = recruiter;
    next();
  } catch (error) {
    next(error);
  }
};

// Check CV download permission
exports.checkCVDownloadPermission = async (req, res, next) => {
  try {
    if (req.user.role !== 'recruiter') {
      return next();
    }

    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }

    // Get active subscription or use basic plan limits
    let cvDownloadsLimit = 5; // Free plan limit
    
    const activeSubscription = await RecruiterSubscription.findOne({
      recruiter_id: recruiter._id,
      payment_status: 'paid',
      end_date: { $gt: new Date() }
    }).sort({ end_date: -1 });

    if (activeSubscription) {
      cvDownloadsLimit = activeSubscription.features.cv_downloads || 0;
    }

    // You would need to track CV downloads in a separate collection
    // For now, we'll just check if they have the feature
    if (cvDownloadsLimit === 0) {
      return res.status(403).json({
        success: false,
        message: 'CV download feature requires a paid subscription. Please upgrade your plan.',
        code: 'CV_DOWNLOAD_LIMIT_EXCEEDED'
      });
    }

    req.subscription = activeSubscription;
    req.recruiter = recruiter;
    next();
  } catch (error) {
    next(error);
  }
};

// Get subscription status for response
exports.getSubscriptionStatus = async (recruiterId) => {
  try {
    const activeSubscription = await RecruiterSubscription.findOne({
      recruiter_id: recruiterId,
      payment_status: 'paid',
      end_date: { $gt: new Date() }
    }).sort({ end_date: -1 });

    if (!activeSubscription) {
      return {
        planType: 'free',
        isActive: false,
        features: {
          job_posts_limit: 3,
          featured_jobs: 0,
          candidate_search: false,
          advanced_analytics: false,
          priority_support: false,
          cv_downloads: 5
        },
        daysRemaining: 0
      };
    }

    const daysRemaining = Math.ceil((activeSubscription.end_date - new Date()) / (1000 * 60 * 60 * 24));

    return {
      planType: activeSubscription.plan_type,
      isActive: true,
      features: activeSubscription.features,
      daysRemaining: daysRemaining,
      endDate: activeSubscription.end_date
    };
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
