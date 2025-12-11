const Candidate = require("../models/Candidate"); // Ứng viên
const Job = require("../models/Job"); // Công việc
const Application = require("../models/Application"); // Đơn ứng tuyển
const Interview = require("../models/Interview"); // Phỏng vấn
const Notification = require("../models/Notification"); // Thông báo

// Lấy danh sách tất cả ứng viên (có phân trang, tìm kiếm)

const {
  getPaginationParams,
  applyPagination,
  buildPaginationResponse,
  getSearchParams,
  getDateRangeFilter,
} = require("../utils/pagination");

// Lấy danh sách tất cả ứng viên (có phân trang, tìm kiếm
// access: private, admin, recruiter
// route: GET /api/v1/candidates
exports.getCandidates = async (req, res, next) => {
  try {
    // Lấy thông tin phân trang từ request
    const { page, limit, skip } = getPaginationParams(req);
    // Lấy điều kiện tìm kiếm từ request
    const searchFilters = getSearchParams(req);

    // Tìm kiếm ứng viên, đồng thời lấy thông tin user liên quan
    const candidatesQuery = Candidate.find(searchFilters)
      .populate(
        "user_id",
        // Lấy các trường thông tin cơ bản của user
        "first_name last_name email phone avatar url full_name is_verified is_active"
      )
      .sort("-created_at"); // Sắp xếp theo ngày tạo mới nhất

    // Áp dụng phân trang cho kết quả truy vấn
    const candidates = await applyPagination(
      candidatesQuery,
      page,
      limit,
      skip
    );
    // Đếm tổng số ứng viên phù hợp điều kiện
    const total = await Candidate.countDocuments(searchFilters);

    // Trả về kết quả dạng phân trang
    res
      .status(200)
      .json(buildPaginationResponse(candidates, total, page, limit));
  } catch (error) {
    // Xử lý lỗi nếu có
    next(error);
  }
};

// get single candidate by id
// access: private
// route : GET /api/v1/candidates/:id

// hàm lấy thông tin chi tiết của một ứng viên dựa trên ID

exports.getCandidate = async (req, res, next) => {
  try {
    // Tìm ứng viên theo ID, đồng thời lấy thông tin user và các đơn ứng tuyển liên quan
    const candidate = await Candidate.findById(req.params.id)
      // dùng populate để lấy thông tin user liên quan
      .populate(
        "user_id",
        "first_name last_name email phone avatar url full_name is_verified is_active"
      )
      // và lấy thông tin các đơn ứng tuyển liên quan
      .populate("applications");

    // nếu không tìm thấy ứng viên, trả về lỗi 404
    if (!candidate) {
      return res.status(404).json({
        // trả về thông báo lỗi
        success: false,
        message: "Candidate not found",
      });
    }

    // nếu tìm thấy, trả về thông tin ứng viên
    res.status(200).json({
      success: true,
      data: candidate,
    });
    // Xử lý lỗi nếu có
  } catch (error) {
    next(error);
  }
};

// create new candidate
// access: private, candidate
// route: POST /api/v1/candidates

