Reemplaza getPolls por esto:

const Poll = require("../models/Poll");

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });

    const pollsWithStats = polls.map(poll => {
      const totalVotes = poll.options.reduce(
        (sum, option) => sum + option.votes,
        0
      );

      const optionsWithPercentage = poll.options.map(option => ({
        text: option.text,
        votes: option.votes,
        percentage:
          totalVotes === 0
            ? 0
            : Math.round((option.votes / totalVotes) * 100)
      }));

      return {
        _id: poll._id,
        question: poll.question,
        options: optionsWithPercentage,
        totalVotes,
        createdAt: poll.createdAt
      };
    });

    res.json(pollsWithStats);

  } catch (error) {
    res.status(500).json({ error: error.message });
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