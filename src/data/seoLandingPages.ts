export type SeoLandingPageKind = 'service' | 'category' | 'solution' | 'industry' | 'market' | 'trust';

export interface SeoLandingPage {
  path: string;
  kind: SeoLandingPageKind;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  audience: string;
  outcomes: Array<{ title: string; description: string }>;
  approach: string[];
  evidence: string[];
  questions: Array<{ question: string; answer: string }>;
  relatedLinks: Array<{ label: string; href: string }>;
  updated: string;
}

const updated = '2026-10-07';

const services: SeoLandingPage[] = [
  {
    path: '/services/corporate-training',
    kind: 'service',
    eyebrow: 'Corporate training services',
    title: 'Corporate Training Solutions for Enterprise Teams | TechnoEdge',
    description: 'Build role-ready enterprise capability through instructor-led, virtual and blended corporate training designed around real work outcomes.',
    h1: 'Corporate training that turns learning into workplace capability',
    answer: 'TechnoEdge designs and delivers corporate training programmes for enterprise teams that need practical, role-specific skills—not generic course attendance. Learning paths combine expert instruction, hands-on practice, assessments and application plans aligned to the work people perform.',
    audience: 'CHROs, L&D leaders, capability heads, technology leaders and business-function owners building skills across India and global teams.',
    outcomes: [
      { title: 'Role-ready learning', description: 'Map learning to job roles, proficiency levels and the decisions people make at work.' },
      { title: 'Flexible delivery', description: 'Choose instructor-led, virtual, blended or cohort formats without losing consistency.' },
      { title: 'Measurable application', description: 'Use practice, assessments and manager reinforcement to connect completion with performance.' },
    ],
    approach: ['Diagnose the business goal, learner roles and current capability.', 'Design a role-based pathway using relevant programmes, labs and scenarios.', 'Deliver with expert facilitators and accessible learning assets.', 'Measure participation, capability gain and application after the programme.'],
    evidence: ['A catalogue spanning role-based, technical, certification, AI, process and behavioural learning.', 'Experience supporting enterprise learning engagements across industries and team sizes.', 'A delivery model that can combine training, custom content and AI-enabled support.'],
    questions: [
      { question: 'What is enterprise corporate training?', answer: 'Enterprise corporate training is a structured capability programme designed for a company’s roles, systems, goals and operating context. It differs from an open course because examples, practice and measurement are aligned to the organisation.' },
      { question: 'Can TechnoEdge customize an existing programme?', answer: 'Yes. A catalogue programme can be adapted by role, proficiency, industry context, duration, delivery mode and practical exercises after a discovery discussion.' },
      { question: 'Do you support teams outside India?', answer: 'Yes. TechnoEdge supports virtual and blended delivery for distributed teams, with scheduling and content adaptation planned around the audience.' },
    ],
    relatedLinks: [
      { label: 'Explore the training catalogue', href: '/catalogue' },
      { label: 'Role-based training', href: '/catalogue/role-based' },
      { label: 'AI readiness training', href: '/solutions/ai-readiness-training' },
    ],
    updated,
  },
  {
    path: '/services/custom-elearning-development',
    kind: 'service',
    eyebrow: 'Custom digital learning',
    title: 'Custom E-Learning Development for Enterprises | TechnoEdge',
    description: 'Transform business knowledge into practical, accessible and LMS-ready custom e-learning for onboarding, systems, processes and compliance.',
    h1: 'Custom e-learning your teams can understand and use',
    answer: 'TechnoEdge converts complex business knowledge, policies, systems and subject-matter expertise into clear digital learning experiences. Programmes can include scenarios, interaction, assessment, animation, multilingual adaptation and standards-ready delivery for enterprise learning platforms.',
    audience: 'L&D, HR, compliance, operations and transformation teams that need consistent learning at scale.',
    outcomes: [
      { title: 'Clearer content', description: 'Turn dense source material into concise explanations, decisions and practice.' },
      { title: 'Consistent delivery', description: 'Give distributed teams the same core experience while supporting local context.' },
      { title: 'LMS readiness', description: 'Package content for the required delivery and tracking environment, including SCORM or xAPI where appropriate.' },
    ],
    approach: ['Clarify the performance objective and source-material owners.', 'Create the learning architecture, script and interaction model.', 'Prototype the visual and instructional direction before full production.', 'Develop, test, package and support review through release.'],
    evidence: ['Experience with onboarding, process, system, compliance and capability content.', 'Instructional, visual, language and technology services available within one workflow.', 'Design choices based on learner context rather than decorative interaction.'],
    questions: [
      { question: 'What source material can be converted into e-learning?', answer: 'Source material can include SOPs, presentations, policy documents, recordings, manuals, expert interviews and existing classroom content.' },
      { question: 'Can courses be delivered through our LMS?', answer: 'Yes. Delivery requirements are confirmed during scoping so the final package and tracking method match the target learning platform.' },
      { question: 'Can the content be localized?', answer: 'Yes. Language and cultural adaptation can be planned with the instructional design so localization does not remove essential context.' },
    ],
    relatedLinks: [
      { label: 'Explore the e-learning experience', href: '/e-learning/' },
      { label: 'Custom e-learning solution', href: '/solutions/custom-elearning' },
      { label: 'Content and language services', href: '/services/content-language-services' },
    ],
    updated,
  },
  {
    path: '/services/ai-automation-consulting',
    kind: 'service',
    eyebrow: 'Applied AI and automation',
    title: 'AI and Automation Consulting for Enterprises | TechnoEdge',
    description: 'Identify, design and enable practical AI and automation opportunities with governance, workforce readiness and measurable adoption.',
    h1: 'Move AI and automation from ideas into trusted workflows',
    answer: 'TechnoEdge helps enterprise teams identify practical AI opportunities, prepare people to use them responsibly and redesign repeatable workflows. The focus is on business value, human oversight, data readiness and adoption—not technology demonstrations without an operating plan.',
    audience: 'Business, technology, operations, data and transformation leaders moving from AI experimentation to governed adoption.',
    outcomes: [
      { title: 'Prioritized use cases', description: 'Evaluate opportunities by value, feasibility, risk and adoption effort.' },
      { title: 'Safer adoption', description: 'Define practical guardrails for data, review, accountability and responsible use.' },
      { title: 'Workforce readiness', description: 'Equip the people who will operate, supervise and improve AI-enabled workflows.' },
    ],
    approach: ['Assess workflows, data constraints and readiness.', 'Prioritize a small set of high-value, testable use cases.', 'Prototype the process with clear human review points.', 'Train teams, measure adoption and scale what proves useful.'],
    evidence: ['The TE-AI360 maturity journey connects awareness, adoption, automation, augmentation and acceleration.', 'Role-based programmes support technical and non-technical users.', 'Training and implementation planning are treated as one adoption problem.'],
    questions: [
      { question: 'Where should an enterprise start with AI automation?', answer: 'Start with a repeatable process where the inputs, risks, expected output and human owner are clear. A limited pilot is easier to measure and govern than an organisation-wide launch.' },
      { question: 'Does AI readiness need to happen before automation?', answer: 'The two can overlap, but teams need sufficient literacy, governance and process clarity before an automated workflow is trusted at scale.' },
      { question: 'Can this work include training?', answer: 'Yes. Role-based training and adoption support can be designed alongside the workflow so users understand both the tool and the decisions they retain.' },
    ],
    relatedLinks: [
      { label: 'AI readiness training', href: '/solutions/ai-readiness-training' },
      { label: 'AI tools catalogue', href: '/catalogue/ai-tools' },
      { label: 'Data and AI support', href: '/services/data-ai-support' },
    ],
    updated,
  },
  {
    path: '/services/data-ai-support',
    kind: 'service',
    eyebrow: 'Data foundations for AI',
    title: 'Enterprise Data and AI Support Services | TechnoEdge',
    description: 'Prepare data, teams and operating practices for reliable analytics, machine learning and generative AI initiatives.',
    h1: 'Build the data capability reliable AI depends on',
    answer: 'TechnoEdge supports the people and practices behind data and AI initiatives—from data literacy and platform skills to governance, quality, analytics and responsible AI adoption. The work connects technical capability with the business teams that use data to decide and act.',
    audience: 'Data leaders, analytics teams, platform teams, AI teams and business functions building dependable data-informed operations.',
    outcomes: [
      { title: 'Shared data literacy', description: 'Give technical and business teams a common understanding of data quality, interpretation and responsibility.' },
      { title: 'Platform capability', description: 'Build practical skills across relevant cloud, analytics, engineering and AI technologies.' },
      { title: 'Governed use', description: 'Connect data access and AI experimentation with quality, privacy, security and ownership.' },
    ],
    approach: ['Map target roles and the decisions each role supports.', 'Assess capability across data, platform, analytics and governance.', 'Build pathways using projects and realistic datasets.', 'Measure proficiency and reinforce application through communities or coaching.'],
    evidence: ['Technical, role-based and certification-aligned programmes can be combined.', 'Learning paths can span foundational awareness through advanced implementation.', 'Content can be adapted to the organisation’s platform and operating model.'],
    questions: [
      { question: 'Is data literacy only for technical teams?', answer: 'No. Business users need to understand data quality, interpretation and responsible use, while technical teams need deeper platform, engineering and governance skills.' },
      { question: 'Can training align with our existing platform?', answer: 'Yes. The pathway can be mapped to the technologies, roles and maturity already present in the organisation.' },
      { question: 'How does data readiness affect generative AI?', answer: 'AI systems depend on accessible, relevant and governed information. Weak data ownership or quality can reduce trust even when the model itself is capable.' },
    ],
    relatedLinks: [
      { label: 'Tools and technology training', href: '/catalogue/tools-technology' },
      { label: 'Certification enablement', href: '/solutions/certification-enablement' },
      { label: 'AI and automation consulting', href: '/services/ai-automation-consulting' },
    ],
    updated,
  },
  {
    path: '/services/content-language-services',
    kind: 'service',
    eyebrow: 'Content and language operations',
    title: 'Content Processing and Language Services | TechnoEdge',
    description: 'Make enterprise learning and business content clearer, accessible and ready for multilingual audiences at scale.',
    h1: 'Content and language services that preserve meaning at scale',
    answer: 'TechnoEdge helps teams process, structure, adapt and localize learning and business content without losing its intended meaning. Workflows can combine editorial review, language adaptation, media support and quality assurance for repeatable delivery.',
    audience: 'Learning, publishing, product, support and operations teams managing high-volume or multilingual content.',
    outcomes: [
      { title: 'Consistent structure', description: 'Apply repeatable standards to content that arrives in different formats and levels of quality.' },
      { title: 'Context-aware language', description: 'Preserve terminology, tone and domain meaning during adaptation.' },
      { title: 'Scalable quality', description: 'Use defined review stages, glossaries and checks rather than ad hoc corrections.' },
    ],
    approach: ['Inventory content formats, audiences, languages and risks.', 'Define style, terminology, review and acceptance standards.', 'Process and adapt content through controlled production stages.', 'Run linguistic, functional and final-release quality checks.'],
    evidence: ['Content, learning design and digital-production capabilities can be coordinated.', 'Processes can support recurring production rather than one-time conversion.', 'Human review remains explicit when automation assists the workflow.'],
    questions: [
      { question: 'What types of content can be supported?', answer: 'Typical inputs include learning content, scripts, captions, presentations, knowledge material, assessments and structured content records.' },
      { question: 'How is terminology kept consistent?', answer: 'A shared glossary, style guidance and review workflow are established before production scales.' },
      { question: 'Can AI assist the process?', answer: 'AI can support defined stages, but quality ownership, sensitive-data handling and human review are agreed before use.' },
    ],
    relatedLinks: [
      { label: 'Custom e-learning development', href: '/services/custom-elearning-development' },
      { label: 'Explore e-learning', href: '/e-learning/' },
      { label: 'Talk to TechnoEdge', href: '/contact' },
    ],
    updated,
  },
];

