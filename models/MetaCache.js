const mongoose = require("mongoose");

const metaCacheSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    image: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MetaCache", metaCacheSchema);
