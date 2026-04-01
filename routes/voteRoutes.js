const express = require('express');
const router = express.Router();
const { votePoll } = require('../controllers/voteController');

router.post('/', votePoll);

module.exports = router;