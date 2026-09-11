import { FilterGroupConfig } from '../types/filters';
import { toolsTechnologyProgrammes } from './actualProgrammes';

export const ROLE_BASED_FILTER_GROUPS: FilterGroupConfig[] = [
  {
    id: 'industry',
    title: 'Industry',
    allowMultiple: true,
    options: [
      { id: 'Technology & Communications', label: 'Technology & Communications' },
      { id: 'Banking / Financial Services', label: 'Banking / Financial Services' },
      { id: 'Consumer / Retail / Services', label: 'Consumer / Retail / Services' },
      { id: 'Manufacturing / Industrial', label: 'Manufacturing / Industrial' },
      { id: 'Healthcare / Life Sciences', label: 'Healthcare / Life Sciences' },
    ],
  },
  {
    id: 'department',
    title: 'Department',
    allowMultiple: true,
    initialVisibleCount: 6,
    options: [
      { id: 'Human Resources', label: 'Human Resources' },
      { id: 'Finance & Accounting', label: 'Finance & Accounting' },
      { id: 'Sales & Business Development', label: 'Sales & Business Development' },
      { id: 'Marketing', label: 'Marketing' },
      { id: 'Operations', label: 'Operations' },
      { id: 'Information Technology', label: 'Information Technology' },
      { id: 'Customer Service & Customer Success', label: 'Customer Service & Customer Success' },
      { id: 'Procurement & Vendor Management', label: 'Procurement & Vendor Management' },
      { id: 'Legal & Compliance', label: 'Legal & Compliance' },
      { id: 'Project & Program Management', label: 'Project & Program Management' },
      { id: 'Quality Management', label: 'Quality Management' },
      { id: 'Strategy & Business Management', label: 'Strategy & Business Management' },
      { id: 'Administration & Facilities', label: 'Administration & Facilities' },
      { id: 'Risk & Internal Audit', label: 'Risk & Internal Audit' },
      { id: 'Product / Service Management', label: 'Product / Service Management' },
    ],
  },
  {
    id: 'duration',
    title: 'Duration',
    allowMultiple: true,
    options: [
      { id: '4 Hours', label: '4 Hours' },
      { id: '8 Hours', label: '8 Hours' },
      { id: '16 Hours', label: '16 Hours' },
      { id: '32 Hours', label: '32 Hours' },
    ],
  },
];

export const TOOLS_TECHNOLOGY_FILTER_GROUPS: FilterGroupConfig[] = [
  {
    id: 'technology',
    title: 'Technology',
    allowMultiple: true,
    options: Array.from(new Set(toolsTechnologyProgrammes.map((p) => p.toolName).filter(Boolean))).map(tech => ({
      id: tech,
      label: tech,
    })),
  },
  {
    id: 'toolCategory',
    title: 'Tool Category',
    allowMultiple: true,
    options: [
      { id: 'AI', label: 'AI' },
      { id: 'Cloud Platform', label: 'Cloud Platform' },
      { id: 'BI & Analytics', label: 'BI & Analytics' },
      { id: 'Data & Database Platform', label: 'Data & Database Platform' },
      { id: 'DevOps & Development Tools', label: 'DevOps & Development Tools' },
      { id: 'Cybersecurity & Networking Tools', label: 'Cybersecurity & Networking Tools' },
      { id: 'Enterprise Applications', label: 'Enterprise Applications' },
      { id: 'Automation / No-Code', label: 'Automation / No-Code' },
      { id: 'Testing & QA Tools', label: 'Testing & QA Tools' },
      { id: 'Productivity & Collaboration', label: 'Productivity & Collaboration' },
      { id: 'Design, Content & Learning', label: 'Design, Content & Learning' },
      { id: 'Engineering & Scientific', label: 'Engineering & Scientific' },
    ],
  },
  {
    id: 'duration',
    title: 'Duration',
    allowMultiple: true,
    options: [
      { id: '4 Hours', label: '4 Hours' },
      { id: '8 Hours', label: '8 Hours' },
      { id: '16 Hours', label: '16 Hours' },
      { id: '32 Hours', label: '32 Hours' },
    ],
  },
];

export const PEOPLE_PROCESS_FILTER_GROUPS: FilterGroupConfig[] = [
  {
    id: 'category',
    title: 'Category',
    allowMultiple: true,
    options: [
      { id: 'People', label: 'People' },
      { id: 'Process', label: 'Process' },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    allowMultiple: true,
    options: [
      { id: 'People & Communication Skills', label: 'People & Communication Skills' },
      { id: 'Leadership & Managerial Skills', label: 'Leadership & Managerial Skills' },
      { id: 'Project & Program Management', label: 'Project & Program Management' },
      { id: 'Agile & Ways of Working', label: 'Agile & Ways of Working' },
      { id: 'Business Process & Operations', label: 'Business Process & Operations' },
      { id: 'Other', label: 'Other' },
    ],
  },
  {
    id: 'duration',
    title: 'Duration',
    allowMultiple: true,
    options: [
      { id: '8 Hours', label: '8 Hours' },
      { id: '16 Hours', label: '16 Hours' },
    ],
  },
];
