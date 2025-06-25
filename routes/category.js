var express = require("express");
var router = express.Router();
var Category = require("../models/Category");
router.post("/", async function (req, res, next) {
  try {
    const data = req.body;
    console.log("카테고리 생성 성공");

    const category = await Category.create(data);

    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

module.exports = router;
