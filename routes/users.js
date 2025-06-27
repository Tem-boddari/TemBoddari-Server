var express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/auth");
const { createToken } = require("../utils/token");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { nickname, email, password, checkPassword } = req.body;

    // 비밀번호 확인
    if (password !== checkPassword) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const user = await User.signUp(nickname, email, password);
    console.log("회원가입", user);

    const responseData = {
      success: true,
      user: {
        nickname: user.nickname,
        email: user.email,
      },
    };
    // 서버가 진짜로 보내려는 데이터가 무엇인지 터미널에 찍어봅니다.
    console.log("!!! 최종 응답으로 보낼 데이터:", JSON.stringify(responseData));

    res.status(201).json(responseData);
  } catch (err) {
    console.error("회원가입 중 에러 발생:", err);

    // Mongoose 중복 키 에러(코드 11000)인 경우
    if (err.code === 11000) {
      // 어떤 키가 중복되었는지 확인 (email 또는 nickname)
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        // 409 Conflict 상태 코드가 더 적절
        success: false,
        message: `이미 사용 중인 ${
          field === "email" ? "이메일" : "닉네임"
        }입니다.`,
      });
    }

    // 그 외의 다른 서버 에러
    res.status(500).json({
      success: false,
      message: "서버 내부 오류가 발생했습니다. 다시 시도해주세요.",
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    if (!user) {
      return res.status(401).json({ message: "User null" });
    }

    const tokenMaxAge = 60 * 60 * 24 * 3;
    const tokenPayload = {
      _id: user._id,
      email: user.email,
    };
    const token = createToken(tokenPayload, tokenMaxAge);
    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      sameSite: "none",
      secure: true,
      domain: ".52.79.109.73",
    });
    console.log("로그인 성공", user.email);
    console.log("토큰 생성됨:", token.substring(0, 20) + "...");
    console.log("쿠키 설정:", {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({
      nickname: user.nickname,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", async (req, res, next) => {
  try {
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    console.log("로그아웃 성공");
    res.status(200).send("logout Successful");
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.status(200).json({
      message: "인증됨",
      user: {
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러" });
  }
});

module.exports = router;
