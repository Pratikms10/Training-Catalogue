import { ToolsTechProgramme } from '../types';

export const toolsTechnologyProgrammes: ToolsTechProgramme[] = [
  {
    id: 'TT0001',
    title: 'ChatGPT for Work: Understand AI-Assisted Productivity',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'ChatGPT / ChatGPT Enterprise',
    vendor: 'OpenAI',
    technologyCategory: ['AI', 'Productivity & Collaboration'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    level: 'Awareness',
    duration: '4 Hours',
    details: {
      summary: 'Learn how ChatGPT and ChatGPT Enterprise can support workplace productivity, business workflows, content creation, analysis, and responsible AI adoption.',
      format: 'Technology-Based Programme',
      approach: 'Practical & Demonstration-Based',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'ChatGPT / ChatGPT Enterprise'
      ],
      objective: 'This programme introduces participants to ChatGPT and ChatGPT Enterprise as AI-powered productivity tools for modern workplace environments.\n\nParticipants will understand how conversational AI works, explore key ChatGPT capabilities, and identify practical ways AI can support daily business activities such as drafting content, summarising information, analysing data, and improving workflows.\n\nThe programme introduces AI-assisted workplace scenarios while helping learners understand limitations such as inaccurate outputs, data privacy considerations, and the importance of human validation.',
      audience: [
        'Business professionals exploring AI adoption',
        'Managers and team leaders',
        'Knowledge workers',
        'Operations and administrative teams',
        'Marketing and communication professionals',
        'Analysts and reporting professionals',
        'Learning and development teams',
        'Digital transformation professionals'
      ],
      prerequisitesList: [
        'Basic digital skills',
        'No prior AI or ChatGPT experience required'
      ],
      modules: [
        {
          id: '01',
          title: 'Introduction to ChatGPT and Generative AI',
          learningOutcomes: [
            'Understand what ChatGPT is and how conversational AI works',
            'Identify common workplace applications of ChatGPT',
            'Recognise how generative AI differs from traditional software tools',
            'Understand the role of prompts in AI interactions',
            'Identify opportunities for AI-assisted productivity'
          ]
        },
        {
          id: '02',
          title: 'ChatGPT Core Capabilities',
          learningOutcomes: [
            'Explore ChatGPT conversation capabilities',
            'Identify content creation and summarisation use cases',
            'Understand AI-assisted research and information processing',
            'Recognise how ChatGPT supports workplace tasks',
            'Identify common business scenarios where ChatGPT can add value'
          ]
        },
        {
          id: '03',
          title: 'ChatGPT Enterprise Overview',
          learningOutcomes: [
            'Understand the purpose of ChatGPT Enterprise',
            'Identify how enterprise AI differs from individual AI usage',
            'Understand workplace adoption considerations',
            'Recognise the importance of secure AI usage',
            'Identify organisational benefits of enterprise AI solutions'
          ]
        },
        {
          id: '04',
          title: 'Working with ChatGPT',
          learningOutcomes: [
            'Understand effective prompt-writing principles',
            'Identify ways to improve AI responses through better instructions',
            'Explore examples of business-focused prompts',
            'Understand iterative conversations with AI',
            'Recognise the importance of reviewing AI-generated outputs'
          ]
        },
        {
          id: '05',
          title: 'AI-Assisted Workplace Productivity',
          learningOutcomes: [
            'Identify productivity improvements using ChatGPT',
            'Explore AI-assisted content creation workflows',
            'Understand AI support for summarisation and documentation',
            'Recognise opportunities for workflow improvement',
            'Identify tasks suitable for AI assistance'
          ]
        },
        {
          id: '06',
          title: 'AI Use Cases, Limitations and Troubleshooting Awareness',
          learningOutcomes: [
            'Explore practical ChatGPT business scenarios',
            'Understand common AI limitations',
            'Recognise inaccurate or unsupported AI responses',
            'Identify situations requiring human review',
            'Understand factors affecting AI output quality'
          ],
          appliedExercise: {
            title: 'Applied In-Class Exercise — Create a Workplace AI Assistant Workflow',
            content: [
              'Participants will:',
              'Select a common workplace task',
              'Create a ChatGPT prompt for the task',
              'Review the generated response',
              'Identify improvements needed',
              'Discuss responsible AI usage considerations',
              '',
              'Output:',
              'A basic AI-assisted workflow example'
            ]
          }
        },
        {
          id: '07',
          title: 'Security, Responsible AI and Best Practices',
          learningOutcomes: [
            'Understand responsible ChatGPT usage principles',
            'Identify data privacy considerations',
            'Recognise risks of sharing sensitive information',
            'Understand the need for human validation',
            'Identify organisational guidelines for AI adoption'
          ]
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Improving Business Productivity with ChatGPT',
          content: 'A business team wants to reduce time spent on repetitive tasks such as drafting emails, summarising documents, and preparing meeting notes.\n\nParticipants identify:\n- Suitable tasks for ChatGPT assistance\n- Appropriate prompts for each activity\n- Expected productivity benefits\n- Risks requiring human review'
        }
      ]
    }
  },
  {
    id: 'TT0002',
    title: 'Microsoft 365 Copilot: Enterprise AI Workflow Automation',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Microsoft 365 Copilot',
    vendor: 'Microsoft',
    technologyCategory: ['AI', 'Productivity & Collaboration'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg',
    level: 'Intermediate',
    duration: '8 Hours',
    details: {
      summary: 'Master contextual prompting, multi-app grounding, and intelligent workflow automation across Word, Excel, PowerPoint, Teams, and Outlook using Microsoft 365 Copilot.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Tenant Simulations',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Microsoft 365 Copilot',
        'Microsoft Graph Grounding',
        'Copilot in Word & PowerPoint',
        'Copilot in Excel (Python enabled)',
        'Microsoft Teams Copilot'
      ],
      objective: 'Enterprise deployment of Microsoft 365 Copilot is only as impactful as user adoption. This course trains business users and corporate teams to write sophisticated multi-turn prompts grounded in enterprise graph data, automate document generation, summarize meetings in real time, and analyze financial spreadsheets.',
      audience: [
        'Enterprise Knowledge Workers',
        'Executive Assistants and Operations Teams',
        'Departmental Managers and Team Leads',
        'IT Champions driving M365 Copilot rollouts'
      ],
      prerequisitesList: [
        'Proficiency with standard Microsoft 365 desktop and web applications'
      ],
      modules: [
        {
          id: '01',
          title: 'Copilot Architecture & Semantic Index Foundations',
          learningOutcomes: [
            'How Microsoft 365 Copilot leverages LLMs and Microsoft Graph',
            'Data boundaries, tenant isolation, and enterprise permission compliance',
            'Contextual prompt engineering: Objective, Context, Source, and Expectation (OCSE)',
            'Avoiding prompt drift and hallucination traps'
          ]
        },
        {
          id: '02',
          title: 'Copilot in Office Apps: Word, PowerPoint & Outlook',
          learningOutcomes: [
            'Drafting RFP proposals from customer brief documents in Word',
            'Transforming 20-page whitepapers into 10-slide executive decks in PowerPoint',
            'Summarizing long email threads and tone coaching in Outlook',
            'Live meeting recaps and action item extraction in Microsoft Teams'
          ]
        },
        {
          id: '03',
          title: 'Advanced Copilot in Excel: Formulas, Insights & Python Integration',
          learningOutcomes: [
            'Analyzing sales spreadsheets and generating dynamic pivot tables via prompts',
            'Formula generation (XLOOKUP, INDEX/MATCH, DAX approximations)',
            'Prompt-driven charts, trend forecasting, and scenario questions',
            'Validating Copilot calculations against original data tables'
          ],
          appliedExercise: {
            title: 'Applied in Class — The 30-Minute Executive Presentation Build',
            content: 'Using a raw quarterly sales spreadsheet and three email updates, learners use Copilot to generate an executive memo in Word and a corresponding polished presentation deck in PowerPoint.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Generating a Comprehensive Enterprise RFP Response',
          content: 'Learners direct Copilot in Word to reference existing corporate case studies stored in SharePoint, draft a tailored 10-section proposal, and cross-reference compliance checklists.'
        }
      ]
    }
  },
  {
    id: 'TT0003',
    title: 'Power BI Desktop & DAX: Enterprise Business Intelligence',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Microsoft Power BI',
    vendor: 'Microsoft',
    technologyCategory: ['BI & Analytics', 'Data & Database Platform'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg',
    level: 'Intermediate',
    duration: '16 Hours',
    details: {
      summary: 'Design star-schema data models, master complex DAX calculations (CALCULATE, time intelligence), and build interactive enterprise dashboards with Power BI Service governance.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Business Intelligence Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Power BI Desktop',
        'Power Query (M Language)',
        'DAX (Data Analysis Expressions)',
        'Power BI Service & Gateway'
      ],
      objective: 'Transform raw, disparate business data into interactive executive reporting suites. This practical course takes data analysts from data ingestion and cleaning with Power Query to star-schema modeling, advanced DAX measures, row-level security (RLS), and automated cloud refreshes.',
      audience: [
        'Business Intelligence Developers',
        'Data & Reporting Analysts',
        'FP&A and Commercial Finance Analysts',
        'Operations Managers seeking visual analytics'
      ],
      prerequisitesList: [
        'Solid spreadsheet proficiency (Pivot Tables, VLOOKUP/XLOOKUP)',
        'Basic understanding of relational table relationships'
      ],
      modules: [
        {
          id: '01',
          title: 'ETL with Power Query & Dimensional Data Modeling',
          learningOutcomes: [
            'Transforming messy CSVs, SQL tables, and SharePoint lists',
            'Applying best-practice Star Schema: Fact vs. Dimension tables',
            'One-to-many relationships, bi-directional cross-filtering hazards',
            'Creating automated date/calendar tables for time-intelligence'
          ]
        },
        {
          id: '02',
          title: 'Mastering DAX: Evaluation Contexts & Calculations',
          learningOutcomes: [
            'Calculated columns vs. DAX measures',
            'Row Context vs. Filter Context and context transition',
            'The CALCULATE function, FILTER, ALL, ALLEXCEPT',
            'Time-intelligence DAX: YTD, MTD, same-period-last-year, rolling averages'
          ]
        },
        {
          id: '03',
          title: 'Interactive Visuals, UX Design & Power BI Service Deployment',
          learningOutcomes: [
            'Bookmarks, drill-through pages, custom tooltips, and slicers',
            'Designing accessible, executive-ready layouts without visual clutter',
            'Configuring Row-Level Security (RLS) for departmental governance',
            'Publishing to workspaces, scheduled gateway refreshes, and app packaging'
          ],
          appliedExercise: {
            title: 'Applied in Class — End-to-End Enterprise Sales Dashboard',
            content: 'Ingest 500,000 transaction rows, model dimensions, write 10 custom DAX measures including YoY growth, and construct an interactive 3-page executive reporting application.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Troubleshooting Broken DAX Filter Context in Regional Sales Report',
          content: 'Learners debug a client dashboard where gross margin percentages produce erroneous grand totals, identifying context transition failures and correcting the DAX formula.'
        }
      ]
    }
  },
  {
    id: 'TT0004',
    title: 'Applied Python for Data Analytics & Machine Learning',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Python Data Stack (Pandas, NumPy, Scikit-Learn)',
    vendor: 'Python / Open Source',
    technologyCategory: ['Data & Database Platform', 'AI', 'Engineering & Scientific'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
    level: 'Intermediate',
    duration: '32 Hours',
    details: {
      summary: 'Harness Python for high-performance data manipulation with Pandas, statistical visualization with Seaborn, exploratory analysis, and supervised machine learning with Scikit-Learn.',
      format: 'Technology-Based Programme',
      approach: 'Interactive Jupyter Coding Labs',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Python 3',
        'Jupyter Notebooks / VS Code',
        'Pandas & NumPy',
        'Matplotlib & Seaborn',
        'Scikit-Learn'
      ],
      objective: 'Empower analytical professionals to transcend spreadsheet file-size limits and unlock programmatic automation. Participants build robust data wrangling pipelines, engineer predictive features, train classification and regression algorithms, and evaluate real-world business accuracy.',
      audience: [
        'Data Analysts moving into Data Science',
        'Actuaries, Statisticians, and Quantitative Researchers',
        'Software Engineers expanding into Analytics & AI',
        'Technical Product Managers'
      ],
      prerequisitesList: [
        'Basic programming concepts (variables, loops, conditional logic) in any language',
        'Foundational arithmetic and statistics'
      ],
      modules: [
        {
          id: '01',
          title: 'High-Performance Data Wrangling with Pandas & NumPy',
          learningOutcomes: [
            'Vectorized operations and multi-dimensional array slicing with NumPy',
            'Pandas DataFrames: indexing, filtering, merging, and reshaping',
            'Handling missing values, outlier detection, and datetime series',
            'Grouping, aggregation, and pivot calculations on multi-million row datasets'
          ]
        },
        {
          id: '02',
          title: 'Exploratory Data Analysis (EDA) & Storytelling Visualizations',
          learningOutcomes: [
            'Statistical distribution plotting: histograms, KDEs, and boxplots',
            'Correlation matrices and pairplots using Seaborn',
            'Identifying multicollinearity and feature interactions',
            'Exporting clean visual reports for non-technical stakeholders'
          ]
        },
        {
          id: '03',
          title: 'Predictive Modeling & Applied Machine Learning with Scikit-Learn',
          learningOutcomes: [
            'Train-test splitting, cross-validation, and preventing data leakage',
            'Supervised models: Logistic Regression, Random Forests, Gradient Boosting',
            'Evaluating metrics: Precision, Recall, F1-Score, ROC-AUC, and RMSE',
            'Hyperparameter tuning using GridSearchCV and pipeline serialization'
          ],
          appliedExercise: {
            title: 'Applied in Class — Customer Churn Prediction Pipeline',
            content: 'Clean customer telecommunications dataset, engineer tenure and usage features, train a Random Forest classifier, and generate actionable retention probability scores.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Automating Monthly Operational Reconciliation',
          content: 'Learners write an end-to-end Python script that reads 50 CSV store files, cleans corrupt date formats, performs fuzzy string matching on vendor names, and exports a unified audit report.'
        }
      ]
    }
  },
  {
    id: 'TT0005',
    title: 'AWS Solutions Architecture: Cloud Scalability, Resilience & Security',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Amazon Web Services (AWS)',
    vendor: 'AWS',
    technologyCategory: ['Cloud Platform', 'DevOps & Development Tools'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    level: 'Advanced',
    duration: '32 Hours',
    details: {
      summary: 'Architect highly available, decoupled, and fault-tolerant cloud solutions on AWS adhering to the Well-Architected Framework, multi-AZ VPC design, and serverless computing.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on AWS Console & CloudFormation Labs',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'AWS VPC & Route 53',
        'EC2, Auto Scaling & ALB',
        'S3, EBS & EFS Storage',
        'RDS & Aurora Database Clusters',
        'AWS Lambda, SQS & SNS Serverless'
      ],
      objective: 'Designing enterprise-scale cloud systems requires balancing reliability, security, cost efficiency, and operational performance. This comprehensive course prepares enterprise architects and systems engineers to design resilient multi-tier architectures across AWS global infrastructure.',
      audience: [
        'Cloud Solutions Architects',
        'DevOps and Systems Engineers',
        'Enterprise Technical Leads and Architects',
        'Engineers preparing for AWS Certified Solutions Architect Associate / Professional'
      ],
      prerequisitesList: [
        'Solid grasp of IP networking, DNS, and server operating systems',
        'At least 6 months experience navigating cloud consoles'
      ],
      modules: [
        {
          id: '01',
          title: 'Global Infrastructure, Secure VPC Networking & Hybrid Connectivity',
          learningOutcomes: [
            'Multi-tier VPC layout: public, private, and isolated subnets across Multi-AZ',
            'Routing tables, NAT Gateways, Internet Gateways, and Network ACLs vs. Security Groups',
            'VPC Peering, Transit Gateway, and Direct Connect hybrid links',
            'Private endpoints with AWS PrivateLink to eliminate public internet traversal'
          ]
        },
        {
          id: '02',
          title: 'Compute Scalability, Elastic Load Balancing & Managed Storage',
          learningOutcomes: [
            'Auto Scaling Groups with target tracking and predictive scaling policies',
            'Application Load Balancers (ALB) and Network Load Balancers (NLB)',
            'S3 lifecycle rules, intelligent tiering, replication, and bucket policies',
            'EBS volume types (gp3 vs. io2) and shared EFS network storage'
          ]
        },
        {
          id: '03',
          title: 'High Availability Databases, Serverless Decoupling & Disaster Recovery',
          learningOutcomes: [
            'Multi-AZ RDS deployments, read replicas, and Aurora global databases',
            'Event-driven decoupling with Amazon SQS, SNS, and EventBridge',
            'Serverless compute with AWS Lambda and API Gateway',
            'Disaster Recovery strategies: Backup & Restore, Pilot Light, Warm Standby, Active-Active'
          ],
          appliedExercise: {
            title: 'Applied in Class — Deploying a Zero-Downtime Multi-AZ Web Application',
            content: 'Build a secure VPC from scratch, deploy redundant EC2 clusters behind an ALB with Aurora Multi-AZ MySQL backend, and test automated failure recovery.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Recovering from an Availability Zone Blackout',
          content: 'Learners simulate a catastrophic AZ failure in AWS, verifying automated health checks, Route 53 DNS failover, and database replica promotion without data loss.'
        }
      ]
    }
  },
  {
    id: 'TT0006',
    title: 'Snowflake Cloud Data Platform: Modern Data Warehousing & Architecture',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Snowflake Data Cloud',
    vendor: 'Snowflake',
    technologyCategory: ['Data & Database Platform', 'Cloud Platform'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Inc._logo.svg',
    level: 'Intermediate',
    duration: '16 Hours',
    details: {
      summary: 'Harness Snowflake multi-cluster shared data architecture, virtual warehouse scaling, zero-copy cloning, time travel, and semi-structured JSON querying.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Snowflake SQL Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Snowflake Snowsight SQL',
        'Virtual Warehouses',
        'Snowpipe (Continuous Ingestion)',
        'Zero-Copy Cloning & Time Travel',
        'Streams and Tasks'
      ],
      objective: 'Legacy data warehouses suffer from concurrency bottlenecks and rigid compute coupling. This course trains data engineers and analytics leads on Snowflake decoupled storage and compute architecture, instant elasticity, secure data sharing, and automated data pipelines.',
      audience: [
        'Data Engineers & Database Administrators',
        'Data Warehouse Architects',
        'BI Developers migrating to Snowflake',
        'Big Data Specialists'
      ],
      prerequisitesList: [
        'Proficiency in standard SQL queries (SELECT, JOIN, GROUP BY, subqueries)',
        'Familiarity with relational database warehousing concepts'
      ],
      modules: [
        {
          id: '01',
          title: 'Snowflake Architecture & Virtual Compute Management',
          learningOutcomes: [
            'Three-layer architecture: Database Storage, Query Processing, Cloud Services',
            'Sizing and configuring Virtual Warehouses: auto-suspend and auto-resume',
            'Multi-cluster warehouses for high-concurrency business peak hours',
            'Optimizing query caching (Result Cache vs. Local Disk Cache)'
          ]
        },
        {
          id: '02',
          title: 'Data Ingestion, Semi-Structured JSON & Snowpipe',
          learningOutcomes: [
            'Loading data from AWS S3, Azure Blob, and GCP buckets via Stages',
            'Querying raw JSON, Avro, and Parquet with the VARIANT data type and FLATTEN',
            'Continuous automated micro-batch ingestion using Snowpipe',
            'Copy options, file formatting, and error handling (ON_ERROR)'
          ]
        },
        {
          id: '03',
          title: 'Governance, Zero-Copy Cloning, Time Travel & Data Sharing',
          learningOutcomes: [
            'Using Time Travel for point-in-time recovery and accidental DROP undo',
            'Instant zero-copy cloning for staging environments without storage duplication',
            'Dynamic data masking and Row Access Policies (RAP) for privacy',
            'Zero-ETL secure data sharing across Snowflake accounts'
          ],
          appliedExercise: {
            title: 'Applied in Class — Production Warehouse Pipeline & Masking Setup',
            content: 'Set up an automated external stage, ingest semi-structured JSON web telemetry, flatten arrays into relational analytical views, and configure dynamic PII masking policies.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Recovering a Dropped Financial Table via Time Travel',
          content: 'A junior engineer accidentally truncates a core financial revenue table; learners use Snowflake AT and BEFORE syntax to restore the exact state 10 minutes prior without restoring from external backups.'
        }
      ]
    }
  },
  {
    id: 'TT0007',
    title: 'Databricks & Apache Spark: Modern Lakehouse Engineering',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Databricks / Apache Spark / Delta Lake',
    vendor: 'Databricks',
    technologyCategory: ['Data & Database Platform', 'AI', 'Cloud Platform'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.png',
    level: 'Advanced',
    duration: '32 Hours',
    details: {
      summary: 'Build high-throughput unified lakehouse architectures using Databricks, PySpark distributed dataframes, Delta Lake ACID transactions, and Unity Catalog governance.',
      format: 'Technology-Based Programme',
      approach: 'Interactive Databricks Notebook Labs',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Databricks Workspace',
        'Apache Spark & PySpark',
        'Delta Lake (ACID)',
        'Unity Catalog',
        'Delta Live Tables (DLT)'
      ],
      objective: 'The Lakehouse pattern unifies the reliability of data warehouses with the flexibility and machine learning readiness of data lakes. This programme trains data engineers to develop robust medallion (Bronze, Silver, Gold) streaming and batch pipelines on Databricks.',
      audience: [
        'Data Engineers and Big Data Developers',
        'Machine Learning Engineers managing feature stores',
        'Cloud Architects transitioning from Hadoop/Hive to Databricks'
      ],
      prerequisitesList: [
        'Intermediate Python or Scala knowledge',
        'Understanding of distributed computing concepts'
      ],
      modules: [
        {
          id: '01',
          title: 'Distributed Compute with Apache Spark & PySpark',
          learningOutcomes: [
            'Spark execution model: Driver, Executors, Tasks, Stages, and Jobs',
            'PySpark DataFrame APIs, Catalyst Optimizer, and Tungsten engine',
            'Managing partition skew, shuffle operations, and broadcast joins',
            'Debugging Spark UI event timelines and memory allocation'
          ]
        },
        {
          id: '02',
          title: 'Delta Lake & The Medallion Architecture',
          learningOutcomes: [
            'ACID transactions on cloud object storage using Delta transaction logs',
            'Designing the Medallion pattern: Bronze (raw), Silver (cleansed), Gold (aggregated)',
            'Schema enforcement, schema evolution, and Time Travel (RESTORE)',
            'Compacting micro-files with OPTIMIZE and Z-ORDER clustering'
          ]
        },
        {
          id: '03',
          title: 'Unity Catalog Governance & Delta Live Tables (DLT)',
          learningOutcomes: [
            'Unified data and AI governance with Unity Catalog three-level namespace',
            'Automated end-to-end data pipelines with Delta Live Tables',
            'Data quality expectations and automatic pipeline monitoring',
            'Auditing data lineage from source to machine learning models'
          ],
          appliedExercise: {
            title: 'Applied in Class — Medallion Lakehouse Pipeline Build',
            content: 'Construct a complete streaming Medallion pipeline ingesting raw IoT sensor streams into Delta Bronze, applying cleaning and deduplication in Silver, and producing business aggregation cubes in Gold.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Resolving Out-of-Memory (OOM) Errors in Large Join Job',
          content: 'Learners analyze a production PySpark job crashing with memory errors, identify severe partition skew, and apply salting and broadcast join optimizations to achieve 5x faster runtime.'
        }
      ]
    }
  },
  {
    id: 'TT0008',
    title: 'Microsoft Azure Cloud Solutions & Enterprise Infrastructure',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Microsoft Azure',
    vendor: 'Microsoft',
    technologyCategory: ['Cloud Platform', 'DevOps & Development Tools'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
    level: 'Intermediate',
    duration: '16 Hours',
    details: {
      summary: 'Architect secure, resilient enterprise workloads on Microsoft Azure using Azure Virtual Networks, Entra ID, Azure App Services, and Azure SQL Database.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Azure Portal & CLI Labs',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Azure Virtual Network (VNet)',
        'Microsoft Entra ID (Azure AD)',
        'Azure App Service & Functions',
        'Azure SQL & Cosmos DB',
        'Azure Monitor & Key Vault'
      ],
      objective: 'Enterprise organizations rely on Microsoft Azure for mission-critical IT infrastructure and seamless hybrid-cloud integration with Active Directory. This course trains IT professionals and cloud engineers in architecting scalable VNets, configuring identity-first security with Entra ID, deploying containerized App Services, and implementing automated disaster recovery.',
      audience: [
        'Azure Cloud Administrators & Engineers',
        'Solutions Architects moving to Azure',
        'Systems Administrators managing hybrid IT',
        'Candidates preparing for AZ-104 / AZ-305 certifications'
      ],
      prerequisitesList: [
        'Basic understanding of networking concepts (IP addressing, DNS)',
        'Familiarity with server virtualization and cloud computing fundamentals'
      ],
      modules: [
        {
          id: '01',
          title: 'Azure Virtual Networks (VNet) & Hybrid Connectivity',
          learningOutcomes: [
            'Designing secure VNet topologies: Hub-and-Spoke architecture',
            'Network Security Groups (NSGs) and Application Security Groups (ASGs)',
            'Azure Bastion, VPN Gateway, and ExpressRoute hybrid links',
            'Private Endpoints and Azure DNS Private Zones'
          ]
        },
        {
          id: '02',
          title: 'Identity & Access with Microsoft Entra ID & Governance',
          learningOutcomes: [
            'Role-Based Access Control (RBAC) and Custom Roles',
            'Privileged Identity Management (PIM) and just-in-time access',
            'Azure Policy enforcement, Resource Locks, and Management Groups',
            'Securing secrets and certificates with Azure Key Vault'
          ]
        },
        {
          id: '03',
          title: 'Scalable Compute, Azure SQL & Business Continuity',
          learningOutcomes: [
            'Deploying resilient multi-tier Azure App Services and Function Apps',
            'Azure SQL Database: elastic pools, failover groups, and Geo-Replication',
            'Azure Backup and Azure Site Recovery (ASR) planning',
            'Centralized diagnostics and alerting using Azure Monitor and Log Analytics'
          ],
          appliedExercise: {
            title: 'Applied in Class — Deploying a High-Availability Azure Hub-Spoke Environment',
            content: 'Provision a Hub-Spoke VNet architecture via Azure CLI, configure peering, set up an Azure Application Gateway with WAF, and connect a resilient Azure App Service backend.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Securing a Compromised Multi-Tier Azure Application',
          content: 'Participants audit an Azure subscription with public IP leaks, restrict VM management through Azure Bastion, configure Private Endpoints for backend SQL databases, and enforce Azure Policy guardrails.'
        }
      ]
    }
  },
  {
    id: 'TT0009',
    title: 'Docker & Kubernetes: Cloud-Native Containerization & Orchestration',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Kubernetes & Docker',
    vendor: 'Cloud Native Computing Foundation (CNCF)',
    technologyCategory: ['DevOps & Development Tools', 'Cloud Platform'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes.logo.svg',
    level: 'Advanced',
    duration: '32 Hours',
    details: {
      summary: 'Package microservices with multi-stage Docker builds, orchestrate high-availability clusters with Kubernetes (Pods, Deployments, Services, Ingress), and configure GitOps deployments.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Terminal & Cluster Sandbox',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Docker Engine & Docker Compose',
        'Kubernetes (kubectl)',
        'Helm Package Manager',
        'K9s Terminal UI',
        'Ingress-NGINX'
      ],
      objective: 'Containers and Kubernetes have become the de-facto standard for scalable modern cloud architectures. This intensive, production-focused bootcamp guides DevOps engineers and developers through authoring lightweight, secure Dockerfiles, managing persistent volumes, implementing zero-downtime rolling updates, and configuring autoscaling with Horizontal Pod Autoscaler (HPA).',
      audience: [
        'DevOps and Site Reliability Engineers (SRE)',
        'Backend and Full-Stack Software Developers',
        'Cloud Infrastructure Engineers',
        'Candidates preparing for CKA (Certified Kubernetes Administrator)'
      ],
      prerequisitesList: [
        'Comfortable with Linux command-line terminal navigation',
        'Understanding of basic client-server networking and ports'
      ],
      modules: [
        {
          id: '01',
          title: 'Production Docker: Multi-Stage Builds & Container Security',
          learningOutcomes: [
            'Authoring optimized, minimal Dockerfiles with multi-stage builds',
            'Container runtime isolation, non-root users, and vulnerability scanning (Trivy)',
            'Managing container storage with bind mounts and named volumes',
            'Multi-container local orchestration with Docker Compose'
          ]
        },
        {
          id: '02',
          title: 'Core Kubernetes Architecture & Workload Primitives',
          learningOutcomes: [
            'Control Plane (API Server, etcd, Scheduler) vs. Worker Node components (kubelet, kube-proxy)',
            'Pods, ReplicaSets, and Deployments: rolling updates and rollback strategies',
            'ConfigMaps and Secrets: injecting environment variables and mounting files',
            'Liveness, Readiness, and Startup Probes for self-healing resilience'
          ]
        },
        {
          id: '03',
          title: 'Cluster Networking, Services, Ingress & Helm Packaging',
          learningOutcomes: [
            'Kubernetes networking: ClusterIP, NodePort, and LoadBalancer Services',
            'Configuring Ingress controllers and TLS certificates with cert-manager',
            'Persistent Volumes (PV), Persistent Volume Claims (PVC), and StorageClasses',
            'Packaging multi-service microservice architectures with Helm Charts'
          ],
          appliedExercise: {
            title: 'Applied in Class — Zero-Downtime Microservice Deployment & Autoscaling',
            content: 'Deploy a multi-tier web and database application on Kubernetes, configure Horizontal Pod Autoscaler (HPA) under synthetic load testing, and execute a zero-downtime rolling update.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Troubleshooting CrashLoopBackOff & Resource Starvation',
          content: 'Learners investigate an unresponsive Kubernetes deployment experiencing CrashLoopBackOff and OOMKilled events, inspect container logs, correct memory limits, and fix broken database health probes.'
        }
      ]
    }
  },
  {
    id: 'TT0010',
    title: 'Tableau Desktop & Server: Visual Analytics & Executive Dashboards',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Tableau Desktop & Server',
    vendor: 'Salesforce',
    technologyCategory: ['BI & Analytics', 'Productivity & Collaboration'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Tableau_Logo.png',
    level: 'Intermediate',
    duration: '16 Hours',
    details: {
      summary: 'Design compelling visual analytics, master Level of Detail (LOD) expressions, and publish interactive executive dashboards on Tableau Server and Tableau Cloud.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Visual Analytics Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Tableau Desktop',
        'Tableau Server / Cloud',
        'Tableau Prep Builder',
        'LOD Calculations (FIXED, INCLUDE, EXCLUDE)'
      ],
      objective: 'Effective visual analytics empowers business decision-makers to spot trends, anomalies, and opportunities instantly. This course teaches business analysts and data storytellers how to prep and clean data with Tableau Prep, build advanced charts, author complex Level of Detail (LOD) expressions, and design executive dashboards that adhere to human perceptual cognitive principles.',
      audience: [
        'Business Analysts & Data Storytellers',
        'BI Developers and Reporting Specialists',
        'Marketing, Finance, and Operations Analysts',
        'Professionals preparing for Tableau Certified Data Analyst exam'
      ],
      prerequisitesList: [
        'Basic familiarity with spreadsheet data or database tables',
        'Interest in data visualization and reporting'
      ],
      modules: [
        {
          id: '01',
          title: 'Data Preparation, Relationships & Fundamental Visuals',
          learningOutcomes: [
            'Connecting to data sources, live connections vs. extracts (Hyper)',
            'Cleaning and pivoting data with Tableau Prep Builder',
            'Dimensions vs. Measures, Discrete (Blue) vs. Continuous (Green) fields',
            'Building heat maps, dual-axis charts, bullet graphs, and scatter plots'
          ]
        },
        {
          id: '02',
          title: 'Calculations, Parameters & Level of Detail (LOD) Expressions',
          learningOutcomes: [
            'Basic row-level and aggregate calculated fields',
            'Table Calculations: Quick Table Calcs, Running Total, Percent of Total, Rank',
            'Mastering Level of Detail (LOD) Expressions: FIXED, INCLUDE, and EXCLUDE',
            'Dynamic user interactivity using Parameters and Sets'
          ]
        },
        {
          id: '03',
          title: 'Dashboard UX Design, Story Points & Tableau Server Governance',
          learningOutcomes: [
            'Visual hierarchy, cognitive load principles, and color psychology',
            'Dashboard Actions: Filter, Highlight, URL, and Set Actions',
            'Designing responsive layouts for desktop, tablet, and mobile displays',
            'Publishing to Tableau Cloud, configuring scheduled data extract refreshes and permissions'
          ],
          appliedExercise: {
            title: 'Applied in Class — Executive Customer Retention Dashboard',
            content: 'Build a multi-view executive dashboard analyzing customer churn across geographic territories, incorporating FIXED LOD cohort retention curves and parameter-driven dynamic measure selectors.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Resolving LOD Granularity Mismatches in Sales Commission Report',
          content: 'Learners troubleshoot an executive report where regional sales quotas miscalculate when sliced by individual sales reps, applying a FIXED LOD calculation to maintain accurate quota baselines.'
        }
      ]
    }
  },
  {
    id: 'TT0011',
    title: 'HashiCorp Terraform: Automated Multi-Cloud Infrastructure as Code',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'HashiCorp Terraform',
    vendor: 'HashiCorp',
    technologyCategory: ['DevOps & Development Tools', 'Cloud Platform'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Terraform_Logo.svg',
    level: 'Intermediate',
    duration: '16 Hours',
    details: {
      summary: 'Provision and manage multi-cloud infrastructure declaratively using HashiCorp Configuration Language (HCL), remote state locking, reusable modules, and CI/CD pipelines.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Infrastructure Coding Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Terraform CLI',
        'HashiCorp Configuration Language (HCL)',
        'Terraform Cloud / Enterprise',
        'AWS & Azure Providers',
        'tflint & Checkov'
      ],
      objective: 'Manual infrastructure provisioning leads to human error, configuration drift, and compliance failures. This hands-on course teaches cloud engineers and systems architects how to adopt declarative Infrastructure as Code (IaC) with Terraform, manage remote state with S3/DynamoDB locks, build modular architectures, and prevent breaking changes in automated CI/CD pipelines.',
      audience: [
        'Cloud Engineers & DevOps Specialists',
        'Site Reliability Engineers (SRE)',
        'Systems Administrators adopting IaC',
        'Engineers preparing for HashiCorp Certified Terraform Associate'
      ],
      prerequisitesList: [
        'Basic familiarity with at least one major cloud provider (AWS, Azure, or GCP)',
        'Comfortable executing commands in bash or terminal'
      ],
      modules: [
        {
          id: '01',
          title: 'Declarative IaC Fundamentals & Terraform Architecture',
          learningOutcomes: [
            'Imperative vs. Declarative infrastructure management',
            'Core workflow: terraform init, plan, apply, and destroy',
            'Resource dependencies, implicit vs. explicit (depends_on)',
            'Variables, outputs, locals, and dynamic data blocks'
          ]
        },
        {
          id: '02',
          title: 'State File Management, Backends & Concurrency Locking',
          learningOutcomes: [
            'Understanding terraform.tfstate: the source of truth and drift detection',
            'Configuring secure remote backends (AWS S3 + DynamoDB locking, Azure Blob)',
            'Handling state migrations, imports of existing legacy resources, and state refresh',
            'Managing sensitive data in state files and secret integration with Vault'
          ]
        },
        {
          id: '03',
          title: 'Reusable Modules, Workspaces & Automated CI/CD Testing',
          learningOutcomes: [
            'Structuring modular architectures for VPC, databases, and compute tiers',
            'Managing multi-environment configurations using Workspaces vs. directory structures',
            'Static code analysis, linting, and policy-as-code security scanning with Checkov',
            'Automating Terraform execution within GitHub Actions and GitLab CI'
          ],
          appliedExercise: {
            title: 'Applied in Class — Provisioning an Automated Multi-Tier Cloud Environment',
            content: 'Author modular Terraform code to provision a secure VPC, RDS database cluster, and auto-scaled compute pool, complete with S3 remote state locking and automated validation tests.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Recovering from Remote State Lock Deadlock & Drift',
          content: 'Learners resolve a critical CI/CD deployment failure caused by an interrupted pipeline holding a DynamoDB state lock, audit manual out-of-band AWS console changes, and reconcile state drift.'
        }
      ]
    }
  },
  {
    id: 'TT0012',
    title: 'Git & GitHub Enterprise: Collaborative Version Control & CI/CD Actions',
    category: 'tools-technology',
    categoryBadge: 'Tool or Technology',
    toolName: 'Git & GitHub Enterprise',
    vendor: 'Microsoft / GitHub',
    technologyCategory: ['DevOps & Development Tools', 'Productivity & Collaboration'],
    toolLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    level: 'Basic',
    duration: '8 Hours',
    details: {
      summary: 'Master Git branching workflows, pull request reviews, merge conflict resolution, branch protection rules, and automated CI/CD workflows with GitHub Actions.',
      format: 'Technology-Based Programme',
      approach: 'Hands-on Repository Collaboration Lab',
      delivery: 'Instructor-Led',
      toolsCovered: [
        'Git CLI',
        'GitHub Enterprise',
        'GitHub Actions (CI/CD)',
        'GitHub Pull Requests & Code Reviews',
        'VS Code Git Lens'
      ],
      objective: 'Version control is the backbone of all modern software engineering and collaborative digital projects. This course provides developers, analysts, and technical contributors with confidence in branching strategies (GitHub Flow, Trunk-Based), resolving complex merge conflicts, enforcing branch protection governance, and automating build/test pipelines with GitHub Actions.',
      audience: [
        'Junior and Mid-Level Software Developers',
        'Data Analysts and Engineers working with code',
        'Technical Project Managers and QA Engineers',
        'IT professionals transitioning into DevOps workflows'
      ],
      prerequisitesList: [
        'No prior Git experience required',
        'Basic familiarity with code editors (VS Code) and terminal commands'
      ],
      modules: [
        {
          id: '01',
          title: 'Git Core Concepts: Working Directory, Staging & Commits',
          learningOutcomes: [
            'Understanding distributed version control vs. centralized systems',
            'The three Git trees: Working Directory, Staging Area (Index), and Repository',
            'Crafting meaningful atomic commits following Conventional Commits standards',
            'Inspecting history with git log, diff, and navigating commits with git checkout'
          ]
        },
        {
          id: '02',
          title: 'Branching Strategies, Merge Conflicts & Pull Request Reviews',
          learningOutcomes: [
            'Branching models: GitHub Flow vs. Trunk-Based Development',
            'Merging strategies: Fast-Forward, 3-Way Merge, Squash and Merge, and Rebase',
            'Diagnosing and safely resolving complex merge conflicts',
            'Conducting high-value code reviews with comments, suggestions, and approvals'
          ]
        },
        {
          id: '03',
          title: 'GitHub Enterprise Governance & Automated CI/CD Actions',
          learningOutcomes: [
            'Configuring Branch Protection Rules, required status checks, and signed commits',
            'Managing repository secrets, environments, and team access permissions',
            'Authoring basic GitHub Actions workflows (.github/workflows) for automated linting and tests',
            'Release tagging, semantic versioning, and changelog generation'
          ],
          appliedExercise: {
            title: 'Applied in Class — Simulated Team Pull Request & Conflict Resolution',
            content: 'In teams of two, create conflicting feature branches against a shared repository, open Pull Requests, review each other’s code, resolve deliberate merge conflicts, and trigger an automated GitHub Actions test pipeline.'
          }
        }
      ],
      scenarios: [
        {
          title: 'Scenario — Recovering an Accidental Hard Reset with Git Reflog',
          content: 'A developer accidentally runs git reset --hard and loses an unmerged feature branch; learners use git reflog to trace the commit SHA and restore the lost code in under 5 minutes.'
        }
      ]
    }
  }
];
