import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CategoryId, BaseProgramme } from './types';
import { CATEGORIES_ARCHITECTURE } from './data/architectureData';
import { HeaderStructure } from './components/HeaderStructure';
import { IntroductionStructure } from './components/IntroductionStructure';
import { CategoryNavigation } from './components/CategoryNavigation';
import { CatalogueGrid } from './components/CatalogueGrid';
import { CourseDetail } from './components/CourseDetail';
import { FooterStructure } from './components/FooterStructure';
import { RfqModal } from './components/RfqModal';
import { FloatingActions } from './components/FloatingActions';
import { peopleProcessProgrammes } from './data/actualProgrammes';
import { fetchCourseById } from './api/catalogueApi';
import { ImportCentre } from './components/admin/ImportCentre';
import { CareersPage } from './components/careers/CareersPage';
import { CareerRolePage } from './components/careers/CareerRolePage';
import { InsightsPage } from './components/insights/InsightsPage';
import { InsightArticlePage } from './components/insights/InsightArticlePage';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isImportCentre = location.pathname === '/admin/import';
  const isInsightsPage = location.pathname === '/insights';
  const insightArticleSlug = location.pathname.startsWith('/insights/')
    ? decodeURIComponent(location.pathname.replace('/insights/', ''))
    : null;
  const isCareersPage = location.pathname === '/careers';
  const careerRoleSlug = location.pathname.startsWith('/careers/')
    ? decodeURIComponent(location.pathname.replace('/careers/', ''))
    : null;
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('role-based');
  const [selectedProgramme, setSelectedProgramme] = useState<BaseProgramme | null>(null);
  const [isProgrammeLoading, setIsProgrammeLoading] = useState(false);
  const [programmeLoadError, setProgrammeLoadError] = useState<string | null>(null);
  const [isEnterpriseInquiryOpen, setIsEnterpriseInquiryOpen] = useState(false);

  useEffect(() => {
    let activeController: AbortController | null = null;
    const path = location.pathname;
    activeController?.abort();
      if (path.startsWith('/programmes/')) {
        const id = decodeURIComponent(path.replace('/programmes/', '')).toUpperCase();
        setProgrammeLoadError(null);

        const isLegacyCertificationCode = /^[A-Z0-9]{2,12}-[A-Z0-9][A-Z0-9-]{1,30}$/.test(id) && /\d/.test(id);
        if (id.startsWith('TT') || id.startsWith('TC') || id.startsWith('RB') || id.startsWith('CER') || isLegacyCertificationCode) {
          const displayCategory: CategoryId = id.startsWith('TT')
            ? 'ai-tools'
            : id.startsWith('TC')
              ? 'tools-technology'
            : id.startsWith('RB')
              ? 'role-based'
              : 'certifications';
          setActiveCategoryId(displayCategory);
          setSelectedProgramme(null);
          setIsProgrammeLoading(true);
          const controller = new AbortController();
          activeController = controller;

          fetchCourseById(id, controller.signal)
            .then((programme) => {
              if (programme.id !== id) {
                navigate(`/programmes/${programme.id}`, { replace: true });
              }
              setSelectedProgramme(programme);
            })
            .catch((error: Error) => {
              if (error.name === 'AbortError') return;
              setProgrammeLoadError(error.message);
              setSelectedProgramme({
                id: 'NOT_FOUND',
                title: 'Programme Not Found',
                category: displayCategory,
                level: 'Awareness',
              });
            })
            .finally(() => {
              if (!controller.signal.aborted) setIsProgrammeLoading(false);
            });
          return () => controller.abort();
        }

        let prog: BaseProgramme | undefined;
        if (id.startsWith('PP')) prog = peopleProcessProgrammes.find(p => p.id === id);

        setIsProgrammeLoading(false);
        if (prog) {
          if (id.startsWith('PP')) {
            const category: CategoryId = prog && 'subType' in prog && prog.subType === 'Process'
              ? 'process-based'
              : 'people-behavioural';
            setActiveCategoryId(category);
            setSelectedProgramme({
              ...prog,
              category,
              badge: category === 'process-based' ? 'Process Based' : 'People & Behavioural',
            });
          } else {
            setSelectedProgramme(prog);
          }
        } else {
          setSelectedProgramme({
            id: 'NOT_FOUND',
            title: 'Programme Not Found',
            category: id.startsWith('PP') ? 'people-behavioural' : 'role-based',
            level: 'Awareness',
          });
        }
      } else {
        setIsProgrammeLoading(false);
        setProgrammeLoadError(null);
        setSelectedProgramme(null);
      }

    return () => {
      activeController?.abort();
    };
  }, [location.pathname, navigate]);

  const handleSelectProgramme = (programme: BaseProgramme) => {
    navigate(`/programmes/${programme.id}`);
  };

  const handleBack = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearchClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      const searchInput = document.getElementById('catalogue-search-input');
      if (searchInput) {
        searchInput.focus();
        const catalogueSection = document.getElementById('programme-catalogue-section');
        if (catalogueSection) {
          const rect = catalogueSection.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({
            top: rect.top + scrollTop - 64,
            behavior: 'smooth',
          });
        }
      }
    }, 100);
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setActiveCategoryId(catId);
    setTimeout(() => {
      const catalogueSection = document.getElementById('programme-catalogue-section');
      if (catalogueSection) {
        const rect = catalogueSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - 64,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const handleFooterCategorySelect = (catId: CategoryId) => {
    setActiveCategoryId(catId);
    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      const catalogueSection = document.getElementById('programme-catalogue-section');
      if (catalogueSection) {
        const rect = catalogueSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - 64,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <div id="corporate-catalogue-app" className="min-h-screen bg-white text-[#000000] flex flex-col font-sans antialiased selection:bg-[#0000FF] selection:text-white">
      <HeaderStructure 
        onHomeClick={handleBack}
        onQuickSearchClick={handleQuickSearchClick}
        onEnterpriseInquiryClick={() => setIsEnterpriseInquiryOpen(true)}
        onNavigate={(path) => {
          navigate(path);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentPath={location.pathname}
      />
      <main id="main-catalogue-content" className="flex-1 flex flex-col">
        {isImportCentre ? (
          <ImportCentre />
        ) : isInsightsPage ? (
          <InsightsPage />
        ) : insightArticleSlug ? (
          <InsightArticlePage slug={insightArticleSlug} onBack={() => navigate('/insights')} />
        ) : isCareersPage ? (
          <CareersPage onViewRole={(slug) => navigate(`/careers/${slug}`)} />
        ) : careerRoleSlug ? (
          <CareerRolePage slug={careerRoleSlug} onBack={() => navigate('/careers')} />
        ) : (
          <>
        {isProgrammeLoading && (
          <div className="flex-1 flex items-center justify-center py-24 px-6" role="status">
            <p className="text-base font-semibold text-[rgba(0,0,0,0.70)]">Loading programme…</p>
          </div>
        )}

        {selectedProgramme && selectedProgramme.id !== 'NOT_FOUND' && (
          <CourseDetail 
             programme={selectedProgramme} 
             onBack={handleBack} 
           />
        )}

        {selectedProgramme && selectedProgramme.id === 'NOT_FOUND' && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
            <h1 className="text-3xl font-bold text-[#000000] mb-4">Programme not found</h1>
            <p className="text-[rgba(0,0,0,0.70)] mb-8">
              {programmeLoadError || 'The requested programme could not be found or has been removed.'}
            </p>
            <button 
              onClick={handleBack} 
              className="bg-[#0000FF] hover:opacity-90 active:opacity-100 text-white px-6 py-3 rounded-lg font-semibold transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
            >
              Back to Catalogue
            </button>
          </div>
        )}

        <div className={selectedProgramme || isProgrammeLoading ? 'hidden' : 'block'}>
          <IntroductionStructure />
          <CategoryNavigation
            categories={CATEGORIES_ARCHITECTURE}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleCategorySelect}
          />
          <CatalogueGrid 
             activeCategoryId={activeCategoryId} 
             onViewDetail={handleSelectProgramme}
          />
        </div>
          </>
        )}
      </main>
      <FooterStructure 
        onSelectCategory={handleFooterCategorySelect}
        onOpenInquiry={() => setIsEnterpriseInquiryOpen(true)}
      />

      {/* Floating WhatsApp and Phone utility buttons */}
      <FloatingActions />

      {/* Global Enterprise Inquiry RFQ Modal */}
      <RfqModal
        isOpen={isEnterpriseInquiryOpen}
        onClose={() => setIsEnterpriseInquiryOpen(false)}
      />
    </div>
  );
}
