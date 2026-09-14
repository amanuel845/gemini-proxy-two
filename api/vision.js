import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const DEFAULT_MODEL = "gemini-3.6-flash";

// Allow large image uploads (Vercel serverless body limit is ~4.5MB)
export const config = {
  api: {
    bodyParser: { sizeLimit: "4mb" },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      prompt = "Describe this image in detail.",
      imageBase64,
      mimeType = "image/jpeg",
      model = DEFAULT_MODEL,
    } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "`imageBase64` is required" });
    }

    // Strip data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: cleanBase64 } },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      model,
      text: response.text,
      usage: response.usageMetadata || null,
    });
  } catch (error) {
    console.error("[vision]", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
}
