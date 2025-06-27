// routes/recommends.js
const express = require("express");
const Recommendation = require("../models/Recommendation");
const UserGroup = require("../models/UserGroup");
const Like = require("../models/Like");

const router = express.Router();
const authenticate = require("../middleware/auth");
/**
 * 추천 글 작성
 * POST /api/recommend
 */
router.post("/", authenticate, async (req, res) => {
  try {
    // 1) user_id 중복 선언 제거
    if (!req.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
    const user_id = req.user._id; // 로그인된 유저

    // 2) req.body에서 user_id 빼고 나머지만 구조 분해
    const { category_id, title, content, price, product_link } = req.body;

    const recommend = await Recommendation.create({
      user_id,
      category_id,
      title,
      content,
      price,
      product_link,
    });

    res.status(201).json({ message: "작성 완료", recommend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * 로그인 한 유저가 있는 그룹의 데이터만 조회
 * GET /api/recommend
 */
// router.get("/", authenticate, async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "로그인이 필요합니다." });
//     }

//     const currentUserId = req.user._id;
//     console.log("현재 로그인 사용자 ID:", currentUserId);

//     // 1. 현재 로그인한 사용자의 그룹 목록 조회
//     const userGroups = await UserGroup.find({ user_id: currentUserId });
//     if (!userGroups.length) {
//       return res
//         .status(200)
//         .json({ message: "소속된 그룹이 없습니다.", recommends: [] });
//     }

//     const groupIds = userGroups.map((ug) => ug.group_id);
//     console.log("소속 그룹 ID 목록:", groupIds);

//     // 2. 해당 그룹에 속한 모든 사용자 ID 조회
//     const usersInGroups = await UserGroup.find({ group_id: { $in: groupIds } });
//     const userIds = usersInGroups.map((ug) => ug.user_id);
//     console.log("같은 그룹 사용자 ID 목록:", userIds);

//     // 3. 추천 글 조회 (같은 그룹 사용자들이 작성한 것만)
//     const recommends = await Recommendation.find({ user_id: { $in: userIds } })
//       .populate("user_id", "nickname email")
//       .sort({ createdAt: -1 });

//     console.log("추천 글 조회 완료:", recommends.length, "건");
//     res.status(200).json({ message: "추천 글 조회 완료", recommends });
//   } catch (err) {
//     console.error("추천 글 조회 중 오류:", err);
//     res.status(500).json({ message: "서버 오류가 발생했습니다." });
//   }
// });

/**
 * 추천 글 전체 조회
 * GET /api/recommend
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
 * PUT /api/recommend/:recommendId
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
 * 추천 글 삭제 + 관련 탐나요 삭제
 * DELETE /api/recommends/:recommendId
 */
router.delete("/:recommendId", async (req, res, next) => {
  try {
    const { recommendId } = req.params;

    // 1. 추천 글 삭제
    const deleted = await Recommendation.findByIdAndDelete(recommendId);
    if (!deleted) {
      console.log("삭제 실패: 해당 ID 없음", recommendId);
      return res
        .status(404)
        .json({ message: "삭제할 추천 글을 찾을 수 없습니다." });
    }

    // 2. 해당 추천 글에 달린 모든 '탐나요'도 삭제
    await Like.deleteMany({ recommendation_id: recommendId });

    console.log("추천 글 및 탐나요 삭제 완료:", recommendId);
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

/**
 * 추천 글 탐나요
 * POST /api/recommends/:recommendId/likes
 * Body: { user_id }
 */
router.post("/:recommendId/likes", async (req, res, next) => {
  try {
    const { recommendId } = req.params;
    const { user_id } = req.body;

    // 추천 글 존재 확인
    const recommend = await Recommendation.findById(recommendId);
    if (!recommend) {
      console.log("탐나요 실패: 추천 글 없음", recommendId);
      return res
        .status(404)
        .json({ message: "해당 추천 글을 찾을 수 없습니다." });
    }

    // 탐나요 생성
    const like = await Like.create({
      user_id,
      recommendation_id: recommendId,
    });

    console.log("탐나요 완료:", like._id);
    res.status(201).json({ message: "탐나요 완료", like });
  } catch (err) {
    // 이미 탐나요를 누른 경우
    if (err.code === 11000) {
      console.log(
        "탐나요 실패: 중복",
        req.params.recommendId,
        req.body.user_id
      );
      return res.status(400).json({ message: "이미 탐나요를 눌렀습니다." });
    }
    console.error(err);
    res.status(500);
    next(err);
  }
});

/**
 * 추천 글 탐나요 취소
 * DELETE /api/recommends/:recommendId/likes
 * Body: { user_id }
 */
router.delete("/:recommendId/likes", async (req, res, next) => {
  try {
    const { recommendId } = req.params;
    const { user_id } = req.body;

    const deleted = await Like.findOneAndDelete({
      user_id,
      recommendation_id: recommendId,
    });

    if (!deleted) {
      console.log("탐나요 취소 실패: 해당 좋아요 없음", recommendId, user_id);
      return res.status(404).json({ message: "취소할 탐나요가 없습니다." });
    }

    console.log("탐나요 취소 완료:", recommendId, user_id);
    res.json({ message: "탐나요 취소 완료" });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

/**
 * 특정 추천 글 좋아요 개수 조회
 * GET /api/recommends/:recommendId/likes/count
 */
router.get("/:recommendId/likes/count", async (req, res, next) => {
  try {
    const { recommendId } = req.params;
    const count = await Like.countDocuments({ recommendation_id: recommendId });

    console.log("탐나요 개수 조회 완료:", recommendId, count);
    res.json({ message: "탐나요 개수 조회 완료", count });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

module.exports = router;
