import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export const explainSecurityWarning = async (req, res) => {
  const { warning, url } = req.body;

  const prompt = `
Your name is API Buddy. You are an API debugging assistant. Analyze this warning and give the reason in simplest language with detail and possible fix.

Request:
- Url: ${url}
- Warning: ${warning}

Reply in 3 short paragraphs:
1. What the Warning means and Summary of warning
2. What might have caused it and Likely root cause
3. What parameters may be missing/wrong and How to Fix it. Give Good and Impactful Suggestions.






  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      console.error("Gemini returned invalid response");
      return res.status(500).json({ error: "Invalid Gemini response" });
    }

    const response = result.response;
    const text = response.text();

    res.status(200).json({ explanation: text });
  } catch (err) {
    console.error("Error inside generateContent block:", err);
    res.status(500).json({ error: "Gemini generateContent failed" });
  }
};
