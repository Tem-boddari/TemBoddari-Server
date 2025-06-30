// models/GroupPurchase.js
const mongoose = require("mongoose");

const groupPurchaseSchema = new mongoose.Schema(
  {
    // 어떤 추천에서 시작되었는지
    recommendation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation",
    },

    // 공구 개설자
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 카테고리 (추천과 동일한 분류)
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // 공구 제목 (추천 제목과 다를 수 있음)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 원가
    original_price: {
      type: Number,
      required: true,
    },

    // 목표 인원
    max_participants: {
      type: Number,
      required: true,
    },

    // 마감일
    end_date: {
      type: Date,
      required: true,
    },

    // 상세 내용
    content: {
      type: String,
      required: false,
    },

    // 상태: 진행중, 성공, 실패, 취소
    status: {
      type: String,
      enum: ["진행중", "성공", "실패", "취소"],
      default: "진행중",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("GroupPurchase", groupPurchaseSchema);
