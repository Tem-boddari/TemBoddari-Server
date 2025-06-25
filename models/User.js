// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  // ---------- ERD: nickname ----------
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // ---------- ERD: email ----------
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  // ---------- ERD: hashed_password ----------
  hashed_password: {
    type: String,
    required: true,
  },

  // ---------- ERD: created_at ----------
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// 회원가입 예시
userSchema.statics.signUp = async function (nickname, email, password) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return this.create({ nickname, email, hashed_password: hash });
};

// 로그인 예시
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.hashed_password);
  return ok ? user : null;
};

module.exports = mongoose.model("User", userSchema);
