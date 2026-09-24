import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GroupNavigationProps {
  canGoBack: boolean;
  canGoForward: boolean;
  disabled: boolean;
  onBack: () => void;
  onForward: () => void;
}

export const GroupNavigation: React.FC<GroupNavigationProps> = ({
  canGoBack,
  canGoForward,
  disabled,
  onBack,
  onForward,
}) => (
  <div className="featured-group-navigation">
    <button
      type="button"
      aria-label="Previous articles"
      disabled={disabled || !canGoBack}
      onClick={onBack}
    >
      <ArrowLeft aria-hidden="true" />
    </button>
    <button
      type="button"
      aria-label="Next articles"
      disabled={disabled || !canGoForward}
      onClick={onForward}
    >
      <ArrowRight aria-hidden="true" />
    </button>
  </div>
);
