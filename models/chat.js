const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  userIdOne: {
    require: true,
    type: String,
    trim: true,
  },
  userIdTwo: {
    require: true,
    type: String,
    trim: true,
  },
  messages: {
    type: Array,
    default: [],
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
