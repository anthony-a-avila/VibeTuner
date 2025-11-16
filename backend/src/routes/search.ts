// backend/src/routes/search.ts
import { Router } from "express";
import { reduceQueryWithGPT } from "../services/chatgpt";
import { searchSpotify } from "../services/spotify";
import type { QueryDTO } from "../types/dtos";

const router = Router();
const USE_SPOTIFY = process.env.USE_SPOTIFY === "true";

router.post("/search", async (req, res) => {
  const dto: QueryDTO = req.body;

  try {
    // 1) Natural language -> base Spotify query
    const baseQuery = await reduceQueryWithGPT(dto.query);

    // 2) No more tag:hipster here; obscurity is handled via popularity
    const spotifyQuery = baseQuery;

    if (!USE_SPOTIFY) {
      return res.json({
        mode: "prompt-to-query-only",
        baseQuery,
        spotifyQuery,
      });
    }

    // 3) Let spotify.ts handle: fetch 50, score by obscurity, slice to numResults
    const tracks = await searchSpotify(spotifyQuery, dto);

    return res.json({
      mode: "full-chain",
      baseQuery,
      spotifyQuery,
      desiredObscurity: dto.obscurity,
      tracks,
    });
  } catch (error) {
    console.error("[/api/search] error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
