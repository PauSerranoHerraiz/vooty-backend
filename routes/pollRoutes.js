const express = require("express");
const router = express.Router();
const { getPolls, createPoll } = require("../controllers/pollController");

router.get("/", getPolls);
router.post("/", createPoll);

module.exports = router;