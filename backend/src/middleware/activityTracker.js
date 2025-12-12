const UserActivity = require("../models/UserActivity");
const { getClientIP } = require("../middleware/adminUtils");

// Middleware để theo dõi hoạt động người dùng và quản trị viên
const trackActivity = (activityType, entityType = null) => {
  return async (req, res, next) => {
    // Lưu trữ phương thức json gốc
    const originalJson = res.json;

    // Ghi đè phương thức json của res lượt theo dõi hoạt động
    res.json = function (data) {
      // Kiểm tra điều kiện: chỉ theo dõi khi phản hồi API là thành công (theo quy ước trả về { success: true, ... }).
      if (data.success) {
        // Dùng setImmediate để không làm chậm phản hồi chính của API response
        setImmediate(async () => {
          try {
            const activityData = {
              user_id: req.user.id,
              activity_type: activityType,
              entity_type: entityType,
              entity_id: data.data?._id || data.data?.id || null,
              activity_data: {
                method: req.method,
                path: req.path,
                query: req.query,
                params: req.params,
              },
              ip_address: getClientIP(req),
              user_agent: req.get("User-Agent"),
            };

            // Thêm mô tả nếu là hành động của admin
            if (activityType === "admin_action") {
              activityData.description = `${req.method} ${req.path}`;
            }
            
            await UserActivity.create(activityData);
          } catch (error) {
            console.error("Error tracking activity:", error);
          }
        });
      }

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Update thời gian đăng nhập cuối cùng của user
const updateLastLogin = async (req, res, next) => {
  if (req.user) {
    try {
      await req.user.constructor.findByIdAndUpdate(
        req.user.id,
        { last_login: new Date() },
        { new: false }
      );
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  }
  next();
};

// Log admin actions
const logAdminAction = (action) => {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json;

    res.json = function (data) {
      // Only log successful admin actions
      if (data.success && req.user.role === "admin") {
        setImmediate(async () => {
          try {
            await UserActivity.create({
              user_id: req.user.id,
              activity_type: "admin_action",
              description: `${action}: ${req.method} ${req.path}`,
              activity_data: {
                action,
                target_id: req.params.id,
                request_body: req.body,
              },
              ip_address: getClientIP(req),
              user_agent: req.get("User-Agent"),
            });
          } catch (error) {
            console.error("Error logging admin action:", error);
          }
        });
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  trackActivity,
  updateLastLogin,
  logAdminAction,
};