const categorySeed = [
  ['role-based', 'Role-Based Corporate Training Programmes', 'Role-based training organizes learning around the responsibilities, decisions and tools of a job rather than a broad topic. Explore programmes for functions such as HR, finance, sales, operations, leadership, technology and data.', 'Build capability paths for specific roles and departments.', ['AI and digital skills by role', 'Department-specific pathways', 'Progression from awareness to expert practice']],
  ['ai-tools', 'AI Tools Training for Enterprise Teams', 'Hands-on AI tools training helps employees use platforms such as ChatGPT, Copilot, Gemini and automation tools safely and productively in real work. Programmes are organized by tool, use case and proficiency level.', 'Build practical and responsible use of AI-powered tools.', ['Tool-specific practice', 'Role-relevant use cases', 'Responsible use and output verification']],
  ['tools-technology', 'Tools and Technology Training Programmes', 'Technical training builds practical capability across cloud, data, DevOps, development, platforms and emerging technologies. Programmes can support foundational learning, implementation skills or advanced specialization.', 'Develop the technical skills required for platforms and delivery teams.', ['Technology pathways', 'Labs and applied exercises', 'Role and proficiency alignment']],
  ['certifications', 'Enterprise Certification Training and Enablement', 'Certification enablement combines credential-aligned learning with practice, exam preparation and a team capability plan. Explore pathways across Microsoft, AWS, Cisco, IBM, Google Cloud and other providers.', 'Align certification goals with business capability—not exam completion alone.', ['Credential-aligned pathways', 'Official exam and renewal context', 'Team preparation support']],
  ['process-based', 'Process-Based Corporate Training', 'Process-based learning helps teams apply repeatable methods for projects, service management, Agile delivery, operational excellence and business workflows.', 'Improve how teams execute shared methods and processes.', ['Workflow practice', 'Framework application', 'Team operating consistency']],
  ['people-behavioural', 'People and Behavioural Skills Training', 'People and behavioural programmes develop communication, leadership, ownership, collaboration and management capability through realistic practice and reflection.', 'Strengthen the human capabilities that make business and technology change work.', ['Leadership development', 'Communication practice', 'Behavioural application']],
] as const;

