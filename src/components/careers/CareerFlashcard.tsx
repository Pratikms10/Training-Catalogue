import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CareerPrinciple } from '../../data/careersData';

interface CareerFlashcardProps extends CareerPrinciple {
  position: number;
}

export const CareerFlashcard: React.FC<CareerFlashcardProps> = ({
  number,
  title,
  description,
  variant,
  position,
}) => (
  <article
    className={`career-flashcard career-flashcard--${variant}`}
    style={{ '--career-card-order': position } as React.CSSProperties}
    tabIndex={0}
  >
    <div className="career-flashcard__topline">
      <span className="career-flashcard__number">{number}</span>
      <span className="career-flashcard__motion-mark" aria-hidden="true">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </article>
);
