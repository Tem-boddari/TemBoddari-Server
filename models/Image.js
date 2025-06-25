// models/Image.js
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    related_entity_type: {
      type: String,
      required: true,
      enum: ["Recommendation", "GroupPurchase"],
    },
    related_entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "related_entity_type",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Image", imageSchema);
