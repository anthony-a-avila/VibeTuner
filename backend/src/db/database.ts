import path from "path";
import sqlite3 from "sqlite3";

export interface CollectionTrackRow {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  is_favorited: number;
}

export interface CollectionTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  isFavorited: boolean;
}

const dbPath = path.join(process.cwd(), "vibetuner.db");

export const db = new sqlite3.Database(dbPath);

export function initDb(): void {
  db.serialize(() => {
    db.run(
      `
        CREATE TABLE IF NOT EXISTS collection_tracks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          artist TEXT NOT NULL,
          duration TEXT NOT NULL,
          image TEXT NOT NULL,
          is_favorited INTEGER NOT NULL DEFAULT 0
        )
      `
    );
  });
}

function rowToTrack(row: CollectionTrackRow): CollectionTrack {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    duration: row.duration,
    image: row.image,
    isFavorited: row.is_favorited === 1,
  };
}

export function getAllTracks(): Promise<CollectionTrack[]> {
  return new Promise((resolve, reject) => {
    db.all<CollectionTrackRow>(
      "SELECT id, title, artist, duration, image, is_favorited FROM collection_tracks ORDER BY rowid DESC",
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(rowToTrack));
      }
    );
  });
}

export function upsertTrack(track: CollectionTrack): Promise<CollectionTrack> {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO collection_tracks (id, title, artist, duration, image, is_favorited)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          artist = excluded.artist,
          duration = excluded.duration,
          image = excluded.image
      `,
      [
        track.id,
        track.title,
        track.artist,
        track.duration,
        track.image,
        track.isFavorited ? 1 : 0,
      ],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(track);
      }
    );
  });
}

export function setFavorite(id: string, isFavorited: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE collection_tracks SET is_favorited = ? WHERE id = ?",
      [isFavorited ? 1 : 0, id],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
}

export function deleteTrack(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM collection_tracks WHERE id = ?", [id], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export function isTrackSaved(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get<CollectionTrackRow>(
      "SELECT id FROM collection_tracks WHERE id = ?",
      [id],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(!!row);
      }
    );
  });
}
