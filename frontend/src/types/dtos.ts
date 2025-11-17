export interface QueryDTO {
  query: string;
  numResults: number;
  obscurity: number;
}

export interface TrackDTO {
  id: string;
  title: string;
  artist: string;
  duration: number;   // seconds
  trackImg: string;
  popularity: number; // 0–100 from Spotify
}

export interface CollectionTrackDTO {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  isFavorited: boolean;
}
