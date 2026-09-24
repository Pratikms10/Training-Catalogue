export interface InsightsHeroContent {
  titleLead: string;
  titleBridge: string;
  titleAccent: string;
  paragraphs: readonly string[];
}

export const insightsHeroContent: InsightsHeroContent = {
  titleLead: 'Insights That Move',
  titleBridge: 'Learning and',
  titleAccent: 'Business Forward',
  paragraphs: [
    'Practical perspectives on AI, technology, learning, and workforce transformation—grounded in the challenges businesses face today.',
    "Clear, useful ideas designed to help teams build capability, make better decisions, and stay ready for what's next.",
  ],
};

export interface FeaturedArticleContent {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  image: string;
  url: string;
}

export interface FeaturedPost {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  url: string;
}

export type FeaturedCategory = 'AI' | 'Latest' | 'Popular';

export const featuredArticle: FeaturedArticleContent = {
  id: 'ai-training-indian-gcc-leaders-2026',
  title: 'AI Training for Indian GCC Leaders in 2026: How to Build Senior AI Capability Instead of Competing for Scarce External Talent',
  summary: 'A practical look at how GCC leaders can build advanced AI capability internally instead of relying only on scarce external talent.',
  author: 'TechnoEdge',
  date: 'Sep 2026',
  image: '',
  url: '/insights/ai-training-indian-gcc-leaders-2026',
};

const createFeaturedPosts = (
  prefix: string,
  items: ReadonlyArray<readonly [title: string, category: string]>,
): FeaturedPost[] => items.map(([title, category], index) => {
  const id = `${prefix}-${index + 1}`;

  return {
    id,
    title,
    category,
    date: 'Sep 2026',
    image: '',
    url: `/insights/${id}`,
  };
});

export const featuredPostsByCategory: Record<FeaturedCategory, FeaturedPost[]> = {
  AI: createFeaturedPosts('ai', [
    ['Enterprise RAG Training in 2026', 'AI'],
    ['AI-102 Certification Roadmap 2026', 'AI'],
    ['Model Context Protocol Security in 2026', 'AI'],
    ['LLM Evaluation and AI Observability Skills in 2026', 'AI'],
    ['Generative AI Training for Non-Technical Teams', 'AI'],
    ['Microsoft 365 Copilot Training in 2026', 'AI'],
    ['AI Readiness Assessment 2026', 'AI'],
    ['Agentic AI for Business Teams in 2026', 'AI'],
    ['AI Upskilling for Teams 2026', 'AI'],
    ['AI Governance for Enterprise Teams', 'AI'],
  ]),
  Latest: createFeaturedPosts('latest', [
    ['Training ROI Dashboard in Power BI in 2026', 'Data & BI'],
    ['Identity Security for AI and Cloud Teams', 'Cloud & Security'],
    ['Azure Data Engineering Skills Gap in 2026', 'Data & BI'],
    ['Microsoft Fabric Governance Training in 2026', 'Data & BI'],
    ['EU AI Act AI Literacy Training in 2026', 'L&D'],
    ['Corporate Learning Metrics That Matter', 'L&D'],
    ['Power Platform Automation Training 2026', 'Technology'],
    ['Leading a Multi-Generational Workforce', 'Leadership'],
    ['BFSI Technology Training 2026', 'L&D'],
    ['Data Governance Training 2026', 'Data & BI'],
  ]),
  Popular: createFeaturedPosts('popular', [
    ['Microsoft 365 Copilot Training in 2026', 'AI'],
    ['Role-Based Corporate IT Training 2026', 'L&D'],
    ['AI Upskilling for Teams 2026', 'AI'],
    ['Cybersecurity Corporate Training in 2026', 'Cloud & Security'],
    ['Corporate Power BI Training in 2026', 'Data & BI'],
    ['Is Gen Z Difficult to Manage—or Differently Motivated?', 'Leadership'],
    ['What Will Corporate Training Look Like in India by 2027?', 'L&D'],
    ['Cloud Training ROI', 'Cloud'],
    ['AI in Corporate Training', 'AI'],
    ['How to Build an Employee Upskilling Plan in 90 Days', 'L&D'],
  ]),
};

