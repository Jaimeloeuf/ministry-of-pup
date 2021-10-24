if (!process.env.BOT_TOKEN) throw new Error("Missing BOT_TOKEN");

const tApiURL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

/**
 * Simple wrapper to call the sendMessage API.
 * fetch lib is loaded lazily within and used directly
 *
 * Using HTML for formmating instead of MarkdownV2 due to the restrictions in place for parsing markdown text.
 * Especially when trying to send user input directly to telegram API, it may crash as user may use special
 * reserved characters and cause server the crash. Thus the fix to this is just use HTML formatting instead.
 * See links below for reference on this issue.
 *
 * https://core.telegram.org/bots/api#markdownv2-style
 * https://stackoverflow.com/questions/62600596/why-is-a-reserved-character-in-markdownv2-in-telegrams-bot-api
 * https://github.com/telegraf/telegraf/issues/1242
 *
 * @param {String} msg Notification message (HTML format) to send
 */
module.exports = (msg) =>
  require("tiny-json-http")
    .post({
      url: tApiURL,
      data: {
        chat_id: -1001795694004,
        text: msg,
        parse_mode: "HTML",
      },
    })
    .then((resp) => resp.body);
