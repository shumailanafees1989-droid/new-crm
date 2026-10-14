/**
 * Bright Digital Agency - CRM Core Data Store
 * Default realistic dataset for Team, Clients, Leads, Projects, and Tasks.
 */

const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'team-1',
    name: 'Ahmed Raza',
    role: 'Web Developer',
    department: 'Engineering',
    email: 'ahmed.raza@brightdigital.agency',
    phone: '+92 301 5551201',
    avatarInitials: 'AR',
    avatarColor: 'from-blue-600 to-indigo-600',
    colorHex: '#4f46e5',
    status: 'Online',
    skills: ['React', 'Next.js', 'Node.js', 'WordPress Headless', 'REST APIs', 'PostgreSQL'],
    bio: 'Senior full-stack developer specializing in scalable web apps, Jamstack architectures, and high-performance agency client portals.'
  },
  {
    id: 'team-2',
    name: 'Fatima Noor',
    role: 'UI/UX Designer',
    department: 'Design & Creative',
    email: 'fatima.noor@brightdigital.agency',
    phone: '+92 302 5553482',
    avatarInitials: 'FN',
    avatarColor: 'from-pink-500 to-rose-600',
    colorHex: '#ec4899',
    status: 'In Figma',
    skills: ['Figma', 'Design Systems', 'Mobile App UI', 'Wireframing', 'Prototyping', 'User Research'],
    bio: 'Lead visual & UX designer passionate about clean interfaces, accessible typography systems, and delightful micro-interactions.'
  },
  {
    id: 'team-3',
    name: 'Ali Hassan',
    role: 'AI Video Creator',
    department: 'AI & Motion Media',
    email: 'ali.hassan@brightdigital.agency',
    phone: '+92 304 5558913',
    avatarInitials: 'AH',
    avatarColor: 'from-purple-600 to-violet-600',
    colorHex: '#8b5cf6',
    status: 'Rendering',
    skills: ['Runway Gen-2', 'Midjourney', 'ElevenLabs', 'After Effects', 'Premiere Pro', 'AI Avatars'],
    bio: 'Pioneering generative AI video director producing hyper-realistic commercial video reels, synthetic avatars, and 3D motion ads.'
  },
  {
    id: 'team-4',
    name: 'Ayesha Khan',
    role: 'Marketing Specialist',
    department: 'Growth & Acquisition',
    email: 'ayesha.khan@brightdigital.agency',
    phone: '+92 306 5554729',
    avatarInitials: 'AK',
    avatarColor: 'from-amber-500 to-emerald-600',
    colorHex: '#10b981',
    status: 'In Campaign',
    skills: ['Meta Ads', 'Google Ads', 'SEO Growth', 'Content Strategy', 'Funnel Analytics', 'Email Automation'],
    bio: 'Data-driven performance marketer driving multi-channel paid acquisition, search visibility, and client pipeline revenue.'
  }
];

