# Gemini Proxy

A thin, CORS-enabled proxy around the Google Gemini API, ready to deploy on Vercel.

## Endpoints

| Method | Route         | Description                          |
|--------|---------------|--------------------------------------|
| POST   | `/api/chat`   | Non-streaming chat completion        |
| POST   | `/api/stream` | Streaming chat (text/plain chunks)   |
| POST   | `/api/vision` | Image + text understanding           |
| GET    | `/api/models` | List available model IDs             |

## Request bodies

### POST /api/chat
```json
{
  "prompt": "Hello!",
  "model": "gemini-3.6-flash",
  "systemInstruction": "You are concise.",
  "history": [{ "role": "user", "text": "hi" }, { "role": "assistant", "text": "hey" }],
  "temperature": 0.7,
  "maxOutputTokens": 1024
}
