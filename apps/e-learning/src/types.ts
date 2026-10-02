export interface ProblemItem {
  id: string;
  icon: string;
  raw: string;
  desc: string;
  title: string;
  text: string;
}

export type DemoType =
  | 'choice'
  | 'track'
  | 'video'
  | 'video_audio'
  | 'micro'
  | 'game'
  | 'sim'
  | 'immersive'
  | 'assessment'
  | 'support'
  | 'ilt'
  | 'audio'
  | 'ai';

export interface WorldItem {
  id: string;
  icon: string;
  name: string;
  sub: string;
  tag: string;
  bullets: string[];
  type: DemoType;
  details?: {
    overview: string;
    useCases: string[];
    deliverables: string[];
  };
}

export interface DepthLevel {
  level: number;
  title: string;
  text: string;
  pills: string[];
  best: string;
  speech: string;
  face: string;
  learnerRole: string;
  interactionType: string;
}

export interface IndustryItem {
  id: string;
  label: string;
  modeBadge?: string;
  title: string;
  intro: string;
  challenge: string;
  formats: string;
  practice: string;
  measure: string;
  story: string;
  accent: string;
}

export interface JargonTerm {
  code: string;
  title: string;
  desc: string;
  category?: string;
}

export interface AiCoachOption {
  text: string;
  empathy: number;
  clarity: number;
  resolution: number;
  feedback: string;
}
