import type { InsightArticleRecord } from './insightsData';

export interface InsightArticleSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
}

export interface InsightArticleContent {
  introduction: string;
  sections: readonly InsightArticleSection[];
  takeaways: readonly string[];
  conclusion: string;
}

interface CategoryPerspective {
  capability: string;
  stakeholders: string;
  evidence: string;
  practice: string;
}

const defaultPerspective: CategoryPerspective = {
  capability: 'business and technology capability',
  stakeholders: 'business leaders, managers and delivery teams',
  evidence: 'adoption, quality and measurable business outcomes',
  practice: 'role-based learning, practical exercises and manager reinforcement',
};

const categoryPerspectives: Record<string, CategoryPerspective> = {
  AI: {
    capability: 'responsible and production-ready AI capability',
    stakeholders: 'AI leaders, engineering teams, risk owners and business users',
    evidence: 'solution reliability, safe adoption and value delivered in real workflows',
    practice: 'governed experimentation, scenario-based practice and cross-functional review',
  },
  'Data & BI': {
    capability: 'confident, decision-focused data capability',
    stakeholders: 'data teams, analysts, operational leaders and decision-makers',
    evidence: 'decision quality, dashboard adoption and time to insight',
    practice: 'hands-on data scenarios, shared definitions and decision-oriented coaching',
  },
  'Cloud & Security': {
    capability: 'secure, resilient cloud capability',
    stakeholders: 'platform teams, security leaders, architects and administrators',
    evidence: 'control effectiveness, operational readiness and reduced exposure',
    practice: 'labs, architecture reviews, incident simulations and policy-to-practice exercises',
  },
  Cloud: {
    capability: 'reliable cloud operating capability',
    stakeholders: 'cloud leaders, platform teams, architects and administrators',
    evidence: 'operational quality, adoption and responsible use of cloud services',
    practice: 'hands-on labs, design reviews and role-based operating scenarios',
  },
  'L&D': {
    capability: 'scalable enterprise learning capability',
    stakeholders: 'L&D leaders, HR teams, managers and subject-matter experts',
    evidence: 'skill application, manager reinforcement and performance improvement',
    practice: 'role-based pathways, cohort learning and structured workplace application',
  },
  Leadership: {
    capability: 'practical leadership capability for modern work',
    stakeholders: 'people leaders, HR partners and transformation sponsors',
    evidence: 'team clarity, stronger decisions and sustained behaviour change',
    practice: 'guided reflection, realistic scenarios, peer learning and manager coaching',
  },
  Search: {
    capability: 'credible, audience-centred search and content capability',
    stakeholders: 'marketing leaders, content teams, experts and web owners',
    evidence: 'useful engagement, qualified discovery and trusted subject authority',
    practice: 'editorial standards, technical reviews and expert-led content workflows',
  },
  Technology: {
    capability: 'adaptable enterprise technology capability',
    stakeholders: 'technology leaders, delivery teams and business process owners',
    evidence: 'adoption, delivery quality and improved operational performance',
    practice: 'hands-on application, workflow exercises and role-specific learning paths',
  },
};

export const getInsightArticleContent = (article: InsightArticleRecord): InsightArticleContent => {
  const perspective = categoryPerspectives[article.category] ?? defaultPerspective;

  return {
    introduction: `${article.excerpt} The most useful response is not another isolated course. It is a focused capability plan that connects knowledge, practice, governance and measurable workplace application.`,
    sections: [
      {
        id: 'why-this-matters',
        title: 'Why this matters now',
        paragraphs: [
          `${article.title} is fundamentally a capability question. Organisations need to turn fast-moving ideas into repeatable decisions and consistent ways of working, while keeping business priorities visible throughout the process.`,
          `That requires alignment between ${perspective.stakeholders}. When those groups work from a shared outcome, learning becomes part of delivery rather than an activity that sits beside it.`,
        ],
      },
      {
        id: 'focus-areas',
        title: 'What enterprise teams should focus on',
        paragraphs: [
          `Start by defining the decisions, workflows and responsibilities that the capability must improve. This creates a practical boundary for the programme and prevents teams from collecting knowledge that never reaches day-to-day work.`,
          `The strongest programmes combine ${perspective.practice}. They give people enough context to make sound choices, then create repeated opportunities to apply those choices in realistic situations.`,
        ],
      },
      {
        id: 'capability-roadmap',
        title: 'A practical capability roadmap',
        paragraphs: [
          `Baseline current capability by role, not only by job title. Identify what people must understand, what they must be able to do, and where approval or escalation is required. Prioritise the small number of gaps that carry the greatest operational consequence.`,
          `Build the pathway in stages: shared foundations, role-specific practice, workplace application and reinforcement. Give managers a clear role in coaching and create short feedback loops so the programme can evolve as teams learn.`,
        ],
      },
      {
        id: 'measure-progress',
        title: 'How to measure meaningful progress',
        paragraphs: [
          `Completion is an activity measure, not proof of capability. Use a balanced view that combines participation with observed application and ${perspective.evidence}.`,
          `Review the evidence at agreed intervals with business and capability owners. The goal is not to produce a perfect dashboard; it is to make better decisions about where support, practice or governance needs to change.`,
        ],
      },
    ],
    takeaways: [
      `Define ${perspective.capability} in terms of real work and decisions.`,
      'Design learning around roles, practice and workplace application.',
      'Make managers and governance owners part of the reinforcement model.',
      `Measure progress through ${perspective.evidence}, not completion alone.`,
    ],
    conclusion: 'A clear capability system turns insight into repeatable action. Start with one priority workflow, prove the approach with a focused group, and scale only after the learning and operating model work together.',
  };
};
