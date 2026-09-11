import { RoleBasedProgramme } from '../types';

export const roleBasedProgrammes: RoleBasedProgramme[] = [
  {
    id: 'RB0001',
    title: 'Smarter Talent Acquisition Fundamentals',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Applicant Tracking Systems',
      'LinkedIn Recruiter',
      'Candidate CRM',
      'Microsoft Excel',
      'Generative AI'
    ],
    level: 'Awareness',
    duration: '4 Hours',
    industry: 'Technology & Communications',
    department: 'Human Resources',
    functionName: 'Talent Acquisition / Recruitment',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    details: {
      summary: 'Build awareness of modern recruitment workflows, talent sourcing practices, candidate evaluation, recruitment technology, and responsible AI-supported hiring processes.',
      format: 'Role-Based Programme',
      approach: 'Practical',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Applicant Tracking Systems',
        'LinkedIn Recruiter',
        'Candidate CRM',
        'Microsoft Excel',
        'Generative AI'
      ],
      objective: 'Technology organizations compete for specialized talent across software, cloud, cybersecurity, AI, data, telecom, and digital roles. This programme introduces participants to the end-to-end talent acquisition lifecycle, from understanding hiring requirements and sourcing candidates to screening, candidate engagement, selection, and recruitment reporting. Participants explore how Applicant Tracking Systems, sourcing platforms, candidate databases, and generative AI can improve recruiter productivity while maintaining human judgment, fairness, data protection, and accountability throughout the hiring process.',
      audience: [
        'Talent Acquisition Professionals',
        'Recruiters',
        'Recruitment Coordinators',
        'HR Executives',
        'Hiring Support Professionals',
        'HR Business Partners involved in recruitment'
      ],
      prerequisitesList: [
        'No prior recruitment expertise required',
        'Basic understanding of workplace hiring processes',
        'Familiarity with standard digital workplace tools'
      ],
      modules: [
        {
          id: '01',
          title: 'Understanding the Recruitment Lifecycle',
          learningOutcomes: [
            'Workforce requirement to successful hire',
            'Key stages of the recruitment funnel',
            'Recruiter and hiring manager responsibilities',
            'Candidate experience across the hiring journey'
          ]
        },
        {
          id: '02',
          title: 'Talent Sourcing & Candidate Discovery',
          learningOutcomes: [
            'Understanding role and skill requirements',
            'Sourcing channels for technology talent',
            'Boolean search and keyword fundamentals',
            'Building relevant candidate pipelines'
          ]
        },
        {
          id: '03',
          title: 'Screening & Candidate Evaluation',
          learningOutcomes: [
            'Resume and profile screening fundamentals',
            'Matching skills against job requirements',
            'Structured screening criteria',
            'Bias awareness and human decision-making'
          ],
          appliedExercise: {
            title: 'Applied in Class',
            content: 'Review a technology-role requirement and create a simple candidate screening and sourcing framework using structured criteria and AI-assisted keyword suggestions.'
          }
        },
        {
          id: '04',
          title: 'Recruitment Technology & AI',
          learningOutcomes: [
            'Applicant Tracking Systems and Candidate CRM',
            'Digital sourcing and talent databases',
            'AI-assisted profile summarization and search support',
            'Data privacy, validation, and responsible AI practices'
          ]
        },
        {
          id: '05',
          title: 'Recruitment Metrics & Visibility',
          learningOutcomes: [
            'Recruitment funnel and conversion metrics',
            'Time-to-fill and sourcing effectiveness',
            'Candidate pipeline visibility',
            'Basic recruitment dashboards and reporting'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Building a Technology Talent Pipeline',
          content: 'Translate a specialist technology requirement into sourcing criteria, search terms, and candidate channels to create a more focused talent pipeline.'
        },
        {
          title: 'Improving Recruiter Productivity with AI Support',
          content: 'Use generative AI to prepare alternative sourcing keywords and summarize candidate information for recruiter review while keeping final evaluation and hiring decisions with people.'
        }
      ]
    }
  },
  {
    id: 'RB0002',
    title: 'Strategic Financial Modeling & Commercial Acumen',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Financial Modeling',
      'Discounted Cash Flow',
      'Scenario Planning',
      'Capital Budgeting',
      'Advanced Excel'
    ],
    level: 'Intermediate',
    duration: '16 Hours',
    industry: 'Banking / Financial Services',
    department: 'Finance & Accounting',
    functionName: 'Financial Planning & Commercial Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    details: {
      summary: 'Equip finance professionals with hands-on competencies to design dynamic 3-statement financial models, evaluate capital investments, and build executive sensitivity scenarios.',
      format: 'Role-Based Programme',
      approach: 'Hands-on Financial Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Microsoft Excel',
        'Power Query',
        'Scenario Manager',
        'Monte Carlo Simulators',
        'Financial BI'
      ],
      objective: 'Modern corporate finance teams must move beyond backward-looking variance reporting toward forward-looking commercial steering. This intensive programme equips finance leaders, commercial managers, and analysts with best-practice financial modeling standards (FAST standard), robust dynamic forecasting architectures, and sensitivity stress-testing techniques.',
      audience: [
        'Financial Analysts & Senior Analysts',
        'FP&A Managers and Directors',
        'Corporate Controllers & Accounting Leads',
        'Investment Banking Associates',
        'Commercial Business Partners'
      ],
      prerequisitesList: [
        'Proficiency in core corporate accounting principles',
        'Solid working knowledge of spreadsheet formulas'
      ],
      modules: [
        {
          id: '01',
          title: 'Financial Statement Architecture & Integration',
          learningOutcomes: [
            'Linking Income Statement, Balance Sheet, and Cash Flow Statement',
            'Working capital cycle forecasting',
            'Debt schedule and interest calculations',
            'Retained earnings and equity balance mechanisms'
          ]
        },
        {
          id: '02',
          title: 'Valuation Methodologies & Investment Appraisal',
          learningOutcomes: [
            'Discounted Cash Flow (DCF) modeling & WACC determination',
            'Net Present Value (NPV) and Internal Rate of Return (IRR)',
            'Terminal value calculation methods',
            'Enterprise value vs. Equity value reconciliations'
          ]
        },
        {
          id: '03',
          title: 'Sensitivity, Scenario Modeling & Board Presentation',
          learningOutcomes: [
            'Building dynamic scenario switches and stress testing',
            'Data tables and tornado chart generation',
            'Translating financial figures into executive narratives',
            'Mitigating spreadsheet risk and governance audit checks'
          ],
          appliedExercise: {
            title: 'Applied in Class — M&A Commercial Model Build',
            content: 'Construct an integrated 5-year commercial forecast model incorporating inflation scenarios, debt refinancing schedules, and dynamic EBITDA sensitivity matrices.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Evaluating Strategic Capital Expansion',
          content: 'A corporate enterprise is evaluating a $40M regional expansion. Learners design the capital budgeting model to compare lease versus buy options, stress-test interest rate volatility, and deliver executive board recommendations.'
        }
      ]
    }
  },
  {
    id: 'RB0003',
    title: 'Consultative B2B Sales & Strategic Key Account Management',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Consultative Selling',
      'Executive Stakeholder Mapping',
      'Value Proposition Design',
      'Contract Negotiation',
      'CRM Pipeline Optimization'
    ],
    level: 'Intermediate',
    duration: '8 Hours',
    industry: 'Technology & Communications',
    department: 'Sales & Business Development',
    functionName: 'Enterprise B2B Account Executive',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    details: {
      summary: 'Master enterprise discovery methodologies, multi-threaded stakeholder navigation, business case co-creation, and win-win negotiation strategies for complex commercial cycles.',
      format: 'Role-Based Programme',
      approach: 'Interactive Simulation & Role-Play',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Salesforce / HubSpot CRM',
        'LinkedIn Sales Navigator',
        'Value Selling Framework',
        'Mutual Action Plans'
      ],
      objective: 'Enterprise buyers require trusted advisors rather than traditional product presenters. This programme transitions commercial teams into consultative problem solvers who navigate complex organizational buying committees, quantify tangible customer ROI, and accelerate sales pipeline velocity.',
      audience: [
        'Enterprise Account Executives',
        'Business Development Managers',
        'Sales Directors & Regional Leads',
        'Customer Success Managers handling renewals & expansion'
      ],
      prerequisitesList: [
        'Experience managing enterprise or commercial sales conversations'
      ],
      modules: [
        {
          id: '01',
          title: 'Diagnostic Discovery & Customer Value Architecture',
          learningOutcomes: [
            'Uncovering latent business pain and strategic priorities',
            'Economic impact modeling and cost of inaction (COI)',
            'Formulating killer commercial questions that challenge assumptions',
            'Aligning solutions directly with strategic business outcomes'
          ]
        },
        {
          id: '02',
          title: 'Navigating Enterprise Buying Centers & Multi-Threading',
          learningOutcomes: [
            'Economic buyers vs. champions vs. technical blockers',
            'Securing internal champions and equipping them to sell internally',
            'Co-creating Mutual Action Plans (MAP) with executive sponsors',
            'De-risking procurement, legal, and infosec reviews'
          ]
        },
        {
          id: '03',
          title: 'High-Stakes Commercial Negotiation & Closing',
          learningOutcomes: [
            'Negotiating on value instead of discounting price',
            'Trading concessions strategically without margin erosion',
            'Handling aggressive procurement tactics and RFP barriers',
            'Finalizing executive commitments with clear closing pathways'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Defending Deal Margin in Final Procurement Round',
          content: 'Learners conduct live simulated negotiation scenarios against an enterprise procurement team demanding a 25% discount, restructuring terms around volume tiers, multi-year SLAs, and commercial trade-offs.'
        }
      ]
    }
  },
  {
    id: 'RB0004',
    title: 'Cloud Infrastructure Security Architecture & Zero Trust Governance',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Zero Trust Architecture',
      'Cloud Security Posture Management (CSPM)',
      'IAM Least Privilege',
      'Threat Modeling',
      'DevSecOps Automation'
    ],
    level: 'Advanced',
    duration: '32 Hours',
    industry: 'Technology & Communications',
    department: 'Information Technology',
    functionName: 'Cloud Security Engineer & Architect',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    details: {
      summary: 'Design and enforce robust Zero Trust security guardrails, IAM governance, cryptographic key policies, and continuous compliance across multi-cloud infrastructure environments.',
      format: 'Role-Based Programme',
      approach: 'Hands-on Cloud Sandbox Labs',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'AWS IAM & GuardDuty',
        'Azure Entra ID & Defender',
        'HashiCorp Vault & Terraform',
        'Kubernetes RBAC',
        'SIEM / CloudTrail'
      ],
      objective: 'With rapid enterprise cloud adoption comes unprecedented exposure to identity misuse, configuration drift, and API vulnerabilities. This course provides comprehensive architectural training in implementing defense-in-depth, least-privilege governance, and automated security scanning across hybrid cloud footprints.',
      audience: [
        'Cloud Security Architects',
        'DevSecOps Engineers',
        'Systems Engineers & Infrastructure Leads',
        'Cybersecurity Analysts moving to Cloud'
      ],
      prerequisitesList: [
        'Working knowledge of public cloud (AWS, Azure, or GCP)',
        'Understanding of networking protocols and identity management'
      ],
      modules: [
        {
          id: '01',
          title: 'Zero Trust Principles & Identity as the Primary Perimeter',
          learningOutcomes: [
            'Eliminating implicit network trust and perimeter assumptions',
            'Strict IAM role modeling, permission boundaries, and session policies',
            'Conditional access and contextual multi-factor authentication',
            'Privileged Access Management (PAM) for cloud operators'
          ]
        },
        {
          id: '02',
          title: 'Cloud Data Protection, Encryption & Key Management',
          learningOutcomes: [
            'Envelope encryption patterns with KMS and HSMs',
            'Securing data in transit, at rest, and in use (confidential computing)',
            'Automated secret rotation with HashiCorp Vault',
            'Data loss prevention (DLP) and discovery in cloud object stores'
          ]
        },
        {
          id: '03',
          title: 'Continuous Compliance, Infrastructure as Code & Incident Response',
          learningOutcomes: [
            'Shift-left static analysis for Terraform and Kubernetes manifests',
            'CSPM policies and automated remediation of misconfigurations',
            'Cloud forensics, threat hunting, and log ingestion architectures',
            'Simulating cloud breach scenarios and containment playbooks'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Detecting and Remediating a Compromised Cloud Identity',
          content: 'In a sandboxed AWS/Azure lab environment, participants investigate abnormal API calls indicating leaked service account credentials, isolate affected workloads, and rebuild immutable Zero Trust policies.'
        }
      ]
    }
  },
  {
    id: 'RB0005',
    title: 'Supply Chain Operations & Digital Logistics Resilience',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Supply Chain Analytics',
      'Inventory Optimization',
      'Supplier Risk Management',
      'Demand Forecasting',
      'Logistics IoT'
    ],
    level: 'Intermediate',
    duration: '16 Hours',
    industry: 'Manufacturing / Industrial',
    department: 'Operations',
    functionName: 'Supply Chain Operations Manager',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    details: {
      summary: 'Drive end-to-end supply chain agility, optimize inventory safety stock using statistical modeling, and mitigate geopolitical and supplier disruption risks.',
      format: 'Role-Based Programme',
      approach: 'Operations Simulator & Real-World Case Studies',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'ERP Supply Chain Modules',
        'Power BI Logistics Dashboards',
        'Monte Carlo Inventory Models',
        'Supplier Scorecards'
      ],
      objective: 'Modern global supply chains face persistent volatility from port delays, raw material shortages, and unpredictable demand swings. This programme trains operations professionals in statistical safety-stock modeling, supplier diversification strategies, and digital control-tower architectures.',
      audience: [
        'Supply Chain Planners & Inventory Analysts',
        'Logistics & Distribution Managers',
        'Operations Directors',
        'Procurement & Sourcing Specialists'
      ],
      prerequisitesList: [
        'Basic familiarity with inventory management concepts and spreadsheets'
      ],
      modules: [
        {
          id: '01',
          title: 'Demand Sensing & Collaborative Forecasting (CPFR)',
          learningOutcomes: [
            'Time-series demand forecasting and forecast error metrics (MAPE, MAD)',
            'Dampening the Bullwhip Effect through demand visibility',
            'Aligning sales and operations planning (S&OP) cadence',
            'Integrating market intelligence and leading indicators'
          ]
        },
        {
          id: '02',
          title: 'Inventory Optimization & Dynamic Safety Stock Strategies',
          learningOutcomes: [
            'Calculating multi-echelon safety stock under lead time variability',
            'ABC-XYZ inventory stratification and holding cost reduction',
            'Economic Order Quantity (EOQ) versus lean Just-in-Time (JIT) trade-offs',
            'Stockout probability and service level optimization'
          ]
        },
        {
          id: '03',
          title: 'Resilient Logistics & Supplier Risk Mitigation',
          learningOutcomes: [
            'Single-source vs. dual-sourcing risk evaluations',
            'Real-time transport tracking and cold-chain monitoring',
            'Developing supplier contingency and disaster response playbooks',
            'Carbon footprint tracking and sustainable logistics governance'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Resolving a Sudden Critical Component Shortage',
          content: 'Learners analyze real-time production schedules when a Tier-1 supplier suffers sudden factory shutdown, redistributing inventory across global hubs to protect key customer SLAs.'
        }
      ]
    }
  },
  {
    id: 'RB0006',
    title: 'Enterprise Digital Product Strategy & Continuous Discovery',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Product Strategy',
      'Opportunity Solution Trees',
      'Customer Interviewing',
      'Roadmapping',
      'Product Analytics'
    ],
    level: 'Advanced',
    duration: '16 Hours',
    industry: 'Consumer / Retail / Services',
    department: 'Marketing',
    functionName: 'Principal Product Manager',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
    details: {
      summary: 'Equip product leaders to move from feature-factory delivery to outcome-driven product management through hypothesis validation and customer co-discovery.',
      format: 'Role-Based Programme',
      approach: 'Interactive Workshop & Framework Application',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Miro / FigJam',
        'Mixpanel / Amplitude',
        'Jira Product Discovery',
        'Productboard'
      ],
      objective: 'Building successful digital products requires tight synchronization between customer needs, engineering feasibility, and business monetization. This course teaches modern discovery cadences, rapid experiment design, and executive stakeholder alignment around outcomes rather than output.',
      audience: [
        'Senior Product Managers & Group Product Managers',
        'Product Owners & Technical Product Leads',
        'Directors of Digital Product',
        'UX Research & Strategy Leads'
      ],
      prerequisitesList: [
        'Prior experience in software or digital product development lifecycle'
      ],
      modules: [
        {
          id: '01',
          title: 'Outcome-Driven Roadmaps & Strategic Alignment',
          learningOutcomes: [
            'Defining North Star metrics and input drivers',
            'Shifting from timeline feature Gantt charts to outcome roadmaps',
            'Aligning engineering capacity with strategic business OKRs',
            'Managing executive stakeholder expectations and pushback'
          ]
        },
        {
          id: '02',
          title: 'Continuous Customer Discovery & Opportunity Solution Trees',
          learningOutcomes: [
            'Conducting non-leading generative customer interviews',
            'Mapping opportunities, customer pains, and unmet needs',
            'Rapid prototyping and cheap hypothesis testing',
            'Separating genuine customer signals from vanity feedback'
          ]
        },
        {
          id: '03',
          title: 'Product Analytics, Experimentation & Go-to-Market',
          learningOutcomes: [
            'Designing statistically sound A/B tests and rollout feature flags',
            'Funnel conversion analysis and cohort retention curves',
            'Cross-functional GTM alignment with sales, marketing, and support',
            'Sunset strategies for legacy features and technical debt management'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Reversing Retention Decline in a Consumer Mobile App',
          content: 'Participants review real product telemetry data showing month-2 drop-off, construct an opportunity tree, design three targeted experiments, and pitch a revised roadmap to simulated executives.'
        }
      ]
    }
  },
  {
    id: 'RB0007',
    title: 'Enterprise Learning & Development: Strategic Training Needs Analysis',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Training Needs Analysis (TNA)',
      'Competency Frameworks',
      'Stakeholder Alignment',
      'Skills Gap Assessment',
      'L&D Business Case'
    ],
    level: 'Awareness',
    duration: '4 Hours',
    industry: 'Consumer / Retail / Services',
    department: 'Human Resources',
    functionName: 'Learning & Organizational Development',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    details: {
      summary: 'Master the fundamentals of organizational training needs analysis, translating business goals into quantifiable skill requirements and learning roadmaps.',
      format: 'Role-Based Programme',
      approach: 'Case Study & Framework Application',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Skills Matrix Software',
        'Survey Platforms',
        'Microsoft Excel',
        'HRIS L&D Modules'
      ],
      objective: 'Too often training is treated as an ad-hoc event rather than a driver of business performance. This foundational programme teaches L&D specialists and HR partners how to conduct rigorous organizational needs assessments, interview department sponsors, and prioritize learning interventions with clear business KPIs.',
      audience: [
        'L&D Specialists & Coordinators',
        'HR Business Partners',
        'Department Training Leads',
        'Talent Management Associates'
      ],
      prerequisitesList: [
        'Basic understanding of HR operations and organizational structure'
      ],
      modules: [
        {
          id: '01',
          title: 'Business-Driven Needs Discovery',
          learningOutcomes: [
            'Differentiating performance gaps from training gaps',
            'Conducting stakeholder discovery interviews with department heads',
            'Mapping organizational priorities to core workforce capabilities',
            'Calculating the business cost of capability deficiencies'
          ]
        },
        {
          id: '02',
          title: 'Data Collection & Skills Gap Auditing',
          learningOutcomes: [
            'Designing focused diagnostic assessments and employee surveys',
            'Synthesizing performance review data and capability matrices',
            'Benchmarking current competencies against future industry demands',
            'Formulating prioritized training roadmaps'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Responding to Executive Request for Mandatory Training',
          content: 'An executive demands a company-wide 4-hour seminar to fix productivity issues. Learners conduct a rapid diagnostic to discover underlying workflow bottlenecks and pitch an integrated solution.'
        }
      ]
    }
  },
  {
    id: 'RB0008',
    title: 'Modern Corporate L&D Program Design & Blended Delivery',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Instructional Design',
      'ADDIE & SAM Models',
      'Blended Learning Architecture',
      'Facilitation Techniques',
      'LMS Management'
    ],
    level: 'Basic',
    duration: '8 Hours',
    industry: 'Banking / Financial Services',
    department: 'Human Resources',
    functionName: 'Instructional Designer & Trainer',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    details: {
      summary: 'Design high-impact, blended workplace learning experiences using adult learning theory, modern instructional frameworks, and engaging digital delivery.',
      format: 'Role-Based Programme',
      approach: 'Hands-on Course Prototyping',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Articulate 360',
        'Canvas / Moodle LMS',
        'Miro',
        'Mentimeter'
      ],
      objective: 'Corporate learners have limited time and high expectations for relevance. This hands-on programme equips instructional designers and corporate trainers with modern adult learning principles (Andragogy), microlearning design methods, interactive facilitation techniques, and digital LMS course authoring.',
      audience: [
        'Corporate Trainers & Facilitators',
        'Instructional Designers',
        'Subject Matter Experts transitioning to teaching',
        'L&D Associates'
      ],
      prerequisitesList: [
        'Familiarity with presentation tools and training environments'
      ],
      modules: [
        {
          id: '01',
          title: 'Adult Learning Principles & Behavioral Objectives',
          learningOutcomes: [
            'Applying Bloom’s Revised Taxonomy to workplace performance outcomes',
            'Designing engaging microlearning bites and spaced-repetition schedules',
            'Cognitive load management in complex technical subjects',
            'Constructing learner personas and motivation drivers'
          ]
        },
        {
          id: '02',
          title: 'Blended Course Architecture & Virtual Facilitation',
          learningOutcomes: [
            'Blending asynchronous digital assets with synchronous workshops',
            'Interactive breakout exercises and virtual lab management',
            'Formative assessment design and authentic skill evaluations',
            'Overcoming learner disengagement in remote settings'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Redesigning a Dry 40-Slide Compliance Deck',
          content: 'Participants convert a static, text-heavy slide presentation into an engaging scenario-based branching decision exercise with immediate feedback loops.'
        }
      ]
    }
  },
  {
    id: 'RB0009',
    title: 'Strategic Talent Capability Building & Succession Planning',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Succession Planning',
      '9-Box Grid Assessment',
      'Leadership Development Pipelines',
      'Talent Analytics',
      'Mentorship Architecture'
    ],
    level: 'Intermediate',
    duration: '16 Hours',
    industry: 'Healthcare / Life Sciences',
    department: 'Human Resources',
    functionName: 'Talent Management Lead',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    details: {
      summary: 'Build resilient talent pipelines, identify and develop high-potential leaders, and implement systematic succession management across critical business roles.',
      format: 'Role-Based Programme',
      approach: 'Strategic Talent Review Simulation',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Workday / SuccessFactors Talent Module',
        '9-Box Matrix Modeling',
        'IDP Templates',
        'Power BI Talent Dashboards'
      ],
      objective: 'Enterprise resilience hinges on seamless talent continuity for critical operational and executive positions. This course instructs talent management leaders on calibrating performance vs. potential using 9-Box frameworks, structuring personalized individual development plans (IDPs), and building executive succession pipelines.',
      audience: [
        'Talent Management Managers',
        'Senior HR Business Partners',
        'Head of People / People Directors',
        'Workforce Planning Specialists'
      ],
      prerequisitesList: [
        'Experience with HR talent cycles, performance reviews, or career planning'
      ],
      modules: [
        {
          id: '01',
          title: 'Talent Calibration & 9-Box Architecture',
          learningOutcomes: [
            'Objectively evaluating performance track records versus growth potential',
            'Conducting non-biased executive talent calibration discussions',
            'Identifying flight-risk key employees and retention strategies',
            'Bench strength ratio calculations across critical roles'
          ]
        },
        {
          id: '02',
          title: 'High-Potential Acceleration & Succession Architecture',
          learningOutcomes: [
            'Designing rotational assignments and stretch project experiences',
            'Establishing structured executive sponsorship and mentoring schemes',
            'Emergency successor vs. ready-in-2-years transition pathways',
            'Measuring pipeline readiness and promotion-from-within velocity'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Facilitating an Executive Talent Calibration Session',
          content: 'Learners moderate a simulated senior management panel debate where business leaders advocate for their respective candidates, navigating political bias to reach consensus on the top 10% high potentials.'
        }
      ]
    }
  },
  {
    id: 'RB0010',
    title: 'Chief Learning Officer Executive Strategy & Workforce Transformation',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'CLO Executive Strategy',
      'Workforce Reskilling Architecture',
      'Kirkpatrick Level 4 & Phillips ROI',
      'Learning Culture Architecture',
      'AI & EdTech Ecosystems'
    ],
    level: 'Advanced',
    duration: '32 Hours',
    industry: 'Technology & Communications',
    department: 'Human Resources',
    functionName: 'Head of Learning & Organizational Development',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    details: {
      summary: 'Architect enterprise-scale workforce upskilling transformations, align learning investments with C-suite balance sheets, and quantify tangible business ROI.',
      format: 'Role-Based Programme',
      approach: 'Executive Boardroom Strategy Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Kirkpatrick / Phillips ROI Models',
        'Learning Experience Platforms (LXP)',
        'Enterprise Skills Taxonomies',
        'Capital Allocation Models'
      ],
      objective: 'In an era of generative AI and rapid automation, corporate learning is an existential enterprise capability. This masterclass prepares L&D executives and Chief Learning Officers to position learning as a core strategic lever, negotiate multi-million dollar capability budgets, and prove bottom-line financial returns.',
      audience: [
        'Chief Learning Officers (CLO)',
        'VP / Directors of Global Talent Development',
        'Chief People Officers (CPO)',
        'Enterprise Transformation Executives'
      ],
      prerequisitesList: [
        'Senior leadership experience in human capital, L&D, or corporate strategy'
      ],
      modules: [
        {
          id: '01',
          title: 'Strategic Capital Allocation for Enterprise Upskilling',
          learningOutcomes: [
            'Framing capability building as a capital asset rather than operating expense',
            'Aligning multi-year reskilling roadmaps with AI enterprise adoption',
            'Evaluating buy vs. build vs. borrow talent acquisition strategies',
            'Architecting enterprise Learning Experience Platforms (LXP) and data lakes'
          ]
        },
        {
          id: '02',
          title: 'Quantifying Business Impact, Productivity & Phillips ROI',
          learningOutcomes: [
            'Isolating the effects of training from market and economic variables',
            'Calculating monetary value of defect reduction, revenue uplift, and cycle speed',
            'Formulating executive board presentations demonstrating measurable ROI',
            'Fostering a self-directed, continuous learning corporate culture'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Defending a $5M Upskilling Budget to the CFO',
          content: 'Learners present a comprehensive 3-year AI literacy and technical upskilling transformation business case to a skeptical CFO, linking training milestones directly to operating cost reductions.'
        }
      ]
    }
  },
  {
    id: 'RB0011',
    title: 'Strategic B2B Marketing, ABM & Digital Demand Generation',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Account-Based Marketing (ABM)',
      'B2B Demand Generation',
      'Marketing Automation & CRM',
      'Revenue Operations (RevOps)',
      'Content Marketing Strategy'
    ],
    level: 'Intermediate',
    duration: '16 Hours',
    industry: 'Technology & Communications',
    department: 'Marketing',
    functionName: 'Demand Generation & B2B Marketing Lead',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    details: {
      summary: 'Design high-converting Account-Based Marketing (ABM) campaigns, orchestrate omni-channel demand funnels, and align marketing pipelines with sales revenue targets.',
      format: 'Role-Based Programme',
      approach: 'Campaign Design Workshop',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'HubSpot / Marketo',
        'Demandbase / 6sense',
        'LinkedIn Campaign Manager',
        'Google Analytics 4'
      ],
      objective: 'B2B buying journeys have become complex, multi-stakeholder, and digital-first. This course instructs commercial marketing professionals on executing Tier-1 Account-Based Marketing (ABM) strategies, deploying intent data to capture in-market accounts, and unifying marketing and sales under a single RevOps engine.',
      audience: [
        'B2B Marketing Managers',
        'Demand Generation Leads',
        'Growth Marketers',
        'Product Marketing Managers',
        'Commercial Strategy Leads'
      ],
      prerequisitesList: [
        'Working knowledge of digital marketing channels and B2B sales cycles'
      ],
      modules: [
        {
          id: '01',
          title: 'Account-Based Marketing (ABM) Strategy & Account Selection',
          learningOutcomes: [
            'Defining Ideal Customer Profiles (ICP) and Tier-1 account lists',
            'Leveraging intent data (Bombora/6sense) to identify active buying windows',
            'Personalized content mapping across the 6-buyer committee matrix',
            'Coordinating marketing touches with sales outbound sequences'
          ]
        },
        {
          id: '02',
          title: 'Full-Funnel Demand Orchestration & RevOps Attribution',
          learningOutcomes: [
            'Multi-touch attribution models: first-touch, W-shaped, and algorithmic',
            'Paid digital channel optimization (LinkedIn, programmatic display, search)',
            'Measuring Pipeline Velocity, Customer Acquisition Cost (CAC), and LTV',
            'Establishing Sales Qualified Lead (SQL) SLAs between departments'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Designing an ABM Campaign for 50 Enterprise Target Accounts',
          content: 'Learners formulate a 90-day multi-channel ABM playbook targeting Fortune 500 financial institutions, integrating personalized landing pages, executive direct mail, and bespoke LinkedIn ads.'
        }
      ]
    }
  },
  {
    id: 'RB0012',
    title: 'Customer Experience Excellence & Enterprise Retention Strategy',
    category: 'role-based',
    categoryBadge: 'Role-Based Programme',
    relatedSkills: [
      'Customer Journey Mapping',
      'Net Promoter Score (NPS) & CSAT',
      'Customer Success Management',
      'Churn Prediction & Mitigation',
      'Service Recovery Systems'
    ],
    level: 'Intermediate',
    duration: '16 Hours',
    industry: 'Consumer / Retail / Services',
    department: 'Customer Service & Customer Success',
    functionName: 'Customer Success & CX Director',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&q=80',
    details: {
      summary: 'Engineer exceptional customer journeys, reduce enterprise churn, establish voice-of-the-customer listening posts, and maximize net revenue retention (NRR).',
      format: 'Role-Based Programme',
      approach: 'Customer Journey Blueprinting Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Gainsight / ChurnZero',
        'Zendesk / Salesforce Service Cloud',
        'Qualtrics CX',
        'Customer Journey Mapping Platforms'
      ],
      objective: 'Customer acquisition cost continues to rise, making post-sale retention, expansion, and advocacy the primary driver of enterprise valuation. This practical programme guides CX and Customer Success professionals through mapping end-to-end customer touchpoints, architecting proactive onboarding, and identifying early churn triggers.',
      audience: [
        'Customer Success Managers & Directors',
        'Customer Experience (CX) Leads',
        'Client Services Managers',
        'Account Managers responsible for renewals',
        'Operations leaders overseeing customer care'
      ],
      prerequisitesList: [
        'Experience handling customer relationships, onboarding, or client operations'
      ],
      modules: [
        {
          id: '01',
          title: 'Customer Journey Mapping & Friction Point Elimination',
          learningOutcomes: [
            'Mapping the emotional and operational customer lifecycle from onboarding to renewal',
            'Identifying moments of truth and customer effort reduction',
            'Establishing Voice-of-Customer (VoC) feedback loops and sentiment tracking',
            'Designing customer health scores with predictive leading indicators'
          ]
        },
        {
          id: '02',
          title: 'Proactive Retention, Escalation Management & NRR Expansion',
          learningOutcomes: [
            'Diagnosing early churn risk signals and automated rescue playbooks',
            'Service recovery frameworks to turn dissatisfied clients into brand advocates',
            'Structuring executive Business Reviews (QBRs) that demonstrate ongoing ROI',
            'Identifying organic up-sell and cross-sell triggers during adoption'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Turning Around a High-Value At-Risk Account',
          content: 'A tier-one enterprise account announces intentions not to renew due to poor onboarding adoption. Participants design a 30-day intervention roadmap, renegotiate deliverables, and secure a multi-year contract extension.'
        }
      ]
    }
  }
];