const categories: SeoLandingPage[] = categorySeed.map(([slug, h1, answer, audience, outcomeTitles]) => ({
  path: `/catalogue/${slug}`,
  kind: 'category',
  eyebrow: 'Training catalogue',
  title: `${h1} | TechnoEdge`,
  description: `${answer} Browse TechnoEdge programmes for enterprise teams.`,
  h1,
  answer,
  audience,
  outcomes: outcomeTitles.map((title) => ({ title, description: `Select programmes by role, level, duration and delivery context to create a coherent ${title.toLowerCase()} plan.` })),
  approach: ['Clarify the target roles and business outcomes.', 'Select programmes by proficiency and practical context.', 'Combine related modules into a sequenced learning path.', 'Confirm delivery, assessment and reinforcement requirements.'],
  evidence: ['Every programme uses a stable catalogue identifier.', 'Programme pages expose audience, prerequisites, outcomes and learning structure when approved.', 'The catalogue supports enterprise scoping rather than self-service checkout.'],
  questions: [
    { question: `How should we select ${h1.toLowerCase()}?`, answer: 'Start with the roles, current proficiency and work outcomes involved. Duration and format should follow the capability need rather than lead the decision.' },
    { question: 'Can several programmes be combined?', answer: 'Yes. Programmes can be sequenced into a role, team or transformation pathway after the target capability has been defined.' },
    { question: 'Can the content be tailored?', answer: 'Tailoring can cover examples, exercises, duration, delivery mode and the balance between concepts and application.' },
  ],
  relatedLinks: [
    { label: 'Search the complete catalogue', href: '/catalogue' },
    { label: 'Corporate training services', href: '/services/corporate-training' },
    { label: 'Request a capability discussion', href: '/contact' },
  ],
  updated,
}));