// hàm tạo mới một ứng viên
exports.createCandidate = async (req, res, next) => {
  try {
    req.body.user_id = req.user.id; // Gán user_id từ thông tin người dùng đã xác thực

    const candidate = await Candidate.create(req.body); // Tạo ứng viên mới với dữ liệu từ request body

    res.status(201).json({
      // Trả về phản hồi thành công
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

// update candidate
// access: private, admin
// route: PUT /api/v1/candidates/:id

exports.updateCandidate = async (req, res, next) => {
  try {
    let candidate = await Candidate.findById(req.params.id); // Tìm ứng viên theo ID từ tham số URL

    if (!candidate) {
      // Nếu không tìm thấy ứng viên
      return res.status(404).json({
        // Trả về lỗi 404
        success: false,
        message: "Candidate not found",
      });
    }

    // Kiểm tra quyền truy cập: chỉ người dùng sở hữu ứng viên hoặc admin mới được phép cập nhật
    if (
      // So sánh user_id của ứng viên với ID người dùng hiện tại
      candidate.user_id.toString() !== req.user.id &&
      // Kiểm tra nếu người dùng không phải admin
      req.user.role !== "admin"
    ) {
      // Kiểm tra quyền truy cập
      return res.status(401).json({
        // Trả về lỗi 403 nếu không có quyền
        success: false,
        message: "Not authorized to update this candidate", // Thông báo không có quyền
      });
    }

    candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      // Cập nhật ứng viên với dữ liệu từ request body
      new: true, // Trả về đối tượng đã được cập nhật
      runValidators: true, // Chạy các validator đã định nghĩa trong schema
    }).populate("user_id", "first_name email full_name phone avatar url"); // Populate thông tin user liên quan

    res.status(200).json({
      // Trả về phản hồi thành công
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

// delete candidate
// access: private, candidate, admin
// route: DELETE /api/v1/candidates/:id

// hàm xóa một ứng viên
exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id); // Tìm ứng viên theo ID từ tham số URL
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Kiểm tra quyền truy cập: chỉ người dùng sở hữu ứng viên hoặc admin mới được phép xóa
    if (
      candidate.user_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this candidate",
      });
    }
    await candidate.deleteOne(); // Xóa ứng viên khỏi cơ sở dữ liệu
    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

// get candidate profile (own profile) nghĩa là lấy thông tin hồ sơ ứng viên của chính người dùng đã xác thực
// access: private, candidate
// route: GET /api/v1/candidates/profile

exports.getCandidateProfile = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({
      user_id: req.user.id,
    }).populate(
      "user_id",
      "first_name last_name email phone avatar_url full_name is_verified is_active"
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }
    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

// update candidate profile (own profile) nghĩa là cập nhật thông tin hồ sơ ứng viên của chính người dùng đã xác thực
// access: private, candidate
//route : PUT /api/v1/candidates/profile

exports.updateCandidateProfile = async (req, res, next) => {
  try {
    let candidate = await Candidate.findOne({ user_id: req.user.id });
    if (!candidate) {
      // Nếu không tìm thấy hồ sơ ứng viên
      req.body.user_id = req.user.id; // Gán user_id từ thông tin người dùng đã xác thực

      candidate = await Candidate.create(req.body); // Tạo hồ sơ ứng viên mới với dữ liệu từ request body
    } else {
      // Nếu tìm thấy hồ sơ ứng viên, tiến hành cập nhật
      candidate = await Candidate.findByIdAndUpdate(candidate._id, req.body, {
        new: true, // Trả về đối tượng đã được cập nhật
        runValidators: true, // Chạy các validator đã định nghĩa trong schema
      });
    }
    await candidate.populate(
      "user_id",
      "first_name last_name email phone avatar_url full_name is_verified is_active"
    );
    res.status(200).json({
      // Trả về phản hồi thành công
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error); // Chuyển lỗi đến middleware xử lý lỗi
  }
};

// get candidate applications
// access: private, candidate
// route: GET /api/v1/candidates/applications
exports.getCandidateApplications = async (req, res, next) => {
  // hàm lấy danh sách các đơn ứng tuyển của ứng viên đã xác thực
  try {
    const { page, limit, skip } = getPaginationParams(req); // Lấy thông tin phân trang từ request
    const { status } = req.query; // Lấy trạng thái ứng tuyển từ query parameters

    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm ứng viên dựa trên user_id của người dùng đã xác thực
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const query = { candidate_id: candidate._id }; // Tạo điều kiện truy vấn để tìm các đơn ứng tuyển của ứng viên
    if (status) query.application_status = status; // Nếu có trạng thái ứng tuyển trong query parameters, thêm điều kiện vào truy vấn

    const applicationsQuery = Application.find(query) // Tìm các đơn ứng tuyển dựa trên điều kiện truy vấn
      .populate({
        // Populate thông tin công việc liên quan
        path: "job_id",
        select:
          "title company_name salary_min salary_max location work_location",
      })
      .populate({
        // Populate thông tin ứng viên liên quan
        path: "job_id",
        populate: {
          path: "recruiter_id",
          select: "company_name company_logo_url",
        },
      })
      .sort("-created_at"); // Sắp xếp theo ngày tạo mới nhất

    const applications = await applyPagination(
      // Áp dụng phân trang cho kết quả truy vấn
      applicationsQuery,
      page,
      limit,
      skip
    );
    const total = await Application.countDocuments(query); // Đếm tổng số đơn ứng tuyển phù hợp điều kiện

    res
      .status(200)
      .json(buildPaginationResponse(applications, total, page, limit)); // Trả về kết quả dạng phân trang
  } catch (error) {
    next(error);
  }
};

// get candidate interviews
// access: private, candidate
// route: GET /api/v1/candidates/interviews

exports.getCandidateInterviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const dateFilters = getDateRangeFilter(req);
    const { status } = req.query;

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const query = { candidate_id: candidate._id, ...dateFilters };
    if (status) query.interview_status = status;

    const interviewsQuery = Interview.find(query)
      .populate({
        path: "job_id",
        select: "title",
      })
      .populate({
        path: "recruiter_id",
        select: "company_name",
      })
      .populate({
        path: "applicant_id",
        select: "application_status",
      })
      .sort("interview_date");

    const interviews = await applyPagination(
      interviewsQuery,
      page,
      limit,
      skip
    );
    const total = await Interview.countDocuments(query);

    res
      .status(200)
      .json(buildPaginationResponse(interviews, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// search jobs for candidate
// access: private, candidate
// route: GET /api/v1/candidates/jobs/search

// hàm tìm kiếm công việc cho ứng viên
exports.searchJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req); // Lấy thông tin phân trang từ request
    const searchFilters = getSearchParams(req); // Lấy điều kiện tìm kiếm từ request

    const {
      // Lấy các tham số tìm kiếm cụ thể từ query parameters
      category,
      job_type,
      work_location,
      salary_min,
      salary_max,
      location,
    } = req.query;

    const query = {
      // Tạo điều kiện truy vấn cơ bản
      is_active: true, // Chỉ tìm kiếm các công việc đang hoạt động
      status: "approved",
      ...searchFilters,
    };

    if (category) query.category_id = category; // Nếu có danh mục trong query parameters, thêm điều kiện vào truy vấn
    if (job_type) query.job_type = job_type; // Nếu có loại công việc trong query parameters, thêm điều kiện vào truy vấn
    if (work_location) query.work_location = work_location; // Nếu có hình thức làm việc trong query parameters, thêm điều kiện vào truy vấn
    if (location) query["location.city"] = { $regex: location, $options: "i" }; // Nếu có vị trí trong query parameters, thêm điều kiện vào truy vấn với regex để tìm kiếm không phân biệt hoa thường

    if (salary_min) {
      // Nếu có mức lương tối thiểu trong query parameters, thêm điều kiện vào truy vấn
      query.salary_min = { $gte: parseInt(salary_min) }; // Chuyển đổi sang số nguyên và sử dụng toán tử $gte
    }

    if (salary_max) {
      // Nếu có mức lương tối đa trong query parameters, thêm điều kiện vào truy vấn
      query.salary_max = { $lte: parseInt(salary_max) };
    }

    const jobsQuery = Job.find(query) // Tìm các công việc dựa trên điều kiện truy vấn
      .populate({
        // Populate thông tin danh mục liên quan
        path: "category_id",
        select: "name",
      })
      .populate({
        // Populate thông tin nhà tuyển dụng liên quan
        path: "recruiter_id",
        select: "company_name company_logo_url industry",
      })
      .select("-applications -interviews") // Loại bỏ trường applications và interviews khỏi kết quả
      .sort("-created_at"); // Sắp xếp theo ngày tạo mới nhất

    const jobs = await applyPagination(jobsQuery, page, limit, skip); // Áp dụng phân trang cho kết quả truy vấn
    const total = await Job.countDocuments(query); // Đếm tổng số công việc phù hợp điều kiện

    res.status(200).json(buildPaginationResponse(jobs, total, page, limit)); // Trả về kết quả dạng phân trang
  } catch (error) {
    next(error);
  }
};

// get candidate dashboard
// access: private, candidate
// route: GET /api/v1/candidates/dashboard

exports.getCandidateDashboard = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // get basic stats
    const [
      totalApplications, // Tổng số đơn ứng tuyển
      pendingApplications, // Số đơn ứng tuyển đang chờ xử lý
      acceptedApplications, // Số đơn ứng tuyển đã được chấp nhận
      rejectedApplications, // Số đơn ứng tuyển đã bị từ chối
      totalInterviews, // Tổng số lịch phỏng vấn
      upcomingInterviews, // Số lịch phỏng vấn sắp tới
    ] = await Promise.all([
      // Thực hiện đồng thời nhiều truy vấn để lấy số liệu thống kê
      Application.countDocuments({ candidate_id: candidate._id }), // Đếm tổng số đơn ứng tuyển của ứng viên
      Application.countDocuments({
        // Đếm số đơn ứng tuyển đang chờ xử lý
        candidate_id: candidate._id, // ID của ứng viên
        application_status: "pending", // Trạng thái ứng tuyển là "pending"
      }),
      Application.countDocuments({
        // Đếm số đơn ứng tuyển đã được chấp nhận
        candidate_id: candidate._id, // ID của ứng viên
        application_status: "accepted", // Trạng thái ứng tuyển là "accepted"
      }),
      Application.countDocuments({
        // Đếm số đơn ứng tuyển đã bị từ chối
        candidate_id: candidate._id, // ID của ứng viên
        application_status: "rejected", // Trạng thái ứng tuyển là "rejected"
      }),
      Interview.countDocuments({ candidate_id: candidate._id }), // Đếm tổng số lịch phỏng vấn của ứng viên
      Interview.countDocuments({
        // Đếm số lịch phỏng vấn sắp tới của ứng viên
        candidate_id: candidate._id, // ID của ứng viên
        interview_date: { $gte: new Date() }, // Ngày phỏng vấn lớn hơn hoặc bằng ngày hiện tại
        interview_status: "scheduled", // Trạng thái phỏng vấn là "scheduled"
      }),
    ]);

    // get recent applications
    const recentApplications = await Application.find({
      // Tìm các đơn ứng tuyển gần đây của ứng viên
      candidate_id: candidate._id,
    }) // Tìm các đơn ứng tuyển của ứng viên

      .populate("job_id", "title company_name") // Populate thông tin công việc liên quan
      .populate({
        path: "job_id",
        populate: {
          // Populate thông tin nhà tuyển dụng liên quan
          path: "recruiter_id",
          select: "company_name company_logo_url",
        },
      })
      .sort("-created_at") // Sắp xếp theo ngày tạo mới nhất
      .limit(5); // Lấy 5 đơn ứng tuyển gần đây nhất

    // get recommended jobs
    const recommendedJobs = await Job.find({
      // Tìm các công việc được đề xuất cho ứng viên
      is_active: true,
      status: "approved",
    })
      .populate("category_id", "name") // Populate thông tin danh mục liên quan
      .populate("recruiter_id", "company_name company_logo_url") // Populate thông tin nhà tuyển dụng liên quan
      .sort("-created_at") // Sắp xếp theo ngày tạo mới nhất
      .limit(5); // Lấy 5 công việc được đề xuất

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalApplications,
          pendingApplications,
          acceptedApplications,
          rejectedApplications,
          totalInterviews,
          upcomingInterviews,
        },
        recentApplications, // Danh sách các đơn ứng tuyển gần đây
        recommendedJobs, // Danh sách các công việc được đề xuất
      },
    });
  } catch (error) {
    next(error);
  }
};