const DEFAULT_CLIENTS = [
  {
    id: 'client-1',
    name: 'David Sterling',
    company: 'Apex Retail Co',
    email: 'd.sterling@apexretail.com',
    phone: '+1 (555) 349-8120',
    activeProjects: 2,
    totalSpent: 32000,
    status: 'Active',
    joinedDate: '2026-03-12',
    industry: 'E-Commerce / Fashion',
    notes: 'Premium enterprise retail account. Ongoing headless Shopify maintenance and Q4 campaign.'
  },
  {
    id: 'client-2',
    name: 'Dr. Sarah Bennett',
    company: 'Lumina Health Group',
    email: 'sarah.bennett@luminahealth.io',
    phone: '+1 (555) 672-9914',
    activeProjects: 1,
    totalSpent: 24500,
    status: 'Active',
    joinedDate: '2026-04-20',
    industry: 'Healthcare Tech',
    notes: 'Telemedicine portal design and HIPAA-compliant patient dashboard development.'
  },
  {
    id: 'client-3',
    name: 'Marcus Vance',
    company: 'Nova FinTech Solutions',
    email: 'm.vance@novafintech.net',
    phone: '+44 20 7946 0912',
    activeProjects: 1,
    totalSpent: 45000,
    status: 'Active',
    joinedDate: '2026-01-15',
    industry: 'Financial Technology',
    notes: 'Wealth management web app onboarding revamp with high security compliance.'
  },
  {
    id: 'client-4',
    name: 'Elena Rostova',
    company: 'GreenScape Organics',
    email: 'elena@greenscapeorganics.com',
    phone: '+1 (555) 438-2201',
    activeProjects: 1,
    totalSpent: 18200,
    status: 'Active',
    joinedDate: '2026-05-10',
    industry: 'Sustainable Consumer Goods',
    notes: 'Complete rebrand package, packaging guidelines, and eco-friendly web store redesign.'
  },
  {
    id: 'client-5',
    name: 'Chloe Dupont',
    company: 'UrbanStyle Apparel',
    email: 'chloe@urbanstyle.fr',
    phone: '+33 1 42 68 55 00',
    activeProjects: 1,
    totalSpent: 15800,
    status: 'Active',
    joinedDate: '2026-06-05',
    industry: 'Luxury Streetwear',
    notes: 'AI-generated viral video reel series and interactive Lookbook 2026.'
  },
  {
    id: 'client-6',
    name: 'James Miller',
    company: 'Elevate SaaS Platform',
    email: 'jmiller@elevatesaas.co',
    phone: '+1 (555) 901-7762',
    activeProjects: 1,
    totalSpent: 28400,
    status: 'Active',
    joinedDate: '2026-02-18',
    industry: 'B2B Software',
    notes: 'Full-funnel Google and LinkedIn performance ad acquisition strategy.'
  },
  {
    id: 'client-7',
    name: 'Tariq Mahmood',
    company: 'Horizon Architecture',
    email: 'tariq@horizonarchitects.ae',
    phone: '+971 4 391 0022',
    activeProjects: 1,
    totalSpent: 19500,
    status: 'Active',
    joinedDate: '2026-07-22',
    industry: 'Luxury Architecture',
    notes: 'Minimalist 3D architectural portfolio site with cinematic AI fly-through videos.'
  },
  {
    id: 'client-8',
    name: 'Maya Lin',
    company: 'ZenPulse Wellness',
    email: 'maya@zenpulse.app',
    phone: '+1 (555) 782-4409',
    activeProjects: 0,
    totalSpent: 12000,
    status: 'Completed',
    joinedDate: '2026-08-14',
    industry: 'Health & Wellness Mobile',
    notes: 'Mobile app onboarding wireframes completed. Retainer currently paused for funding round.'
  }
];

