import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingQueryResults from "./imports/LandingQueryResults";
import Collection from "./imports/Collection";

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

  const addTrack = (track: Omit<Track, "isFavorited">) => {
    setCollection((prev) => {
      // Check if track already exists
      if (prev.some((t) => t.id === track.id)) {
        return prev;
      }
      return [...prev, { ...track, isFavorited: false }];
    });
  };

  const removeTrack = (trackId: string) => {
    setCollection((prev) => prev.filter((t) => t.id !== trackId));
  };

  const toggleFavorite = (trackId: string) => {
    setCollection((prev) =>
      prev.map((t) =>
        t.id === trackId ? { ...t, isFavorited: !t.isFavorited } : t
      )
    );
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
