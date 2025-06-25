const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // .env 파일의 환경변수를 불러옴
const usersRouter = require("./routes/users");
const groupsRouter = require("./routes/groups");
const categoryRouter = require("./routes/category");
const recommendRouter = require("./routes/recommends");
const mongoose = require("mongoose");
const DB_URL =
  "mongodb+srv://pitapatsun:JyBVgDPw2HTXGacA@team-boddari.in7nfkt.mongodb.net/?retryWrites=true&w=majority&appName=Team-boddari";
mongoose
  .connect(DB_URL, {
    retryWrites: true,
    w: "majority",
    appName: "Team-boddari",
  })
  .then(() => {
    console.log("Connected Successful");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
const port = process.env.PORT || 5000; // .env 파일의 PORT를 사용하거나, 없으면 3000번 사용
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", usersRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/recommend", recommendRouter);
app.get("/", (req, res) => {
  res.send("Hello from my Express server!");
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json(res.locals);
});
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
module.exports = app;
