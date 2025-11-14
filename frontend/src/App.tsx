import { useState } from "react";
import LandingQueryResults from "./imports/LandingQueryResults";
import Collection from "./imports/Collection";

type Page = "search" | "collection";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  isFavorited: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("search");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collection, setCollection] = useState<Track[]>([]);
  
  // Search page state
  const [queryText, setQueryText] = useState('');
  const [numResults, setNumResults] = useState(3);
  const [numResultsInputValue, setNumResultsInputValue] = useState('3');
  const [obscurityEnabled, setObscurityEnabled] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    title: string;
    artist: string;
    duration: string;
    image: string;
  }>>([]);

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
      prev.map((t) => (t.id === trackId ? { ...t, isFavorited: !t.isFavorited } : t))
    );
  };

  const isTrackInCollection = (trackId: string) => {
    return collection.some((t) => t.id === trackId);
  };

  const handleClearSearch = () => {
    setQueryText('');
    setNumResults(3);
    setNumResultsInputValue('3');
    setObscurityEnabled(false);
    setSearchResults([]);
  };

  return (
    <div className="w-full h-screen overflow-auto">
      {currentPage === "search" ? (
        <LandingQueryResults 
          onNavigateToCollection={() => setCurrentPage("collection")} 
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
          obscurityEnabled={obscurityEnabled}
          setObscurityEnabled={setObscurityEnabled}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <Collection 
          onNavigateToSearch={() => setCurrentPage("search")} 
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          tracks={collection}
          onToggleFavorite={toggleFavorite}
          onRemoveTrack={removeTrack}
        />
      )}
    </div>
  );
}
