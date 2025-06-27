// routes/usergroup.js
const express = require("express");
const UserGroup = require("../models/UserGroup");

const router = express.Router();
const authenticate = require("../middleware/auth");
/**
 * 유저 ID를 기반으로 유저그룹 조회
 * GET /api/???
 */
router.get("/", authenticate, async (req, res) => {
  const userId = req.user._id;
  console.log("user", userId);
  try {
    const userGroups = await UserGroup.find({ user_id: userId })
      //.populate("group_id") // 그룹 정보까지 함께 가져오기
      //   .populate("user_id") // 유저 정보도 필요하다면
      .exec();

    res.status(200).json(userGroups);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

// user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   group_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Group",
//     required: true,
//   },
//   role: {
//     type: String,
//     default: "member", // admin, member 등
//     trim: true,
//   },
//   joined_at: {
//     type: Date,
//     default: Date.now,
//   },
