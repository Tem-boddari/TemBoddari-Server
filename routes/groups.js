var express = require("express");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const authenticate = require("../middleware/auth");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond group");
});

// 그룹 생성하기
router.post("/", async function (req, res, next) {
  try {
    const data = req.body;
    console.log("그룹 생성", data);

    const group = await Group.create({
      name: data.name,
      invitation_code: data.invitation_code,
    });
    console.log("그룹 생성 완료", group.name);
    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

// 그룹 참여하기
router.post("/:groupId/join", authenticate, async function (req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    console.log(req.params);
    console.log("요청된 groupId:", groupId);
    console.log("요청된 userId:", userId);

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const userGroup = await UserGroup.create({
      group_id: groupId,
      user_id: userId,
    });

    console.log("그룹에 참여했습니다.");

    res.json(userGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
