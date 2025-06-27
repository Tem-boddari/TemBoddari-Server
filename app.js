const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const usersRouter = require("./routes/users");
const groupsRouter = require("./routes/groups");
const categoryRouter = require("./routes/category");
const recommendRouter = require("./routes/recommends");
const userGroupRoutes = require("./routes/usergroup");
const groupbuyRoutes = require("./routes/groupbuys");
const cors = require("cors");
const mongoose = require("mongoose");

// Next.js SSR 배포
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({
  dev,
  dir: "C:/Users/campus3S018/Desktop/dev/TemBoddari-Client",
});
const handle = nextApp.getRequestHandler();

/* DB 연결 */
mongoose
  .connect(process.env.DB_URL, {
    retryWrites: true,
    w: "majority",
    appName: "Team-boddari",
  })
  .then(() => console.log("Connected Successful"))
  .catch((err) => console.log(err));

/* Express 앱 */
const app = express();
const port = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

/* CORS */
const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_ORIGIN];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
/* 공통 미들웨어 */
app.use(cookieParser());
app.use(express.json());

/* API 라우터 */
app.use("/api/auth", usersRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/recommend", recommendRouter);
app.use("/api/usergroup", userGroupRoutes);
app.use("/api/groupbuys", groupbuyRoutes);

/* 기본 라우트 (Health Check) */
app.get("/health", (_, res) => res.send("OK")); // 기존 ‘/’는 Next가 처리

/* 에러 핸들러 */
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: dev ? err : {},
  });
});

/* Next.js 준비 후 서버 기동 */
nextApp.prepare().then(() => {
  // Next.js가 처리하지 않은 나머지 라우트
  app.use((req, res) => handle(req, res));
  app.listen(port, HOST, () => {
    console.log(`🌐 Server + SSR running at http://${HOST}:${port}`);
  });
});

module.exports = app;
