const express = require("express");
require("dotenv").config(); // .env 파일의 환경변수를 불러옴

const app = express();
const port = process.env.PORT || 5000; // .env 파일의 PORT를 사용하거나, 없으면 3000번 사용

app.get("/", (req, res) => {
  res.send("Hello from my Express server!");
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
