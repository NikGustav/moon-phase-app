const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5501;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 月相数据 API
app.get('/api/moonphase', (req, res) => {
    const moonPhase = {
        phase: '下弦月',
        date: new Date().toISOString(),
        illumination: '50%'
    };
    res.json(moonPhase);
});

// 用户数据 API
let userProfile = {
    birthday: '2000-01-01',
    zodiac: '摩羯座'
};

app.get('/api/user', (req, res) => {
    res.json(userProfile);
});

app.post('/api/user', (req, res) => {
    userProfile = { ...userProfile, ...req.body };
    res.json(userProfile);
});

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '抱歉，服务器暂时无法处理请求，请稍后再试' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 