const DEFAULT_LEADS = [
  {
    id: 'lead-1',
    name: 'Tariq Siddiqui',
    email: 'tariq@siddiquigroup.com',
    phone: '+92 321 8849102',
    service: 'Web Development',
    source: 'Website Contact Form',
    status: 'Proposal Sent',
    followUpDate: '2026-10-18',
    budget: '$12,500',
    budgetNumber: 12500,
    notes: 'Enterprise corporate portal overhaul with custom bilingual portal (English/Urdu) and employee intranet.'
  },
  {
    id: 'lead-2',
    name: 'Sophia Ramirez',
    email: 's.ramirez@lumencosmetics.io',
    phone: '+1 (415) 892-4410',
    service: 'AI Video Production',
    source: 'LinkedIn',
    status: 'In Discussion',
    followUpDate: '2026-10-19',
    budget: '$8,000',
    budgetNumber: 8000,
    notes: 'Wants 6 high-gloss AI generated promotional videos for winter cosmetics line. Needs photorealistic human avatars.'
  },
  {
    id: 'lead-3',
    name: 'Bilal Mehmood',
    email: 'bilal@primelogistics.pk',
    phone: '+92 333 4291883',
    service: 'UI/UX Design',
    source: 'Referral',
    status: 'New',
    followUpDate: '2026-10-20',
    budget: '$6,500',
    budgetNumber: 6500,
    notes: 'Logistics fleet tracking dispatch dashboard redesign. Current software is cluttered and confusing dispatchers.'
  },
  {
    id: 'lead-4',
    name: 'Clara Zimmerman',
    email: 'clara@nordicfin.de',
    phone: '+49 89 542 1902',
    service: 'Digital Marketing',
    source: 'Google Ads',
    status: 'Won',
    followUpDate: '2026-10-14',
    budget: '$15,000',
    budgetNumber: 15000,
    notes: 'Approved 3-month performance marketing retainer for DACH region. Moving to onboarding and client contract.'
  },
  {
    id: 'lead-5',
    name: 'Omar Farooq',
    email: 'omar.farooq@crestholding.com',
    phone: '+971 50 782 9134',
    service: 'Web Development',
    source: 'Cold Outreach',
    status: 'Contacted',
    followUpDate: '2026-10-22',
    budget: '$22,000',
    budgetNumber: 22000,
    notes: 'Dubai real estate listing engine with WhatsApp CRM lead routing. Demo call scheduled for Tuesday 3 PM.'
  },
  {
    id: 'lead-6',
    name: 'Jennifer Wu',
    email: 'jen@bamboopure.com',
    phone: '+1 (206) 555-0194',
    service: 'AI Video Production',
    source: 'Instagram',
    status: 'In Discussion',
    followUpDate: '2026-10-21',
    budget: '$5,200',
    budgetNumber: 5200,
    notes: 'UGC-style AI video reels and TikTok creative testing for eco-friendly home goods brand.'
  },
  {
    id: 'lead-7',
    name: 'Hamza Qureshi',
    email: 'h.qureshi@skylineedu.pk',
    phone: '+92 300 7712390',
    service: 'UI/UX Design',
    source: 'Website Contact Form',
    status: 'Proposal Sent',
    followUpDate: '2026-10-23',
    budget: '$4,800',
    budgetNumber: 4800,
    notes: 'LMS mobile app design with course progress trackers and student community forums.'
  },
  {
    id: 'lead-8',
    name: 'Rachel Adams',
    email: 'radams@momentumfit.com',
    phone: '+1 (312) 904-8831',
    service: 'Digital Marketing',
    source: 'Referral',
    status: 'Contacted',
    followUpDate: '2026-10-25',
    budget: '$9,500',
    budgetNumber: 9500,
    notes: 'Meta & TikTok paid user acquisition for fitness subscription app. Aiming for $18 customer acquisition cost.'
  },
  {
    id: 'lead-9',
    name: 'Saad Al-Maktoum',
    email: 'saad@alnoorinvest.ae',
    phone: '+971 55 210 9876',
    service: 'Web Development',
    source: 'LinkedIn',
    status: 'Lost',
    followUpDate: '2026-10-10',
    budget: '$14,000',
    budgetNumber: 14000,
    notes: 'Client decided to defer website initiative to Q1 2027 due to executive team restructuring.'
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Apex E-Commerce Redesign',
    client: 'Apex Retail Co',
    category: 'Web Dev & UI/UX',
    assignedTeam: ['Ahmed Raza', 'Fatima Noor', 'Ayesha Khan'],
    deadline: '2026-11-15',
    status: 'In Progress',
    progress: 72,
    budget: '$32,000',
    description: 'High-converting headless Shopify storefront with custom design system and Meta retargeting ads.'
  },
  {
    id: 'proj-2',
    name: 'Lumina Health Portal',
    client: 'Lumina Health Group',
    category: 'Healthcare UI & Web',
    assignedTeam: ['Fatima Noor', 'Ahmed Raza'],
    deadline: '2026-11-30',
    status: 'In Progress',
    progress: 58,
    budget: '$24,500',
    description: 'HIPAA-compliant telemedicine dashboard with appointment booking and secure doctor messaging.'
  },
  {
    id: 'proj-3',
    name: 'Nova FinTech Onboarding',
    client: 'Nova FinTech Solutions',
    category: 'Web Development',
    assignedTeam: ['Ahmed Raza'],
    deadline: '2026-12-10',
    status: 'Planning',
    progress: 25,
    budget: '$45,000',
    description: 'Multi-step biometric customer onboarding funnel with identity verification API integrations.'
  },
  {
    id: 'proj-4',
    name: 'UrbanStyle 3D AI Campaign',
    client: 'UrbanStyle Apparel',
    category: 'AI Video Production',
    assignedTeam: ['Ali Hassan'],
    deadline: '2026-10-31',
    status: 'In Progress',
    progress: 85,
    budget: '$15,800',
    description: 'Cutting-edge AI video lookbook and short-form video reels featuring synthetic virtual models.'
  },
  {
    id: 'proj-5',
    name: 'GreenScape Organics Rebrand',
    client: 'GreenScape Organics',
    category: 'UI/UX & Marketing',
    assignedTeam: ['Fatima Noor', 'Ayesha Khan'],
    deadline: '2026-11-20',
    status: 'In Progress',
    progress: 40,
    budget: '$18,200',
    description: 'Complete brand guidelines, sustainable packaging mockups, and organic search SEO audit.'
  },
  {
    id: 'proj-6',
    name: 'Elevate SaaS Growth Q4',
    client: 'Elevate SaaS Platform',
    category: 'Growth & AI Media',
    assignedTeam: ['Ayesha Khan', 'Ali Hassan'],
    deadline: '2026-12-05',
    status: 'In Progress',
    progress: 64,
    budget: '$28,400',
    description: 'Performance advertising blitz across Google, LinkedIn, and AI video product demo explainers.'
  }
];

