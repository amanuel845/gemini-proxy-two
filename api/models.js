export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    success: true,
    models: [
      { id: "gemini-3.6-flash", description: "Fast, versatile, best default for free tier" },
      { id: "gemini-2.5-pro", description: "Most capable (may not be free-tier eligible)" },
      { id: "gemini-2.0-flash", description: "Previous-gen fast model" },
      { id: "gemini-2.0-flash-lite", description: "Lightest and cheapest" },
    ],
  });
}
