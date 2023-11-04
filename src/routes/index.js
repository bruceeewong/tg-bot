const router = require("express").Router();
const webhookRouter = require("./webhooks");

router.use("/webhook", webhookRouter);

module.exports = router;
