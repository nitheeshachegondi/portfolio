/* =====================================================================
   THE ONE SOURCE OF TRUTH
   Everything the portfolio ever says about you comes from this file.
   The matcher never invents claims — it only re-reads what is here.

   How to edit:
   - skills      → things you have directly done  (level: STRONG)
                    `projects: []` + `unlinked: true` = stated on resume, but no
                    project proof attached yet. In Strict mode these are
                    downgraded to PARTIAL until you link a project.
   - bridges     → related skills you have used under a different name (TRANSFERABLE)
   - partials    → some exposure, not depth (PARTIAL)
   - gaps        → things you have NOT done (NOT DEMONSTRATED)
   Anything the JD asks for that is in none of these is also shown as
   "not demonstrated" — the default is honesty.
   ===================================================================== */
window.PROFILE = {
  name: "Nitheesha Chegondi",
  title: "AI Product Builder · Full Stack Developer · Generative AI Builder",
  location: "West Godavari, Andhra Pradesh, India",
  openTo: "Remote roles in AI Product, Product Development, Technical Product and early-stage technology teams.",
  summary:
    "I take ideas from product concept and feature definition to working MVPs, combining development with product thinking, AI experimentation and deployment. I built Kaizoi (interview preparation) and PromptPocket (prompt management and optimization).",

  // Fill these in — empty ones are hidden automatically.
  links: {
    email: "",
    linkedin: "",
    github: "",
    portfolio: "",
    kaizoi: "https://kaizoi.in",
    promptpocket: "https://promptpocket.in"
  },

  formalExperience: { from: "Nov 2025", to: "Aug 2026", label: "about nine months in a formal role, plus project work" },

  education: "B.Tech, Electronics & Communication Engineering — Swarnandhra College of Engineering & Technology (2019–2023)",
  certifications: [
    "ChatGPT Prompt Engineering for Developers",
    "Career Essentials in Generative AI — Microsoft + LinkedIn",
    "HubSpot Marketing Software Certification",
    "Additional AI/ML certifications"
  ],

  /* ----------------------------- PROJECTS ----------------------------- */
  projects: [
    {
      id: "kaizoi",
      name: "Kaizoi",
      kind: "Interview Preparation Platform",
      role: "Founder & Product Builder",
      url: "https://kaizoi.in",
      tagline: "An interview-preparation product built around structured career and interview workflows.",
      did: [
        "Defined the product concept and planned the features",
        "Designed the user flows",
        "Built the web app with AI-powered functionality",
        "Deployed and launched it"
      ],
      story: [
        { label: "Idea", text: "Help people prepare for interviews through structured career and interview workflows instead of scattered tips." },
        { label: "Product", text: "Turned the idea into a feature plan and user flows — what a person does first, next, and last." },
        { label: "Build", text: "Developed the web product end-to-end with AI-powered functionality." },
        { label: "Ship", text: "Deployed it and put it live at kaizoi.in." }
      ],
      note: "my 0→1 product",
      evidence: []   // e.g. { type:"link", label:"Live site", href:"https://kaizoi.in" }, { type:"image", src:"assets/kaizoi-1.png", label:"Home" }
    },
    {
      id: "promptpocket",
      name: "PromptPocket",
      kind: "AI Prompt Management & Optimization",
      role: "Founder & Product Builder",
      url: "https://promptpocket.in",
      tagline: "Save, organize, reuse and optimize prompts across AI platforms.",
      did: [
        "Built prompt saving, organizing and reuse",
        "Worked on prompt-optimization workflows",
        "Integrated AI APIs and shaped the user experience",
        "Deployed it"
      ],
      story: [
        { label: "Problem", text: "Good prompts get lost and rewritten again and again across AI tools." },
        { label: "Product", text: "A place to save, organize and reuse prompts, with optimization built in." },
        { label: "Build", text: "Prompt-optimization workflows, AI/API integration and product functionality." },
        { label: "Ship", text: "Deployed at promptpocket.in." }
      ],
      note: "solving my own annoyance",
      evidence: []
    },
    {
      id: "resumefixit",
      name: "ResumeFixit",
      kind: "AI ATS Resume Optimization",
      role: "Builder",
      url: "",
      tagline: "Resume optimization aimed at 90+ ATS scores, with keyword-gap analysis against a job description.",
      did: [
        "Built resume parsing and enhancement workflows",
        "Built keyword-gap analysis against job descriptions",
        "Built editable resume sections and ATS-compliant PDF generation",
        "Deployed to production on Vercel"
      ],
      story: [
        { label: "Goal", text: "Target 90+ ATS scores by closing the keyword gap between a resume and a job description." },
        { label: "Build", text: "Parsing, enhancement, editable sections and ATS-compliant PDF output." },
        { label: "Ship", text: "Running in production on Vercel." }
      ],
      note: "a JD-matching idea — sound familiar?",
      evidence: []
    },
    {
      id: "growthflow",
      name: "GrowthFlow AI",
      kind: "Multi-Agent WhatsApp Business Automation",
      role: "Designer & Builder",
      url: "",
      tagline: "Three cooperating AI agents for lead conversion, missed-call recovery and reputation management.",
      did: [
        "Designed a 3-agent system (lead conversion, missed-call recovery, reputation management)",
        "Integrated Twilio WhatsApp automation",
        "Implemented urgency detection and real-time business alerts",
        "Built customer-interaction dashboards and the SaaS pricing/deployment architecture"
      ],
      story: [
        { label: "Problem", text: "Small businesses lose leads to missed calls and slow replies." },
        { label: "Design", text: "Split the work across three agents, each with one job." },
        { label: "Build", text: "Twilio WhatsApp integration, urgency detection, real-time alerts and dashboards." },
        { label: "Business", text: "Worked out SaaS pricing and deployment architecture." }
      ],
      note: "agents with one job each",
      evidence: []
    },
    {
      id: "truthlens",
      name: "TruthLens",
      kind: "Fine-Tuned Model for Hallucination Detection",
      role: "Builder",
      url: "",
      tagline: "Gemma 3 4B fine-tuned with LoRA to label answers GROUNDED or HALLUCINATED.",
      did: [
        "Fine-tuned Gemma 3 4B with LoRA and Unsloth on the HaluEval dataset",
        "Built an inference pipeline returning GROUNDED vs. HALLUCINATED",
        "Published open-source weights on Hugging Face",
        "Reduced training loss by 47% on Kaggle GPU infrastructure"
      ],
      story: [
        { label: "Question", text: "Can a small model learn to tell grounded answers from hallucinated ones?" },
        { label: "Train", text: "LoRA + Unsloth on HaluEval, on Kaggle GPUs." },
        { label: "Result", text: "Training loss down 47%; an inference pipeline that returns GROUNDED or HALLUCINATED." },
        { label: "Share", text: "Weights published openly on Hugging Face." }
      ],
      note: "my deepest ML work so far",
      evidence: []
    },
    {
      id: "claims",
      name: "Multi-Modal Claim Verification",
      kind: "Hackathon Project",
      role: "Builder",
      url: "",
      tagline: "Verifies insurance damage claims from images, conversations and user history.",
      did: [
        "Built an AI pipeline combining images, conversations and user history",
        "Structured claim extraction and risk assessment",
        "Predicted claim status"
      ],
      story: [
        { label: "Problem", text: "Damage claims arrive as photos, chats and history — scattered evidence." },
        { label: "Build", text: "One pipeline: structured claim extraction, risk assessment, status prediction." }
      ],
      note: "built against the clock",
      evidence: []
    },
    {
      id: "secondbrain",
      name: "Second Brain",
      kind: "AI Knowledge Management",
      role: "Builder",
      url: "",
      tagline: "Turns unstructured notes into structured wiki pages and a knowledge graph.",
      did: [
        "Built note organization that converts raw notes into structured wiki pages",
        "Implemented AI content classification",
        "Generated a knowledge graph for searchable personal knowledge"
      ],
      story: [
        { label: "Problem", text: "Notes pile up unstructured and become unsearchable." },
        { label: "Build", text: "AI classification, wiki-page structuring and knowledge-graph generation." }
      ],
      note: "",
      evidence: []
    },
    {
      id: "nexsphere",
      name: "NexSphere Edu Labs",
      kind: "Work · Strategic Partnerships Officer & Digital Engagement Specialist (Nov 2025 – Aug 2026)",
      role: "Strategic Partnerships Officer & Digital Engagement Specialist",
      url: "",
      tagline: "Joined while the digital presence was still being built — designed it, built it, ran it, and brought ideas nobody had briefed.",
      did: [
        "Developed and maintained company websites, landing pages, and digital platforms supporting business growth initiatives.",
        "Designed and implemented digital automation workflows for lead generation, customer engagement, and marketing operations.",
        "Built AI-assisted content generation workflows that improved campaign execution speed and reduced manual effort.",
        "Collaborated directly with leadership to identify business problems and deliver technology-driven solutions using web and AI technologies.",
        "Managed end-to-end deployment and optimization of web assets, analytics tracking, and user engagement funnels.",
        "Ran campaigns across Instagram, Meta and LinkedIn. (From my CIO's reference letter.)",
        "Brought proposals of my own rather than waiting to be briefed — several were better than what the team had been doing. (From my CIO's reference letter.)"
      ],
      story: [
        { label: "Arrival", text: "I joined when much of the digital presence was still being built." },
        { label: "Build", text: "Designed, built and integrated the websites and landing pages." },
        { label: "Run", text: "Ran campaigns across Instagram, Meta and LinkedIn, with AI-assisted content workflows to speed up execution." },
        { label: "Ideas", text: "Thought seriously about how we engaged audiences digitally and brought proposals of my own instead of waiting for a brief." },
        { label: "Operate", text: "Managed deployment, analytics tracking and engagement funnels, and worked directly with leadership on business problems." }
      ],
      note: "where the ideas started",
      evidence: []
    }
  ],

  /* ------------------------- STRONG: directly done ------------------------ */
  skills: [
    { id: "python", label: "Python", aliases: ["python"], projects: ["truthlens", "claims"],
      note: "I use Python for model training, inference pipelines and AI workflows." },
    { id: "javascript", label: "JavaScript", aliases: ["javascript", "ecmascript", "es6"], projects: ["kaizoi", "promptpocket", "nexsphere"],
      note: "JavaScript is my day-to-day language for web products." },
    { id: "typescript", label: "TypeScript", aliases: ["typescript"], projects: ["resumefixit", "promptpocket"],
      note: "I build typed Next.js apps in TypeScript." },
    { id: "react", label: "React", aliases: ["react", "react.js", "reactjs"], notIf: /react[\s-]?native/i, projects: ["resumefixit", "promptpocket", "kaizoi"],
      note: "I build interfaces in React and Next.js." },
    { id: "nextjs", label: "Next.js", aliases: ["next.js", "nextjs", "next js"], projects: ["resumefixit", "promptpocket", "kaizoi"],
      note: "Next.js is the framework behind my shipped products." },
    { id: "frontend", label: "HTML / CSS / Tailwind", aliases: ["html", "html5", "css", "css3", "tailwind", "tailwind css", "responsive design"], projects: ["nexsphere", "kaizoi"],
      note: "I write the markup and styling for websites and landing pages myself." },
    { id: "webdev", label: "Web development", aliases: ["web development", "web developer", "full stack", "full-stack", "fullstack", "frontend", "front-end", "web application", "web app", "landing page", "website", "web platform", "web design", "website design", "web designer", "digital presence"],
      projects: ["nexsphere", "kaizoi", "promptpocket", "resumefixit"],
      note: "I build and ship full-stack web products and marketing sites — and at NexSphere I designed, built and integrated the company's websites and landing pages.", ref: true },
    { id: "backend", label: "Backend (FastAPI, Node.js, Express)", aliases: ["backend", "back-end", "fastapi", "node.js", "nodejs", "node", "express", "express.js"], projects: [], unlinked: true,
      note: "FastAPI and Node/Express are on my resume as working tools." },
    { id: "sql", label: "SQL", aliases: ["sql"], projects: [], unlinked: true,
      note: "SQL is on my resume as a working language." },
    { id: "apis", label: "API integration", aliases: ["api", "rest api", "restful", "api integration", "third-party integration", "integrations"], projects: ["promptpocket", "growthflow"],
      note: "I integrate AI and messaging APIs into products." },
    { id: "llm", label: "LLM applications", aliases: ["llm", "large language model", "generative ai", "genai", "gen ai", "gpt", "chatgpt", "ai application", "ai-powered", "ai powered", "ai", "openai", "openai api", "gemini", "gemini api", "groq"],
      projects: ["kaizoi", "promptpocket", "resumefixit", "growthflow"],
      note: "I build LLM-powered products with the Gemini, OpenAI and Groq APIs." },
    { id: "prompt", label: "Prompt engineering", aliases: ["prompt engineering", "prompt design", "prompting", "prompts", "prompt optimization"], projects: ["promptpocket"],
      note: "I built a product around prompt optimization and hold a prompt-engineering certification." },
    { id: "langchain", label: "LangChain", aliases: ["langchain"], projects: [], unlinked: true,
      note: "LangChain is on my resume as a working tool." },
    { id: "rag", label: "RAG & vector databases", aliases: ["rag", "retrieval augmented generation", "retrieval-augmented generation", "vector database", "vector db", "vector store", "embeddings", "semantic search"], projects: [], unlinked: true,
      note: "RAG and vector databases are on my resume as working tools." },
    { id: "finetune", label: "Fine-tuning (LoRA, Unsloth, Hugging Face)", aliases: ["fine-tuning", "fine tuning", "finetuning", "fine-tune", "lora", "peft", "unsloth", "hugging face", "huggingface", "gemma", "model training", "open-source models", "open source models"],
      projects: ["truthlens"],
      note: "I fine-tuned Gemma 3 4B with LoRA and Unsloth, cut training loss by 47%, and published the weights on Hugging Face." },
    { id: "evals", label: "Hallucination detection & evaluation", aliases: ["hallucination", "hallucinations", "llm evaluation", "model evaluation", "evals", "grounding", "ai safety", "trust and safety"], projects: ["truthlens"],
      note: "TruthLens classifies answers as GROUNDED or HALLUCINATED." },
    { id: "agents", label: "AI agents", aliases: ["ai agent", "agents", "agentic", "multi-agent", "multi agent", "agent workflows", "agent orchestration"], projects: ["growthflow"],
      note: "I designed a three-agent system where each agent has one job." },
    { id: "multimodal", label: "Multi-modal AI", aliases: ["multimodal", "multi-modal", "vision language", "image and text"], projects: ["claims"],
      note: "I built a pipeline that reasons over images, conversations and user history." },
    { id: "kgraph", label: "Knowledge graphs", aliases: ["knowledge graph", "knowledge graphs", "knowledge management", "wiki"], projects: ["secondbrain"],
      note: "Second Brain generates a knowledge graph from unstructured notes." },
    { id: "whatsapp", label: "Twilio & WhatsApp automation", aliases: ["twilio", "whatsapp", "sms automation", "messaging automation"], projects: ["growthflow"],
      note: "I integrated Twilio WhatsApp automation with urgency detection and real-time alerts." },
    { id: "automation", label: "Workflow automation", aliases: ["automation", "automated workflow", "workflow automation", "digital automation", "automate", "automating"], projects: ["nexsphere", "growthflow"],
      note: "I designed automation workflows for lead generation, engagement and marketing operations." },
    { id: "leadgen", label: "Lead generation & customer engagement", aliases: ["lead generation", "lead gen", "lead conversion", "customer engagement", "marketing operations", "marketing automation", "engagement funnel"], projects: ["nexsphere", "growthflow"],
      note: "I built lead-generation and engagement workflows at NexSphere and lead-conversion agents in GrowthFlow." },
    { id: "aicontent", label: "AI-assisted content workflows", aliases: ["ai content", "content generation", "ai-assisted content", "ai generated content", "content automation"], projects: ["nexsphere"],
      note: "I built AI-assisted content workflows that sped up campaign execution and reduced manual effort." },
    { id: "deploy", label: "Deployment (Vercel)", aliases: ["deployment", "deploying", "deploy", "vercel", "production", "hosting"], projects: ["resumefixit", "kaizoi", "nexsphere"],
      note: "I deploy and optimize web assets myself, including production deployments on Vercel." },
    { id: "firebase", label: "Firebase", aliases: ["firebase"], projects: [], unlinked: true, note: "Firebase is on my resume as a working tool." },
    { id: "docker", label: "Docker", aliases: ["docker", "containers", "containerization"], projects: [], unlinked: true, note: "Docker is on my resume as a working tool." },
    { id: "git", label: "Git & GitHub", aliases: ["git", "github", "version control"], projects: [], unlinked: true, note: "Git and GitHub are on my resume as working tools." },
    { id: "postman", label: "Postman", aliases: ["postman", "api testing"], projects: [], unlinked: true, note: "Postman is on my resume as a working tool." },
    { id: "productbuild", label: "Product building (concept → MVP)", aliases: ["product development", "product thinking", "product sense", "mvp", "0 to 1", "zero to one", "0-to-1", "user flows", "feature definition", "feature planning", "product builder", "prototyping", "rapid prototyping", "prototype", "product management", "product manager", "technical product", "ai product", "product engineer"],
      projects: ["kaizoi", "promptpocket", "resumefixit"],
      note: "I take ideas from concept and feature definition to a working, deployed MVP." },
    { id: "ownership", label: "Ownership & early-stage execution", aliases: ["ownership", "end-to-end", "end to end", "self-starter", "self starter", "founder", "startup", "start-up", "early-stage", "early stage", "entrepreneurial", "autonomy", "autonomous", "independently"],
      projects: ["kaizoi", "promptpocket"],
      note: "I founded and built Kaizoi and PromptPocket myself, from concept to launch." },
    { id: "leadership-collab", label: "Working with leadership", aliases: ["stakeholder", "stakeholders", "leadership team", "work with leadership", "business problems"], projects: ["nexsphere"],
      note: "I worked directly with leadership to identify business problems and deliver technology-driven solutions." },
    { id: "hackathon", label: "Hackathons", aliases: ["hackathon", "hackathons"], projects: ["claims"],
      note: "I build under time pressure in hackathons, such as the multi-modal claim verification project." },
    /* ---- Backed by my CIO's reference letter (ref: true) ---- */
    { id: "campaigns", label: "Running campaigns (Instagram, Meta, LinkedIn)",
      aliases: ["campaigns", "campaign execution", "running campaigns", "social media campaigns", "social media", "social media marketing", "social media management", "instagram", "digital marketing", "digital campaigns"],
      projects: ["nexsphere"], ref: true,
      note: "I ran campaigns across Instagram, Meta and LinkedIn, and built AI-assisted content workflows that sped up campaign execution." },
    { id: "digeng", label: "Digital audience engagement",
      aliases: ["digital engagement", "audience engagement", "user engagement", "community engagement", "engage audiences", "engaging audiences"],
      projects: ["nexsphere"], ref: true,
      note: "My title was Digital Engagement Specialist. I thought seriously about how we engaged audiences digitally and built the funnels and workflows behind it." },
    { id: "ideas", label: "Originating ideas & strategy proposals",
      aliases: ["ideas", "idea generation", "new ideas", "original ideas", "fresh ideas", "bring ideas", "contribute ideas", "creative thinking", "creativity", "strategy proposals", "proactive", "self-directed", "creative ideas", "creative problem solving"],
      projects: ["nexsphere", "kaizoi", "promptpocket"], ref: true,
      note: "I brought proposals of my own rather than waiting to be briefed, and several were better than what the team had been doing." },
    { id: "reliable", label: "Professional, reliable, good with colleagues",
      aliases: ["reliable", "reliability", "deadlines", "meet deadlines", "timelines", "professionalism", "team player", "teamwork", "collaboration", "collaborate", "cross-functional", "cross functional", "work well with", "dependable", "time management"],
      projects: ["nexsphere"], ref: true,
      note: "My CIO's reference describes my conduct as professional, my working relationships as good, and me as reliable on timelines." }
  ],

  /* ----------------- TRANSFERABLE: related, different name ---------------- */
  bridges: [
    { id: "t-positioning", label: "Content positioning & storytelling", aliases: ["content positioning", "positioning", "storytelling", "messaging", "brand voice", "brand", "narrative", "content strategy"],
      projects: ["kaizoi", "promptpocket", "nexsphere"],
      bridge: "I shaped how Kaizoi and PromptPocket are explained to users, and built AI-assisted content workflows at NexSphere. I have not owned a formal content-strategy function." },
    { id: "t-campaign", label: "Conversion-focused creative", aliases: ["conversion", "conversion-focused", "conversion focused", "creative", "copywriting", "copy"],
      projects: ["kaizoi", "nexsphere"],
      bridge: "I made product and landing-page choices aimed at clarity and engagement, but I have not run controlled conversion experiments." },
    { id: "t-nlp", label: "NLP / document parsing", aliases: ["nlp", "natural language processing", "text classification", "document parsing", "resume parsing", "information extraction", "text analytics"],
      projects: ["resumefixit", "secondbrain", "claims"],
      bridge: "I built resume parsing, note classification and structured claim extraction — applied NLP inside products rather than research." },
    { id: "t-chatbot", label: "Conversational AI", aliases: ["chatbot", "chatbots", "conversational ai", "virtual assistant", "voice assistant"],
      projects: ["growthflow", "kaizoi"],
      bridge: "I built agents that converse with customers over WhatsApp. I have not built a standalone chatbot platform." },
    { id: "t-degree", label: "Degree requirement", aliases: ["bachelor's degree", "bachelors degree", "bachelor", "bachelor's", "b.tech", "btech", "degree", "computer science", "engineering degree"],
      projects: [],
      bridge: "my degree is a B.Tech in Electronics & Communication Engineering (2019–2023) — an engineering degree, not Computer Science itself." },
    { id: "t-comm", label: "Communication", aliases: ["communication", "communication skills", "written communication", "verbal communication"],
      projects: ["nexsphere"],
      bridge: "I worked directly with leadership at NexSphere to turn business problems into delivered solutions." },
    { id: "t-problem", label: "Problem solving", aliases: ["problem solving", "problem-solving", "analytical", "critical thinking"],
      projects: ["nexsphere", "truthlens"],
      bridge: "I took business problems to shipped solutions at NexSphere and worked through training problems in TruthLens (loss reduced by 47%)." },
    { id: "t-learn", label: "Learning quickly", aliases: ["fast learner", "learn quickly", "quick learner", "self-learner", "curious", "willingness to learn", "eager to learn", "fast-paced", "fast paced"],
      projects: ["truthlens", "growthflow", "claims"],
      bridge: "I have picked up very different stacks across projects — LoRA fine-tuning, WhatsApp agents, multi-modal pipelines." },
    { id: "t-gen", label: "Software engineering", aliases: ["software engineer", "software developer", "software engineering", "software development", "programming", "coding"],
      projects: ["kaizoi", "resumefixit", "growthflow"],
      bridge: "I ship working software end-to-end, though my formal engineering role is under a year and mostly project-based." }
  ],

  /* ----------------------- PARTIAL: some exposure ------------------------ */
  partials: [
    { id: "p-ml", label: "Machine learning", aliases: ["machine learning", "ml", "deep learning", "data science", "ai/ml", "artificial intelligence", "neural network", "neural networks"],
      projects: ["truthlens"],
      note: "I have fine-tuned a Gemma 3 4B model with LoRA and built classification pipelines.",
      growth: "I have not done classical ML, feature engineering or production MLOps." },
    { id: "p-analytics", label: "Analytics", aliases: ["analytics", "google analytics", "web analytics", "tracking", "funnel analytics", "metrics", "kpi", "kpis", "data analysis", "data-driven", "data driven", "dashboards", "reporting"],
      projects: ["nexsphere"],
      note: "I set up analytics tracking and engagement funnels at NexSphere and built customer-interaction dashboards in GrowthFlow.",
      growth: "I have not done deep product analysis or experiment design." },
    { id: "p-crm", label: "CRM / HubSpot", aliases: ["hubspot", "crm", "marketing software"],
      projects: ["nexsphere"],
      note: "I hold a HubSpot Marketing Software certification and built lead workflows.",
      growth: "I have not administered a CRM at scale." },
    { id: "p-campstrat", label: "Campaign & marketing strategy", aliases: ["campaign strategy", "campaign management", "marketing strategy", "digital strategy", "strategy", "growth marketing", "marketing"],
      projects: ["nexsphere"],
      note: "I ran campaigns across Instagram, Meta and LinkedIn and brought strategy ideas of my own, several better than what the team had been doing.",
      growth: "I have not documented owning a campaign budget or formal strategy planning at scale." },
    { id: "p-paidsocial", label: "Paid social", aliases: ["meta ads", "facebook ads", "paid social", "social ads", "linkedin ads", "instagram ads"],
      projects: ["nexsphere"],
      note: "I ran campaigns across Instagram, Meta and LinkedIn.",
      growth: "I have not shown ad-spend management or ROAS reporting here." },
    { id: "p-partner", label: "Strategic partnerships", aliases: ["strategic partnerships", "partnerships", "partnership", "partner management", "business development"],
      projects: ["nexsphere"],
      note: "My title at NexSphere Edu Labs was Strategic Partnerships Officer & Digital Engagement Specialist (Nov 2025 – Aug 2026), and I collaborated directly with leadership.",
      growth: "The work I can evidence in detail is on the digital-engagement side; I have not documented a partnerships deal pipeline." },
    { id: "p-ux", label: "UX / user flows", aliases: ["ux", "user experience", "ui/ux", "ui design", "ux design", "user interface"],
      projects: ["kaizoi", "promptpocket"],
      note: "I designed user flows and interfaces for my own products.",
      growth: "I have no formal UX research practice or design-tool portfolio." },
    { id: "p-cloud", label: "Cloud deployment", aliases: ["cloud", "serverless", "scalable systems", "scalability"],
      projects: ["resumefixit"],
      note: "I deploy to Vercel and use Firebase and Docker.",
      growth: "I have not worked on AWS, Azure or GCP infrastructure." },
    { id: "p-years", label: "Years of experience", aliases: [], projects: ["nexsphere"],
      note: "My formal role ran Nov 2025 – Aug 2026; the rest of my experience is project work.",
      growth: "" }
  ],

  /* ----------------------- GAPS: not demonstrated ------------------------ */
  gaps: [
    { id: "g-aws", group: "Cloud & DevOps", label: "AWS / Azure / GCP", aliases: ["aws", "amazon web services", "azure", "gcp", "google cloud"], near: "I deploy on Vercel and use Docker — not these clouds." },
    { id: "g-k8s", group: "Cloud & DevOps", label: "Kubernetes", aliases: ["kubernetes", "k8s", "helm"] },
    { id: "g-cicd", group: "Cloud & DevOps", label: "CI/CD pipelines", aliases: ["ci/cd", "cicd", "jenkins", "github actions", "gitlab ci", "devops", "terraform", "infrastructure as code"], near: "I ship through Vercel deployments, which is not the same as owning pipelines." },
    { id: "g-mlops", group: "Data & MLOps", label: "MLOps / model serving at scale", aliases: ["mlops", "model serving", "model deployment at scale", "feature store", "mlflow", "kubeflow"] },
    { id: "g-torch", group: "Data & MLOps", label: "PyTorch / TensorFlow", aliases: ["pytorch", "tensorflow", "keras", "jax"], near: "I fine-tuned with Unsloth and Hugging Face tooling (TruthLens)." },
    { id: "g-cv", group: "Data & MLOps", label: "Computer vision", aliases: ["computer vision", "opencv", "object detection", "image classification", "yolo"], near: "I used images as one input in a multi-modal claims pipeline." },
    { id: "g-bigdata", group: "Data & MLOps", label: "Big data & pipelines", aliases: ["spark", "hadoop", "airflow", "kafka", "snowflake", "bigquery", "dbt", "etl", "data pipeline", "data pipelines", "data engineering"] },
    { id: "g-bi", group: "Data & MLOps", label: "BI tools", aliases: ["tableau", "power bi", "looker"] },
    { id: "g-db", group: "Databases", label: "Postgres / MySQL / MongoDB / Redis", aliases: ["postgres", "postgresql", "mysql", "mongodb", "redis", "dynamodb", "nosql", "database design"], near: "SQL is on my resume, but I do not have a database-heavy project to show." },
    { id: "g-lang", group: "Other languages & frameworks", label: "Java / C# / Go / Rust / PHP / Ruby", aliases: ["java", "c#", ".net", "golang", "rust", "php", "ruby", "scala", "kotlin", "laravel", "rails", "ruby on rails"] },
    { id: "g-fw", group: "Other languages & frameworks", label: "Django / Flask / Spring / Angular / Vue / GraphQL", aliases: ["django", "flask", "spring", "spring boot", "angular", "vue", "vue.js", "graphql", "svelte"] },
    { id: "g-mobile", group: "Mobile", label: "Mobile development", aliases: ["android", "ios", "swift", "flutter", "react native", "mobile development", "mobile app"] },
    { id: "g-ads", group: "Marketing & design", label: "Paid advertising", aliases: ["google ads", "ppc", "sem", "paid media", "paid ads", "paid advertising", "performance marketing", "ad spend", "media buying"], near: "I ran campaigns across Instagram, Meta and LinkedIn, but I have not shown ad-spend management." },
    { id: "g-seo", group: "Marketing & design", label: "SEO", aliases: ["seo", "search engine optimization", "keyword research"] },
    { id: "g-design", group: "Marketing & design", label: "Design tools & visual design", aliases: ["figma", "photoshop", "illustrator", "canva", "adobe", "video editing", "motion graphics", "graphic design", "user research"] },
    { id: "g-sales", group: "Marketing & design", label: "Sales platforms", aliases: ["salesforce", "sales engineering", "account management", "enterprise sales"] },
    { id: "g-process", group: "Process & teams", label: "Agile / Scrum / Jira", aliases: ["agile", "scrum", "jira", "kanban", "sprint planning"] },
    { id: "g-people", group: "Process & teams", label: "People management", aliases: ["people management", "manage a team", "managing a team", "direct reports", "mentoring engineers", "team lead", "engineering manager"] },
    { id: "g-arch", group: "Process & teams", label: "System design at scale / microservices", aliases: ["microservices", "system design", "distributed systems", "high availability", "event-driven"] },
    { id: "g-test", group: "Process & teams", label: "Formal testing & QA", aliases: ["unit testing", "unit tests", "test automation", "qa", "quality assurance", "selenium", "cypress", "jest", "tdd"] },
    { id: "g-dsa", group: "Process & teams", label: "Competitive algorithms", aliases: ["data structures", "algorithms", "leetcode", "competitive programming"] },
    { id: "g-adv", group: "Process & teams", label: "Advanced degree", aliases: ["master's", "masters degree", "master's degree", "phd", "ph.d", "m.s.", "m.tech", "doctorate"] }
  ],

  /* ===================== REFERENCE (from my CIO, NexSphere Edu Labs) =====================
     Word for word. `highlights` are phrases (must appear exactly in the paragraphs) that get lit up. */
  reference: {
    from: "Chief Information Officer",
    org: "NexSphere Edu Labs",
    paragraphs: [
      "Nitheesha joined at a point when much of our digital presence was still being built. She designed, built and integrated our websites and landing pages, and she ran our campaigns across Instagram, Meta and LinkedIn.",
      "Where she stood out most, though, was in ideas. She thought seriously about how we engaged our audiences digitally and brought proposals of her own rather than waiting to be briefed, several of which were better than what we had been doing. Her conduct throughout was professional, she worked well with colleagues, and she was reliable on timelines.",
      "On that basis I am glad to recommend her for roles in web design and development, digital marketing, or digital engagement. She would suit an organisation that wants someone contributing ideas to the strategy rather than only executing against a brief.",
      "I am happy to respond to any specific queries from prospective employers or academic institutions."
    ],
    highlights: [
      "designed, built and integrated our websites and landing pages",
      "ran our campaigns across Instagram, Meta and LinkedIn",
      "ideas",
      "brought proposals of her own rather than waiting to be briefed",
      "several of which were better than what we had been doing",
      "reliable on timelines",
      "contributing ideas to the strategy rather than only executing against a brief"
    ],
    tells: [
      { h: "Ideas before briefs", t: "“Brought proposals of her own rather than waiting to be briefed, several of which were better than what we had been doing.”", s: "Source: CIO reference" },
      { h: "Built it. Ran it.", t: "Websites and landing pages designed, built and integrated — then campaigns run across Instagram, Meta and LinkedIn.", s: "Source: CIO reference + my resume" },
      { h: "Reliable on timelines", t: "Professional throughout, good with colleagues, and on time. Creative people who ship are rarer than creative people.", s: "Source: CIO reference (the last sentence is mine)" }
    ],
    receipts: [
      { said: "designed, built and integrated our websites and landing pages",
        mine: "Developed and maintained company websites, landing pages, and digital platforms supporting business growth initiatives.",
        status: "same", note: "" },
      { said: "ran our campaigns across Instagram, Meta and LinkedIn",
        mine: "Built AI-assisted content generation workflows that improved campaign execution speed and reduced manual effort.",
        status: "only", note: "My resume covers the content workflows behind campaign execution. The Instagram, Meta and LinkedIn campaigns themselves come from the reference." },
      { said: "brought proposals of her own rather than waiting to be briefed",
        mine: "Collaborated directly with leadership to identify business problems and deliver technology-driven solutions using web and AI technologies.",
        status: "rel", note: "Related, not identical: the resume says I worked with leadership on problems; the reference adds that the ideas were mine." },
      { said: "professional, she worked well with colleagues, and she was reliable on timelines",
        mine: "Not a resume line — this is a colleague’s observation.",
        status: "only", note: "" },
      { said: "roles in web design and development, digital marketing, or digital engagement",
        mine: "NexSphere Edu Labs | Strategic Partnerships Officer & Digital Engagement Specialist, Nov 2025 – Aug 2026",
        status: "rel", note: "" }
    ]
  },

  /* ===================== THE FULL RESUME, WORD FOR WORD ===================== */
  resume: {
    name: "Nitheesha Chegondi",
    headline: "AI Product Builder | Full Stack Developer | Generative AI Builder",
    contact: { location: "West Godavari, Andhra Pradesh", labels: ["Email", "LinkedIn", "GitHub", "Portfolio"] },
    summary: [
      "AI Product Builder and Full-Stack Developer with hands-on experience building and launching AI-powered products and web applications. Built Kaizoi, an interview-preparation platform, and PromptPocket, an AI prompt management and optimization product, alongside experience with React, Next.js, Python, FastAPI, LLM applications, AI workflows and APIs.",
      "Experienced in taking ideas from product concept and feature definition to working MVPs, combining technical development with product thinking, AI experimentation and deployment. Interested in remote opportunities in AI Product, Product Development, Technical Product and early-stage technology teams."
    ],
    skills: [
      ["Programming", "Python, JavaScript, TypeScript, SQL"],
      ["Frontend", "React.js, Next.js, HTML5, CSS3, Tailwind CSS"],
      ["Backend", "FastAPI, Node.js, Express.js"],
      ["AI / ML", "Gemini API, OpenAI API, Groq, LangChain, RAG, Prompt Engineering, LoRA Fine-Tuning, Unsloth, Hugging Face, Vector Databases"],
      ["Tools", "Git, GitHub, Vercel, Firebase, Twilio, Docker, Postman"]
    ],
    experience: [
      { org: "NexSphere Edu Labs", role: "Strategic Partnerships Officer & Digital Engagement Specialist", dates: "Nov 2025 – Aug 2026",
        bullets: [
          "Developed and maintained company websites, landing pages, and digital platforms supporting business growth initiatives.",
          "Designed and implemented digital automation workflows for lead generation, customer engagement, and marketing operations.",
          "Built AI-assisted content generation workflows that improved campaign execution speed and reduced manual effort.",
          "Collaborated directly with leadership to identify business problems and deliver technology-driven solutions using web and AI technologies.",
          "Managed end-to-end deployment and optimization of web assets, analytics tracking, and user engagement funnels."
        ] }
    ],
    projects: [
      { title: "Kaizoi — Interview Preparation Platform", role: "Founder & Product Builder",
        bullets: [
          "Built and launched an interview-preparation web product designed to help users prepare through structured career and interview workflows.",
          "Worked end-to-end across product concept, feature planning, user flows, development, AI-powered functionality and deployment."
        ], website: "kaizoi.in" },
      { title: "PromptPocket — AI Prompt Management & Optimization Platform", role: "Founder & Product Builder",
        bullets: [
          "Built an AI-focused product for saving, organizing, reusing and optimizing prompts for practical use across AI platforms.",
          "Worked on prompt optimization workflows, AI/API integration, product functionality, user experience and deployment."
        ], website: "promptpocket.in" },
      { title: "ResumeFixit — AI-powered ATS Resume Optimization Platform", role: "",
        bullets: [
          "Built an AI resume optimization platform targeting 90+ ATS scores, with keyword-gap analysis against job descriptions.",
          "Developed resume parsing and enhancement workflows, editable resume sections, and ATS-compliant PDF generation, deployed in production on Vercel."
        ] },
      { title: "GrowthFlow AI — Multi-Agent WhatsApp Business Automation Platform", role: "",
        bullets: [
          "Designed a 3-agent AI system for lead conversion, missed-call recovery, and reputation management, integrated with Twilio WhatsApp automation.",
          "Implemented urgency detection, real-time business alerts, customer interaction dashboards, and SaaS pricing/deployment architecture."
        ] },
      { title: "TruthLens — Fine-Tuned Gemma Model for Hallucination Detection", role: "",
        bullets: [
          "Fine-tuned Gemma 3 4B using LoRA and Unsloth on the HaluEval dataset, building an inference pipeline returning GROUNDED vs. HALLUCINATED outputs.",
          "Published open-source model weights on Hugging Face and reduced training loss by 47% on Kaggle GPU infrastructure."
        ] },
      { title: "Multi-Modal Claim Verification System — Hackathon Project", role: "",
        bullets: [
          "Built an AI pipeline verifying insurance damage claims via images, conversations, and user history, with structured claim extraction, risk assessment, and claim status prediction."
        ] },
      { title: "Second Brain — AI Knowledge Management Platform", role: "",
        bullets: [
          "Built a note organization platform converting unstructured notes into structured wiki pages.",
          "Implemented AI-powered content classification and knowledge graph generation for searchable personal knowledge management."
        ] }
    ],
    education: [
      { degree: "Bachelor of Technology, Electronics & Communication Engineering", school: "Swarnandhra College of Engineering & Technology", years: "2019 – 2023" }
    ],
    certifications: [
      "ChatGPT Prompt Engineering for Developers",
      "Career Essentials in Generative AI — Microsoft + LinkedIn",
      "HubSpot Marketing Software Certification, plus additional AI/ML certifications"
    ]
  }
};
