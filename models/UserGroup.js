// models/UserGroup.js
const mongoose = require("mongoose");

const userGroupSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  role: {
    type: String,
    default: "member", // admin, member 등
    trim: true,
  },
  joined_at: {
    type: Date,
    default: Date.now,
  },
});

// user_id + group_id 조합은 유일하도록 인덱스 설정 (복합 PK 역할)
userGroupSchema.index({ user_id: 1, group_id: 1 }, { unique: true });

module.exports = mongoose.model("UserGroup", userGroupSchema);
