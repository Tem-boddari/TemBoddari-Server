// test/testModels.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const Category = require("../models/Category");
const Recommendation = require("../models/Recommendation");
const GroupPurchase = require("../models/GroupPurchase");
const Like = require("../models/Like");
const Participant = require("../models/Participant");
const Image = require("../models/Image");

(async () => {
  try {
    // 1) DB 연결
    await mongoose.connect(process.env.DB_URL);
    console.log("[테스트] DB 연결 성공");

    // 1-1) 기존 데이터 초기화
    await mongoose.connection.db.dropDatabase();
    console.log("[테스트] DB 초기화 완료");

    // 2) 카테고리 생성 테스트
    const category = await Category.create({ name: "테스트카테고리" });
    console.log("[테스트] 카테고리 생성:", category);

    // 3) 그룹 생성 테스트
    const group = await Group.create({
      name: "테스트그룹",
      invitation_code: "1234",
    });
    console.log("[테스트] 그룹 생성:", group);

    // 4) 유저 생성 테스트
    const user = await User.signUp(
      "테스트닉네임",
      "test@example.com",
      "비번1234"
    );
    console.log("[테스트] 유저 생성:", user);

    // 5) UserGroup 생성 테스트
    const ug = await UserGroup.create({
      user_id: user._id,
      group_id: group._id,
      role: "member",
    });
    console.log("[테스트] UserGroup 생성:", ug);

    // 6) Recommendation 생성 테스트
    const rec = await Recommendation.create({
      user_id: user._id,
      category_id: category._id,
      title: "테스트 추천 제목",
      content: "이것은 테스트용 추천 내용입니다.",
      price: 10000,
      product_link: "https://example.com/product/123",
    });
    console.log("[테스트] Recommendation 생성:", rec);

    // 7) GroupPurchase 생성 테스트
    const gp = await GroupPurchase.create({
      recommendation_id: rec._id,
      user_id: user._id,
      category_id: category._id,
      title: "테스트 공구 제목",
      original_price: 50000,
      max_participants: 5,
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 일주일 뒤
      // status는 기본값 '진행중' 사용
    });
    console.log("[테스트] GroupPurchase 생성:", gp);

    // 8) Like 생성 테스트
    const like = await Like.create({
      user_id: user._id,
      recommendation_id: rec._id,
    });
    console.log("[테스트] Like 생성:", like);

    // 9) Participant 생성 테스트
    const participant = await Participant.create({
      user_id: user._id,
      group_purchase_id: gp._id,
    });
    console.log("[테스트] Participant 생성:", participant);

    // 10) Recommendation 관련 이미지 생성 테스트
    const imgRec = await Image.create({
      image_url:
        "https://cdn.eyesmag.com/content/uploads/posts/2025/01/22/shutterstock_2491179401-06f50759-c2c5-49cb-b10b-ba47ca6d2166.jpg",
      related_entity_type: "Recommendation",
      related_entity_id: rec._id,
    });
    console.log("[테스트] 추천 이미지 생성:", imgRec);

    // 11) GroupPurchase 관련 이미지 생성 테스트
    const imgGp = await Image.create({
      image_url:
        "https://images.mypetlife.co.kr/content/uploads/2023/04/18140421/AdobeStock_212879665-1024x670.jpeg",
      related_entity_type: "GroupPurchase",
      related_entity_id: gp._id,
    });
    console.log("[테스트] 공구 이미지 생성:", imgGp);
  } catch (err) {
    console.error("[테스트] 오류 발생:", err);
  } finally {
    await mongoose.disconnect();
    console.log("[테스트] DB 연결 종료");
  }
})();
