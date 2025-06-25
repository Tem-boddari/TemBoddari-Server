const { verifyToken } = require("../utils/token");

function authenticate(req, res, next) {
  let token = req.cookies.authToken;
  const headerToken = req.headers.authorization;

  if (!token && headerToken) {
    token = headerToken.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "토큰 없음" });
  }

  try {
    const user = verifyToken(token);
    if (!user) {
      return res.status(403).json({ message: "유효하지 않은 토큰" });
    }

    req.user = user; // ✅ 이후 라우터에서 user 정보 사용 가능
    next();
  } catch (err) {
    return res.status(403).json({ message: "토큰 검증 실패" });
  }
}

module.exports = authenticate;
