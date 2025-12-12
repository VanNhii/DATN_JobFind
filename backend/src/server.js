require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Kết nối DB
const connectDB = require("./config/database");

// Middleware
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobCategoryRoutes = require("./routes/jobCategoryRoutes");

const app = express();

// 2. Kết nối DB
connectDB();

// 3. Middleware cơ bản
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json()); // Quan trọng để nhận JSON từ client

// 4. Routes API
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION}/recruiters`, recruiterRoutes);
app.use(`/api/${process.env.API_VERSION}/users`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/candidates`, candidateRoutes);
app.use(`/api/${process.env.API_VERSION}/jobs`, jobRoutes);
app.use(`/api/${process.env.API_VERSION}/job-categories`, jobCategoryRoutes);

// 5. Xử lý lỗi chung
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});
