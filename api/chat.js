import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DEFAULT_MODEL = "gemini-3.6-flash";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      prompt,
      model = DEFAULT_MODEL,
      systemInstruction,
      history = [],
      temperature,
      maxOutputTokens,
    } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, error: "`prompt` (string) is required" });
    }

    const contents = [
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: prompt }] },
    ];

    const config = {};
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (typeof temperature === "number") config.temperature = temperature;
    if (typeof maxOutputTokens === "number") config.maxOutputTokens = maxOutputTokens;

    const response = await ai.models.generateContent({
      model,
      contents,
      config: Object.keys(config).length ? config : undefined,
    });

    return res.status(200).json({
      success: true,
      model,
      text: response.text,
      usage: response.usageMetadata || null,
    });
  } catch (error) {
    console.error("[chat]", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
}
