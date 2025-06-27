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
    const { nickname, email, password } = req.body;
    const user = await User.signUp(nickname, email, password);
    console.log("회원가입", user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
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
      sameSite: "lax",
      secure: false,
    });
    console.log("로그인 성공", user.email);
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
