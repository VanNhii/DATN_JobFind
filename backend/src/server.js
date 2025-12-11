require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Kết nối DB
const connectDB = require("./config/database");

// Middlewares
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

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

// 5. Xử lý lỗi chung
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});
