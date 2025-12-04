const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - dòng bộ kiểm tra xác thực người dùng
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization nếu có
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Đảm bảo token tồn tại kiem tra nếu không có token thì không cho truy cập
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Giải mã token để lấy thông tin người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Lấy người dùng từ token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Kiểm tra xem tài khoản người dùng có đang hoạt động không
      if (!req.user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Authorization middleware - kiểm tra vai trò người dùng
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Kiểm tra xác thực tùy chọn - cho phép truy cập cả với và không có token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token không hợp lệ, không gán người dùng
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