const solutionSeed = [
  ['ai-readiness-training', 'AI Readiness Training for Enterprise Workforces', 'Prepare leaders, managers and employees to use AI productively, safely and with clear accountability.', ['AI literacy by role', 'Responsible-use guardrails', 'Function-specific practice']],
  ['role-based-workforce-upskilling', 'Role-Based Workforce Upskilling', 'Build capability around the work each role performs, then connect role pathways to shared business outcomes.', ['Role and skill mapping', 'Proficiency-based pathways', 'Application and reinforcement']],
  ['enterprise-onboarding', 'Enterprise Onboarding Learning Solutions', 'Create consistent onboarding that helps employees understand the organisation, their role, required systems and safe ways of working.', ['Faster role clarity', 'Consistent process learning', 'Manager-supported application']],
  ['certification-enablement', 'Enterprise Certification Enablement', 'Turn certification targets into structured team capability plans with aligned learning, practice and preparation support.', ['Credential mapping', 'Preparation pathways', 'Progress visibility']],
  ['custom-elearning', 'Custom E-Learning Solutions', 'Transform expert knowledge, policies and processes into clear digital learning that can be delivered consistently across teams.', ['Instructional design', 'Interactive production', 'LMS-ready delivery']],
] as const;

const solutions: SeoLandingPage[] = solutionSeed.map(([slug, h1, answer, outcomeTitles]) => ({
  path: `/solutions/${slug}`,
  kind: 'solution',
  eyebrow: 'Enterprise capability solution',
  title: `${h1} | TechnoEdge`,
  description: `${answer} Explore a practical TechnoEdge approach for India and global enterprise teams.`,
  h1,
  answer,
  audience: 'Enterprise leaders who need a defined capability outcome across multiple roles, teams or locations.',
  outcomes: outcomeTitles.map((title) => ({ title, description: `Design ${title.toLowerCase()} around real learner context, evidence and business constraints.` })),
  approach: ['Define the desired business and workforce outcome.', 'Map roles, current capability and delivery constraints.', 'Design the learning, practice and support system.', 'Pilot, measure, improve and scale based on evidence.'],
  evidence: ['Catalogue, custom content and advisory capabilities can be combined.', 'Solutions are scoped around the organisation instead of a fixed public package.', 'Measurement is defined before delivery begins.'],
  questions: [
    { question: `What does ${h1.toLowerCase()} include?`, answer: 'The final scope depends on roles and outcomes, but normally combines discovery, pathway design, learning content, delivery, practice and measurement.' },
    { question: 'Can we start with a pilot?', answer: 'Yes. A focused pilot is the preferred way to test relevance, operational effort and measurement before expanding.' },
    { question: 'How is success measured?', answer: 'Measures are selected during discovery and can include participation, proficiency, application, time to capability and agreed business indicators.' },
  ],
  relatedLinks: [
    { label: 'Corporate training services', href: '/services/corporate-training' },
    { label: 'Explore programmes', href: '/catalogue' },
    { label: 'Discuss your requirement', href: '/contact' },
  ],
  updated,
}));

const industrySeed = [
  ['bfsi', 'Corporate Training for Banking, Financial Services and Insurance', 'Build regulated-industry capability across data, AI, cloud, cyber security, operations, customer experience and leadership while keeping governance visible.'],
  ['technology-gcc', 'Capability Building for Technology Teams and GCCs', 'Develop role-ready capability for engineering, data, cloud, AI, product, operations and leadership teams working across global delivery environments.'],
  ['manufacturing', 'Corporate Training for Manufacturing Teams', 'Connect digital, data, automation, operational excellence and leadership learning to the systems and decisions used in manufacturing work.'],
  ['pharma-healthcare', 'Corporate Training for Pharma and Healthcare Teams', 'Support technology, data, process, compliance and leadership capability with learning designed for accuracy, accountability and regulated work.'],
  ['retail', 'Corporate Training for Retail and Consumer Teams', 'Build data, digital, operations, customer, technology and leadership capability across fast-moving retail and consumer environments.'],
] as const;

const industries: SeoLandingPage[] = industrySeed.map(([slug, h1, answer]) => ({
  path: `/industries/${slug}`,
  kind: 'industry',
  eyebrow: 'Industry capability',
  title: `${h1} | TechnoEdge`,
  description: `${answer} Explore role-based and technology learning for enterprise teams.`,
  h1,
  answer,
  audience: 'Capability, HR, L&D, technology and business leaders responsible for workforce readiness in this industry.',
  outcomes: [
    { title: 'Industry context', description: 'Use terminology, scenarios and constraints that make the learning recognizable to participants.' },
    { title: 'Role relevance', description: 'Map capability to the decisions and responsibilities of different functions.' },
    { title: 'Responsible adoption', description: 'Keep privacy, security, quality and human oversight visible in technology learning.' },
  ],
  approach: ['Confirm the business priority and industry constraints.', 'Map roles and the capabilities required by each group.', 'Select and adapt programme content and practical work.', 'Measure proficiency and reinforce use after delivery.'],
  evidence: ['Programmes span business, behavioural and technical capability.', 'Delivery can support cohorts across locations and proficiency levels.', 'Content adaptation is agreed with subject-matter stakeholders.'],
  questions: [
    { question: 'How is industry context added to training?', answer: 'Context is introduced through terminology, workflows, examples, datasets, scenarios and risk considerations supplied or approved by the organisation.' },
    { question: 'Can one initiative support business and technical teams?', answer: 'Yes. Shared foundations can be combined with deeper role pathways so teams develop a common language without receiving identical training.' },
    { question: 'Can delivery support international teams?', answer: 'Yes. Virtual and blended delivery can be scheduled for distributed groups, with localisation planned when it materially improves understanding.' },
  ],
  relatedLinks: [
    { label: 'Role-based programmes', href: '/catalogue/role-based' },
    { label: 'AI readiness training', href: '/solutions/ai-readiness-training' },
    { label: 'Talk to TechnoEdge', href: '/contact' },
  ],
  updated,
}));

