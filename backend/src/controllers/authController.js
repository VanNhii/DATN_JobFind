const mongoose = require("mongoose");

const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Recruiter = require("../models/Recruiter");
const {
  generateSecureOTP,
  createExpiryTime,
  isValidOTP,
} = require("../utils/otpService");
const { sendOTPEmail } = require("../utils/emailService");

exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, username, email, password, role, phone } =
      req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    // Tạo người dùng mới với trạng thái 'pending'
    const userData = {
      first_name: first_name,
      last_name: last_name,
      email,
      password,
      role,
      account_status: "pending",
    };

    // Thêm số điện thoại nếu có
    if (phone && phone.trim()) {
      userData.phone = phone;
    }

    const user = await User.create(userData);

    // Tạo role tương ứng trong collection Candidate hoặc Recruiter
    if (role === "candidate") {
      await Candidate.create({
        user_id: user._id,
      });
    } else if (role === "recruiter") {
      await Recruiter.create({
        user_id: user._id,
        company_name: req.body.company_name || "Not specified",
        industry: req.body.industry || "Technology",
      }); // Thêm các trường khác nếu cần
    }

    // Tạo OTP và gửi email xác thực (giả sử bạn có hàm sendVerificationEmail)
    const otp = generateSecureOTP(); // tạo trong ultils/otpService.js
    console.log(
      `Generated OTP for ${email}: ${otp} -- ip : ${
        req.ip
      } -- user agent: ${req.get("User-Agent")}`
    );

    // Cập nhật email vertification trong user document
    user.email_verification = {
      code: otp,
      expires_at: createExpiryTime(15), // tạo trong ultils/otpService.js
      attempts: 0,
    };
    await user.save();

    // Gửi OTP qua email
    await sendOTPEmail(email, otp, "verification"); // tạo trong utils/emailService.js
    res.status(201).json({
      success: true, // cờ hiểu báo cho frontend biết đã thành công
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
      data: {
        userId: user._id,
        email: email,
        message: "Vui lòng kiểm tra email để lấy mã OTP xác thực.",
      },
    });
  } catch (error) {
    next(error);
  }
};

