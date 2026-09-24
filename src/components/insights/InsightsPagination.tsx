import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type PageToken = number | 'ellipsis-left' | 'ellipsis-right';

interface InsightsPaginationProps {
  currentPage: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

const desktopTokens = (currentPage: number, totalPages: number): PageToken[] => {
  if (totalPages <= 4) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, 'ellipsis-right'];
  if (currentPage >= totalPages - 1) return [1, 'ellipsis-left', totalPages - 2, totalPages - 1, totalPages];
  return [1, 'ellipsis-left', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-right'];
};

const mobileTokens = (currentPage: number, totalPages: number): PageToken[] => {
  if (totalPages <= 3) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 2) return [1, 2, 'ellipsis-right'];
  if (currentPage >= totalPages - 1) return [1, 'ellipsis-left', totalPages - 1, totalPages];
  return [1, 'ellipsis-left', currentPage, 'ellipsis-right'];
};

interface PageButtonsProps {
  tokens: PageToken[];
  currentPage: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

const PageButtons: React.FC<PageButtonsProps> = ({ tokens, currentPage, disabled, onPageChange }) => (
  <>
    {tokens.map((token) => typeof token === 'number' ? (
      <button
        key={token}
        type="button"
        aria-label={`Go to page ${token}`}
        aria-current={currentPage === token ? 'page' : undefined}
        disabled={disabled}
        className={currentPage === token ? 'latest-pagination__page is-active' : 'latest-pagination__page'}
        onClick={() => onPageChange(token)}
      >
        {token}
      </button>
    ) : (
      <span key={token} className="latest-pagination__ellipsis" aria-hidden="true">…</span>
    ))}
  </>
);

export const InsightsPagination: React.FC<InsightsPaginationProps> = ({
  currentPage,
  totalPages,
  disabled,
  onPageChange,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className="latest-pagination" aria-label="Insights pagination">
      <button
        type="button"
        className="latest-pagination__text-button"
        disabled={disabled || isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeft aria-hidden="true" /> Previous
      </button>

      <div className="latest-pagination__pages latest-pagination__pages--desktop">
        <PageButtons
          tokens={desktopTokens(currentPage, totalPages)}
          currentPage={currentPage}
          disabled={disabled}
          onPageChange={onPageChange}
        />
      </div>

      <div className="latest-pagination__pages latest-pagination__pages--mobile">
        <PageButtons
          tokens={mobileTokens(currentPage, totalPages)}
          currentPage={currentPage}
          disabled={disabled}
          onPageChange={onPageChange}
        />
      </div>

      <button
        type="button"
        className="latest-pagination__text-button"
        disabled={disabled || isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <ArrowRight aria-hidden="true" />
      </button>

      <button
        type="button"
        className="latest-pagination__text-button latest-pagination__last"
        disabled={disabled || isLastPage}
        onClick={() => onPageChange(totalPages)}
      >
        Last <ArrowRight aria-hidden="true" />
      </button>
    </nav>
  );
};