const marketPages: SeoLandingPage[] = [
  {
    path: '/markets/india', kind: 'market', eyebrow: 'India enterprise learning',
    title: 'Corporate Training and E-Learning in India | TechnoEdge',
    description: 'Enterprise corporate training, custom e-learning, AI readiness and capability solutions delivered from TechnoEdge offices in Pune, India.',
    h1: 'Enterprise learning and AI capability for teams across India',
    answer: 'TechnoEdge Learning Services India Pvt. Ltd. supports organisations with corporate training, custom e-learning, content services, data capability and practical AI adoption. Delivery can support individual functions, multi-location cohorts and organisation-wide capability initiatives.',
    audience: 'India-based enterprises, GCCs and multinational teams requiring local delivery context with global technology capability.',
    outcomes: [
      { title: 'India delivery context', description: 'Plan around local roles, operating conditions, schedules and enterprise priorities.' },
      { title: 'Broad capability coverage', description: 'Combine business, behavioural, technology, data, AI and certification pathways.' },
      { title: 'Scalable formats', description: 'Use classroom, virtual, blended and digital learning across locations.' },
    ],
    approach: ['Discuss roles, locations and business goals.', 'Select or design the capability pathway.', 'Confirm delivery, language and technology requirements.', 'Pilot and scale using agreed evidence.'],
    evidence: ['Registered and head-office addresses are published consistently on the site.', 'Pune-based operations support enterprise learning engagements.', 'Programmes are designed for corporate teams rather than consumer checkout.'],
    questions: [
      { question: 'Where is TechnoEdge based?', answer: 'TechnoEdge is based in Pune, Maharashtra, with its registered and head-office details published on the Contact page.' },
      { question: 'Can delivery cover multiple Indian locations?', answer: 'Yes. Delivery design can combine virtual, onsite and blended formats according to cohort size, location and programme requirements.' },
      { question: 'Can India teams join global learning programmes?', answer: 'Yes. A shared global pathway can include India-specific examples, scheduling and support where these improve application.' },
    ],
    relatedLinks: [{ label: 'Contact TechnoEdge', href: '/contact' }, { label: 'Corporate training', href: '/services/corporate-training' }, { label: 'Global delivery', href: '/markets/global-delivery' }],
    updated,
  },
  {
    path: '/markets/global-delivery', kind: 'market', eyebrow: 'Global enterprise delivery',
    title: 'Global Corporate Training and Learning Delivery | TechnoEdge',
    description: 'Plan consistent virtual, blended and digital capability programmes for enterprise teams across regions and time zones.',
    h1: 'Consistent capability building for distributed global teams',
    answer: 'TechnoEdge supports global teams through virtual facilitation, blended pathways, reusable digital content and coordinated delivery standards. Global consistency is balanced with the language, examples and operating context learners need in each region.',
    audience: 'Multinational organisations, distributed technology teams and global capability functions coordinating learning across regions.',
    outcomes: [
      { title: 'Shared standards', description: 'Keep core outcomes, terminology and measurement consistent across cohorts.' },
      { title: 'Regional relevance', description: 'Adapt examples, support and scheduling without fragmenting the programme.' },
      { title: 'Reusable learning assets', description: 'Combine live learning with digital resources that remain available after delivery.' },
    ],
    approach: ['Define global outcomes and non-negotiable standards.', 'Identify regional differences that affect understanding or delivery.', 'Prepare facilitator, content and learner-support assets.', 'Run cohorts, compare evidence and improve the shared model.'],
    evidence: ['Virtual and digital formats support distributed audiences.', 'Content and language workflows can support adaptation.', 'A single catalogue and measurement model keeps programme identity consistent.'],
    questions: [
      { question: 'How do you handle multiple time zones?', answer: 'Cohorts, session windows and asynchronous support are planned during scoping rather than forcing every learner into one schedule.' },
      { question: 'Can global content be localized?', answer: 'Yes. Localisation is based on language, terminology, examples, regulation and work context—not translation alone.' },
      { question: 'How is consistency maintained?', answer: 'Shared objectives, facilitator guidance, core assets and measures are maintained across cohorts, with approved regional adaptations recorded separately.' },
    ],
    relatedLinks: [{ label: 'Corporate training', href: '/services/corporate-training' }, { label: 'Content and language services', href: '/services/content-language-services' }, { label: 'India delivery', href: '/markets/india' }],
    updated,
  },
];

