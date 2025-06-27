const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const Participant = require("../models/Participant");

// 공구 참여
router.post("/", authenticate, async (req, res) => {
  try {
    const user_id = req.user._id;
    const { group_purchase_id } = req.body;

    if (!group_purchase_id) {
      return res
        .status(400)
        .json({ message: "group_purchase_id가 필요합니다." });
    }

    const exists = await Participant.findOne({ user_id, group_purchase_id });
    if (exists) {
      return res.status(400).json({ message: "이미 참여한 공구입니다." });
    }

    const participant = await Participant.create({
      user_id,
      group_purchase_id,
    });
    res.status(201).json({ message: "공구 참여 완료", participant });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "이미 참여한 공구입니다." });
    }
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 공구 참여자 조회
router.get("/", async (req, res) => {
  try {
    const { group_purchase_id } = req.query;
    if (!group_purchase_id) {
      return res
        .status(400)
        .json({ message: "group_purchase_id가 필요합니다." });
    }

    const participants = await Participant.find({ group_purchase_id });
    res.status(200).json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 공구 참여 취소
router.delete("/", authenticate, async (req, res) => {
  try {
    const user_id = req.user._id;
    const { group_purchase_id } = req.body;

    if (!group_purchase_id) {
      return res
        .status(400)
        .json({ message: "group_purchase_id가 필요합니다." });
    }

    const deleted = await Participant.findOneAndDelete({
      user_id,
      group_purchase_id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "참여 내역이 없습니다." });
    }
    res.status(200).json({ message: "공구 참여 취소 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
