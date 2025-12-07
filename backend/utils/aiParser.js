import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function parseVendorData(rawText) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
  });

  if (rawText.length > 8000) {
    rawText = rawText.substring(0, 8000);
  }

  const prompt = `
Extract structured vendor response in EXACTLY this JSON format:

{
  "products": [
    {
      "name": "string",
      "brand": "string",
      "quantity": number,
      "price": number,
      "specs": { "key": "value" }
    }
  ],
  "totalQuoteValue": number,
  "message": "string"
}

Important rules:
- Ensure all fields exist (use null if missing)
- "products" must be an array
- "specs" must be an object (not array, not text)
- Do NOT include extra text outside the JSON
- If information is missing, infer from context or return null
- "price" and "totalQuoteValue" must be numbers only (no currency symbols)
- Respond ONLY with valid JSON.

Vendor Response Text:
"""${rawText}"""
`;

  let retries = 5;
  let delay = 5000;

  while (retries > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.choices[0].message.content;

      return JSON.parse(content);
    } catch (err) {
      if (err?.status === 429) {
        console.log(`Rate limit hit. Retrying in ${delay / 1000}s...`);
        await sleep(delay);

        delay *= 2;
        retries--;
        continue;
      }
      console.log("AI Parse Error:", err);
      return null;
    }
  }

  console.log("FAILED: Could not parse vendor data after retries.");
  return null;
}