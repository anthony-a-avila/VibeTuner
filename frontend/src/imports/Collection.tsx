import { DarkModeToggle } from "../components/DarkModeToggle";
import { Star, Trash2 } from "lucide-react";
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

  const handleDeleteConfirm = () => {
    if (trackToDelete) {
      onRemoveTrack(trackToDelete);
      setTrackToDelete(null);
    }
  };

  // Grid positions for up to 12 tracks (3 rows x 4 columns)
  const gridPositions = [
    { left: 45, top: 167 },    // Row 1, Col 1
    { left: 302, top: 167 },   // Row 1, Col 2
    { left: 562, top: 167 },   // Row 1, Col 3
    { left: 822, top: 167 },   // Row 1, Col 4
    { left: 42, top: 448 },    // Row 2, Col 1
    { left: 299, top: 448 },   // Row 2, Col 2
    { left: 559, top: 448 },   // Row 2, Col 3
    { left: 823, top: 448 },   // Row 2, Col 4
    { left: 42, top: 723 },    // Row 3, Col 1
    { left: 302, top: 723 },   // Row 3, Col 2
    { left: 562, top: 723 },   // Row 3, Col 3
    { left: 821, top: 723 },   // Row 3, Col 4
  ];

  return (
    <div className={`relative size-full transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} data-name="Collection">
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
        
        {tracks.slice(0, 12).map((track, index) => {
          const pos = gridPositions[index];
          return (
            <div key={track.id}>
              {/* Album artwork */}
              <div className="absolute rounded-[10px] size-[200px]" style={{ left: pos.left, top: pos.top }}>
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[10px] size-full" src={track.image} />
              </div>
              
              {/* Track title */}
              <p className={`absolute font-[family-name:'Courier_New',Courier,monospace] h-[33px] leading-[normal] not-italic text-[16px] w-[167px] transition-colors overflow-hidden text-ellipsis whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-black'}`} style={{ left: pos.left + 15, top: pos.top + 207 }}>
                {track.title}
              </p>
              
              {/* Artist name */}
              <p className={`absolute font-[family-name:'Courier_New',Courier,monospace] h-[33px] italic leading-[normal] text-[13px] w-[169px] transition-colors overflow-hidden text-ellipsis whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-black'}`} style={{ left: pos.left + 15, top: pos.top + 224 }}>
                {track.artist}
              </p>
              
              {/* Star icon for favorite */}
              <div
                className="absolute cursor-pointer transition-transform hover:scale-110 z-10"
                style={{ 
                  left: pos.left + 10, 
                  top: pos.top + 10, 
                  mixBlendMode: track.isFavorited ? 'normal' : 'difference',
                  filter: 'drop-shadow(0 0 0.5px white) drop-shadow(0 0 1px black)'
                }}
                onClick={() => onToggleFavorite(track.id)}
              >
                <Star
                  size={24}
                  className={track.isFavorited ? "fill-yellow-400 text-yellow-400" : "text-white"}
                  strokeWidth={2}
                />
              </div>
              
              {/* Trash icon for delete */}
              <div
                className="absolute cursor-pointer transition-transform hover:scale-110 z-10"
                style={{ 
                  left: pos.left + 166, 
                  top: pos.top + 10, 
                  mixBlendMode: 'difference',
                  filter: 'drop-shadow(0 0 0.5px white) drop-shadow(0 0 1px black)'
                }}
                onClick={() => setTrackToDelete(track.id)}
              >
                <Trash2
                  size={24}
                  className="text-white transition-colors"
                  strokeWidth={2}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
