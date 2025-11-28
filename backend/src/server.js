require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database.js');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});