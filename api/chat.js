// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { query, lang } = req.body;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_KEY) return res.status(500).json({ error: "API key missing" });
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Jarvis, an AI assistant that auto-detects Hindi or English language. Respond in same language." },
          { role: "user", content: query }
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "OpenAI Request Failed" });
  }
}