export type InsightCategory = 'AI' | 'Data & BI' | 'Cloud & Security' | 'L&D' | 'Leadership' | 'Search';

export interface InsightArticle {
  id: string;
  title: string;
  category: InsightCategory;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  url: string;
}

export const insightCategories: ReadonlyArray<'All' | InsightCategory> = [
  'All',
  'AI',
  'Data & BI',
  'Cloud & Security',
  'L&D',
  'Leadership',
  'Search',
];

const initialInsightsArticles: InsightArticle[] = [
  {
    id: 'enterprise-rag-training-2026',
    title: 'Enterprise RAG Training in 2026: How AI Teams Can Ground GenAI on Internal Data Without Creating Security, Leakage or Hallucination Risk',
    category: 'AI',
    excerpt: 'A practical look at grounding enterprise GenAI with internal knowledge while keeping security and reliability in focus.',
    date: 'Sep 21, 2026',
    readTime: '8 min read',
    image: '',
    url: '#',
  },
  {
    id: 'ai-102-certification-roadmap-2026',
    title: 'AI-102 Certification Roadmap 2026: The Skills Azure AI Engineers Need for Generative AI and Enterprise AI Solutions',
    category: 'AI',
    excerpt: 'Explore the Azure AI capabilities enterprise teams need as AI engineering moves toward generative and agentic solutions.',
    date: 'Sep 18, 2026',
    readTime: '7 min read',
    image: '',
    url: '#',
  },
  {
    id: 'training-roi-dashboard-power-bi-2026',
    title: 'How L&D Leaders Can Build a Training ROI Dashboard in Power BI in 2026: Measuring Skill Gain, Adoption and Business Impact',
    category: 'Data & BI',
    excerpt: 'See how learning teams can connect training activity with adoption, capability growth and measurable business outcomes.',
    date: 'Sep 15, 2026',
    readTime: '6 min read',
    image: '',
    url: '#',
  },
  {
    id: 'identity-security-ai-cloud-teams-2026',
    title: 'Identity Security for AI and Cloud Teams in 2026: An Enterprise Training Roadmap Across SC-300, SC-100 and Zero Trust',
    category: 'Cloud & Security',
    excerpt: 'A structured approach to developing identity and Zero Trust capability across modern cloud and AI teams.',
    date: 'Sep 12, 2026',
    readTime: '7 min read',
    image: '',
    url: '#',
  },
  {
    id: 'gen-z-differently-motivated',
    title: 'Is Gen Z Difficult to Manage—or Differently Motivated?',
    category: 'Leadership',
    excerpt: 'A closer look at what motivates younger employees and how managers can adapt their leadership approach.',
    date: 'Sep 09, 2026',
    readTime: '5 min read',
    image: '',
    url: '#',
  },
  {
    id: 'seo-search-evolution-2026',
    title: 'SEO in 2026: How Search Is Evolving, Why Old SEO Is Failing, and What Websites Must Do to Get Traffic',
    category: 'Search',
    excerpt: 'Understand how traditional search, AI search and changing discovery behaviors are reshaping modern SEO.',
    date: 'Sep 06, 2026',
    readTime: '7 min read',
    image: '',
    url: '#',
  },
  {
    id: 'bfsi-technology-training-2026',
    title: 'BFSI Technology Training 2026: How Banks Can Upskill Teams for AI, Cloud, Data, and Cyber Resilience',
    category: 'L&D',
    excerpt: 'Build a practical capability roadmap for financial services teams navigating rapid technology change.',
    date: 'Sep 03, 2026',
    readTime: '8 min read',
    image: '',
    url: '#',
  },
  {
    id: 'llm-evaluation-observability-skills-2026',
    title: 'Why Enterprise GenAI Teams Need LLM Evaluation and AI Observability Skills in 2026',
    category: 'AI',
    excerpt: 'Develop the evaluation practices teams need to move dependable generative AI into production.',
    date: 'Aug 30, 2026',
    readTime: '7 min read',
    image: '',
    url: '#',
  },
  {
    id: 'data-literacy-enterprise-teams',
    title: 'From Reporting to Decisions: Building Data Literacy Across Enterprise Teams',
    category: 'Data & BI',
    excerpt: 'Help business teams turn dashboards and data into faster, more confident decisions.',
    date: 'Aug 27, 2026',
    readTime: '6 min read',
    image: '',
    url: '#',
  },
  {
    id: 'leading-through-technology-change',
    title: 'Leading Through Technology Change: A Practical Playbook for Managers',
    category: 'Leadership',
    excerpt: 'Give managers the communication and coaching skills needed to lead successful change.',
    date: 'Aug 24, 2026',
    readTime: '6 min read',
    image: '',
    url: '#',
  },
  {
    id: 'cloud-security-skills-before-ai-scale',
    title: 'Cloud Security Skills Enterprises Need Before Scaling AI Workloads',
    category: 'Cloud & Security',
    excerpt: 'Strengthen identity, governance, and operational readiness before AI workloads scale.',
    date: 'Aug 21, 2026',
    readTime: '7 min read',
    image: '',
    url: '#',
  },
  {
    id: 'corporate-training-india-2027',
    title: 'What Will Corporate Training Look Like in India by 2027?',
    category: 'L&D',
    excerpt: 'Prepare learning strategy for the technologies, expectations, and workforce shifts ahead.',
    date: 'Aug 18, 2026',
    readTime: '5 min read',
    image: '',
    url: '#',
  },
];

