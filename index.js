require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// CORSを許可する設定
app.use(cors({ origin: 'https://www.google.com:443' }));
app.use(express.json());

app.post('/gemini', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const backendUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const message = req.body.message;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message,
          }],
        }],
      }),
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
