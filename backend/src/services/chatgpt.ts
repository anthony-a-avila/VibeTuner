// backend/src/services/chatgpt.ts
import axios from "axios";
import { PROMPT_TO_QUERY_EXAMPLES } from "./promptToQueryExamples";

// Make sure dotenv.config() is called in src/index.ts
// so process.env is populated before this file runs.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * reduceQueryWithGPT
 * -------------------
 * Takes a long, natural-language music prompt and returns a compact,
 * Spotify Search API-ready "q" string.
 *
 * IMPORTANT:
 * - No obscurity/tag logic here. Do NOT append "tag:hipster".
 *   That is handled in the route (search.ts).
 */
export async function reduceQueryWithGPT(query: string): Promise<string> {
  const examplesBlock = PROMPT_TO_QUERY_EXAMPLES.map(
    (ex) => `User: ${ex.natural}\nSpotify query: ${ex.spotify}`
  ).join("\n\n");

  const systemPrompt = `
You convert long, natural language music descriptions into short Spotify Search API "q" strings.

Guidelines:
- Use only lower-case words and spaces (no punctuation unless clearly needed).
- Be concise and keyword-focused (genre, mood, tempo, instruments, vocals).
- Do NOT include playlist-style wording like "songs", "tracks", "music" unless needed.
- Do NOT include "tag:hipster" or any other tags. That is handled elsewhere.
- Output ONLY the final Spotify query string and nothing else.
`.trim();

  const userPrompt = `
Here are some examples:

${examplesBlock}

Now convert this user query into a Spotify query string.

User: ${query}
Spotify query:
`.trim();

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o-mini", // smallest/newest GPT-4o variant
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 32,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text: string =
      response.data?.choices?.[0]?.message?.content?.trim() ?? "";

    return text;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("[ChatGPT] error status:", err.response?.status);
      console.error("[ChatGPT] error body:", err.response?.data);
    } else {
      console.error("[ChatGPT] unknown error:", err);
    }
    throw err; // let the route handle the 500
  }
}
