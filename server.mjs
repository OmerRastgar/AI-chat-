
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

app.post('/api/chat', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  const { text, activeStandard } = req.body;

  if (!text || !activeStandard) {
    return res.status(400).json({ error: 'Missing text or activeStandard in request body' });
  }

  try {
    const prompt = `
      As a cybersecurity expert specializing in the ${activeStandard} framework, answer the following user query:
      "${text}"
      Provide a clear, concise, and accurate answer based on ${activeStandard} guidelines. Use the provided search tool to find relevant, up-to-date information and official documentation.
      Do NOT list your sources or references in your response text. The source links will be displayed separately in the user interface.
      If applicable, you can refer to specific controls or sections from the ${activeStandard} framework within your answer.
      If the query is outside the scope of ${activeStandard}, clarify that and offer a response based on general cybersecurity best practices.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const references = groundingMetadata?.groundingChunks
      ?.map((chunk) => ({
        title: chunk.web?.title || 'Source',
        link: chunk.web?.uri || '#',
      }))
      .filter((ref) => ref.link !== '#');

    res.json({
      text: response.text,
      references: (references && references.length > 0) ? references : undefined,
    });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
