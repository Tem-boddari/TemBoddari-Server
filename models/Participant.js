// models/Participant.js
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group_purchase_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupPurchase",
    required: true,
  },
  joined_at: {
    type: Date,
    default: Date.now,
  },
});

// user_id + group_purchase_id 조합 유니크 설정
participantSchema.index({ user_id: 1, group_purchase_id: 1 }, { unique: true });

module.exports = mongoose.model("Participant", participantSchema);
