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

userGroupSchema.index({ user_id: 1 }, { unique: true });

module.exports = mongoose.model("UserGroup", userGroupSchema);
