const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  newsHeader: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("news", newsSchema);
