const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("PulseUp API running");
});

app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});