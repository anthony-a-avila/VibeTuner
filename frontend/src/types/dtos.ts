export type QueryDTO {
  query: string;
  numResults: number;
  obscurity: number;
};

export type TrackDTO {
  title: string;
  artist: string;
  duration: number;   // seconds
  trackImg: string;
  popularity: number; // 0–100 from Spotify
};