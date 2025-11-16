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