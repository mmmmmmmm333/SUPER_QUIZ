const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Foydalanuvchilar ma'lumotlari uchun xotira
let usersDB = {};

// Foydalanuvchi ma'lumotlarini olish
app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    if (!usersDB[userId]) {
        usersDB[userId] = { score: 0, sessions: 0 };
    }
    res.json({ success: true, data: usersDB[userId] });
});

// Ballni yangilash
app.post('/api/score', (req, res) => {
    const { userId, points } = req.body;
    if (!usersDB[userId]) {
        usersDB[userId] = { score: 0, sessions: 0 };
    }
    usersDB[userId].score += points;
    res.json({ success: true, score: usersDB[userId].score });
});

// Reyting ro'yxati (Leaderboard)
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = Object.keys(usersDB).map(id => ({
        id,
        name: `O'yinchi_${id.slice(-4)}`,
        score: usersDB[id].score
    })).sort((a, b) => b.score - a.score).slice(0, 10);
    
    res.json({ success: true, leaderboard });
});

// Vercel Serverless Function sifatida ishlashi uchun zarur:
module.exports = app;
      
