const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

const GroupPurchase = require("../models/GroupPurchase");
const UserGroup = require("../models/UserGroup");
const Participant = require("../models/Participant");

// 공구 상태 갱신 함수
async function updateGroupbuyStatus(groupbuy) {
  if (groupbuy.status !== "진행중") return groupbuy;

  console.log("상태 갱신 실행 중 ");
  const now = new Date();

  // 현재 참여자 수 확인
  const participantCount = await Participant.countDocuments({
    group_purchase_id: groupbuy._id,
  });

  if (participantCount >= groupbuy.max_participants) {
    groupbuy.status = "성공";
    await groupbuy.save();
    return groupbuy;
  }

  // 마감일이 지났고 참여자 미달인 경우
  if (now > groupbuy.end_date) {
    groupbuy.status = "실패"; // 또는 "실패" 등 원하시는 명칭
    await groupbuy.save();
  }

  return groupbuy;
}

/**
 * 공구 생성
 * POST /api/groupbuys
 */
router.post("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const user_id = req.user._id;
    const {
      recommendation_id,
      category_id,
      title,
      original_price,
      max_participants,
      end_date,
      content,
      image_url,
    } = req.body;

    const groupbuy = await GroupPurchase.create({
      recommendation_id,
      user_id,
      category_id,
      title,
      original_price,
      max_participants,
      end_date,
      content,
      image_url,
    });

    res.status(201).json({ message: "공구 생성 완료", groupbuy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * 로그인 한 유저가 속한 그룹의 사용자들이 개설한 공구만 조회
 * GET /api/groupbuys
 */
router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const currentUserId = req.user._id;
    console.log("현재 로그인 사용자 ID:", currentUserId);

    // 1. 로그인한 사용자가 속한 그룹 ID 목록 조회
    const userGroups = await UserGroup.find({ user_id: currentUserId });

    if (!userGroups.length) {
      return res.status(200).json({
        message: "소속된 그룹이 없습니다.",
        groupbuys: [],
      });
    }

    const groupIds = userGroups.map((ug) => ug.group_id);
    console.log("소속 그룹 ID 목록:", groupIds);

    // 2. 같은 그룹에 속한 모든 유저 ID 조회
    const usersInGroups = await UserGroup.find({ group_id: { $in: groupIds } });
    const userIds = usersInGroups.map((ug) => ug.user_id);
    console.log("같은 그룹 사용자 ID 목록:", userIds);

    // 3. 해당 유저들이 만든 공구만 조회
    let groupbuys = await GroupPurchase.find({ user_id: { $in: userIds } })
      .populate("user_id", "nickname email")
      .populate("recommendation_id", "title")
      .sort({ createdAt: -1 });

    // ✅ 상태 확인 및 갱신 추가
    groupbuys = await Promise.all(
      groupbuys.map(async (groupbuy) => {
        const updated = await updateGroupbuyStatus(groupbuy);

        // ✅ 참여자 수 추가
        const participantCount = await Participant.countDocuments({
          group_purchase_id: groupbuy._id,
        });

        return {
          ...updated.toObject(), // 객체화
          participants: participantCount, // ✅ 포함
        };
      })
    );

    console.log("공구 조회 완료:", groupbuys.length, "건");
    res.status(200).json({ message: "공구 조회 완료", groupbuys });
  } catch (err) {
    console.error("공구 조회 중 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * 공구 상세 조회
 * GET /api/groupbuys/:groupbuyId
 */
router.get("/:groupbuyId", async (req, res, next) => {
  try {
    const { groupbuyId } = req.params;

    let groupbuy = await GroupPurchase.findById(groupbuyId)
      .populate("user_id", "nickname email")
      .populate("recommendation_id", "title");

    if (!groupbuy) {
      return res.status(404).json({ message: "해당 공구를 찾을 수 없습니다." });
    }

    groupbuy = await updateGroupbuyStatus(groupbuy);

    const participantCount = await Participant.countDocuments({
      group_purchase_id: groupbuy._id,
    });

    res.json({
      message: "공구 상세 조회 완료",
      groupbuy: {
        ...groupbuy.toObject(),
        participants: participantCount, // ✅ 포함
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

/**
 * 공구 수정
 * PUT /api/groupbuys/:groupbuyId
 */
router.put("/:groupbuyId", authenticate, async (req, res, next) => {
  try {
    const { groupbuyId } = req.params;
    const updateData = req.body;

    const updated = await GroupPurchase.findByIdAndUpdate(
      groupbuyId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "수정할 공구를 찾을 수 없습니다." });
    }

    res.json({ message: "공구 수정 완료", updated });
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

/**
 * 공구 삭제
 * DELETE /api/groupbuys/:groupbuyId
 */
router.delete("/:groupbuyId", authenticate, async (req, res, next) => {
  try {
    const { groupbuyId } = req.params;

    const deleted = await GroupPurchase.findByIdAndDelete(groupbuyId);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "삭제할 공구를 찾을 수 없습니다." });
    }

    res.json({ message: "공구 삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(err);
  }
});

module.exports = router;
