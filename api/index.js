const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Xotirada reytingni saqlash
let usersDatabase = {};

// Ball yozish API
app.post('/api/score', (req, res) => {
  try {
    const { userId, name, points } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID topilmadi" });
    }

    if (usersDatabase[userId]) {
      usersDatabase[userId].score += parseInt(points || 0);
    } else {
      usersDatabase[userId] = {
        name: name || "O'yinchi",
        score: parseInt(points || 0)
      };
    }

    return res.json({ success: true, score: usersDatabase[userId].score });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Reyting olish API
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = Object.values(usersDatabase)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return res.json({ success: true, leaderboard });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