const trustPages: SeoLandingPage[] = [
  {
    path: '/about', kind: 'trust', eyebrow: 'About TechnoEdge',
    title: 'About TechnoEdge Learning Services',
    description: 'Learn how TechnoEdge builds enterprise capability through corporate training, digital learning, content services, data and practical AI enablement.',
    h1: 'A capability partner for learning, technology and AI-enabled work',
    answer: 'TechnoEdge Learning Services India Pvt. Ltd. helps organisations turn learning requirements into practical capability. Our work spans corporate training, custom e-learning, content and language services, data skills, and AI and automation enablement.',
    audience: 'Enterprise teams seeking a partner that can connect learning strategy, content, delivery and technology capability.',
    outcomes: [
      { title: 'Practical learning', description: 'Design around what people need to understand, decide and do.' },
      { title: 'Connected services', description: 'Bring training, content, technology and delivery work into one capability plan.' },
      { title: 'Responsible innovation', description: 'Use AI and automation with explicit ownership, review and human judgement.' },
    ],
    approach: ['Listen to the business problem before selecting content.', 'Make learner roles and application visible in the design.', 'Use evidence and iteration to improve delivery.', 'Keep ownership, quality and trust explicit as work scales.'],
    evidence: ['More than 200 client engagements are represented in the company’s current public metrics.', 'The catalogue includes more than 3,000 supported courses and programmes.', 'TechnoEdge is recognized through the company credentials displayed on the homepage.'],
    questions: [
      { question: 'What does TechnoEdge provide?', answer: 'TechnoEdge provides corporate training, custom e-learning, content and language services, data and AI support, and AI and automation consulting.' },
      { question: 'Who does TechnoEdge work with?', answer: 'The primary audience is enterprise and institutional teams that need workforce capability across business, technology and leadership roles.' },
      { question: 'Where does TechnoEdge operate?', answer: 'TechnoEdge is based in Pune, India and supports both India-based and distributed global teams.' },
    ],
    relatedLinks: [{ label: 'Explore services', href: '/services/corporate-training' }, { label: 'Browse the catalogue', href: '/catalogue' }, { label: 'Contact us', href: '/contact' }],
    updated,
  },
  {
    path: '/contact', kind: 'trust', eyebrow: 'Contact TechnoEdge',
    title: 'Contact TechnoEdge Learning Services',
    description: 'Contact TechnoEdge about corporate training, custom e-learning, AI readiness, content services and enterprise capability requirements.',
    h1: 'Tell us what capability your team needs to build',
    answer: 'Share the roles, audience size, desired outcome, location and timing you are considering. The TechnoEdge team will use that context to identify the most relevant programmes, delivery approach or custom solution.',
    audience: 'Enterprise buyers, partners, subject-matter experts and professionals exploring work with TechnoEdge.',
    outcomes: [
      { title: 'Programme selection', description: 'Find relevant programmes and combine them into a role or team pathway.' },
      { title: 'Custom solution scoping', description: 'Discuss e-learning, content, data, AI or automation requirements.' },
      { title: 'Delivery planning', description: 'Clarify audience, location, format, timeline and measurement expectations.' },
    ],
    approach: ['Describe the business outcome and intended learners.', 'Include preferred timing, delivery mode and locations if known.', 'TechnoEdge reviews the requirement and identifies the next discovery step.', 'Scope, responsibilities and evidence are agreed before delivery begins.'],
    evidence: ['Email: info@technoedgels.com.', 'Head office: Baner Biz Bay, Baner, Pune, Maharashtra, India.', 'Telephone and WhatsApp options are available in the site footer.'],
    questions: [
      { question: 'What information should an enquiry include?', answer: 'Include the business goal, learner roles, approximate audience size, preferred timing, locations and any required technology or certification.' },
      { question: 'Can I ask for a tailored course outline?', answer: 'Yes. Include the programme or topic and the audience context so the team can determine what should be adapted.' },
      { question: 'Do you accept trainer and expert profiles?', answer: 'Career and collaboration enquiries can be sent through the careers process or the published contact email.' },
    ],
    relatedLinks: [{ label: 'Explore the catalogue', href: '/catalogue' }, { label: 'Custom e-learning', href: '/services/custom-elearning-development' }, { label: 'Careers', href: '/careers' }],
    updated,
  },
  {
    path: '/authors/technoedge-editorial-team', kind: 'trust', eyebrow: 'Editorial authorship',
    title: 'TechnoEdge Editorial Team | Author Profile',
    description: 'Meet the accountable editorial function behind TechnoEdge insight content and learn how subject-matter review and corrections are handled.',
    h1: 'TechnoEdge Editorial Team',
    answer: 'The TechnoEdge Editorial Team is an organisational byline used for content that is planned, assembled or maintained across learning, content and technology specialists. It is not presented as an individual expert. Articles move to named authors and reviewers when that ownership has been verified.',
    audience: 'Readers evaluating the authorship, expertise and review process behind TechnoEdge insight content.',
    outcomes: [
      { title: 'Honest attribution', description: 'An organisational byline is used instead of inventing a personal author for legacy material.' },
      { title: 'Subject review', description: 'Technical or consequential claims require review by an appropriate subject-matter owner.' },
      { title: 'Accountable updates', description: 'Published pages provide a correction route and record material review dates.' },
    ],
    approach: ['Identify the article owner and the expertise needed for review.', 'Check facts, sources, examples and time-sensitive claims.', 'Record publication, modification and review information.', 'Replace the team byline with a verified individual author when appropriate.'],
    evidence: ['Imported archive articles remain noindex until editorial approval.', 'The editorial and correction policies apply to every approved insight.', 'AI assistance does not remove human responsibility for publication.'],
    questions: [
      { question: 'Is the Editorial Team a person?', answer: 'No. It is an organisational byline for collaboratively maintained content and should not be interpreted as an individual biography.' },
      { question: 'Why do some articles not name an individual?', answer: 'The current archive does not provide verified individual attribution for every article. TechnoEdge keeps those pages outside search until authorship and review are resolved.' },
      { question: 'How can a reader report an error?', answer: 'Use the corrections process and include the page URL, disputed statement and supporting source.' },
    ],
    relatedLinks: [{ label: 'Editorial policy', href: '/editorial-policy' }, { label: 'Corrections policy', href: '/corrections-policy' }, { label: 'AI-assisted content policy', href: '/ai-content-policy' }],
    updated,
  },
  {
    path: '/editorial-policy', kind: 'trust', eyebrow: 'Editorial standards', title: 'Editorial Policy | TechnoEdge', description: 'How TechnoEdge plans, reviews, sources, updates and corrects learning and technology content.', h1: 'How TechnoEdge creates and maintains editorial content',
    answer: 'TechnoEdge publishes content to help enterprise learning and technology leaders make informed capability decisions. Articles should be relevant to our audience, distinguish evidence from interpretation, identify the responsible author or editorial team, and be reviewed when facts become outdated.', audience: 'Readers, contributors, reviewers and partners who need to understand how TechnoEdge content is governed.',
    outcomes: [{ title: 'Clear ownership', description: 'Every approved article identifies its authoring team and review status.' }, { title: 'Source transparency', description: 'Material factual claims should link to reliable primary or authoritative sources.' }, { title: 'Maintained accuracy', description: 'Corrections and material updates change the reviewed date and are recorded.' }],
    approach: ['Choose topics relevant to TechnoEdge audiences and expertise.', 'Research and draft with sources recorded.', 'Review claims, structure, links and business relevance.', 'Publish with dates, ownership and a route for corrections.'],
    evidence: ['Editorial pages use publication and modification dates.', 'Unreviewed imported articles remain excluded from search.', 'Material corrections are made without silently changing the historical publication date.'],
    questions: [{ question: 'Does TechnoEdge use AI in content production?', answer: 'AI may assist research organization, drafting or quality checks, but a responsible human must review factual claims, usefulness and final publication.' }, { question: 'How are corrections requested?', answer: 'Readers can contact TechnoEdge with the page URL, disputed statement and supporting evidence.' }, { question: 'Are all imported articles immediately indexed?', answer: 'No. Imported content remains outside search until its editorial and technical quality checks pass.' }],
    relatedLinks: [{ label: 'AI-assisted content policy', href: '/ai-content-policy' }, { label: 'Corrections policy', href: '/corrections-policy' }, { label: 'Insights', href: '/insights' }], updated,
  },
  {
    path: '/corrections-policy', kind: 'trust', eyebrow: 'Corrections', title: 'Content Corrections Policy | TechnoEdge', description: 'How to report and how TechnoEdge handles material corrections to published website content.', h1: 'How TechnoEdge handles content corrections',
    answer: 'Accuracy matters in learning and technology content. When a material error is confirmed, TechnoEdge corrects the page, records an appropriate modification date and reviews related content that may contain the same issue.', audience: 'Readers, customers, technology providers and subject-matter experts reporting a possible error.',
    outcomes: [{ title: 'Traceable reports', description: 'A correction request identifies the page, statement and evidence.' }, { title: 'Proportionate action', description: 'Material errors are corrected; minor style changes do not misrepresent freshness.' }, { title: 'Related review', description: 'Repeated claims are checked across connected pages.' }],
    approach: ['Send the URL and disputed statement to the published contact email.', 'The editorial owner reviews the source and business impact.', 'Confirmed material errors are corrected and the modified date is updated.', 'High-impact issues trigger a review of related pages and structured data.'],
    evidence: ['Content metadata separates original publication from modification.', 'Correction work includes visible text, metadata and machine-readable data.', 'Removed pages use redirects or appropriate HTTP status codes.'],
    questions: [{ question: 'Where should a correction be sent?', answer: 'Send the page URL, the relevant text and a reliable supporting source to info@technoedgels.com.' }, { question: 'Will every edit change the modified date?', answer: 'No. The modified date is reserved for changes that materially affect the information a reader receives.' }, { question: 'Can an article be removed?', answer: 'Yes. Content that is unsafe, misleading, obsolete or no longer supportable may be removed, consolidated or retained outside search.' }],
    relatedLinks: [{ label: 'Editorial policy', href: '/editorial-policy' }, { label: 'Contact TechnoEdge', href: '/contact' }, { label: 'Insights', href: '/insights' }], updated,
  },
  {
    path: '/ai-content-policy', kind: 'trust', eyebrow: 'Responsible content', title: 'AI-Assisted Content Policy | TechnoEdge', description: 'How TechnoEdge uses human review, source verification and disclosure when AI assists content work.', h1: 'Human accountability for AI-assisted content',
    answer: 'TechnoEdge may use AI tools to support research organization, drafting, formatting or quality checks. AI assistance does not replace human responsibility for accuracy, originality, confidentiality, source verification or the final decision to publish.', audience: 'Readers, customers, contributors and reviewers evaluating the trustworthiness of TechnoEdge content.',
    outcomes: [{ title: 'Human ownership', description: 'A named person or accountable editorial team approves publication.' }, { title: 'Protected information', description: 'Confidential customer or personal data must not be entered into unapproved tools.' }, { title: 'Verified claims', description: 'Time-sensitive and consequential facts require source checking before publication.' }],
    approach: ['Use AI only for an approved and understood purpose.', 'Protect confidential, personal and licensed information.', 'Check facts against reliable sources and add original expert value.', 'Disclose substantial AI involvement when a reader would reasonably expect context.'],
    evidence: ['Search-scale automated publishing without value is not part of the policy.', 'Generated material must pass the same editorial standards as other content.', 'Authors and reviewers remain accountable for the published page.'],
    questions: [{ question: 'Is all TechnoEdge content written by AI?', answer: 'No. AI may assist parts of a workflow, but publication requires human judgement, review and accountability.' }, { question: 'How are AI-generated claims handled?', answer: 'Claims are treated as unverified until checked against reliable sources or direct subject-matter evidence.' }, { question: 'Does AI assistance automatically make a page indexable?', answer: 'No. A page must pass usefulness, accuracy, originality and technical quality checks regardless of how it was created.' }],
    relatedLinks: [{ label: 'Editorial policy', href: '/editorial-policy' }, { label: 'Corrections policy', href: '/corrections-policy' }, { label: 'About TechnoEdge', href: '/about' }], updated,
  },
  {
    path: '/privacy', kind: 'trust', eyebrow: 'Privacy', title: 'Privacy Policy | TechnoEdge', description: 'Privacy information for visitors and people who submit enquiries through the TechnoEdge website.', h1: 'Privacy at TechnoEdge',
    answer: 'TechnoEdge collects information that visitors choose to provide through enquiries and basic technical information needed to operate, secure and improve the website. Personal information should be used only for the stated business purpose and handled with appropriate access controls.', audience: 'Website visitors, prospective customers, applicants and partners who provide information to TechnoEdge.',
    outcomes: [{ title: 'Purpose limitation', description: 'Use submitted information to respond to the enquiry or provide the requested service.' }, { title: 'Data minimisation', description: 'Request only information reasonably required for the interaction.' }, { title: 'Controlled access', description: 'Limit access to people and service providers who need it for the stated purpose.' }],
    approach: ['Explain what information a form requests and why.', 'Transmit and store information using appropriate safeguards.', 'Retain information only as required for the purpose and applicable obligations.', 'Provide a contact route for access, correction or deletion requests.'],
    evidence: ['Enquiry forms identify their purpose.', 'Administrative endpoints are excluded from public crawling.', 'Analytics and consent settings are documented when enabled.'],
    questions: [{ question: 'What information can be collected?', answer: 'Information may include name, work contact details, organisation, enquiry content and limited technical or analytics information.' }, { question: 'Is information sold?', answer: 'TechnoEdge does not present website enquiry data as a product for sale.' }, { question: 'How can a privacy request be made?', answer: 'Send the request and relevant contact details to info@technoedgels.com so identity and scope can be confirmed.' }],
    relatedLinks: [{ label: 'Contact TechnoEdge', href: '/contact' }, { label: 'Terms and conditions', href: '/terms' }, { label: 'AI content policy', href: '/ai-content-policy' }], updated,
  },
  {
    path: '/terms', kind: 'trust', eyebrow: 'Website terms', title: 'Terms and Conditions | TechnoEdge', description: 'Terms governing use of the TechnoEdge website, catalogue and public content.', h1: 'Terms for using the TechnoEdge website',
    answer: 'The TechnoEdge website provides general information about services, programmes, careers and insights. Public content is not a binding proposal, certification guarantee, legal opinion or commitment to deliver until scope and commercial terms are agreed in writing.', audience: 'Visitors using the website, catalogue, downloadable information or enquiry channels.',
    outcomes: [{ title: 'Informational use', description: 'Website content supports evaluation and discussion but does not replace a signed agreement.' }, { title: 'Respect for rights', description: 'Site content, branding and assets may not be republished without permission or a valid legal basis.' }, { title: 'Responsible access', description: 'Visitors must not misuse forms, systems or public endpoints.' }],
    approach: ['Use the site for lawful information and enquiry purposes.', 'Confirm current programme, credential and provider details before relying on them.', 'Agree service scope, price, timing and responsibilities separately in writing.', 'Report errors, security concerns or rights issues through the published contact route.'],
    evidence: ['Programme availability and provider information can change.', 'Third-party names and credentials remain subject to their owners’ terms.', 'The current website terms can be updated when services or legal requirements change.'],
    questions: [{ question: 'Does a catalogue page guarantee availability?', answer: 'No. Availability, delivery dates, pricing and customization are confirmed during the enquiry and contracting process.' }, { question: 'Are certification details always current?', answer: 'Providers can change exams and credentials. TechnoEdge records review dates and links to official sources where available.' }, { question: 'Can website content be reused?', answer: 'Limited linking and lawful quotation may be permitted, but reproduction of substantial content requires authorization.' }],
    relatedLinks: [{ label: 'Privacy policy', href: '/privacy' }, { label: 'Corrections policy', href: '/corrections-policy' }, { label: 'Contact TechnoEdge', href: '/contact' }], updated,
  },
];

export const seoLandingPages: SeoLandingPage[] = [
  ...services,
  ...categories,
  ...solutions,
  ...industries,
  ...marketPages,
  ...trustPages,
];

export const getSeoLandingPage = (pathname: string) => (
  seoLandingPages.find((page) => page.path === pathname.replace(/\/+$/, '') || page.path === pathname)
);
