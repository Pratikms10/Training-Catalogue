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
  placeholder = 'Search by role, skill, technology, certification or Course ID...',
  id = 'catalogue-search-input',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <div className="relative flex-1 w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition-colors group-focus-within:bg-white group-focus-within:text-[#0000FF]">
          <Search className="w-5 h-5" aria-hidden="true" />
        </span>
      </div>

      <input
        id={id}
        type="text"
        role="searchbox"
        aria-label="Search programmes by role, skill, technology, certification or Course ID"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-14 sm:h-[60px] pl-16 pr-12 bg-[#075BFF] text-white text-sm sm:text-base font-medium placeholder:font-normal placeholder:text-white/80 border-2 border-[#075BFF] hover:bg-[#004BE0] hover:border-[#004BE0] rounded-xl shadow-[0_8px_24px_rgba(0,73,210,0.28)] transition-all focus:outline-none focus:border-[#003BB5] focus:ring-4 focus:ring-[rgba(33,150,243,0.28)] focus:shadow-[0_10px_30px_rgba(0,73,210,0.34)]"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/80 hover:text-white transition-colors focus:outline-none focus:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
