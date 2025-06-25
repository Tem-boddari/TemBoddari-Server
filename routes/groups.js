var express = require("express");
const Group = require("../models/Group");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond group");
});

router.post("/", async function (req, res, next) {
  try {
    const data = req.body;
    console.log("그룹 생성", data);

    const group = await Group.create({
      name: data.name,
      invitation_code: data.invitation_code,
    });

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

module.exports = router;
