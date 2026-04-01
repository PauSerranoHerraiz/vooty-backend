const mongoose = require('mongoose');
const Vote = require('../models/Vote');
const Poll = require('../models/Poll');

exports.votePoll = async (req, res) => {
  const { pollId, userId, optionIndex } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid pollId format.' });
    }

    const parsedOptionIndex = Number(optionIndex);
    if (!Number.isInteger(parsedOptionIndex) || parsedOptionIndex < 0) {
      return res.status(400).json({ message: 'Invalid optionIndex.' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    if (!poll.options?.[parsedOptionIndex]) {
      return res.status(400).json({ message: 'Option does not exist in this poll.' });
    }

    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted for this post.' });
    }

    const vote = new Vote({
      pollId,
      userId,
      optionIndex: parsedOptionIndex
    });

    await vote.save();

    poll.options[parsedOptionIndex].votes += 1;
    await poll.save();

    res.json({ message: 'Vote recorded successfully!', poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};