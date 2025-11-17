// backend/src/services/spotify.ts
import axios from "axios";
import type { QueryDTO, TrackDTO } from "../types/dtos";
import { getSpotifyAccessToken } from "./spotifyAuth";

export async function searchSpotify(q: string, dto: QueryDTO): Promise<TrackDTO[]> {
  const accessToken = await getSpotifyAccessToken();

  // Always try to pull up to 50 tracks from Spotify
  const response = await axios.get("https://api.spotify.com/v1/search", {
    params: {
      q,
      type: "track",
      limit: 50,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const items = response.data.tracks?.items ?? [];

  // Desired obscurity from client: 0–100 (higher = more obscure)
  const desiredObscurity = dto.obscurity;

  // Score tracks by how close their (100 - popularity) is to desiredObscurity
  type ScoredTrack = {
    track: TrackDTO;
    distance: number;
    trackObscurity: number;
  };

  const scored: ScoredTrack[] = items.map((item: any) => {
    const popularity: number = item.popularity ?? 0; // 0–100
    const trackObscurity = 100 - popularity;        // invert
    const distance = Math.abs(trackObscurity - desiredObscurity);

    const track: TrackDTO = {
      id: item.id,
      title: item.name,
      artist: item.artists?.[0]?.name ?? "Unknown artist",
      duration: Math.floor(item.duration_ms / 1000),
      trackImg: item.album?.images?.[0]?.url ?? "",
      popularity, // keep this so you can see it in Postman
    };

    return { track, distance, trackObscurity };
  });

  // Sort by closeness to desired obscurity
  scored.sort((a, b) => a.distance - b.distance);

  // Decide how many to return (cannot exceed how many we have)
  const safeNumResults = Math.max(
    1,
    Math.min(dto.numResults, scored.length)
  );

  // Take top N tracks only
  const selectedTracks = scored.slice(0, safeNumResults).map((s) => s.track);

  return selectedTracks;
}
