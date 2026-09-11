/**
 * TechnoEdge Corporate Training Catalogue - Information Architecture Types & Contracts
 */

export type CategoryId = 'role-based' | 'people-process' | 'tools-technology';

export type ProgrammePrefix = 'RB' | 'PP' | 'TT';

export type ProficiencyLevel = 'Awareness' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface CategoryArchitecture {
  id: CategoryId;
  name: string;
  count: number;
  idPrefix: ProgrammePrefix;
  idFormatExample: string;
  templateName: string;
  referenceImage: string;
  description: string;
  sampleId: string;
  sampleTitle: string;
  sampleLevel: ProficiencyLevel;
  filterDimensions: string[];
  structuralRules: {
    leftElements: string[];
    rightElements: string[];
    topElements: string[];
    bottomElements: string[];
    specialRule: string;
  };
}

export interface ProgrammeModule {
  id: string;
  title: string;
  learningOutcomes?: string[];
  concepts?: string[];
  practicalActivities?: string[];
  duration?: string;
  appliedExercise?: {
    title: string;
    content: string | string[];
  };
}

export interface ProgrammeScenario {
  title: string;
  content: string | string[];
  workflow?: string;
  description?: string;
}

export interface ProgrammeDetails {
  summary?: string;
  objective?: string;
  objectives?: string[];
  audience?: string[];
  prerequisitesList?: string[];
  delivery?: string;
  approach?: string;
  format?: string;
  toolsCovered?: string[];
  modules?: ProgrammeModule[];
  scenarios?: ProgrammeScenario[];
  [key: string]: any; // Allow flexible payload for future details
}

export interface BaseProgramme {
  id: string; // Must match prefix: RBxxxx, PPxxxx, or TTxxxx
  title: string;
  category: CategoryId;
  level: ProficiencyLevel | string;
  duration?: string;
  format?: 'Instructor-Led' | 'Virtual Class' | 'Self-Paced' | 'Blended' | string;
  details?: ProgrammeDetails; // Full programme content for future view
}

export interface RoleBasedProgramme extends BaseProgramme {
  category: 'role-based';
  categoryBadge: 'Role-Based Programme';
  imageUrl: string;
  relatedSkills: string[];
  industry?: string;
  department?: string;
  functionName?: string;
  roleTitle?: string;
}

export interface PeopleProcessProgramme extends BaseProgramme {
  category: 'people-process';
  badge: 'People and Process';
  topicCategory: string; // e.g. "People & Communication Skills"
  imageUrl: string;
  subType?: 'People' | 'Process';
  portfolio?: string;
  icons?: string[];
}

export interface ToolsTechProgramme extends BaseProgramme {
  category: 'tools-technology';
  toolLogoUrl: string;
  toolName: string; // Official brand name e.g. "ChatGPT", "Microsoft Copilot", "Power BI"
  vendor: string; // e.g. "OpenAI", "Microsoft", "Databricks", "AWS"
  categoryBadge: 'Tool or Technology';
  skillArea?: string;
  technologyCategory?: string[];
}

export type AnyProgramme = RoleBasedProgramme | PeopleProcessProgramme | ToolsTechProgramme;

export interface PageSectionInfo {
  id: string;
  title: string;
  phase: string;
  status: 'Phase 1 - Structural Wireframe' | 'Pending Phase' | 'Architected';
  notes: string;
}
