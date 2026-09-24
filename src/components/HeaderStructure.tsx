import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { OriginButton } from '@/components/ui/origin-button';

interface HeaderStructureProps {
  onHomeClick?: () => void;
  onQuickSearchClick?: () => void;
  onEnterpriseInquiryClick?: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

const primaryNavigation = [
  { label: 'Catalogue', path: '/', enabled: true },
  { label: 'Insights', path: '/insights', enabled: true },
  { label: 'Careers', path: '/careers', enabled: true },
];

export const HeaderStructure: React.FC<HeaderStructureProps> = ({
  onHomeClick,
  onQuickSearchClick,
  onEnterpriseInquiryClick,
  onNavigate,
  currentPath = '/',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const visibleNavigation = primaryNavigation.filter((item) => item.enabled);

  const navigate = (path: string) => {
    setIsMenuOpen(false);
    onNavigate?.(path);
  };

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
          <span className="font-bold text-lg sm:text-xl tracking-tight text-[#000000] whitespace-nowrap">
            TechnoEdge <span className="hidden xl:inline text-[rgba(0,0,0,0.58)] font-light">Learning Services</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-7" aria-label="Primary navigation">
          {visibleNavigation.map((item) => {
            const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF]/35 rounded-sm cursor-pointer ${
                  isActive ? 'text-[#0000FF]' : 'text-slate-700 hover:text-[#0000FF]'
                }`}
              >
                {item.label}
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#0000FF] transition-transform ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            );
          })}
        </nav>

        {/* Right action group */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            id="header-quick-search"
            aria-label="Focus search bar"
            onClick={onQuickSearchClick}
            className="h-9 inline-flex items-center gap-2 rounded-lg border border-[#0000FF] bg-[#0000FF] px-3 text-white shadow-[0_4px_14px_rgba(0,0,255,0.22)] hover:border-[#003BB5] hover:bg-[#003BB5] active:bg-[#002E91] transition-all focus:outline-none focus:ring-2 focus:ring-[#0000FF]/30 focus:ring-offset-2 cursor-pointer"
            title="Search catalogue"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Search programmes</span>
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

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,0,255,0.18)] text-[#0000FF] hover:bg-[rgba(33,150,243,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000FF]/30"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-site-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-site-navigation" className="lg:hidden border-t border-[rgba(0,0,255,0.12)] bg-white px-4 sm:px-8 py-5 shadow-[0_18px_35px_rgba(15,23,42,0.10)]">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {visibleNavigation.map((item) => {
              const isActive = item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`border-b border-slate-100 px-1 py-3.5 text-left text-sm font-semibold ${isActive ? 'text-[#0000FF]' : 'text-slate-800'}`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => { setIsMenuOpen(false); onQuickSearchClick?.(); }}
                className="h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0000FF] px-4 text-sm font-bold text-white"
              >
                <Search className="h-4 w-4" />
                Search programmes
              </button>
              <button
                type="button"
                onClick={() => { setIsMenuOpen(false); onEnterpriseInquiryClick?.(); }}
                className="h-11 rounded-lg border border-[#0000FF] px-4 text-sm font-bold text-[#0000FF]"
              >
                Corporate enquiry
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
