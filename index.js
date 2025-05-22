const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://lexalljuridica.github.io',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/gpt-search', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt requerido' });

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-instruct',
                prompt,
                max_tokens: 60,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const text = data.choices?.[0]?.text.trim() || '';
        res.json({ result: text });
    } catch (err) {
        console.error('Error al consultar OpenAI:', err);
        res.status(500).json({ error: 'Error al procesar la solicitud GPT' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
