import { PeopleProcessProgramme } from '../types';

export const peopleProcessProgrammes: PeopleProcessProgramme[] = [
  {
    id: 'PP0001',
    title: 'Think Clearly, Decide Better: Analytical Thinking at Work',
    category: 'people-process',
    topicCategory: 'People & Communication Skills',
    subType: 'People',
    portfolio: 'People & Communication Skills',
    badge: 'People and Process',
    level: 'Basic',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    details: {
      summary: 'Build practical analytical thinking skills to break down problems, interpret information, challenge assumptions, identify patterns, and make more confident workplace decisions.',
      format: 'Role-Based Programme',
      approach: 'Practical & Activity-Based',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Microsoft Excel',
        'Microsoft Forms',
        'Miro / Whiteboard Tools',
        'Generative AI'
      ],
      objective: 'This programme helps professionals develop a structured approach to analysing workplace situations and making better decisions. Learners practise breaking complex problems into manageable parts, distinguishing facts from assumptions, identifying patterns and relationships, evaluating alternatives, and communicating analytical conclusions clearly.\n\nThe programme also introduces Generative AI as a support tool for organising information, generating questions, summarising inputs, and exploring alternatives while keeping final judgement with the learner.',
      audience: [
        'Individual contributors',
        'Executives and associates',
        'Team coordinators',
        'Customer-facing professionals',
        'Operations, finance, HR, sales, and service professionals'
      ],
      prerequisitesList: [
        'No prior analytical or technical background required',
        'Comfortable using standard workplace digital tools',
        'A willingness to actively participate in class discussions and practical activities'
      ],
      modules: [
        {
          id: '01',
          title: 'Think Like an Analyst: Foundations of Analytical Thinking',
          learningOutcomes: [
            'Understand analytical thinking in a workplace context',
            'Recognise analytical versus reactive thinking',
            'Break complex situations into smaller components',
            'Distinguish facts, opinions and assumptions',
            'Apply structured thinking to routine workplace situations'
          ]
        },
        {
          id: '02',
          title: 'Ask Better Questions, Find Better Answers',
          learningOutcomes: [
            'Identify the real question behind a workplace problem',
            'Use structured questioning techniques',
            'Recognise missing information before acting',
            'Clarify ambiguous requests from managers or clients',
            'Formulate clear, analytical questions'
          ]
        },
        {
          id: '03',
          title: 'Organise, Compare & Spot Patterns in Information',
          learningOutcomes: [
            'Organise messy qualitative and quantitative information',
            'Identify trends, patterns, outliers and anomalies',
            'Use basic tables, lists and comparison frameworks',
            'Compare options systematically rather than emotionally',
            'Synthesise multiple pieces of information into a coherent picture'
          ],
          appliedExercise: {
            title: 'Applied in Class — Customer Feedback Analysis',
            content: 'Learners review a collection of unstructured customer feedback comments and internal operational metrics, categorise complaints by root category, identify the top operational issue, and compare two suggested resolution pathways.'
          }
        },
        {
          id: '04',
          title: 'Evaluate Options & Make the Call',
          learningOutcomes: [
            'Apply decision matrices to workplace dilemmas',
            'Weigh trade-offs: cost, speed, quality, and risk',
            'Anticipate secondary consequences of immediate choices',
            'Document the rationale behind a decision',
            'Present conclusions persuasively with evidence'
          ]
        },
        {
          id: '05',
          title: 'Using Generative AI as an Analytical Thinking Partner',
          learningOutcomes: [
            'Use AI to rapidly brainstorm alternative perspectives',
            'Critique AI-generated summaries and identify hallucinations',
            'Formulate analytical prompts that elicit structured outputs',
            'Maintain human accountability in final decision-making'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Resolving Conflicting Operational Priorities',
          content: 'Learners receive conflicting instructions from two department stakeholders regarding project urgency and resource allocation, applying analytical matrices to produce an objective recommendation.'
        }
      ]
    }
  },
  {
    id: 'PP0002',
    title: 'Ownership & Accountability: Delivering High-Impact Execution',
    category: 'people-process',
    topicCategory: 'Leadership & Managerial Skills',
    subType: 'People',
    portfolio: 'Leadership & Managerial Skills',
    badge: 'People and Process',
    level: 'Basic',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    details: {
      summary: 'Cultivate proactive ownership, eliminate victim mentalities, foster accountability in team deliverables, and instill a culture of follow-through and high-integrity commitments.',
      format: 'Behavioral & Leadership Workshop',
      approach: 'Reflective & Action-Oriented',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'RACI Matrix',
        'Accountability Ladders',
        'Crucial Commitments Framework',
        'Action Tracking Systems'
      ],
      objective: 'High-performing organizations depend on professionals who take proactive responsibility rather than waiting for instructions or passing blame. This signature programme guides participants through cognitive shifts from "it\'s not my job" to extreme ownership, empowering them to drive solutions, manage interdependencies, and communicate proactively.',
      audience: [
        'Emerging Leaders and Supervisors',
        'Project Managers and Team Leads',
        'Individual Contributors transitioning to ownership roles',
        'Cross-functional team members managing complex workflows'
      ],
      prerequisitesList: [
        'Openness to self-reflection and candid behavioral feedback'
      ],
      modules: [
        {
          id: '01',
          title: 'The Accountability Mindset: From Blame to Ownership',
          learningOutcomes: [
            'Understanding the Ladder of Accountability',
            'Recognizing passive-defensive vs. proactive-ownership behaviors',
            'Eliminating the "Wait and See" and "It\'s Not My Job" syndromes',
            'Taking ownership of outcomes rather than just activities'
          ]
        },
        {
          id: '02',
          title: 'Clear Agreements, RACI Clarity & Managing Commitments',
          learningOutcomes: [
            'Defining unambiguous single-point accountability with RACI',
            'The anatomy of a clear commitment: WHO, WHAT, WHEN, and HOW',
            'Renegotiating deadlines proactively before agreements break',
            'Closing loops with stakeholders and eliminating ambiguity'
          ]
        },
        {
          id: '03',
          title: 'Fostering Mutual Accountability in Teams',
          learningOutcomes: [
            'Holding peers and superiors accountable with diplomatic assertiveness',
            'Delivering constructive feedback when commitments are breached',
            'Role-modeling peer accountability without relying on formal authority',
            'Creating personal accountability action plans'
          ],
          appliedExercise: {
            title: 'Applied in Class — Commitment Audit & RACI Restructuring',
            content: 'Participants audit their current live workplace deliverables, identify existing grey areas of ownership, and reconstruct clear RACI contracts with their key team peers.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Rescuing a Stalled Cross-Functional Project',
          content: 'A customer deliverable is delayed because Marketing thought IT was leading, while IT was waiting for Product approvals. Learners step in, break the blame cycle, establish sole ownership, and negotiate recovery milestones.'
        }
      ]
    }
  },
  {
    id: 'PP0003',
    title: 'Leading High-Performing Agile Squads & Scrum Mastery',
    category: 'people-process',
    topicCategory: 'Agile & Ways of Working',
    subType: 'Process',
    portfolio: 'Agile & Ways of Working',
    badge: 'People and Process',
    level: 'Intermediate',
    duration: '16 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&q=80',
    details: {
      summary: 'Master servant leadership, facilitate high-impact sprint ceremonies, remove systemic team blockers, and coach cross-functional engineering squads toward predictable velocity.',
      format: 'Agile Simulation Workshop',
      approach: 'Applied Team Simulations',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Jira Software',
        'Confluence',
        'Miro Sprint Boards',
        'Burndown & Cumulative Flow Charts'
      ],
      objective: 'Transition from mechanical "Scrum in name only" to genuine team autonomy and agility. This programme trains Scrum Masters, Agile Coaches, and engineering team leads to master facilitation techniques, resolve dysfunctional squad dynamics, and build psychological safety.',
      audience: [
        'Scrum Masters & Agile Champions',
        'Engineering Leads & Technical Project Managers',
        'Product Owners working with Agile squads',
        'Delivery Managers transitioning to Agile frameworks'
      ],
      prerequisitesList: [
        'Basic understanding of the Agile Manifesto and Scrum framework'
      ],
      modules: [
        {
          id: '01',
          title: 'Facilitating High-Value Scrum Ceremonies',
          learningOutcomes: [
            'Re-energizing Standups: focusing on flow instead of status reporting',
            'Effective Sprint Planning: story sizing, capacity, and sprint goals',
            'Actionable Retrospectives: using liberating structures for psychological safety',
            'Continuous backlog refinement and Definition of Done (DoD)'
          ]
        },
        {
          id: '02',
          title: 'Measuring Flow, WIP Limits & Velocity Predictability',
          learningOutcomes: [
            'Interpreting Burndown, Burnup, and Cumulative Flow Diagrams (CFD)',
            'Cycle time and lead time vs. story point velocity debates',
            'Implementing Kanban Work-In-Progress (WIP) limits to unblock delivery',
            'Managing external dependencies and technical debt trade-offs'
          ]
        },
        {
          id: '03',
          title: 'Coaching Dysfunctional Dynamics & Building Trust',
          learningOutcomes: [
            'Resolving conflict between Product Owners and Engineering developers',
            'Fostering psychological safety for candid technical debate',
            'Servant leadership techniques for decentralized decision making',
            'Scaling agile practices across multiple cooperating squads'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Turning Around a Disillusioned Scrum Squad',
          content: 'Learners facilitate a simulated emergency retrospective for an engineering team that has missed three consecutive sprint goals and is suffering from toxic blame.'
        }
      ]
    }
  },
  {
    id: 'PP0004',
    title: 'Lean Six Sigma Operational Excellence & Value Stream Mapping',
    category: 'people-process',
    topicCategory: 'Business Process & Operations',
    subType: 'Process',
    portfolio: 'Business Process & Operations',
    badge: 'People and Process',
    level: 'Intermediate',
    duration: '16 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    details: {
      summary: 'Eliminate non-value-added waste (TIMWOODS), streamline cycle times with Value Stream Mapping (VSM), and apply statistical root-cause DMAIC tools to achieve process capability.',
      format: 'Operational Excellence Lab',
      approach: 'Process Simulation & Case Studies',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Value Stream Mapping (VSM)',
        'Minitab / Excel Statistical Add-in',
        'Fishbone (Ishikawa) & 5 Whys',
        'SIPOC & Control Charts'
      ],
      objective: 'Process inefficiencies, handoff delays, and rework loops drain corporate profitability. This course provides participants with practical Lean Six Sigma methodologies to map end-to-end workflows, calculate process cycle efficiency, isolate root causes, and deploy poka-yoke (mistake-proofing).',
      audience: [
        'Operations Managers and Process Leads',
        'Quality Assurance Professionals',
        'Continuous Improvement Specialists',
        'Shared Services & Global Capability Center (GCC) Analysts'
      ],
      prerequisitesList: [
        'Basic familiarity with business process workflows'
      ],
      modules: [
        {
          id: '01',
          title: 'DMAIC Roadmap & The 8 Forms of Workplace Waste',
          learningOutcomes: [
            'Defining process boundaries with SIPOC diagrams',
            'Identifying TIMWOODS (Transport, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, Skills)',
            'Distinguishing Value-Add, Non-Value-Add, and Business Non-Value-Add activities',
            'Calculating Process Cycle Efficiency (PCE) and Takt Time'
          ]
        },
        {
          id: '02',
          title: 'Value Stream Mapping (VSM): Current State to Future State',
          learningOutcomes: [
            'Constructing current state process maps with data boxes',
            'Mapping information flow and physical/digital material flow',
            'Identifying bottleneck queues, handoff friction, and rework loops',
            'Designing lean future state maps with continuous flow principles'
          ]
        },
        {
          id: '03',
          title: 'Statistical Root Cause & Mistake-Proofing (Poka-Yoke)',
          learningOutcomes: [
            'Pareto analysis and stratified cause-and-effect mapping',
            'Statistical process control (SPC) and understanding variation',
            'Designing robust poka-yoke mechanisms to prevent human error',
            'Developing sustainability control plans and standard operating procedures'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Slashing Vendor Invoicing Cycle Times by 60%',
          content: 'Learners analyze an enterprise shared services accounts payable process suffering from a 22-day approval lag, map the VSM, remove 4 redundant approval stages, and design an automated 5-day future state.'
        }
      ]
    }
  },
  {
    id: 'PP0005',
    title: 'Executive Presence, Influence & C-Suite Communication',
    category: 'people-process',
    topicCategory: 'Leadership & Managerial Skills',
    subType: 'People',
    portfolio: 'Leadership & Managerial Skills',
    badge: 'People and Process',
    level: 'Advanced',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    details: {
      summary: 'Command boardroom attention, structure executive narratives with the Minto Pyramid Principle, and influence senior stakeholders without defensive posturing.',
      format: 'Executive Masterclass',
      approach: 'Video Coaching & On-the-Fly Pitching',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Minto Pyramid Principle',
        'Executive Summary Frameworks',
        'Stakeholder Influence Matrix',
        'Crisis Communication Guidelines'
      ],
      objective: 'Technical and functional excellence is insufficient for high-level career elevation; leaders must project executive gravitas, articulate concise bottom-line recommendations, and withstand rigorous scrutiny from executive boards.',
      audience: [
        'Senior Directors and Functional Heads',
        'High-Potential Enterprise Leaders',
        'Management Consultants and Advisors',
        'Principal Engineers presenting to C-Suite'
      ],
      prerequisitesList: [
        'Regular interaction with senior management or enterprise clients'
      ],
      modules: [
        {
          id: '01',
          title: 'Top-Down Communication: The Minto Pyramid Principle',
          learningOutcomes: [
            'Structuring presentations: Answer First (BLUF - Bottom Line Up Front)',
            'Grouping supporting arguments MECE (Mutually Exclusive, Collectively Exhaustive)',
            'Translating technical complexity into financial and strategic impacts',
            'Condensing 30-slide presentations into a 3-minute executive brief'
          ]
        },
        {
          id: '02',
          title: 'Gravitas, Demeanor & Managing Tough Boardroom Questions',
          learningOutcomes: [
            'Verbal and non-verbal vocal presence and pacing',
            'Managing sudden interruptions and aggressive pushback with poise',
            'Distinguishing between probing questions, skepticism, and political traps',
            'Disagreeing with authority constructively without being defensive'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Defending a Budget Reallocation in a 10-Minute Executive Committee Slot',
          content: 'Participants role-play delivering a controversial strategic investment proposal to simulated C-level judges who challenge their assumptions within the first 60 seconds.'
        }
      ]
    }
  },
  {
    id: 'PP0006',
    title: 'Strategic Project Management & PMP Best Practices',
    category: 'people-process',
    topicCategory: 'Project & Program Management',
    subType: 'Process',
    portfolio: 'Project & Program Management',
    badge: 'People and Process',
    level: 'Intermediate',
    duration: '16 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    details: {
      summary: 'Master end-to-end enterprise project governance, critical path method (CPM), risk mitigation registers, and stakeholder alignment under PMI/PMP standards.',
      format: 'Interactive PM Lab',
      approach: 'Case Study & Framework Application',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Microsoft Project',
        'Risk Matrix & RAID Log',
        'Earned Value Analysis (EVA)',
        'Work Breakdown Structures (WBS)'
      ],
      objective: 'Complex enterprise initiatives frequently fail due to scope creep, inadequate risk planning, and poorly managed dependencies. This programme equips project managers with structured predictive and hybrid project delivery frameworks to ensure projects complete on time, within budget, and to stakeholder expectations.',
      audience: [
        'Project Managers & Programme Leads',
        'PMO Coordinators & Directors',
        'Operations Specialists leading strategic initiatives',
        'Senior team leads preparing for PMP certification'
      ],
      prerequisitesList: [
        'Experience participating in or managing project lifecycles'
      ],
      modules: [
        {
          id: '01',
          title: 'Scope Definition, WBS & Critical Path Scheduling',
          learningOutcomes: [
            'Decomposing project charters into 100% rule Work Breakdown Structures (WBS)',
            'Calculating Critical Path Method (CPM) and project float/slack',
            'Fast-tracking versus crashing schedule trade-offs',
            'Resource leveling and capacity constraint resolution'
          ]
        },
        {
          id: '02',
          title: 'Earned Value Management (EVM) & Risk Governance',
          learningOutcomes: [
            'Measuring cost and schedule variance: CPI, SPI, and EAC forecasting',
            'Formulating proactive RAID logs (Risks, Assumptions, Issues, Dependencies)',
            'Quantifying risk probabilities and financial contingency reserves',
            'Managing formal scope change control boards (CCB)'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Recovering a Multi-Million Dollar Delayed ERP Rollout',
          content: 'Learners audit an enterprise ERP migration that is 6 months behind schedule and 20% over budget, renegotiating the critical path and resetting stakeholder governance.'
        }
      ]
    }
  },
  {
    id: 'PP0007',
    title: 'Emotional Intelligence & High-Trust Workplace Leadership',
    category: 'people-process',
    topicCategory: 'Leadership & Managerial Skills',
    subType: 'People',
    portfolio: 'Leadership & Managerial Skills',
    badge: 'People and Process',
    level: 'Basic',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    details: {
      summary: 'Develop self-awareness, emotional regulation, and deep empathy to lead high-trust, psychologically safe teams that thrive through organizational stress.',
      format: 'Experiential Leadership Workshop',
      approach: 'Reflective Coaching & Behavioral Simulation',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'EQ-i 2.0 Framework',
        'Amygdala Hijack Recovery Toolkit',
        'Empathy Mapping',
        'Psychological Safety Assessments'
      ],
      objective: 'Leadership effectiveness correlates directly with emotional intelligence (EQ). This workshop empowers managers to recognize behavioral triggers in themselves and their teams, defuse interpersonal tension, and build authentic, high-trust team cultures.',
      audience: [
        'New Managers and Team Supervisors',
        'People Managers facing high-stress deadlines',
        'Senior Executives seeking EQ calibration',
        'HR Business Partners and Leadership Coaches'
      ],
      prerequisitesList: [
        'Willingness to participate in candid self-assessment and peer reflection'
      ],
      modules: [
        {
          id: '01',
          title: 'Self-Awareness, Triggers & Emotional Self-Regulation',
          learningOutcomes: [
            'Understanding the neurobiology of stress: managing the Amygdala Hijack',
            'Identifying personal leadership triggers and cognitive blind spots',
            'Pausing reactive habits and shifting to deliberate, calm responses',
            'Modeling resilience and steady temperament in high-stakes moments'
          ]
        },
        {
          id: '02',
          title: 'Social Awareness, Empathy & Cultivating Team Psychological Safety',
          learningOutcomes: [
            'Active listening techniques: listening for emotion and subtext',
            'Creating an environment where employees voice concerns without fear of retaliation',
            'Giving high-challenge, high-support performance feedback',
            'Building enduring cross-functional trust and relationship capital'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Leading a Disheartened Team Through Organizational Restructuring',
          content: 'Participants role-play addressing an anxious team following unexpected company layoffs, validating fears transparently while re-establishing focus and psychological safety.'
        }
      ]
    }
  },
  {
    id: 'PP0008',
    title: 'Design Thinking & Customer-Centric Innovation Workshops',
    category: 'people-process',
    topicCategory: 'Business Process & Operations',
    subType: 'Process',
    portfolio: 'Business Process & Operations',
    badge: 'People and Process',
    level: 'Basic',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
    details: {
      summary: 'Apply the 5-stage Stanford d.school Design Thinking methodology to solve ambiguous business challenges, prototype rapidly, and co-create user-validated solutions.',
      format: 'Interactive Design Sprint',
      approach: 'Hands-on Prototyping & User Testing',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Miro / Mural Design Boards',
        'Empathy Maps & Customer Journey Blueprints',
        'How Might We (HMW) Questioning',
        'Paper & Digital Rapid Prototyping'
      ],
      objective: 'Modern enterprises must innovate iteratively from genuine customer empathy rather than internal guesswork. This immersive bootcamp instructs cross-functional squads on conducting ethnographic customer interviews, reframing problem statements with "How Might We", and testing cheap paper prototypes.',
      audience: [
        'Innovation and Strategy Teams',
        'Product, Marketing, and Operations Leads',
        'Business Analysts & Solutions Architects',
        'Executives spearheading digital customer experiences'
      ],
      prerequisitesList: [
        'No prior design background required; open to all business functions'
      ],
      modules: [
        {
          id: '01',
          title: 'Empathize & Define: Uncovering Latent Human Needs',
          learningOutcomes: [
            'Conducting ethnographic, non-leading customer interviews',
            'Synthesizing qualitative feedback into Empathy Maps and Personas',
            'Formulating killer "How Might We" (HMW) opportunity statements',
            'Avoiding premature solution fixation and falling in love with the problem'
          ]
        },
        {
          id: '02',
          title: 'Ideate, Prototype & Test: Rapid De-Risking Cycles',
          learningOutcomes: [
            'Divergent and convergent ideation techniques (Crazy 8s, SCAMPER)',
            'Building low-fidelity cardboard, paper, or wireframe prototypes in minutes',
            'Conducting impartial user testing sessions without defending the concept',
            'Iterating rapidly based on authentic user behavioral feedback'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Redesigning the Retail Banking Customer Onboarding Journey',
          content: 'Squads receive qualitative feedback from customers abandoning an account opening flow, synthesize friction points into empathy maps, and prototype an intuitive 3-step solution.'
        }
      ]
    }
  },
  {
    id: 'PP0009',
    title: 'Conflict Resolution, Crucial Conversations & Principled Negotiation',
    category: 'people-process',
    topicCategory: 'People & Communication Skills',
    subType: 'People',
    portfolio: 'People & Communication Skills',
    badge: 'People and Process',
    level: 'Intermediate',
    duration: '8 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    details: {
      summary: 'Navigate high-stakes conversations with emotional composure, resolve toxic workplace friction, and achieve win-win principled agreements using Harvard PON methods.',
      format: 'Negotiation & Mediation Lab',
      approach: 'Live Conflict Role-Plays',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Crucial Conversations Dialogue Framework',
        'Thomas-Kilmann Conflict Mode Instrument (TKI)',
        'Harvard Principled Negotiation Model',
        'BATNA Worksheet'
      ],
      objective: 'Unresolved workplace conflict results in passive-aggressive resistance, delayed milestones, and talent attrition. This programme provides leaders and team members with practical dialogue frameworks to address difficult topics directly, preserve dignity, and negotiate mutually beneficial resolutions.',
      audience: [
        'Team Leads, Supervisors, and Managers',
        'Project Leads managing contested resources',
        'Procurement and Vendor Managers',
        'HR and Employee Relations Professionals'
      ],
      prerequisitesList: [
        'Experience handling workplace disagreements or negotiations'
      ],
      modules: [
        {
          id: '01',
          title: 'Crucial Conversations: Safety, Mutual Purpose & Mutual Respect',
          learningOutcomes: [
            'Recognizing early warning signs of silence (withdrawing) or violence (aggression)',
            'Restoring psychological safety when conversations turn defensive',
            'Separating facts from the internal story we tell ourselves',
            'Using the STATE framework to share controversial opinions constructively'
          ]
        },
        {
          id: '02',
          title: 'Principled Negotiation: Harvard Program on Negotiation (PON)',
          learningOutcomes: [
            'Separating the people from the problem',
            'Focusing on underlying business interests rather than entrenched positions',
            'Inventing creative options for mutual gain (expanding the pie)',
            'Determining and strengthening your Best Alternative to a Negotiated Agreement (BATNA)'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Mediating a Bitter Engineering vs. Marketing Deadlock',
          content: 'Participants mediate a hostile standoff where Engineering refuses to commit to a Marketing launch date due to quality concerns, establishing mutual purpose and consensus.'
        }
      ]
    }
  },
  {
    id: 'PP0010',
    title: 'Enterprise Agile Coaching, OKRs & Scaled Agile Delivery',
    category: 'people-process',
    topicCategory: 'Agile & Ways of Working',
    subType: 'Process',
    portfolio: 'Agile & Ways of Working',
    badge: 'People and Process',
    level: 'Advanced',
    duration: '16 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    details: {
      summary: 'Scale agility across multi-squad enterprise value streams, align business goals through Objectives and Key Results (OKRs), and coach executive leaders in agile governance.',
      format: 'Enterprise Coaching Masterclass',
      approach: 'Simulated Value Stream Planning',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Scaled Agile Framework (SAFe) Artifacts',
        'Enterprise OKR Alignment Matrices',
        'Lean Portfolio Management (LPM)',
        'Value Stream Dependency Boards'
      ],
      objective: 'Agility that succeeds at the single-team level often collapses when dozens of squads must deliver coordinated enterprise platforms. This advanced course equips enterprise coaches and leaders to deploy lean portfolio management, coordinate cross-squad releases, and connect company strategy to team delivery via OKRs.',
      audience: [
        'Enterprise Agile Coaches',
        'Release Train Engineers (RTE) & PMO Executives',
        'Directors of Engineering and Digital Transformation',
        'Chief Transformation Officers & Enterprise Architects'
      ],
      prerequisitesList: [
        'Demonstrated experience with team-level Agile or Scrum methodologies'
      ],
      modules: [
        {
          id: '01',
          title: 'Scaling Agility: Multi-Squad Coordination & Dependency Management',
          learningOutcomes: [
            'Structuring Agile Release Trains (ARTs) around customer value streams',
            'Cross-squad Program Increment (PI) planning and big-room cadences',
            'Visualizing and resolving cross-team architecture dependencies',
            'Decentralizing technical decision making while preserving platform governance'
          ]
        },
        {
          id: '02',
          title: 'Lean Portfolio Management (LPM) & Strategic OKRs',
          learningOutcomes: [
            'Formulating outcome-oriented Objectives and Key Results (OKRs)',
            'Cascading and connecting strategic OKRs to quarterly squad deliverables',
            'Dynamic capital allocation and funding value streams instead of projects',
            'Measuring business agility and organizational responsiveness'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Facilitating an Enterprise Multi-Squad Dependency Workshop',
          content: 'Learners facilitate a simulated quarterly planning session across 6 interdependent product squads, resolving critical architecture bottlenecks to deliver a unified enterprise release.'
        }
      ]
    }
  },
  {
    id: 'PP0011',
    title: 'Change Management & Organizational Transformation',
    category: 'people-process',
    topicCategory: 'Business Process & Operations',
    subType: 'Process',
    portfolio: 'Business Process & Operations',
    badge: 'People and Process',
    level: 'Intermediate',
    duration: '16 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    details: {
      summary: 'Overcome workforce resistance, deploy the Prosci ADKAR change model, and sustain enterprise digital and cultural transformations with measurable adoption.',
      format: 'Change Strategy Workshop',
      approach: 'Transformation Blueprinting & Simulation',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Prosci ADKAR Model',
        'Kotter’s 8-Step Change Framework',
        'Change Impact & Readiness Assessments',
        'Transformation Communications Matrix'
      ],
      objective: 'Over 70% of digital transformations fail not due to technical flaws, but because employees reject the new ways of working. This practical course provides transformation managers with structured methodologies to diagnose change resistance, build coalition networks, and embed changes into organizational habits.',
      audience: [
        'Change Management Practitioners & Leads',
        'Transformation Office Directors',
        'Human Resources & OD Business Partners',
        'Senior Project Managers leading systems rollouts'
      ],
      prerequisitesList: [
        'Experience leading or participating in organizational transitions'
      ],
      modules: [
        {
          id: '01',
          title: 'Diagnosing Resistance & The ADKAR Change Roadmap',
          learningOutcomes: [
            'Understanding the psychology of transition (William Bridges model)',
            'Assessing organizational readiness and cultural friction zones',
            'Deploying the ADKAR model: Awareness, Desire, Knowledge, Ability, Reinforcement',
            'Identifying barrier points and tailoring targeted behavioral interventions'
          ]
        },
        {
          id: '02',
          title: 'Sponsorship Coalitions, Communication & Reinforcement',
          learningOutcomes: [
            'Coaching executive sponsors to remain visibly committed throughout the transition',
            'Building an organic change champion network across frontline influencers',
            'Designing multi-touch communication campaigns that address "What’s In It For Me" (WIIFM)',
            'Measuring adoption metrics, system utilization, and embedding ongoing rituals'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Overcoming Workforce Resistance to an AI-Driven Workflow Tool',
          content: 'Participants construct a comprehensive 90-day change adoption plan for a company whose operations staff is quietly boycotting a new automated intake system.'
        }
      ]
    }
  },
  {
    id: 'PP0012',
    title: 'Strategic Decision-Making & Critical Problem Solving for Executives',
    category: 'people-process',
    topicCategory: 'Leadership & Managerial Skills',
    subType: 'People',
    portfolio: 'Leadership & Managerial Skills',
    badge: 'People and Process',
    level: 'Advanced',
    duration: '16 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    details: {
      summary: 'De-bias executive choices under severe uncertainty, apply Cynefin complexity frameworks, and make high-stakes corporate decisions with conviction and clarity.',
      format: 'Executive Decision Lab',
      approach: 'Crisis Simulation & Boardroom Scenarios',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Cynefin Complexity Framework',
        'Pre-Mortem Analysis & Red Teaming',
        'Decision Tree & Probabilistic Thinking Models',
        'Cognitive Bias Mitigation Checklists'
      ],
      objective: 'Senior corporate leaders must make high-consequence decisions in environments characterized by volatility, incomplete information, and cognitive biases. This executive programme teaches leaders how to distinguish complex from chaotic situations, stress-test strategic choices with pre-mortems, and execute decisively.',
      audience: [
        'Executive Vice Presidents & General Managers',
        'Managing Directors and Board Advisors',
        'Senior Strategy & Operations Directors',
        'Founders and C-Suite Leaders'
      ],
      prerequisitesList: [
        'Senior executive or general management leadership experience'
      ],
      modules: [
        {
          id: '01',
          title: 'Navigating Complexity: The Cynefin Framework & Sense-Making',
          learningOutcomes: [
            'Categorizing challenges into Clear, Complicated, Complex, and Chaotic domains',
            'Matching appropriate leadership response styles to environmental complexity',
            'Recognizing cognitive biases: confirmation bias, sunk cost fallacy, and overconfidence',
            'Implementing red-teaming techniques to stress-test consensus assumptions'
          ]
        },
        {
          id: '02',
          title: 'Probabilistic Thinking, Pre-Mortems & Decisive Execution',
          learningOutcomes: [
            'Applying Kahneman and Klein’s Pre-Mortem protocol to identify fatal risks before launch',
            'Probabilistic forecasting and expected value decision trees',
            'Balancing speed of decision versus quality of data (Type 1 vs. Type 2 decisions)',
            'Communicating difficult, high-stakes decisions with moral clarity and confidence'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Navigating an Unforeseen Geopolitical Market Crisis',
          content: 'Learners role-play an executive emergency committee addressing a sudden regulatory shutdown in a key overseas market, executing a pre-mortem and determining whether to divest or pivot operations.'
        }
      ]
    }
  }
];
