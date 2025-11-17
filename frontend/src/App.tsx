import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingQueryResults from "./imports/LandingQueryResults";
import Collection from "./imports/Collection";
import axios from "axios";
import type { CollectionTrackDTO } from "./types/dtos";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  isFavorited: boolean;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collection, setCollection] = useState<Track[]>([]);

  // Search page state
  const [queryText, setQueryText] = useState("");
  const [numResults, setNumResults] = useState(3);
  const [numResultsInputValue, setNumResultsInputValue] = useState("3");

  // 0 = very popular, 100 = very obscure (tweak as you like)
  const [obscurity, setObscurity] = useState(50);
  const [obscurityInputValue, setObscurityInputValue] = useState("50");

  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string;
      title: string;
      artist: string;
      duration: string;
      image: string;
    }>
  >([]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Load initial collection from backend
    axios
      .get<{ tracks: CollectionTrackDTO[] }>("/api/collection")
      .then((response) => {
        const mapped: Track[] = response.data.tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          duration: t.duration,
          image: t.image,
          isFavorited: t.isFavorited,
        }));
        setCollection(mapped);
      })
      .catch((error) => {
        console.error("Failed to load collection", error);
      });
  }, []);

  const addTrack = (track: Omit<Track, "isFavorited">) => {
    // Optimistically update UI
    setCollection((prev) => {
      if (prev.some((t) => t.id === track.id)) {
        return prev;
      }
      const updated = [...prev, { ...track, isFavorited: false }];
      return updated;
    });

    axios
      .post<{ track: CollectionTrackDTO }>("/api/collection", {
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        image: track.image,
        isFavorited: false,
      })
      .catch((error) => {
        console.error("Failed to save track to collection", error);
      });
  };

  const removeTrack = (trackId: string) => {
    setCollection((prev) => prev.filter((t) => t.id !== trackId));

    axios
      .delete(`/api/collection/${encodeURIComponent(trackId)}`)
      .catch((error) => {
        console.error("Failed to delete track from collection", error);
      });
  };

  const toggleFavorite = (trackId: string) => {
    let nextValue = true;
    setCollection((prev) =>
      prev.map((t) => {
        if (t.id !== trackId) return t;
        nextValue = !t.isFavorited;
        return { ...t, isFavorited: nextValue };
      })
    );

    axios
      .patch(`/api/collection/${encodeURIComponent(trackId)}/favorite`, {
        isFavorited: nextValue,
      })
      .catch((error) => {
        console.error("Failed to update favorite state", error);
      });
  };

  const isTrackInCollection = (trackId: string) => {
    return collection.some((t) => t.id === trackId);
  };

  const handleClearSearch = () => {
    setQueryText("");
    setNumResults(3);
    setNumResultsInputValue("3");
    setObscurity(50);
    setObscurityInputValue("50");
    setSearchResults([]);
  };

  return (
    <BrowserRouter>
      <div
        className="w-full h-screen overflow-auto"
      >
        <Routes>
          <Route
            path="/"
            element={
              <LandingQueryResults
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                onAddTrack={addTrack}
                isTrackInCollection={isTrackInCollection}
                queryText={queryText}
                setQueryText={setQueryText}
                numResults={numResults}
                setNumResults={setNumResults}
                numResultsInputValue={numResultsInputValue}
                setNumResultsInputValue={setNumResultsInputValue}
                obscurity={obscurity}
                setObscurity={setObscurity}
                obscurityInputValue={obscurityInputValue}
                setObscurityInputValue={setObscurityInputValue}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                onClearSearch={handleClearSearch}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <Collection
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                tracks={collection}
                onToggleFavorite={toggleFavorite}
                onRemoveTrack={removeTrack}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
