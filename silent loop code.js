
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

app.post('/webhook', (req, res) => {
    const events = req.body.events;
    events.forEach(event => {
        if (event.type === 'message' && event.message.type === 'text') {
            const userMessage = event.message.text;
            replyToUser(event.replyToken, {
                type: 'text',
                text: 'あなたの気持ちが届きました：' + userMessage
            });
        }
    });
    res.sendStatus(200);
});

function replyToUser(replyToken, message) {
    axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [message]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
    }).catch(err => console.error('Error:', err));
}

app.get('/', (req, res) => {
    res.send('Silent Loop LINE Bot is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
