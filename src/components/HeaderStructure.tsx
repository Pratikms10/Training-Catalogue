import React from 'react';
import { Search } from 'lucide-react';
import { OriginButton } from '@/components/ui/origin-button';

interface HeaderStructureProps {
  onHomeClick?: () => void;
  onQuickSearchClick?: () => void;
  onEnterpriseInquiryClick?: () => void;
}

export const HeaderStructure: React.FC<HeaderStructureProps> = ({
  onHomeClick,
  onQuickSearchClick,
  onEnterpriseInquiryClick,
}) => {
  return (
    <header id="technoedge-header-structure" className="w-full bg-white border-b border-[rgba(0,0,255,0.12)] sticky top-0 z-40 shrink-0">
      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <div 
          onClick={onHomeClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onHomeClick?.();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="TechnoEdge Corporate Training Catalogue Home"
          className="flex items-center gap-3 cursor-pointer group select-none outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF] focus-visible:ring-offset-2 rounded-lg p-0.5"
        >
          <div className="w-9 h-9 flex items-center justify-center shrink-0">
            <img 
              id="header-brand-logo"
              src="/hero-logo.png" 
              alt="TechnoEdge Logo" 
              className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-105" 
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#000000]">
            TechnoEdge <span className="text-[rgba(0,0,0,0.58)] font-light">Learning Services</span>
          </span>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="header-quick-search"
            aria-label="Focus search bar"
            onClick={onQuickSearchClick}
            className="p-2.5 rounded-lg text-[rgba(0,0,0,0.58)] hover:text-[#0000FF]/70 hover:bg-[rgba(33,150,243,0.06)] active:bg-[rgba(33,150,243,0.12)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0000FF]/30 cursor-pointer"
            title="Search catalogue"
          >
            <Search className="w-4 h-4" />
          </button>
          <OriginButton
            id="header-enterprise-inquiry-btn"
            onClick={onEnterpriseInquiryClick}
            fillClassName="bg-[#22c55e]"
            className="h-9 px-4 rounded-lg bg-[#0000FF] border-none text-white text-xs uppercase tracking-wider font-bold shadow-xs hover:shadow-[0_4px_18px_rgba(0,0,255,0.42)] hover:ring-2 hover:ring-[#2196F3]/70 transition-all duration-200 text-white hover:text-white cursor-pointer"
          >
            Corporate Enquiry
          </OriginButton>
        </div>
      </div>
    </header>
  );
};