/**
 * 12 Sample Tasks Assigned to Urdu-named Team Members
 * 3 tasks assigned to each member:
 * - Ahmed Raza (Web Developer)
 * - Fatima Noor (UI/UX Designer)
 * - Ali Hassan (AI Video Creator)
 * - Ayesha Khan (Marketing Specialist)
 */
const DEFAULT_TASKS = [
  // Ahmed Raza Tasks
  {
    id: 'task-1',
    title: 'Develop Headless Shopify Cart API',
    assignedTo: 'Ahmed Raza',
    project: 'Apex E-Commerce Redesign',
    dueDate: '2026-10-18',
    priority: 'High',
    status: 'In Progress',
    completed: false,
    description: 'Build GraphQL store-front query resolvers and connect sticky slide-out cart drawer.'
  },
  {
    id: 'task-2',
    title: 'Optimize Core Web Vitals for Lumina Portal',
    assignedTo: 'Ahmed Raza',
    project: 'Lumina Health Portal',
    dueDate: '2026-10-12',
    priority: 'Medium',
    status: 'Completed',
    completed: true,
    description: 'Refactor image loader pipelines, defer non-critical JS chunks, achieve 95+ PageSpeed score.'
  },
  {
    id: 'task-3',
    title: 'Build Custom FinTech Webhook Endpoints',
    assignedTo: 'Ahmed Raza',
    project: 'Nova FinTech Onboarding',
    dueDate: '2026-10-25',
    priority: 'High',
    status: 'Pending',
    completed: false,
    description: 'Implement HMAC-SHA256 signature verification for real-time KYC identity verification webhook callbacks.'
  },

  // Fatima Noor Tasks
  {
    id: 'task-4',
    title: 'Design Design System & UI Components in Figma',
    assignedTo: 'Fatima Noor',
    project: 'Apex E-Commerce Redesign',
    dueDate: '2026-10-14',
    priority: 'High',
    status: 'Completed',
    completed: true,
    description: 'Create responsive auto-layout components, color tokens, button variants, and modal sheets.'
  },
  {
    id: 'task-5',
    title: 'Create Mobile Wireframes for Patient Dashboard',
    assignedTo: 'Fatima Noor',
    project: 'Lumina Health Portal',
    dueDate: '2026-10-19',
    priority: 'High',
    status: 'In Progress',
    completed: false,
    description: 'Draft 14 low-fidelity user flow screens for telehealth appointment bookings and lab report downloads.'
  },
  {
    id: 'task-6',
    title: 'Brand Identity Guidelines & Typography Guide',
    assignedTo: 'Fatima Noor',
    project: 'GreenScape Organics Rebrand',
    dueDate: '2026-10-10',
    priority: 'Medium',
    status: 'Completed',
    completed: true,
    description: 'Finalize brand book with color harmonies, secondary font pairings, and social media template grids.'
  },

  // Ali Hassan Tasks
  {
    id: 'task-7',
    title: 'Generate 4K AI Product Teaser Video',
    assignedTo: 'Ali Hassan',
    project: 'UrbanStyle 3D AI Campaign',
    dueDate: '2026-10-17',
    priority: 'Urgent',
    status: 'In Progress',
    completed: false,
    description: 'Prompt and upscale Runway Gen-2 video clips with photorealistic fabric motion and neon street lighting.'
  },
  {
    id: 'task-8',
    title: 'Synthesize Multilingual AI Voiceovers',
    assignedTo: 'Ali Hassan',
    project: 'Elevate SaaS Growth Q4',
    dueDate: '2026-10-11',
    priority: 'Medium',
    status: 'Completed',
    completed: true,
    description: 'Generate high-clarity voice tracks in English, German, and Spanish using ElevenLabs custom voice clones.'
  },
  {
    id: 'task-9',
    title: 'Render 15s Instagram Reels with Runway Gen-2',
    assignedTo: 'Ali Hassan',
    project: 'UrbanStyle 3D AI Campaign',
    dueDate: '2026-10-26',
    priority: 'High',
    status: 'Pending',
    completed: false,
    description: 'Composite dynamic camera moves with sound design and motion text overlays for streetwear campaign.'
  },

  // Ayesha Khan Tasks
  {
    id: 'task-10',
    title: 'Set Up Google Search & Performance Max Ads',
    assignedTo: 'Ayesha Khan',
    project: 'Elevate SaaS Growth Q4',
    dueDate: '2026-10-13',
    priority: 'High',
    status: 'Completed',
    completed: true,
    description: 'Configure conversion tracking tags, audience signals, and negative keyword exclusions.'
  },
  {
    id: 'task-11',
    title: 'Conduct Competitor SEO & Keyword Gap Analysis',
    assignedTo: 'Ayesha Khan',
    project: 'GreenScape Organics Rebrand',
    dueDate: '2026-10-21',
    priority: 'Medium',
    status: 'In Progress',
    completed: false,
    description: 'Identify top 50 high-intent transactional search keywords with low keyword difficulty for content roadmap.'
  },
  {
    id: 'task-12',
    title: 'Design High-Converting Meta Retargeting Funnel',
    assignedTo: 'Ayesha Khan',
    project: 'Apex E-Commerce Redesign',
    dueDate: '2026-10-28',
    priority: 'Urgent',
    status: 'Pending',
    completed: false,
    description: 'Structure custom audience tiers for abandoned carts and 30-day site visitors with dynamic catalog ads.'
  }
];

const DEFAULT_ACTIVITIES = [
  { id: 'act-1', text: 'Task "Set Up Google Search Ads" marked completed by Ayesha Khan', time: '10 mins ago', type: 'task' },
  { id: 'act-2', text: 'New Lead Tariq Siddiqui ($12,500) received via Website Contact Form', time: '25 mins ago', type: 'lead' },
  { id: 'act-3', text: 'Ali Hassan uploaded AI Video render for UrbanStyle 3D AI Campaign', time: '1 hour ago', type: 'project' },
  { id: 'act-4', text: 'Client Apex Retail Co approved Q4 Milestone 2 milestone invoice', time: '3 hours ago', type: 'client' },
  { id: 'act-5', text: 'Fatima Noor finalized Figma components for Apex E-Commerce', time: '5 hours ago', type: 'task' }
];
