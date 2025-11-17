import { Router } from "express";
import {
  CollectionTrack,
  deleteTrack,
  getAllTracks,
  setFavorite,
  upsertTrack,
} from "../db/database";

const router = Router();

router.get("/collection", async (_req, res) => {
  try {
    const tracks = await getAllTracks();
    res.json({ tracks });
  } catch (error) {
    console.error("[GET /api/collection] error:", error);
    res.status(500).json({ error: "Failed to load collection" });
  }
});

router.post("/collection", async (req, res) => {
  const body = req.body as Partial<CollectionTrack>;

  if (!body.id || !body.title || !body.artist || !body.duration || !body.image) {
    return res.status(400).json({ error: "Missing required track fields" });
  }

  try {
    const track: CollectionTrack = {
      id: body.id,
      title: body.title,
      artist: body.artist,
      duration: body.duration,
      image: body.image,
      isFavorited: !!body.isFavorited,
    };

    const saved = await upsertTrack(track);
    res.status(201).json({ track: saved });
  } catch (error) {
    console.error("[POST /api/collection] error:", error);
    res.status(500).json({ error: "Failed to save track" });
  }
});

router.patch("/collection/:id/favorite", async (req, res) => {
  const { id } = req.params;
  const { isFavorited } = req.body as { isFavorited: boolean };

  if (typeof isFavorited !== "boolean") {
    return res.status(400).json({ error: "isFavorited must be boolean" });
  }

  try {
    await setFavorite(id, isFavorited);
    res.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/collection/:id/favorite] error:", error);
    res.status(500).json({ error: "Failed to update favorite state" });
  }
});

router.delete("/collection/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTrack(id);
    res.status(204).send();
  } catch (error) {
    console.error("[DELETE /api/collection/:id] error:", error);
    res.status(500).json({ error: "Failed to delete track" });
  }
});

export default router;

