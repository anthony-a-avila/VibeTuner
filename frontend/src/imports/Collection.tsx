import { DarkModeToggle } from "../components/DarkModeToggle";
import { Star, Trash2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import type { Track } from "../App";

function BackToQueryPage({ onClick, isDarkMode }: { onClick: () => void; isDarkMode: boolean }) {
  return (
    <div className="absolute contents left-[30px] top-[25px]" data-name="Back to Query Page">
      <div 
        className={`absolute h-[50px] left-[30px] rounded-[20px] top-[25px] w-[90px] cursor-pointer transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
        onClick={onClick}
      >
        <div aria-hidden="true" className="absolute border border-[#83aaff] border-solid inset-0 pointer-events-none rounded-[20px]" />
      </div>
      <p 
        className={`absolute font-['Jost:Regular',sans-serif] font-normal h-[16px] leading-[normal] left-[74.5px] text-[24px] text-center top-[34px] translate-x-[-50%] w-[85px] cursor-pointer transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}
        onClick={onClick}
      >
        Search
      </p>
    </div>
  );
}

export default function Collection({ 
  isDarkMode,
  onToggleDarkMode,
  tracks,
  onToggleFavorite,
  onRemoveTrack,
}: { 
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  tracks: Track[];
  onToggleFavorite: (trackId: string) => void;
  onRemoveTrack: (trackId: string) => void;
}) {
  const navigate = useNavigate();
  const [trackToDelete, setTrackToDelete] = useState<string | null>(null);
  const [menuTrackId, setMenuTrackId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (trackToDelete) {
      onRemoveTrack(trackToDelete);
      setTrackToDelete(null);
    }
  };

  const handleMenuToggle = (trackId: string) => {
    setMenuTrackId((current) => (current === trackId ? null : trackId));
  };

  const handleFavoriteFromMenu = (trackId: string) => {
    onToggleFavorite(trackId);
    // Keep menu open so the user can see the state change
  };

  const handleDeleteFromMenu = (trackId: string) => {
    setTrackToDelete(trackId);
    setMenuTrackId(null);
  };

  // Dynamic grid positions (4 columns, N rows)
  const columnLefts = [45, 302, 562, 822];
  const firstRowTop = 167;
  const rowGap = 281; // based on existing layout

  const getGridPosition = (index: number) => {
    const col = index % columnLefts.length;
    const row = Math.floor(index / columnLefts.length);
    return {
      left: columnLefts[col],
      top: firstRowTop + row * rowGap,
    };
  };

  return (
    <div
      className={`relative size-full transition-colors ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      data-name="Collection"
      onClick={() => setMenuTrackId(null)}
    >
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      <BackToQueryPage onClick={() => navigate('/')} isDarkMode={isDarkMode} />
      
      <AlertDialog open={trackToDelete !== null} onOpenChange={() => setTrackToDelete(null)}>
        <AlertDialogContent className={isDarkMode ? 'bg-gray-800 text-white border-gray-600' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Jost']">Are you sure you want to delete this song?</AlertDialogTitle>
            <AlertDialogDescription className={`font-['Jost'] ${isDarkMode ? 'text-gray-300' : ''}`}>
              This action cannot be undone. This will permanently remove the track from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative mx-auto w-full max-w-[1080px]">
        <p className={`absolute font-['Jost:Regular',sans-serif] font-normal h-[60px] leading-[normal] left-[539.5px] text-[40px] text-center top-[32px] translate-x-[-50%] w-[363px] transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>Collection</p>
        
        {tracks.map((track, index) => {
          const pos = getGridPosition(index);
          const titleLength = track.title.length;

          let titleFontSize = 16;
          if (titleLength > 55) {
            titleFontSize = 11;
          } else if (titleLength > 45) {
            titleFontSize = 12;
          } else if (titleLength > 35) {
            titleFontSize = 13;
          } else if (titleLength > 25) {
            titleFontSize = 14;
          }

          return (
            <div key={track.id}>
              {/* Album artwork */}
              <div
                className="absolute z-0 rounded-[10px] size-[200px]"
                style={{ left: pos.left, top: pos.top }}
              >
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[10px] size-full" src={track.image} />
              </div>
              
              {/* Text block: title + artist */}
              <div
                className="absolute"
                style={{
                  left: pos.left + 15,
                  top: pos.top + 207,
                  width: 167,
                }}
              >
                {/* Track title */}
                <p
                  className={`font-[family-name:'Courier_New',Courier,monospace] leading-[normal] not-italic transition-colors overflow-hidden text-left ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  style={{
                    fontSize: `${titleFontSize}px`,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {track.title}
                </p>

                {/* Artist name */}
                <p
                  className={`mt-1 font-[family-name:'Courier_New',Courier,monospace] italic leading-[normal] text-[13px] w-full transition-colors overflow-hidden text-ellipsis whitespace-nowrap text-left ${
                    isDarkMode ? "text-gray-300" : "text-black"
                  }`}
                >
                  {track.artist}
                </p>
              </div>

              {/* More (3-dot) menu trigger */}
              <div
                className="absolute z-50 cursor-pointer transition-transform hover:scale-110"
                // Slightly outside the album art so it's never visually buried
                style={{ left: pos.left + 204, top: pos.top + 205 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuToggle(track.id);
                }}
              >
                <MoreHorizontal
                  size={18}
                  className={isDarkMode ? "text-white" : "text-black"}
                  strokeWidth={2}
                />
              </div>

              {/* Context menu for favorite / delete */}
              {menuTrackId === track.id && (
                <div
                  className={`absolute z-50 min-w-[140px] rounded-md border px-3 py-2 text-[12px] shadow-lg ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                  style={{ left: pos.left + 120, top: pos.top + 230 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 ${
                      isDarkMode ? "hover:bg-gray-700/70" : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleFavoriteFromMenu(track.id)}
                  >
                    <Star
                      size={14}
                      className={
                        track.isFavorited
                          ? "fill-yellow-400 text-yellow-400"
                          : isDarkMode
                          ? "text-white"
                          : "text-black"
                      }
                      strokeWidth={2}
                    />
                    <span>{track.isFavorited ? "Unfavorite" : "Favorite"}</span>
                  </div>
                  <div
                    className={`mt-1 flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-red-500 ${
                      isDarkMode ? "hover:bg-gray-700/70" : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleDeleteFromMenu(track.id)}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </div>
                </div>
              )}
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
