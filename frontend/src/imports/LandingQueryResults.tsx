import React from "react";
import { useNavigate } from "react-router-dom";
import { FilterLabel } from "../components/FilterLabel";
import type { QueryDTO, TrackDTO } from "../types/dtos";
import { USE_BACKEND } from "../appMode";
import axios from "axios";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { Check } from "lucide-react";
import type { Track } from "../App";
// import { Switch } from "../components/ui/switch";
import { LoadingDots } from "../components/LoadingDots";
import { NavCollectionButton } from "../components/NavCollectionButton";
import {
  TRACK_TITLES,
  ARTIST_NAMES,
  ALBUM_IMAGES,
} from "../data/dummyTrackPool";

export default function LandingQueryResults({
  isDarkMode,
  onToggleDarkMode,
  onAddTrack,
  isTrackInCollection,
  queryText,
  setQueryText,
  numResults,
  setNumResults,
  numResultsInputValue,
  setNumResultsInputValue,
  obscurity,
  setObscurity,
  obscurityInputValue,
  setObscurityInputValue,
  searchResults,
  setSearchResults,
  onClearSearch,
}: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onAddTrack: (track: Omit<Track, "isFavorited">) => void;
  isTrackInCollection: (trackId: string) => boolean;
  queryText: string;
  setQueryText: (text: string) => void;
  numResults: number;
  setNumResults: (num: number) => void;
  numResultsInputValue: string;
  setNumResultsInputValue: (val: string) => void;
  obscurity: number;
  setObscurity: (value: number) => void;
  obscurityInputValue: string;
  setObscurityInputValue: (val: string) => void;
  searchResults: Array<{
    id: string;
    title: string;
    artist: string;
    duration: string;
    image: string;
  }>;
  setSearchResults: (results: Array<{
    id: string;
    title: string;
    artist: string;
    duration: string;
    image: string;
  }>) => void;
  onClearSearch: () => void;
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  const handleNumResultsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumResultsInputValue(e.target.value);
  };

  const finalizeNumResultsValue = () => {
    if (numResultsInputValue === "") {
      setNumResultsInputValue(numResults.toString());
      return;
    }
    const val = parseInt(numResultsInputValue, 10);
    const clampedValue = Math.max(
      1,
      Math.min(10, isNaN(val) ? numResults : val)
    );
    setNumResults(clampedValue);
    setNumResultsInputValue(clampedValue.toString());
  };

  const handleNumResultsKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      finalizeNumResultsValue();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleObscurityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setObscurityInputValue(e.target.value);
  };

  const finalizeObscurityValue = () => {
    if (obscurityInputValue === "") {
      setObscurityInputValue(obscurity.toString());
      return;
    }

    const val = parseInt(obscurityInputValue, 10);
    const clampedValue = Math.max(
      0,
      Math.min(100, isNaN(val) ? obscurity : val)
    );

    setObscurity(clampedValue);
    setObscurityInputValue(clampedValue.toString());
  };

  const handleObscurityKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      finalizeObscurityValue();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleClear = () => {
    onClearSearch();
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setShouldAnimate(true);

    if (!USE_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTracks: TrackDTO[] = Array.from(
        { length: numResults },
        (_, index) => {
          const titleIndex = Math.floor(Math.random() * TRACK_TITLES.length);
          const artistIndex = Math.floor(Math.random() * ARTIST_NAMES.length);
          const imageIndex = Math.floor(Math.random() * ALBUM_IMAGES.length);
          const minutes = Math.floor(Math.random() * 4) + 1;
          const seconds = Math.floor(Math.random() * 60);
          const durationInSeconds = minutes * 60 + seconds;

          return {
            trackImg: ALBUM_IMAGES[imageIndex],
            title: TRACK_TITLES[titleIndex],
            artist: ARTIST_NAMES[artistIndex],
            duration: durationInSeconds,
          };
        }
      );

      const results = mockTracks.map((track, index) => ({
        id: `track-${Date.now()}-${index}`,
        title: track.title,
        artist: track.artist,
        duration: `${Math.floor(track.duration / 60)}:${(
          track.duration % 60
        )
          .toString()
          .padStart(2, "0")}`,
        image: track.trackImg,
      }));

      setSearchResults(results);
      setIsLoading(false);
      return;
    }

    const dto: QueryDTO = {
      query: queryText,
      numResults,
      obscurity,
    };

    try {
      const response = await axios.post<{ tracks: TrackDTO[] }>(
        "/api/search",
        dto
      );

      const results = response.data.tracks.map((track, index) => ({
        id: `track-${Date.now()}-${index}`,
        title: track.title,
        artist: track.artist,
        duration: `${Math.floor(track.duration / 60)}:${(
          track.duration % 60
        )
          .toString()
          .padStart(2, "0")}`,
        image: track.trackImg,
      }));

      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate minimum height based on number of results
  const minHeight =
    searchResults.length > 0
      ? 628 + (searchResults.length - 1) * 120 + 100 + 150
      : "100vh";

  return (
    <div
      className={`relative w-full min-h-screen transition-colors ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
      style={{ minHeight }}
      data-name="Landing/Query/Results"
    >
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      <NavCollectionButton
        onClick={() => navigate("/collection")}
        isDarkMode={isDarkMode}
      />

      <div className="relative mx-auto w-full max-w-[1080px]">
        {/* Title */}
        <p
          className={`absolute left-[540px] top-[32px] h-[60px] w-[200px] translate-x-[-50%] text-center font-['Jost:Regular',sans-serif] text-[40px] font-normal leading-[normal] transition-colors ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          VibeTuner
        </p>

        {/* Subtitle */}
        <p
          className={`absolute left-[540px] top-[92px] h-[30px] w-[500px] translate-x-[-50%] text-center font-['Jost:Regular',sans-serif] text-[20px] font-normal leading-[normal] transition-colors ${
            isDarkMode ? "text-gray-300" : "text-black"
          }`}
        >
          Find new tracks using natural language query
        </p>

        {/* Card background */}
        <div
          className={`absolute left-[90px] top-[178px] h-[400px] w-[900px] transition-colors ${
            isDarkMode ? "bg-gray-800" : "bg-[#f4f4f4]"
          }`}
        >
          <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none border border-solid transition-colors ${
              isDarkMode ? "border-gray-600" : "border-black"
            }`}
          />
        </div>

        {/* Search / Clear button backgrounds */}
        <div
          className={`absolute left-[713px] top-[487px] h-[44px] w-[252px] rounded-[10px] transition-colors ${
            isDarkMode ? "bg-gray-700" : "bg-black"
          }`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[10px] border border-[#83aaff] border-solid"
          />
        </div>

        <div
          className={`absolute left-[115px] top-[487px] h-[44px] w-[252px] rounded-[10px] transition-colors ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[10px] border border-[#83aaff] border-solid"
          />
        </div>

        {/* Query textarea */}
        <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "a") {
              e.preventDefault();
              e.currentTarget.select();
            }
          }}
          placeholder="Find me some strange classical music."
          className={`absolute left-[115px] top-[247px] h-[150px] w-[850px] resize-none overflow-auto border border-solid p-3 font-[family-name:'Courier_New',Courier,monospace] text-[16px] leading-[normal] transition-colors ${
            isDarkMode
              ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
              : "border-black bg-white text-black placeholder:text-gray-500"
          }`}
        />

        <p
          className={`absolute left-[115px] top-[402px] font-['Jost:Regular',sans-serif] text-[10px] transition-colors ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          * May return fewer results than specified
        </p>

        {/* Query label */}
        <FilterLabel
          text="Query"
          className="absolute left-[115px] top-[202px] h-[34px] w-[81px]"
        />

        {/* === FILTER ROW (Number of results + Obscurity) === */}
        <div
          className="absolute flex items-center gap-4 w-[850px]"
          style={{ left: 115, top: 422 }}
        >
          {/* Number of results label (reuse FilterLabel so font matches Query) */}
          <FilterLabel
            text="Number of results"
            className="relative h-[34px] w-[200px]"
          />

          {/* Number of results input */}
          <input
            type="text"
            value={numResultsInputValue}
            onChange={handleNumResultsInputChange}
            onBlur={finalizeNumResultsValue}
            onKeyDown={handleNumResultsKeyDown}
            onFocus={(e) => e.target.select()}
            className={`h-[34px] w-[68px] border border-solid text-center font-[family-name:'Courier_New',Courier,monospace] text-[20px] transition-colors ${
              isDarkMode
                ? "border-gray-600 bg-gray-800 text-white"
                : "border-black bg-white text-black"
            }`}
          />

          {/* Obscurity label (also FilterLabel) */}
          <FilterLabel
            text="Obscurity"
            className="relative h-[34px] w-[115px]"
          />

          {/* Obscurity numeric input – same size as Number of results */}
          <input
            type="text"
            value={obscurityInputValue}
            onChange={handleObscurityInputChange}
            onBlur={finalizeObscurityValue}
            onKeyDown={handleObscurityKeyDown}
            onFocus={(e) => e.target.select()}
            className={`h-[34px] w-[68px] border border-solid text-center font-[family-name:'Courier_New',Courier,monospace] text-[20px] transition-colors ${
              isDarkMode
                ? "border-gray-600 bg-gray-800 text-white"
                : "border-black bg-white text-black"
            }`}
          />

          {/* Obscurity slider – fills remaining space so right edge matches textarea */}
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={obscurity}
              onChange={(e) => {
                const value = Number(e.target.value);
                setObscurity(value);
                setObscurityInputValue(value.toString());
              }}
              className={`h-[4px] w-full cursor-pointer rounded-full appearance-none ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
        {/* === END FILTER ROW === */}

        {/* Clear button */}
        <div
          onClick={handleClear}
          className={`absolute left-[240.5px] top-[489px] h-[39px] w-[229px] translate-x-[-50%] cursor-pointer text-center font-['Jost:Regular',sans-serif] text-[24px] font-normal leading-[normal] transition-colors hover:opacity-70 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <p className="mb-0">Clear</p>
          <p>&nbsp;</p>
        </div>

        {/* Search button */}
        <div
          onClick={handleSearch}
          className="absolute left-[839px] top-[489px] h-[39px] w-[229px] translate-x-[-50%] cursor-pointer text-center font-['Jost:Regular',sans-serif] text-[24px] font-normal leading-[normal] text-white transition-opacity hover:opacity-80"
        >
          <p className="mb-0">Search</p>
          <p>&nbsp;</p>
        </div>

        {/* Hidden offscreen block kept from original */}
        <div className="absolute left-[-3702px] top-[750px] h-[80px] w-[900px] bg-[#d9d9d9]" />

        {/* Loading state */}
        {isLoading && (
          <div
            className="absolute flex justify-center"
            style={{ top: 620, left: 90, width: 900 }}
          >
            <LoadingDots isDarkMode={isDarkMode} />
          </div>
        )}

        {/* Dynamic track results */}
        {!isLoading &&
          searchResults.map((track, index) => {
            const topPosition = 628 + index * 120;
            const animationDelay = index * 0.1;

            return (
              <React.Fragment key={track.id}>
                {/* Track card background */}
                <div
                  className={`absolute left-[90px] h-[100px] w-[900px] rounded-[20px] transition-colors ${
                    shouldAnimate ? "animate-fade-in-up" : ""
                  } ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                  style={{
                    top: `${topPosition}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }),
                    ...(!shouldAnimate && { opacity: 1 }),
                  }}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 pointer-events-none rounded-[20px] border border-solid transition-colors ${
                      isDarkMode ? "border-gray-600" : "border-black"
                    }`}
                  />
                </div>

                {/* Album artwork */}
                <div
                  className={`absolute left-[90px] size-[100px] rounded-[20px] ${
                    shouldAnimate ? "animate-fade-in-up" : ""
                  }`}
                  style={{
                    top: `${topPosition}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }),
                    ...(!shouldAnimate && { opacity: 1 }),
                  }}
                >
                  <img
                    alt={track.title}
                    className="absolute inset-0 size-full max-w-none rounded-[20px] object-cover pointer-events-none"
                    src={track.image}
                  />
                </div>

                {/* Track title */}
                <p
                  className={`absolute left-[204px] h-[33px] w-[600px] font-[family-name:'Courier_New',Courier,monospace] text-[24px] leading-[normal] not-italic transition-colors ${
                    shouldAnimate ? "animate-fade-in-up" : ""
                  } ${isDarkMode ? "text-white" : "text-black"}`}
                  style={{
                    top: `${topPosition + 13}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }),
                    ...(!shouldAnimate && { opacity: 1 }),
                  }}
                >
                  {track.title}
                </p>

                {/* Artist name */}
                <p
                  className={`absolute left-[204px] h-[33px] w-[600px] font-[family-name:'Courier_New',Courier,monospace] text-[20px] italic leading-[normal] transition-colors ${
                    shouldAnimate ? "animate-fade-in-up" : ""
                  } ${isDarkMode ? "text-gray-300" : "text-black"}`}
                  style={{
                    top: `${topPosition + 50}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }),
                    ...(!shouldAnimate && { opacity: 1 }),
                  }}
                >
                  {track.artist}
                </p>

                {/* Duration */}
                <p
                  className={`absolute left-[831px] h-[33px] w-[67px] font-[family-name:'Courier_New',Courier,monospace] text-[24px] leading-[normal] not-italic transition-colors ${
                    shouldAnimate ? "animate-fade-in-up" : ""
                  } ${isDarkMode ? "text-white" : "text-black"}`}
                  style={{
                    top: `${topPosition + 36}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }),
                    ...(!shouldAnimate && { opacity: 1 }),
                  }}
                >
                  {track.duration}
                </p>

                {/* Add button circle */}
                <div
                  className={`absolute left-[906px] size-[70px] cursor-pointer ${
                    shouldAnimate ? "animate-fade-in-up" : ""
                  }`}
                  style={{
                    top: `${topPosition + 16}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }),
                    ...(!shouldAnimate && { opacity: 1 }),
                  }}
                  onClick={() => onAddTrack(track)}
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 70 70"
                  >
                    <circle
                      cx="35"
                      cy="35"
                      r="34.5"
                      className="transition-all"
                      fill={
                        isTrackInCollection(track.id)
                          ? "#22c55e"
                          : isDarkMode
                          ? "#1f2937"
                          : "#FFFEFE"
                      }
                      stroke="#83AAFF"
                    />
                  </svg>
                </div>

                {/* Check mark or plus */}
                {isTrackInCollection(track.id) ? (
                  <div
                    className={`absolute left-[921px] pointer-events-none ${
                      shouldAnimate ? "animate-fade-in-up" : ""
                    }`}
                    style={{
                      top: `${topPosition + 30}px`,
                      ...(shouldAnimate && {
                        animationDelay: `${animationDelay}s`,
                        opacity: 0,
                        animationFillMode: "forwards",
                      }),
                      ...(!shouldAnimate && { opacity: 1 }),
                    }}
                  >
                    <Check size={40} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <p
                    className={`absolute left-[921px] h-[28px] w-[19px] pointer-events-none font-[family-name:'Courier_New',Courier,monospace] text-[64px] leading-[normal] not-italic transition-colors ${
                      shouldAnimate ? "animate-fade-in-up" : ""
                    } ${isDarkMode ? "text-white" : "text-black"}`}
                    style={{
                      top: `${topPosition + 16}px`,
                      ...(shouldAnimate && {
                        animationDelay: `${animationDelay}s`,
                        opacity: 0,
                        animationFillMode: "forwards",
                      }),
                      ...(!shouldAnimate && { opacity: 1 }),
                    }}
                  >
                    +
                  </p>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
}