// get candidate notifications
// access: private, candidate
// route: GET /api/v1/candidates/notifications

exports.getCandidateNotifications = async (req, res, next) => {
  // hàm lấy danh sách thông báo của ứng viên đã xác thực
  try {
    const { page, limit, skip } = getPaginationParams(req); // Lấy thông tin phân trang từ request
    const { is_read } = req.query; // Lấy trạng thái đã đọc từ query parameters

    const query = { user_id: req.user.id }; // Tạo điều kiện truy vấn để tìm các thông báo của ứng viên
    if (is_read !== undefined) query.is_read = is_read === "true"; // Nếu có trạng thái đã đọc trong query parameters, thêm điều kiện vào truy vấn

    const notificationsQuery = Notification.find(query).sort("-created_at"); // Tìm các thông báo dựa trên điều kiện truy vấn và sắp xếp theo ngày tạo mới nhất

    const notifications = await applyPagination(
      // Áp dụng phân trang cho kết quả truy vấn
      notificationsQuery,
      page,
      limit,
      skip
    );
    const total = await Notification.countDocuments(query); // Đếm tổng số thông báo phù hợp điều kiện

    if (req.query.mark_as_read === "true") {
      // Nếu có tham số mark_as_read trong query parameters, đánh dấu tất cả thông báo là đã đọc
      await Notification.updateMany(
        // Đánh dấu tất cả thông báo là đã đọc
        { user_id: req.user.id, is_read: false }, // Điều kiện để tìm các thông báo chưa đọc của người dùng
        { is_read: true, read_at: new Date() } // Cập nhật trạng thái đã đọc và thời gian đọc
      );
    }

    res
      .status(200)
      .json(buildPaginationResponse(notifications, total, page, limit)); // Trả về kết quả dạng phân trang
  } catch (error) {
    next(error);
  }
};