const placeholderArticleTitles: ReadonlyArray<readonly [title: string, category: InsightCategory]> = [
  ['Building an Enterprise AI Governance Operating Model', 'AI'],
  ['Agentic AI Skills Business Teams Will Need Next', 'AI'],
  ['Designing Safe Human-in-the-Loop AI Workflows', 'AI'],
  ['Prompt Engineering Standards for Enterprise Teams', 'AI'],
  ['AI Readiness Assessments That Lead to Action', 'AI'],
  ['Generative AI Enablement for Non-Technical Leaders', 'AI'],
  ['Responsible AI Training Beyond Policy Awareness', 'AI'],
  ['Scaling AI Champions Across Business Functions', 'AI'],
  ['The Modern Data Literacy Framework for Business Teams', 'Data & BI'],
  ['Microsoft Fabric Skills for Enterprise Analytics Teams', 'Data & BI'],
  ['From Dashboard Adoption to Decision Quality', 'Data & BI'],
  ['Data Governance Training for Distributed Teams', 'Data & BI'],
  ['Power BI Enablement for Finance and Operations', 'Data & BI'],
  ['Building Self-Service Analytics Without Losing Control', 'Data & BI'],
  ['Practical Data Storytelling for Senior Leaders', 'Data & BI'],
  ['Closing the Data Engineering Capability Gap', 'Data & BI'],
  ['Zero Trust Skills for Hybrid Enterprise Environments', 'Cloud & Security'],
  ['Cloud Security Training for Platform Engineering Teams', 'Cloud & Security'],
  ['Identity Governance Skills for Modern Administrators', 'Cloud & Security'],
  ['Security Operations Readiness for AI Workloads', 'Cloud & Security'],
  ['Building Secure-by-Design Cloud Engineering Habits', 'Cloud & Security'],
  ['Incident Response Exercises That Build Real Capability', 'Cloud & Security'],
  ['Cybersecurity Awareness for High-Risk Business Roles', 'Cloud & Security'],
  ['Preparing Technical Teams for Multi-Cloud Governance', 'Cloud & Security'],
  ['How to Build a Role-Based Learning Architecture', 'L&D'],
  ['Measuring Capability Growth Beyond Course Completion', 'L&D'],
  ['Creating an Internal Technology Academy That Scales', 'L&D'],
  ['Skills Taxonomies for Fast-Changing Technology Roles', 'L&D'],
  ['Designing Cohort Learning for Enterprise Adoption', 'L&D'],
  ['Manager-Led Reinforcement After Formal Training', 'L&D'],
  ['Building a Ninety-Day Employee Upskilling Plan', 'L&D'],
  ['Learning Experience Design for Busy Professionals', 'L&D'],
  ['Leading Teams Through Continuous Technology Change', 'Leadership'],
  ['Coaching Managers to Build Psychological Safety', 'Leadership'],
  ['Decision-Making Skills for First-Time Managers', 'Leadership'],
  ['Leading Multi-Generational Enterprise Teams', 'Leadership'],
  ['Communication Practices for Hybrid Leadership', 'Leadership'],
  ['Building Accountability Without Micromanagement', 'Leadership'],
  ['Developing Technical Experts Into People Leaders', 'Leadership'],
  ['Change Leadership for Enterprise Transformation', 'Leadership'],
  ['Search Strategy in an AI Answer Engine World', 'Search'],
  ['How Expert Content Builds Sustainable Search Visibility', 'Search'],
  ['Technical SEO Priorities for Enterprise Websites', 'Search'],
  ['Building E-E-A-T Into the Editorial Workflow', 'Search'],
  ['Measuring Visibility Across Search and AI Assistants', 'Search'],
  ['Content Operations for Complex B2B Buying Journeys', 'Search'],
  ['Refreshing Legacy Content for Modern Search', 'Search'],
  ['Turning Subject-Matter Expertise Into Useful Content', 'Search'],
];

