import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
});

export async function parseRFP(originalQuery) {
  try {
    const prompt = `
You are an AI that extracts structured procurement data.
Return ONLY valid JSON. Do NOT include Markdown or code block formatting.

Required JSON format:
{
  "products": [
    {
      "name": "string",
      "quantity": number,
      "specs": { "key": "value" }
    }
  ],
  "budget": number or null,
  "timeline": "string",
  "additionalNotes": "string"
}

Extract data from this query:
"${originalQuery}"
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let text = completion.choices[0].message.content;

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    text = text.replace(/`/g, "");
    return JSON.parse(text);
  } catch (err) {
    console.error("Error parsing RFP:", err);
    return {
      products: [],
      budget: null,
      timeline: "",
      additionalNotes: originalQuery,
    };
  }
}