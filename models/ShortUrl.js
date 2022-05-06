const mongoose = require("mongoose");
const shortId = require("shortid");

const ShortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("ShortUrl", ShortUrlSchema);
