const Poll = require("../models/Poll");

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching polls" });
  }
};

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Question and at least 2 options are required" });
    }

    const poll = new Poll({
      question,
      options: options.map((option) => ({ text: option })),
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: "Error creating poll" });
  }
};