// get candidate experiences
// access: private, candidate
// route: GET /api/v1/candidates/experiences

exports.getCandidateExperiences = async (req, res, next) => {
  // ham lấy danh sách kinh nghiệm làm việc của ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Sắp xếp kinh nghiệm theo ngày bắt đầu, mới nhất trước
    const experiences = candidate.experiences.sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    );

    res.status(200).json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

// add candidate experience
// access: private, candidate
// route: POST /api/v1/candidates/experiences

exports.addCandidateExperience = async (req, res, next) => {
  // ham thêm kinh nghiệm làm việc cho ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm hồ sơ ứng viên dựa trên user_id của người dùng đã xác thực

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    candidate.experience.push(req.body); // Thêm kinh nghiệm mới vào mảng experiences
    await candidate.save(); // Lưu hồ sơ ứng viên sau khi thêm kinh nghiệm

    const newExperience =
      candidate.experience[candidate.experiences.length - 1]; // Lấy kinh nghiệm mới thêm vào để trả về trong phản hồi

    res.status(201).json({
      success: true,
      data: newExperience,
    });
  } catch (error) {
    next(error);
  }
};

// update candidate experience
// access: private, candidate
// route: PUT /api/v1/candidates/experiences/:experienceId

exports.updateCandidateExperience = async (req, res, next) => {
  // ham cập nhật kinh nghiệm làm việc cho ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm hồ sơ ứng viên dựa trên user_id của người dùng đã xác thực

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const experienceIndex = candidate.experience.findIndex(
      // Tìm chỉ mục của kinh nghiệm cần cập nhật trong mảng experiences
      (exp) => exp._id.toString() === req.params.experienceId // So sánh ID kinh nghiệm với tham số experienceId từ URL
    );

    if (experienceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    Object.assign(candidate.experience[experienceIndex], req.body); // Cập nhật kinh nghiệm với dữ liệu từ request body
    await candidate.save(); // Lưu hồ sơ ứng viên sau khi cập nhật kinh nghiệm

    res.status(200).json({
      success: true,
      data: candidate.experience[experienceIndex],
    });
  } catch (error) {
    next(error);
  }
};

