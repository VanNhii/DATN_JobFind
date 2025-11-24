const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
try {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB đã được kết nối thành công');  
} catch (error) {
    console.error('MongoDB lỗi kết nối:', error);
    process.exit(1);
}
}

module.exports = connectDB;