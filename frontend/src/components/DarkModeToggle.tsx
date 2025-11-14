import { Moon, Sun } from "lucide-react";

export function DarkModeToggle({ 
  isDarkMode, 
  onToggle 
}: { 
  isDarkMode: boolean; 
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`absolute right-[30px] top-[25px] h-[50px] w-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all z-50 ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600' 
          : 'bg-white hover:bg-gray-50 border border-[#83aaff]'
      }`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-6 w-6 text-yellow-400" />
      ) : (
        <Moon className="h-6 w-6 text-[#4a89ff]" />
      )}
    </button>
  );
}
