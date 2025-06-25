// routes/recommends.js
const express = require("express");
const Recommendation = require("../models/Recommendation");

const router = express.Router();

/**
 * 추천 글 작성
 * POST /api/recommends
 */
router.post("/", async (req, res, next) => {
  try {
    const { user_id, category_id, title, content, price, product_link } =
      req.body;
    const recommend = await Recommendation.create({
      user_id,
      category_id,
      title,
      content,
      price,
      product_link,
    });

    console.log("작성 완료:", recommend._id);
    res.status(201).json({ message: "작성 완료", recommend });
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

/**
 * 추천 글 전체 조회
 * GET /api/recommends
 */
router.get("/", async (req, res, next) => {
  try {
    const recommends = await Recommendation.find().populate(
      "user_id",
      "nickname email"
    );
    console.log("전체 조회 완료: 총", recommends.length, "건");
    res.json({ message: "전체 조회 완료", recommends });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

/**
 * 추천 글 수정
 * PUT /api/recommends/:recommendId
 */
router.put("/:recommendId", async (req, res, next) => {
  try {
    const { recommendId } = req.params;
    const updateData = req.body;
    const updated = await Recommendation.findByIdAndUpdate(
      recommendId,
      updateData,
      { new: true }
    );

    if (!updated) {
      console.log("수정 실패: 해당 ID 없음", recommendId);
      return res
        .status(404)
        .json({ message: "수정할 추천 글을 찾을 수 없습니다." });
    }

    console.log("수정 완료:", recommendId);
    res.json({ message: "수정 완료", updated });
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

/**
 * 추천 글 삭제
 * DELETE /api/recommends/:recommendId
 */
router.delete("/:recommendId", async (req, res, next) => {
  try {
    const { recommendId } = req.params;
    const deleted = await Recommendation.findByIdAndDelete(recommendId);

    if (!deleted) {
      console.log("삭제 실패: 해당 ID 없음", recommendId);
      return res
        .status(404)
        .json({ message: "삭제할 추천 글을 찾을 수 없습니다." });
    }

    console.log("삭제 완료:", recommendId);
    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

/**
 * 추천 글 상세 조회
 * GET /api/recommends/:recommendId
 */
router.get("/:recommendId", async (req, res, next) => {
  try {
    const { recommendId } = req.params;
    const recommend = await Recommendation.findById(recommendId).populate(
      "user_id",
      "nickname email"
    );

    if (!recommend) {
      console.log("상세 조회 실패: 해당 ID 없음", recommendId);
      return res
        .status(404)
        .json({ message: "해당 추천 글을 찾을 수 없습니다." });
    }

    console.log("상세 조회 완료:", recommendId);
    res.json({ message: "상세 조회 완료", recommend });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

module.exports = router;
