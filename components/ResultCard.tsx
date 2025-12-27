import React from 'react';

interface ResultCardProps {
  title: string;
  value: number;
  subtitle: string;
  onEdit?: () => void;
  isEditing?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, value, subtitle, onEdit, isEditing }) => {
  return (
    <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
      
      <h2 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
        {title}
        {onEdit && (
          <button 
            onClick={onEdit}
            className="ml-1 p-1 hover:bg-black hover:text-white transition-colors rounded-sm"
            title={isEditing ? "Close Edit" : "Edit Previous"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        )}
      </h2>
      
      <div className="text-5xl sm:text-6xl font-black font-mono my-2 tracking-tighter">
        {value.toFixed(2)}
      </div>
      
      <p className="text-xs font-mono border-t border-black pt-2 mt-1 w-full max-w-[120px]">
        {subtitle}
      </p>
    </div>
  );
};
