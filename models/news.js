const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  newsHeader: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("news", newsSchema);
