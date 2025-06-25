// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // not null
    unique: true, // unique
    trim: true, // 앞뒤 공백 제거
  },
});

module.exports = mongoose.model("Category", categorySchema);
