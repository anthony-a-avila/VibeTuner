// backend/src/services/spotifyAuth.ts
import axios from "axios";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env");
}

// Simple in-memory cache so we don’t request a new token every call
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

export async function getSpotifyAccessToken(): Promise<string> {
  const now = Date.now();

  // if we already have a non-expired token, reuse it
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    // 60s safety margin
    return cachedToken;
  }

  // Otherwise, request a new token using client credentials flow
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }), // x-www-form-urlencoded body
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, expires_in } = response.data as {
    access_token: string;
    token_type: string;
    expires_in: number; // seconds
  };

  cachedToken = access_token;
  tokenExpiresAt = now + expires_in * 1000;

  return access_token;
}
