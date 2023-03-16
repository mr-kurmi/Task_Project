const jwt = require("jsonwebtoken");
var fs = require("fs");
var yaml = require("js-yaml");
var messageList = yaml.load(fs.readFileSync("./configs/message.yaml"));

/**
 * This function is used to send reply with standard JSON format
 */
const sendMsg = function (messageType, messageCode, req, res, data) {
  messageType = messageType.toLowerCase().trim();
  let msg = messageList[messageType][messageCode];

  if (messageType === "error") {
    res.status(msg.code).json({ status: messageType, message: msg.message });
    return false;
  } else {
    if (data) {
      res.status(msg.code).json({ status: messageType, message: msg.message, data: data });
      return false;
    } else {
      res.status(msg.code).json({ status: messageType, message: msg.message });
      return false;
    }
  }
};

module.exports = {
  sendMsg,
};
