import React from 'react';
import { Search, X } from 'lucide-react';

interface CatalogueSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onEnter?: () => void;
  placeholder?: string;
  id?: string;
}

export const CatalogueSearch: React.FC<CatalogueSearchProps> = ({
  value,
  onChange,
  onClear,
  onEnter,
  placeholder = 'Search by programme, skill, role, tool or keyword...',
  id = 'catalogue-search-input',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <div className="relative flex-1 w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0000FF]">
        <Search className="w-5 h-5 text-[#0000FF]" aria-hidden="true" />
      </div>

      <input
        id={id}
        type="text"
        role="searchbox"
        aria-label="Search programmes by skill, role, tool or keyword"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-[46px] pl-11 pr-10 bg-white text-[#000000] text-sm placeholder:text-[rgba(0,0,0,0.45)] border border-[rgba(0,0,255,0.18)] hover:border-[#0000FF]/30 rounded-lg shadow-2xs transition-all focus:outline-none focus:border-[#0000FF]/30 focus:ring-3 focus:ring-[rgba(33,150,243,0.14)]"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[rgba(0,0,0,0.48)] hover:text-[#0000FF]/70 transition-colors focus:outline-none focus:text-[#0000FF]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
