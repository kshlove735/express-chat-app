require("dotenv").config();
const path = require('path');
const express = require('express');
const app = express();

// 정적파일 제공 설정
const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(publicDirectory));
app.use(express.json());

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
})