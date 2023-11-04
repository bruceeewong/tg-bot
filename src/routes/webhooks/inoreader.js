const router = require("express").Router();
const env = require("../../env");
const axios = require("axios");

if (!env.TG_CHAT_ID || !env.TG_BOT_TOKEN) {
  throw new Error("TG env variables are not set properly");
}
const CHANNEL_ID = env.TG_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;

router.post("/", (req, res) => {
  const data = req.body;

  if (data.items && data.items.length > 0) {
    data.items.forEach((item) => {
      const title = item.title || "No Title";
      const url =
        item.canonical && item.canonical.length > 0
          ? item.canonical[0].href
          : "No URL";
      const message = `<b>[Inoreader] ${escapeHTML(title)}</b>\n${escapeHTML(
        url
      )}`;

      sendMessageToChannel(message);
    });
  }

  res.status(200).send("OK");
});

function sendMessageToChannel(text) {
  axios
    .post(TELEGRAM_API_URL, {
      chat_id: CHANNEL_ID,
      text: text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    })
    .catch((error) => {
      logger.error(error);
    });
}

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = router;