// delete candidate experience
// access: private, candidate
// route: DELETE /api/v1/candidates/experiences/:experienceId

exports.deleteCandidateExperience = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    candidate.experience = candidate.experience.filter(
      (exp) => exp._id.toString() !== req.params.experienceId
    );

    await candidate.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// get candidate educations
// access: private, candidate
// route: GET /api/v1/candidates/educations

exports.getCandidateEducations = async (req, res, next) => {
  // ham lấy danh sách học vấn của ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const educations = candidate.educations.sort(
      (a, b) => new Date(b.start_date) - new Date(a.start_date)
    );
    res.status(200).json({
      success: true,
      data: educations,
    });
  } catch (error) {
    next(error);
  }
};

// add candidate education
// access: private, candidate
// route: POST /api/v1/candidates/educations

exports.addCandidateEducation = async (req, res, next) => {
  // ham thêm học vấn cho ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm hồ sơ ứng viên dựa trên user_id của người dùng đã xác thực
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    candidate.education.push(req.body); // Thêm học vấn mới vào mảng educations
    await candidate.save(); // Lưu hồ sơ ứng viên sau khi thêm học vấn

    const newEducation = candidate.education[candidate.education.length - 1]; // Lấy học vấn mới thêm vào để trả về trong phản hồi
    res.status(201).json({
      success: true,
      data: newEducation,
    });
  } catch (error) {
    next(error);
  }
};