// verify email
// route: POST POST /api/v1/auth/verify-otp
// access: public
// CÁC BƯỚC XÁC THỰC OTP
// muốn xác thực otp thì phải có  otp, và email của người đó
// lúc này mình đi tìm email có tồn tại hay ko,
// dựa vào email đó ra thì nó ra tài khoản,
// dựa vào tài khoản này có chứa otp, rồi mình đi so sánh otp của tài khoản này và otp nhập vào
// trùng thì đúng, ko trùng thì sai
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false, // cờ hiểu báo cho frontend biết đã thất bại
        message: "Vui lòng cung cấp email và mã OTP.",
      });
    }

    if (!isValidOTP(otp)) {
      //!isValidOTP(otp) kiểm tra otp có hợp lệ không nằm trong /utils/otpService.js
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ. Vui lòng thử lại.",
      });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại.",
      });
    }

    // Kiểm tra số lần thử trước vì khi return thì code dừng lại không chạy nữa
    // Đưa số lần
    if (user.email_verification.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã vượt quá số lần thử. Vui lòng yêu cầu mã OTP mới.",
      });
    }
    // console.log("=== DEBUG OTP ===");
    // console.log("1. Email đang check:", email);
    // console.log("2. OTP DB đang giữ :", user.email_verification.code); // Xem DB đang lưu số mấy
    // console.log("3. OTP bạn gửi lên :", otp); // Xem bạn gửi số mấy
    // console.log("4. Thời gian hết hạn:", user.email_verification.expires_at);
    // console.log("5. Thời gian hiện tại:", new Date());
    // console.log("===================");
    // Kiểm tra tài khoản đã được xác thực chưa
    if (
      !user.email_verification.code ||
      user.email_verification.code !== otp ||
      user.email_verification.expires_at < new Date()
    ) {
      // Tăng số lần thử
      user.email_verification.attempts =
        (user.email_verification.attempts || 0) + 1;
      await user.save();
      // console.log(`Failed OTP attempt ${user.email_verification.attempts} for ${email} -- ip : ${req.ip} -- user agent: ${req.get('User-Agent')}`);
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    // Xoá verification code và cập nhật trạng thái kích hoạt tài khoản
    user.email_verification.code = null;
    user.email_verification.expires_at = null;
    user.email_verification.attempts = 0;
    user.account_status = "approved";
    await user.save();

    // Trả về token sau khi xác thực thành công
    sendTokenResponse(
      user,
      200,
      res,
      "Xác thực thành công! Tài khoản đã được kích hoạt."
    ); // hàm này nằm trong utils/auth.js
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Kiểm tra xem email và password có được cung cấp không
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng cung cấp email và mật khẩu",
      });
    }

    // Kiếm tra người dùng có tồn tại không
    const user = await User.findOne({ email }).select("+password"); // chọn cả trường password đã bị ẩn trong schema

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }

    // Kiểm tra tài khoản đã được kích hoạt
    if (user.account_status == "pending") {
      return res.status(401).json({
        success: false,
        message:
          "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.",
        data: {
          email: user.email,
          need_verification: true,
        },
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password); // hàm matchPassword trong models/User.js

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }

    sendTokenResponse(user, 200, res, "Đăng nhập thành công");
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Send OTP
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp email.",
      });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại với email này.",
      });
    }

    // Kiểm tra tài khoản có được kích hoạt không
    if (user.account_status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.",
      });
    }

    // Tạo OTP và gửi email xác thực
    const otp = generateSecureOTP(); // tạo trong ultils/otpService.js
    // Cập nhật email_vertification trong User document với loai 'password_reset'
    user.email_verification = {
      code: otp,
      expires_at: createExpiryTime(15), // tạo trong ultils/otpService.js
      attempts: 0,
    };
    await user.save();

    // Gửi OTP qua email
    await sendOTPEmail(email, otp, "password_reset"); // tạo trong utils/emailService.js
    res.status(200).json({
      success: true, // cờ hiểu báo cho frontend biết đã thành công
      message: "Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn.",
      data: {
        email: email,
        message: "Vui lòng kiểm tra email để lấy mã OTP đặt lại mật khẩu.",
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false, // cờ hiểu báo cho frontend biết đã thất bại
        message: "Vui lòng cung cấp email, mã OTP và mật khẩu mới.",
      });
    }

    if (!isValidOTP(otp)) {
      //!isValidOTP(otp) kiểm tra otp có hợp lệ không nằm trong /utils/otpService.js
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ. Vui lòng thử lại.",
      });
    }

    // Kiểm tra password mới có đủ mạnh không
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 8 ký tự.",
      });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại.",
      });
    }

    // Kiểm tra verification code và thời gian hết hạn trong email_verification của user
    if (user.email_verification.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã vượt quá số lần thử. Vui lòng yêu cầu mã OTP mới.",
      });
    }
    // console.log("=== DEBUG OTP ===");
    // console.log("1. Email đang check:", email);
    // console.log("2. OTP DB đang giữ :", user.email_verification.code); // Xem DB đang lưu số mấy
    // console.log("3. OTP bạn gửi lên :", otp); // Xem bạn gửi số mấy
    // console.log("4. Thời gian hết hạn:", user.email_verification.expires_at);
    // console.log("5. Thời gian hiện tại:", new Date());
    // console.log("===================");
    // Kiểm tra tài khoản đã được xác thực chưa
    if (
      !user.email_verification.code ||
      user.email_verification.code !== otp ||
      user.email_verification.expires_at < new Date()
    ) {
      // Tăng số lần thử
      user.email_verification.attempts =
        (user.email_verification.attempts || 0) + 1;
      await user.save();
      // console.log(`Failed OTP attempt ${user.email_verification.attempts} for ${email} -- ip : ${req.ip} -- user agent: ${req.get('User-Agent')}`);
      return res.status(400).json({
        success: false,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    // Xoá verification code và cập nhật trạng thái kích hoạt tài khoản
    user.email_verification.code = null;
    user.email_verification.expires_at = null;
    user.email_verification.attempts = 0;
    user.password = newPassword;
    await user.save();

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message:
        "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { email, type = "email_verification" } = req.body;
    // type có thể là 'email_verification' hoặc 'password_reset'
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp email.",
      });
    }
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại với email này.",
      });
    }
    //Kiểm tra loại yêu cầu
    if (type !== "email_verification" && type !== "password_reset") {
      return res.status(400).json({
        success: false,
        message: "Loại yêu cầu không hợp lệ.",
      });
    }
    // Với email_verification, chỉ gửi nếu tài khoản chưa active
    if (type === "email_verification" && user.is_active) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã được kích hoạt",
      });
    }
    // Với password_reset, chỉ gửi nếu tài khoản đã active
    if (type === "password_reset" && !user.is_active) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản chưa được kích hoạt",
      });
    }
    // Tạo OTP và gửi email xác thực
    const otp = generateSecureOTP(); // tạo trong ultils/otpService.js

    // Cập nhật email_vertification trong User document
    user.email_verification = {
      code: otp,
      expires_at: createExpiryTime(15), // tạo trong ultils/otpService.js
      attempts: 0,
    };
    await user.save();

    // Gửi OTP qua email
    const emailType = type === 'email_verification' ? 'verification' : 'password_reset';
    await sendOTPEmail(email, otp, emailType); // tạo trong utils/emailService.js
    res.status(200).json({
        success: true, // cờ hiểu báo cho frontend biết đã thành công
        message: "Mã OTP mới đã được gửi đến email của bạn.",
        data: {
          email: email,
          message: "Vui lòng kiểm tra email để lấy mã OTP.",
        },
      });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------
// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        let profile = null;

        // Lấy profile tương ứng dựa trên vai trò
        if (user.role === 'candidate') {
            profile = await Candidate.findOne({ user_id: user._id });
        } else if (user.role === 'recruiter') {
            profile = await Recruiter.findOne({ user_id: user._id });
        }

        res.status(200).json({
            success: true,
            data: {
                user,
                profile
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
    const fieldsToUpdate = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email
    };

    // Xử lý trường hợp frontend gửi full_name
    if (req.body.full_name && !req.body.first_name && !req.body.last_name) {
      const nameParts = req.body.full_name.trim().split(" ");
      fieldsToUpdate.first_name = nameParts[0];
      fieldsToUpdate.last_name = nameParts.slice(1).join(" ") || nameParts[0];
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
    } catch (error) {
       next(error); 
    }
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
    const user = await User.findById(req.user.id).select('+password');
    // Kiểm tra mật khẩu hiện tại
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng',
      });
    }
    // Cập nhật mật khẩu mới
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res, 'Mật khẩu đã được cập nhật');
    } catch (error) {
       next(error); 
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};
// Hàm tạo và gửi token JWT trong cookie và phản hồi JSON
const sendTokenResponse = (user, statusCode, res, message = "Thành công") => {
  // Tạo token JWT
  const token = user.getSignedJwtToken(); // tạo signed trong models/User.js

  // Mặc định là 7 ngày nếu JWT_COOKIE_EXPIRE không được thiết lập
  const cookieExpireDays = process.env.JWT_COOKIE_EXPIRE || 7;

  // Cấu hình cookie
  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000 // chuyển đổi ngày thành milliseconds
    ),
    httpOnly: true, // Chỉ cho phép truy cập cookie qua HTTP(S), không cho truy cập bằng JavaScript hạn chế tấn công XSS
  };
  // Bảo mật cookie trong môi trường production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  // Gửi phản hồi với cookie và JSON
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      data: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
    });
};
