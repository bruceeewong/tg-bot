const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const env = require('dotenv').config().parsed;

const app = express();
app.use(bodyParser.json());

function main() {
    if (!env.TG_BOT_TOKEN) {
        throw new Error('TG_BOT_TOKEN is not set')
    }
    const CHANNEL_ID = env.TG_CHAT_ID;
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;
    
    app.post('/webhook/inoreader', (req, res) => {
        const data = req.body;
    
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const title = item.title || 'No Title';
                const content = item.summary && item.summary.content ? item.summary.content : 'No content available';
                const url = item.canonical && item.canonical.length > 0 ? item.canonical[0].href : 'No URL';
                const message = `<b>${escapeHTML(title)}</b>\n\n${escapeHTML(content)}\n<a href="${url}">Read more</a>`;

    
                sendMessageToChannel(message);
            });
        }
    
        res.status(200).send('OK');
    });
    
    function sendMessageToChannel(text) {
        axios.post(TELEGRAM_API_URL, {
            chat_id: CHANNEL_ID,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
        .then(response => {
            console.log('Message posted', response);
        })
        .catch(error => {
            console.error(error);
        });
    }
    
    function escapeHTML(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Webhook receiver listening on port ${PORT}`);
    });    
}

main()