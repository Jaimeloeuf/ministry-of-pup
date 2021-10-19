const tapi = require("./tapiFF.js")();

/**
 * Simple wrapper to call the sendMessage API
 * @param {String} msg Notification message (can be in markdown format) to send
 */
module.exports = (msg) =>
  tapi("sendMessage", {
    chat_id: -1001795694004,
    text: msg,
    parse_mode: "MarkdownV2",
  });
