const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // All routes below require authentication

router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUser);
router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(authorize("admin"), deleteUser);

 module.exports = router;
