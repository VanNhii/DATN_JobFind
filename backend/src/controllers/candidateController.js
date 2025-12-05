const Candidate = require("../models/Candidate"); // Ứng viên

const {
  getPaginationParams,
  applyPagination,
  buildPaginationResponse,
} = require("../utils/pagination");

// Lấy danh sách tất cả ứng viên (có phân trang, tìm kiếm)

// access: private, admin, recruiter
// route: GET /api/v1/candidates
exports.getCandidates = async (req, res) => {
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
// access: private, candidate
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

// exports.updateCandidateProfile = async (req, res, next) => {
//   try {
//     let candidate = await Candidate.findOne({ user_id: req.user.id });
//     if (!candidate) {
