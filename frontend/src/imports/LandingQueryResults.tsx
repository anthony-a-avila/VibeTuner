import React from "react";
import { useNavigate } from "react-router-dom";
import svgIcons from "./svgIcons";
import { BACKGROUND_LOGO, ALBUM_COVERS } from "../assets/images";
import { FilterLabel } from "../components/FilterLabel";
import type { QueryDTO, TrackDTO } from "../types/dtos";
import { USE_BACKEND } from "../appMode";
import axios from "axios";

function LoadingDots({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="absolute left-[50%] top-[680px] flex items-center gap-3 translate-x-[-50%]">
      <div className={`size-4 rounded-full animate-bounce transition-colors ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '0s', animationDuration: '0.6s' }} />
      <div className={`size-4 rounded-full animate-bounce transition-colors ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '0.2s', animationDuration: '0.6s' }} />
      <div className={`size-4 rounded-full animate-bounce transition-colors ${isDarkMode ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '0.4s', animationDuration: '0.6s' }} />
    </div>
  );
}

function Slider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  }, [isDragging]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateValue = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100);
      onChange(newValue);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const thumbPosition = (value / 100) * 200;

  return (
    <div 
      ref={sliderRef}
      className="absolute h-[17px] left-[765px] top-[420px] w-[200px] cursor-pointer" 
      data-name="Slider"
      onMouseDown={handleMouseDown}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200 17">
        <g id="Slider">
          <rect fill="var(--fill-0, #4A89FF)" height="3" id="Rectangle 9" rx="1.5" width="200" y="14" />
          <path 
            d={`M${thumbPosition} 15L${thumbPosition - 6.495} 3.75H${thumbPosition + 6.495}L${thumbPosition} 15Z`}
            fill="var(--fill-0, #4A89FF)" 
            id="Polygon 1" 
          />
        </g>
      </svg>
    </div>
  );
}

function Group({ onClick, isDarkMode }: { onClick: () => void; isDarkMode: boolean }) {
  return (
    <div 
      className={`absolute h-[50px] left-[30px] rounded-[20px] top-[25px] w-[90px] cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[10px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "41.234375", "--transform-inner-height": "3.5625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-white h-[3.571px] relative rounded-[20px] w-[41.237px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[17.86px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "41.234375", "--transform-inner-height": "3.5625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-white h-[3.571px] relative rounded-[20px] w-[41.237px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[25.71px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "41.234375", "--transform-inner-height": "3.5625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-white h-[3.571px] relative rounded-[20px] w-[41.237px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[33.57px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "41.234375", "--transform-inner-height": "3.5625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-white h-[3.571px] relative rounded-[20px] w-[41.237px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[40.71px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "41.234375", "--transform-inner-height": "3.5625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-white h-[3.571px] relative rounded-[20px] w-[41.237px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[47.86px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "41.234375", "--transform-inner-height": "3.5625" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-white h-[3.571px] relative rounded-[20px] w-[41.237px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.9585346579551697)+(var(--transform-inner-height)*0.1530061960220337)))] items-center justify-center left-[54.29px] top-[4.12px] w-[calc(1px*((var(--transform-inner-height)*0.9882252216339111)+(var(--transform-inner-width)*0.2849760055541992)))]" style={{ "--transform-inner-width": "42.859375", "--transform-inner-height": "3.53125" } as React.CSSProperties}>
        <div className="flex-none rotate-[73.443deg] skew-x-[352.314deg]">
          <div className="bg-white h-[3.534px] relative rounded-[20px] w-[42.868px]">
            <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { DarkModeToggle } from "../components/DarkModeToggle";
import { Check } from "lucide-react";
import type { Track } from "../App";
import { Switch } from "../components/ui/switch";

// Mock track data for the search results
const MOCK_TRACKS = [
  {
    id: "track-1",
    title: "Jazz (We've Got)",
    artist: "A Tribe Called Quest",
    duration: "2:45",
    image: ALBUM_COVERS.cover1,
  },
  {
    id: "track-2",
    title: "Mista Bombastic",
    artist: "Biggie Cheese",
    duration: "3:21",
    image: ALBUM_COVERS.cover2,
  },
  {
    id: "track-3",
    title: "I Used to be an Oakie from Mistogee",
    artist: "Nosmo King",
    duration: "5:23",
    image: ALBUM_COVERS.cover3,
  },
];

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
  obscurityEnabled,
  setObscurityEnabled,
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
  obscurityEnabled: boolean;
  setObscurityEnabled: (enabled: boolean) => void;
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
  
  const handleNumResultsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumResultsInputValue(e.target.value);
  };
  
  const finalizeNumResultsValue = () => {
    if (numResultsInputValue === '') {
      // Reset to previous value if input is empty
      setNumResultsInputValue(numResults.toString());
      return;
    }
    const val = parseInt(numResultsInputValue);
    const clampedValue = Math.max(1, Math.min(10, isNaN(val) ? numResults : val));
    setNumResults(clampedValue);
    setNumResultsInputValue(clampedValue.toString());
  };
  
  const handleNumResultsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finalizeNumResultsValue();
      (e.target as HTMLInputElement).blur();
    }
  };
  
  const handleClear = () => {
    onClearSearch();
  };
  
  // Dummy data pool for generating random tracks
  const TRACK_TITLES = [
    "Midnight Dreams", "Electric Avenue", "Neon Lights", "Ocean Waves",
    "Desert Storm", "Crystal Clear", "Velvet Sky", "Golden Hour",
    "Purple Rain", "Silver Lining", "Cosmic Dance", "Starlight Serenade",
    "Moonlit Path", "Summer Breeze", "Winter Wonderland", "Autumn Leaves",
    "Spring Awakening", "Thunder Road", "Silent Night", "Morning Glory",
    "Evening Star", "Sunset Boulevard", "Rainbow Connection", "Blue Horizon"
  ];
  
  const ARTIST_NAMES = [
    "The Midnight Riders", "Electric Echo", "Neon Dreams", "Ocean Blue",
    "Desert Rose", "Crystal Waters", "Velvet Underground", "Golden Gate",
    "Purple Haze", "Silver Bullets", "Cosmic Rays", "Starlight Express",
    "Luna Park", "Summer Rain", "Winter Storm", "Autumn Fire",
    "Spring Tide", "Thunder Cats", "Silent Knights", "Morning Dew",
    "Evening Shade", "Sunset Drive", "Rainbow Serpent", "Blue Horizon Band"
  ];
  
  const ALBUM_IMAGES = [
    "https://images.unsplash.com/photo-1616663395403-2e0052b8e595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwbXVzaWN8ZW58MXx8fHwxNzYyOTMzNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1697238724753-60c0c31132d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMGFsYnVtfGVufDF8fHx8MTc2Mjk3NTcxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydHdvcmt8ZW58MXx8fHwxNzYzMDAwNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1711054824441-064a99073a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZCUyMGNvdmVyJTIwYXJ0fGVufDF8fHx8MTc2MzAwMDY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1619983081593-e2ba5b543168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMG11c2ljJTIwYWxidW18ZW58MXx8fHwxNzYzMDAwNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ];
  
  const generateRandomDuration = () => {
    const minutes = Math.floor(Math.random() * 4) + 1; // 1-4 minutes
    const seconds = Math.floor(Math.random() * 60); // 0-59 seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSearch = async () => {
    setIsLoading(true);
    setShouldAnimate(true); // Enable animation for new search
    
    if (!USE_BACKEND) {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock TrackDTOs
      const mockTracks: TrackDTO[] = Array.from({ length: numResults }, (_, index) => {
        const titleIndex = Math.floor(Math.random() * TRACK_TITLES.length);
        const artistIndex = Math.floor(Math.random() * ARTIST_NAMES.length);
        const imageIndex = Math.floor(Math.random() * ALBUM_IMAGES.length);
        const minutes = Math.floor(Math.random() * 4) + 1; // 1-4 minutes
        const seconds = Math.floor(Math.random() * 60); // 0-59 seconds
        const durationInSeconds = minutes * 60 + seconds;
        
        return {
          trackImg: ALBUM_IMAGES[imageIndex],
          title: TRACK_TITLES[titleIndex],
          artist: ARTIST_NAMES[artistIndex],
          duration: durationInSeconds
        };
      });
      
      // Convert TrackDTOs to internal format
      const results = mockTracks.map((track, index) => ({
        id: `track-${Date.now()}-${index}`,
        title: track.title,
        artist: track.artist,
        duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
        image: track.trackImg
      }));
      
      setSearchResults(results);
      setIsLoading(false);
      return;
    }
    
    // Build QueryDTO
    const dto: QueryDTO = {
      query: queryText,
      numResults: numResults,
      obscurity: obscurityEnabled
    };
    
    try {
      // Send to backend
      const response = await axios.post<{ tracks: TrackDTO[] }>("/api/search", dto);
      
      // Convert TrackDTOs to internal format
      const results = response.data.tracks.map((track, index) => ({
        id: `track-${Date.now()}-${index}`,
        title: track.title,
        artist: track.artist,
        duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
        image: track.trackImg
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
  // First track starts at 628px, each track is 120px apart, card height is 100px
  const minHeight = searchResults.length > 0 
    ? 628 + (searchResults.length - 1) * 120 + 100 + 150 // 150px bottom margin
    : '100vh';
  
  return (
    <div 
      className={`relative w-full min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} 
      style={{ minHeight }}
      data-name="Landing/Query/Results"
    >
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      <Group onClick={() => navigate('/collection')} isDarkMode={isDarkMode} />
      <div className="relative mx-auto w-full max-w-[1080px]">
        <p className={`absolute font-['Jost:Regular',sans-serif] font-normal h-[60px] leading-[normal] left-[540px] text-[40px] text-center top-[32px] translate-x-[-50%] w-[200px] transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>VibeTuner</p>
        <p className={`absolute font-['Jost:Regular',sans-serif] font-normal h-[30px] leading-[normal] left-[540px] text-[20px] text-center top-[92px] translate-x-[-50%] w-[500px] transition-colors ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Find new tracks using natural language query</p>
        <div className={`absolute h-[400px] left-[90px] top-[178px] w-[900px] transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-[#f4f4f4]'}`}>
          <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none transition-colors ${isDarkMode ? 'border-gray-600' : 'border-black'}`} />
        </div>
        <div className={`absolute h-[44px] left-[713px] rounded-[10px] top-[487px] w-[252px] transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-black'}`}>
          <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[10px]" />
        </div>
        <div className={`absolute h-[44px] left-[115px] rounded-[10px] top-[487px] w-[252px] transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[10px]" />
        </div>
        <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
              e.preventDefault();
              e.currentTarget.select();
            }
          }}
          placeholder="Find me some strange classical music."
          className={`absolute h-[150px] left-[115px] top-[247px] w-[850px] resize-none overflow-auto p-3 font-[family-name:'Courier_New',Courier,monospace] text-[16px] leading-[normal] transition-colors border border-solid ${isDarkMode ? 'bg-gray-800 text-white border-gray-600 placeholder:text-gray-400' : 'bg-white text-black border-black placeholder:text-gray-500'}`}
        />
        <p className={`absolute left-[115px] top-[402px] font-['Jost:Regular',sans-serif] text-[10px] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          * May return fewer results than specified
        </p>
        <div className="absolute h-[34px] left-[333px] top-[422px] w-[68px]">
          <input
            type="text"
            value={numResultsInputValue}
            onChange={handleNumResultsInputChange}
            onBlur={finalizeNumResultsValue}
            onKeyDown={handleNumResultsKeyDown}
            onFocus={(e) => e.target.select()}
            className={`absolute inset-0 w-full h-full text-center font-[family-name:'Courier_New',Courier,monospace] text-[20px] transition-colors ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-black'} border border-solid`}
          />
        </div>
        <FilterLabel text="Query" className="absolute h-[34px] left-[115px] top-[202px] w-[81px]" />
        <FilterLabel text="Number of results" className="absolute h-[34px] left-[115px] top-[422px] w-[200px]" />
        <div 
          onClick={handleClear}
          className={`absolute font-['Jost:Regular',sans-serif] font-normal h-[39px] leading-[normal] left-[240.5px] text-[24px] text-center top-[489px] translate-x-[-50%] w-[229px] transition-colors cursor-pointer hover:opacity-70 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <p className="mb-0">Clear</p>
          <p>&nbsp;</p>
        </div>
        <FilterLabel text="Obscurity" className="absolute h-[34px] left-[736px] top-[420px] w-[115px]" />
        <div className="absolute left-[899px] top-[423px]">
          <Switch 
            checked={obscurityEnabled} 
            onCheckedChange={setObscurityEnabled}
            className="scale-150"
          />
        </div>
        <div 
          onClick={handleSearch}
          className="absolute font-['Jost:Regular',sans-serif] font-normal h-[39px] leading-[normal] left-[839px] text-[24px] text-center text-white top-[489px] translate-x-[-50%] w-[229px] cursor-pointer hover:opacity-80 transition-opacity">
          <p className="mb-0">Search</p>
          <p>&nbsp;</p>
        </div>
        <div className="absolute bg-[#d9d9d9] h-[80px] left-[-3702px] top-[750px] w-[900px]" />
        <div className="absolute left-[-4749px] size-[2048px] top-[-822px]" data-name="anthonyavila_None_d2e35d4d-392e-46a7-b693-30e5c11219e6 1">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={BACKGROUND_LOGO} />
        </div>
        
        {/* Loading state */}
        {isLoading && <LoadingDots isDarkMode={isDarkMode} />}
        
        {/* Dynamic track results */}
        {!isLoading && searchResults.map((track, index) => {
          const topPosition = 628 + (index * 120);
          const animationDelay = index * 0.1; // 100ms delay between each track
          return (
            <React.Fragment key={track.id}>
              {/* Track card background */}
              <div 
                className={`absolute h-[100px] left-[90px] rounded-[20px] w-[900px] transition-colors ${shouldAnimate ? 'animate-fade-in-up' : ''} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} 
                style={{ 
                  top: `${topPosition}px`,
                  ...(shouldAnimate && {
                    animationDelay: `${animationDelay}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }),
                  ...(!shouldAnimate && { opacity: 1 })
                }}
              >
                <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[20px] transition-colors ${isDarkMode ? 'border-gray-600' : 'border-black'}`} />
              </div>
              
              {/* Album artwork */}
              <div 
                className={`absolute left-[90px] rounded-[20px] size-[100px] ${shouldAnimate ? 'animate-fade-in-up' : ''}`}
                style={{ 
                  top: `${topPosition}px`,
                  ...(shouldAnimate && {
                    animationDelay: `${animationDelay}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }),
                  ...(!shouldAnimate && { opacity: 1 })
                }}
              >
                <img alt={track.title} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[20px] size-full" src={track.image} />
              </div>
              
              {/* Track title */}
              <p 
                className={`absolute font-[family-name:'Courier_New',Courier,monospace] h-[33px] leading-[normal] left-[204px] not-italic text-[24px] w-[600px] transition-colors ${shouldAnimate ? 'animate-fade-in-up' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`} 
                style={{ 
                  top: `${topPosition + 13}px`,
                  ...(shouldAnimate && {
                    animationDelay: `${animationDelay}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }),
                  ...(!shouldAnimate && { opacity: 1 })
                }}
              >{track.title}</p>
              
              {/* Artist name */}
              <p 
                className={`absolute font-[family-name:'Courier_New',Courier,monospace] h-[33px] italic leading-[normal] left-[204px] text-[20px] w-[600px] transition-colors ${shouldAnimate ? 'animate-fade-in-up' : ''} ${isDarkMode ? 'text-gray-300' : 'text-black'}`} 
                style={{ 
                  top: `${topPosition + 50}px`,
                  ...(shouldAnimate && {
                    animationDelay: `${animationDelay}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }),
                  ...(!shouldAnimate && { opacity: 1 })
                }}
              >{track.artist}</p>
              
              {/* Duration */}
              <p 
                className={`absolute font-[family-name:'Courier_New',Courier,monospace] h-[33px] leading-[normal] left-[831px] not-italic text-[24px] w-[67px] transition-colors ${shouldAnimate ? 'animate-fade-in-up' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`} 
                style={{ 
                  top: `${topPosition + 36}px`,
                  ...(shouldAnimate && {
                    animationDelay: `${animationDelay}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }),
                  ...(!shouldAnimate && { opacity: 1 })
                }}
              >{track.duration}</p>
              
              {/* Add button */}
              <div 
                className={`absolute left-[906px] size-[70px] cursor-pointer ${shouldAnimate ? 'animate-fade-in-up' : ''}`}
                style={{ 
                  top: `${topPosition + 16}px`,
                  ...(shouldAnimate && {
                    animationDelay: `${animationDelay}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }),
                  ...(!shouldAnimate && { opacity: 1 })
                }}
                onClick={() => onAddTrack(track)}
              >
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" fill={isTrackInCollection(track.id) ? "#22c55e" : isDarkMode ? "#1f2937" : "#FFFEFE"} id="Ellipse 2" r="34.5" stroke="var(--stroke-0, #83AAFF)" className="transition-all" />
                </svg>
              </div>
              
              {/* Check mark or plus icon */}
              {isTrackInCollection(track.id) ? (
                <div 
                  className={`absolute left-[921px] pointer-events-none ${shouldAnimate ? 'animate-fade-in-up' : ''}`}
                  style={{ 
                    top: `${topPosition + 30}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }),
                    ...(!shouldAnimate && { opacity: 1 })
                  }}
                >
                  <Check size={40} className="text-white" strokeWidth={3} />
                </div>
              ) : (
                <p 
                  className={`absolute font-[family-name:'Courier_New',Courier,monospace] h-[28px] leading-[normal] left-[921px] not-italic text-[64px] w-[19px] transition-colors pointer-events-none ${shouldAnimate ? 'animate-fade-in-up' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`} 
                  style={{ 
                    top: `${topPosition + 16}px`,
                    ...(shouldAnimate && {
                      animationDelay: `${animationDelay}s`,
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }),
                    ...(!shouldAnimate && { opacity: 1 })
                  }}
                >+</p>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
