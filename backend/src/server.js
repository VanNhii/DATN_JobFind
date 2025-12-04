require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database"); 
//const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes"); 
const recruiterRoutes = require("./routes/recruiterRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
// 2. Kết nối DB
connectDB();

// 3. Middleware cơ bản
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json()); // Quan trọng nhất để nhận email/pass

// 4. Routes
// Mọi request bắt đầu bằng /api/v1/auth sẽ chui vào authRoutes xử lý
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION}/users`,userRoutes);
app.use(`/api/${process.env.API_VERSION}/recruiters`, recruiterRoutes);


// 5. Xử lý lỗi (Nên có để biết tại sao code lỗi)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Auth đang chạy trên port ${PORT}`);
});