// update candidate education
// access: private, candidate
// route: PUT /api/v1/candidates/educations/:educationId

exports.updateCandidateEducation = async (req, res, next) => {
  // ham cập nhật học vấn cho ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm hồ sơ ứng viên dựa trên user_id của người dùng đã xác thực

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const educationIndex = candidate.education.findIndex(
      // Tìm chỉ mục của học vấn cần cập nhật trong mảng educations
      (edu) => edu._id.toString() === req.params.educationId // So sánh ID học vấn với tham số educationId từ URL
    );

    if (educationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    Object.assign(candidate.education[educationIndex], req.body); // Cập nhật học vấn với dữ liệu từ request body
    await candidate.save(); // Lưu hồ sơ ứng viên sau khi cập nhật học vấn

    res.status(200).json({
      success: true,
      data: candidate.education[educationIndex],
    });
  } catch (error) {
    next(error);
  }
};

// delete candidate education
// access: private, candidate
// route: DELETE /api/v1/candidates/educations/:educationId

exports.deleteCandidateEducation = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    candidate.education = candidate.education.filter(
      (edu) => edu._id.toString() !== req.params.educationId
    );

    await candidate.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// get candidate skills
// access: private, candidate
// route: GET /api/v1/candidates/skills

exports.getCandidateSkills = async (req, res, next) => {
  // ham lấy danh sách kỹ năng của ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Sắp xếp kỹ năng theo tên kỹ năng
    const skills = candidate.skills_details.sort((a, b) =>
      a.skill_name.localeCompare(b.skill_name)
    );

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// add candidate skill
// access: private, candidate
// route: POST /api/v1/candidates/skills

exports.addCandidateSkill = async (req, res, next) => {
  // ham thêm kỹ năng cho ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm hồ sơ ứng viên dựa trên user_id của người dùng đã xác thực

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const existingSkill = candidate.skills_details.find(
      (skill) =>
        skill.skill_name.toLowerCase() === req.body.skill_name.toLowerCase()
    );

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    candidate.skills_details.push(req.body); // Thêm kỹ năng mới vào mảng skills_details
    await candidate.save(); // Lưu hồ sơ ứng viên sau khi thêm kỹ năng

    const newSkill =
      candidate.skills_details[candidate.skills_details.length - 1]; // Lấy kỹ năng mới thêm vào để trả về trong phản hồi

    res.status(201).json({
      success: true,
      data: newSkill,
    });
  } catch (error) {
    next(error);
  }
};

// update candidate skill
// access: private, candidate
// route: PUT /api/v1/candidates/skills/:skillId

exports.updateCandidateSkill = async (req, res, next) => {
  // ham cập nhật kỹ năng cho ứng viên đã xác thực
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id }); // Tìm hồ sơ ứng viên dựa trên user_id của người dùng đã xác thực
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const skillIndex = candidate.skills_details.findIndex(
      // Tìm chỉ mục của kỹ năng cần cập nhật trong mảng skills_details
      (skill) => skill._id.toString() === req.params.skillId // So sánh ID kỹ năng với tham số skillId từ URL
    );

    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    if (
      req.body.skill_name &&
      req.body.skill_name.toLowerCase() !==
        candidate.skills_details[skillIndex].skill_name.toLowerCase()
    ) {
      const existingSkill = candidate.skills_details.find(
        (skill, index) =>
          index !== skillIndex &&
          skill.skill_name.toLowerCase() === req.body.skill_name.toLowerCase()
      );

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: "Skill already exists",
        });
      }
    }

    Object.assign(candidate.skills_details[skillIndex], req.body); // Cập nhật kỹ năng với dữ liệu từ request body
    await candidate.save(); // Lưu hồ sơ ứng viên sau khi cập nhật kỹ năng

    res.status(200).json({
      success: true,
      data: candidate.skills_details[skillIndex],
    });
  } catch (error) {
    next(error);
  }
};