const categoryExcerpt: Record<InsightCategory, string> = {
  AI: 'A practical enterprise perspective on building dependable AI capability, governance and adoption across teams.',
  'Data & BI': 'Explore the skills, operating practices and learning pathways that help teams turn data into better decisions.',
  'Cloud & Security': 'A capability-focused guide to strengthening cloud, identity, governance and cyber resilience.',
  'L&D': 'Practical guidance for designing learning programmes that improve adoption, capability and business performance.',
  Leadership: 'Actionable ideas for managers leading people, performance and change in modern organisations.',
  Search: 'A clear view of how expert content, technical foundations and changing discovery behaviour shape visibility.',
};

const placeholderInsightsArticles: InsightArticle[] = placeholderArticleTitles.map(([title, category], index) => {
  const date = new Date(Date.UTC(2026, 7, 15 - index * 3));
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  return {
    id: `insight-placeholder-${index + 13}`,
    title,
    category,
    excerpt: categoryExcerpt[category],
    date: formattedDate,
    readTime: `${5 + (index % 4)} min read`,
    image: '',
    url: '#',
  };
});

export const insightsArticles: InsightArticle[] = [
  ...initialInsightsArticles,
  ...placeholderInsightsArticles,
].map((article) => ({
  ...article,
  url: `/insights/${article.id}`,
}));

export interface InsightArticleRecord {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  url: string;
}

export const getInsightArticleById = (id: string): InsightArticleRecord | undefined => {
  const article = insightsArticles.find((item) => item.id === id);
  if (article) return article;

  if (featuredArticle.id === id) {
    return {
      id: featuredArticle.id,
      title: featuredArticle.title,
      category: 'AI',
      excerpt: featuredArticle.summary,
      date: featuredArticle.date,
      readTime: '8 min read',
      image: featuredArticle.image,
      url: featuredArticle.url,
    };
  }

  const featuredPost = Object.values(featuredPostsByCategory)
    .flat()
    .find((item) => item.id === id);

  if (!featuredPost) return undefined;

  return {
    id: featuredPost.id,
    title: featuredPost.title,
    category: featuredPost.category,
    excerpt: `A practical enterprise perspective on ${featuredPost.title.toLowerCase()}, with clear guidance for capability leaders and technology teams.`,
    date: featuredPost.date,
    readTime: '6 min read',
    image: featuredPost.image,
    url: featuredPost.url,
  };
};
