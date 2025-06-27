// routes/users.js (전체 수정된 코드)

var express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/auth");
const { createToken } = require("../utils/token");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* --- 회원가입 --- */
router.post("/signup", async (req, res) => {
  try {
    const { nickname, email, password, checkPassword } = req.body;

    if (password !== checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }

    const user = await User.signUp(nickname, email, password);
    console.log("회원가입 성공:", user.nickname);

    res.status(201).json({
      success: true,
      user: {
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("회원가입 중 에러 발생:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `이미 사용 중인 ${
          field === "email" ? "이메일" : "닉네임"
        }입니다.`,
      });
    }
    res.status(500).json({
      success: false,
      message: "서버 내부 오류가 발생했습니다. 다시 시도해주세요.",
    });
  }
});

/* --- 로그인 --- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    if (!user) {
      // login 메소드 내에서 에러를 던지므로 이 코드는 실행되지 않을 수 있지만, 방어적으로 추가
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const tokenMaxAge = 60 * 60 * 24 * 3; // 3일
    const tokenPayload = { _id: user._id, email: user.email };
    const token = createToken(tokenPayload, tokenMaxAge);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      domain: isProduction ? ".your-production-domain.com" : undefined, // 나중에 실제 도메인으로 변경
    });

    console.log("로그인 성공:", user.email);

    // 로그인 성공 응답도 signup과 동일한 구조로 통일
    res.status(200).json({
      // 201 Created가 아니라 200 OK가 더 적절
      success: true,
      user: {
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("로그인 중 에러 발생:", err);
    res.status(401).json({
      success: false,
      message: err.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
    });
  }
});

/* --- 로그아웃 --- */
router.all("/logout", async (req, res) => {
  try {
    // 쿠키를 지울 때는 생성할 때와 동일한 옵션(path, domain 등)을 줘야 정확히 지워집니다.
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(0), // 만료일을 과거로 설정하여 즉시 삭제
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      domain: isProduction ? ".your-production-domain.com" : undefined,
    });
    console.log("로그아웃 성공");
    res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
  } catch (err) {
    console.error("로그아웃 중 에러 발생:", err);
    res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
});

/* --- 내 정보 확인 --- */
router.get("/me", authenticate, async (req, res) => {
  try {
    // authenticate 미들웨어에서 req.user를 이미 찾아왔으므로 다시 DB를 조회할 필요가 없습니다.
    // 만약 토큰의 정보가 아닌 최신 정보가 필요하다면 DB 조회를 유지합니다.
    const user = req.user; // 미들웨어에서 전달된 사용자 정보

    res.status(200).json({
      success: true,
      user: {
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    console.error("내 정보 조회 중 에러 발생:", err);
    res.status(500).json({ success: false, message: "서버 에러" });
  }
});

module.exports = router;
