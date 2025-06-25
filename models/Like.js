// models/Like.js
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recommendation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recommendation",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// 유저-추천 쌍의 유니크 보장 (composite PK 역할)
likeSchema.index({ user_id: 1, recommendation_id: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