// delete candidate skill
// access: private, candidate
// route: DELETE /api/v1/candidates/skills/:skillId

exports.deleteCandidateSkill = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    candidate.skills_detailed = candidate.skills_detailed.filter(
      (skill) => skill._id.toString() !== req.params.skillId
    );

    await candidate.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// apply for a job
// access: private, candidate
// route: POST /api/v1/candidates/jobs/:jobId/apply

exports.applyForJob = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const existingApplication = await Application.findOne({
      candidate_id: candidate._id,
      job_id: req.params.jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // create new application
    const applicationData = {
      job_id: req.params.jobId,
      candidate_id: candidate._id,
      cover_letter: req.body.cover_letter,
      cv_file_url: req.body.cv_file_url || candidate.cv_file_url,
    };

    const application = await Application.create(applicationData);

    await application.populate([
      { path: "job_id", select: "title company_name" },
      { path: "candidate_id", select: "bio experience_years" },
    ]);

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// withdraw job application
// access: private, candidate
// route: POST /api/v1/candidates/applications/:applicationId/withdraw

exports.withdrawApplication = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.candidate_id.toString() !== candidate._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to withdraw this application",
      });
    }

    if (
      application.application_status === "accepted" ||
      application.application_status === "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw an application that has been processed",
      });
    }

    await application.deleteOne(); // Xóa đơn ứng tuyển khỏi cơ sở dữ liệu

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// get saved/bookmarked jobs
// access: private, candidate
// route: GET /api/v1/candidates/jobs/saved

exports.getSavedJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const savedJobIds = candidate.saved_jobs || [];

    if (savedJobIds.length === 0) {
      return res.status(200).json(buildPaginationResponse([], 0, page, limit));
    }

    const jobsQuery = Job.find({ _id: { $in: savedJobIds }, is_active: true })

      .populate("category_id", "name")
      .populate("recruiter_id", "company_name logo_url industry")
      .sort("-created_at");

    const jobs = await applyPagination(jobsQuery, page, limit, skip);
    const total = await Job.countDocuments({
      _id: { $in: savedJobIds },
      is_active: true,
    });

    res.status(200).json(buildPaginationResponse(jobs, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// save/bookmark a job
// access: private, candidate
// route: POST /api/v1/candidates/jobs/:jobId/save

exports.saveJob = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!candidate.saved_jobs) {
      candidate.saved_jobs = [];
    }

    if (candidate.saved_jobs.includes(req.params.jobId)) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    candidate.saved_jobs.push(req.params.jobId);
    await candidate.save();

    res.status(200).json({
      success: true,
      message: "Job saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// unsave/unbookmark a job
// access: private, candidate
// route: POST /api/v1/candidates/jobs/:jobId/unsave

exports.unsaveJob = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    if (candidate.saved_jobs) {
      candidate.saved_jobs = candidate.saved_jobs.filter(
        (jobId) => jobId.toString() !== req.params.jobId
      );
      await candidate.save();
    }

    res.status(200).json({
      success: true,
      message: "Job unsaved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// update salary expectation
// access: private, candidate
// route: PUT /api/v1/candidates/salary-expectation

exports.updateSalaryExpectation = async (req, res, next) => {
  try {
    const { min, max, currency } = req.body;

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    if (min && max && min > max) {
      return res.status(400).json({
        success: false,
        message: "Minimum salary cannot be greater than maximum salary",
      });
    }

    candidate.salary_expectation = {
      min: min || candidate.salary_expectation?.min,
      max: max || candidate.salary_expectation?.max,
      currency: currency || candidate.salary_expectation?.currency || "VND",
    };

    await candidate.save();

    res.status(200).json({
      success: true,
      data: candidate.salary_expectation,
    });
  } catch (error) {
    next(error);
  }
};

// update job status
// access: private, candidate
// route: PUT /api/v1/candidates/job-status

exports.updateJobStatus = async (req, res, next) => {
  try {
    const { job_status } = req.body;

    if (!["seeking", "employed", "not_seeking"].includes(job_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job status",
      });
    }

    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    candidate.job_status = job_status;
    await candidate.save();

    res.status(200).json({
      success: true,
      data: { job_status: candidate.job_status },
    });
  } catch (error) {
    next(error);
  }
};
