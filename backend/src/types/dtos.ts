export interface QueryDTO {
  query: string;
  numResults: number;
  obscurity: number;
}

export interface TrackDTO {
  id: string;         // Spotify track id
  title: string;
  artist: string;
  duration: number;   // seconds
  trackImg: string;
  popularity: number; // 0–100 from Spotify
}
