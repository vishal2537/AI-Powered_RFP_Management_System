import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
});

export const evaluateVendorResponse = async (rfp, vendorResponse) => {
 const prompt = `
You are an AI evaluator comparing an RFP with a vendor's quote.

Your task:
- Analyze how well the vendor's response matches the RFP requirements.
- Consider product names, quantities, specifications, pricing, budget, and overall value.
- Score the vendor on a scale of 0-100.

Output Rules (IMPORTANT):
- OUTPUT STRICTLY A VALID JSON OBJECT ONLY.
- NO explanation outside the JSON.
- JSON must contain exactly these fields:

{
  "finalScore": number,
  "aiExplanationMessage": "string"
}

Scoring Guidance:
- 90-100: Excellent match; meets or exceeds all requirements.
- 70-89: Good match; minor deviations.
- 50-69: Moderate match; some requirements not aligned.
- 0-49: Poor match; major mismatches or missing information.

RFP Requirements:
${JSON.stringify(rfp.structuredData)}

Vendor Response:
${JSON.stringify(vendorResponse.structuredResponseData)}
`;


  await waitForRateLimit();

  let attempts = 0;
  let maxAttempts = 5;
  let delay = 3000;

  while (attempts < maxAttempts) {
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });

      const json = JSON.parse(completion.choices[0].message.content.trim());
      return json;
    } catch (err) {
      if (err.type === "tokens" || err.code === "rate_limit_exceeded") {
        console.log("Rate limit hit. Retrying...");

        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        attempts++;
      } else {
        console.error("AI Evaluation Error:", err);
        return { finalScore: 0, aiExplanationMessage: "AI evaluation failed." };
      }
    }
  }

  return {
    finalScore: 0,
    aiExplanationMessage: "Rate limit reached. Evaluation skipped.",
  };
};


let lastCallTime = 0;
const MIN_DELAY = 1500;

export const waitForRateLimit = async () => {
  const now = Date.now();
  const diff = now - lastCallTime;

  if (diff < MIN_DELAY) {
    await new Promise((resolve) => setTimeout(resolve, MIN_DELAY - diff));
  }

  lastCallTime = Date.now();
};