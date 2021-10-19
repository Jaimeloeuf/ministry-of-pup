/**
 * tapi (telegram API) Factory Function
 *
 * Built by referencing  https://github.com/Enkel-Digital/yatbl/blob/master/src/tapiFF.js
 * @param {String} [BOT_TOKEN=process.env.BOT_TOKEN] Telegram bot token, to generate the base telegram API url
 * @returns {Function} The tapi function
 */
module.exports = function tapiFF(BOT_TOKEN = process.env.BOT_TOKEN) {
  if (!BOT_TOKEN) throw new Error("Missing BOT_TOKEN");

  const baseUrl = `https://api.telegram.org/bot${BOT_TOKEN}/`;

  // Load fetch lib lazily, only if the FF is invoked
  const fetch = require("tiny-json-http");

  /**
   * tapi function that uses HTTP POST and JSON body to send data to telegram's API
   * @function tapi
   * @param {string} tApiMethod Telegram API method found on https://core.telegram.org/bots/api#available-methods
   * @param {object} body Request body for the API
   * @returns {Promise<object>} Returned object from telegram's API
   */
  return (tApiMethod, body) =>
    fetch
      .post({ url: baseUrl + tApiMethod, data: body })
      .then((resp) => resp.body);
};
