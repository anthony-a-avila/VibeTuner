import React from "react";

interface FilterLabelProps {
  text: string;
  className?: string;
}

export function FilterLabel({ text, className }: FilterLabelProps) {
  return (
    <div className={className} data-name={text}>
      <div className="absolute bg-[#4a89ff] inset-0 rounded-[10px]" />
      <p className="absolute bottom-0 font-['Jost:Regular',sans-serif] font-normal leading-[normal] left-[9px] text-[24px] text-left text-nowrap text-white top-[-2.94%] whitespace-pre">
        {text}
      </p>
    </div>
  );
}
