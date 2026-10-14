-- ==============================================================================
-- Bright Digital Agency CRM - Complete Supabase Database Schema & Seed Data
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and go to "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this entire script, and click "Run" (Ctrl+Enter)
-- 4. Copy your Project URL & Anon Key from Project Settings > API into your .env
-- ==============================================================================

-- 1. TEAM MEMBERS TABLE (Ahmed Raza, Fatima Noor, Ali Hassan, Ayesha Khan)
CREATE TABLE IF NOT EXISTS public.crm_team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    email TEXT,
    phone TEXT,
    avatar_initials TEXT,
    avatar_color TEXT,
    color_hex TEXT,
    status TEXT DEFAULT 'Online',
    skills JSONB DEFAULT '[]'::jsonb,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.crm_clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    active_projects INT DEFAULT 1,
    total_spent NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Active',
    joined_date DATE DEFAULT CURRENT_DATE,
    industry TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    service TEXT,
    source TEXT,
    status TEXT DEFAULT 'New',
    follow_up_date DATE,
    budget TEXT,
    budget_number NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.crm_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    category TEXT,
    assigned_team JSONB DEFAULT '[]'::jsonb,
    deadline DATE,
    status TEXT DEFAULT 'In Progress',
    progress INT DEFAULT 0,
    budget TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TASKS TABLE (Deliverables assigned to Team Members)
CREATE TABLE IF NOT EXISTS public.crm_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    project TEXT,
    due_date DATE,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    completed BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACTIVITIES STREAM TABLE
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    time TEXT,
    type TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for anon key client access
-- ==============================================================================
ALTER TABLE public.crm_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- Team Members Policies
DROP POLICY IF EXISTS "Anon public access for crm_team_members" ON public.crm_team_members;
CREATE POLICY "Anon public access for crm_team_members" ON public.crm_team_members 
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Clients Policies
DROP POLICY IF EXISTS "Anon public access for crm_clients" ON public.crm_clients;
CREATE POLICY "Anon public access for crm_clients" ON public.crm_clients 
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Leads Policies
DROP POLICY IF EXISTS "Anon public access for crm_leads" ON public.crm_leads;
CREATE POLICY "Anon public access for crm_leads" ON public.crm_leads 
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Projects Policies
DROP POLICY IF EXISTS "Anon public access for crm_projects" ON public.crm_projects;
CREATE POLICY "Anon public access for crm_projects" ON public.crm_projects 
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Tasks Policies
DROP POLICY IF EXISTS "Anon public access for crm_tasks" ON public.crm_tasks;
CREATE POLICY "Anon public access for crm_tasks" ON public.crm_tasks 
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Activities Policies
DROP POLICY IF EXISTS "Anon public access for crm_activities" ON public.crm_activities;
CREATE POLICY "Anon public access for crm_activities" ON public.crm_activities 
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- DEFAULT SEED DATA
-- Populate realistic agency records if tables are empty
-- ==============================================================================

-- 1. Team Members
INSERT INTO public.crm_team_members (id, name, role, department, email, phone, avatar_initials, avatar_color, color_hex, status, skills, bio)
VALUES
('team-1', 'Ahmed Raza', 'Web Developer', 'Engineering', 'ahmed.raza@brightdigital.agency', '+92 301 5551201', 'AR', 'from-blue-600 to-indigo-600', '#4f46e5', 'Online', '["React", "Next.js", "Node.js", "WordPress Headless", "REST APIs", "PostgreSQL"]'::jsonb, 'Senior full-stack developer specializing in scalable web apps, Jamstack architectures, and high-performance agency client portals.'),
('team-2', 'Fatima Noor', 'UI/UX Designer', 'Design & Creative', 'fatima.noor@brightdigital.agency', '+92 302 5553482', 'FN', 'from-pink-500 to-rose-600', '#ec4899', 'In Figma', '["Figma", "Design Systems", "Mobile App UI", "Wireframing", "Prototyping", "User Research"]'::jsonb, 'Lead visual & UX designer passionate about clean interfaces, accessible typography systems, and delightful micro-interactions.'),
('team-3', 'Ali Hassan', 'AI Video Creator', 'AI & Motion Media', 'ali.hassan@brightdigital.agency', '+92 304 5558913', 'AH', 'from-purple-600 to-violet-600', '#8b5cf6', 'Rendering', '["Runway Gen-2", "Midjourney", "ElevenLabs", "After Effects", "Premiere Pro", "AI Avatars"]'::jsonb, 'Pioneering generative AI video director producing hyper-realistic commercial video reels, synthetic avatars, and 3D motion ads.'),
('team-4', 'Ayesha Khan', 'Marketing Specialist', 'Growth & Acquisition', 'ayesha.khan@brightdigital.agency', '+92 306 5554729', 'AK', 'from-amber-500 to-emerald-600', '#10b981', 'In Campaign', '["Meta Ads", "Google Ads", "SEO Growth", "Content Strategy", "Funnel Analytics", "Email Automation"]'::jsonb, 'Data-driven performance marketer driving multi-channel paid acquisition, search visibility, and client pipeline revenue.')
ON CONFLICT (id) DO NOTHING;

-- 2. Clients
INSERT INTO public.crm_clients (id, name, company, email, phone, active_projects, total_spent, status, joined_date, industry, notes)
VALUES
('client-1', 'David Sterling', 'Apex Retail Co', 'd.sterling@apexretail.com', '+1 (555) 349-8120', 2, 32000, 'Active', '2026-03-12', 'E-Commerce / Fashion', 'Premium enterprise retail account. Ongoing headless Shopify maintenance and Q4 campaign.'),
('client-2', 'Dr. Sarah Bennett', 'Lumina Health Group', 'sarah.bennett@luminahealth.io', '+1 (555) 672-9914', 1, 24500, 'Active', '2026-04-20', 'Healthcare Tech', 'Telemedicine portal design and HIPAA-compliant patient dashboard development.'),
('client-3', 'Marcus Vance', 'Nova FinTech Solutions', 'm.vance@novafintech.net', '+44 20 7946 0912', 1, 45000, 'Active', '2026-01-15', 'Financial Technology', 'Wealth management web app onboarding revamp with high security compliance.'),
('client-4', 'Elena Rostova', 'GreenScape Organics', 'elena@greenscapeorganics.com', '+1 (555) 438-2201', 1, 18200, 'Active', '2026-05-10', 'Sustainable Consumer Goods', 'Complete rebrand package, packaging guidelines, and eco-friendly web store redesign.'),
('client-5', 'Chloe Dupont', 'UrbanStyle Apparel', 'chloe@urbanstyle.fr', '+33 1 42 68 55 00', 1, 15800, 'Active', '2026-06-05', 'Luxury Streetwear', 'AI-generated viral video reel series and interactive Lookbook 2026.'),
('client-6', 'James Miller', 'Elevate SaaS Platform', 'jmiller@elevatesaas.co', '+1 (555) 901-7762', 1, 28400, 'Active', '2026-02-18', 'B2B Software', 'Full-funnel Google and LinkedIn performance ad acquisition strategy.'),
('client-7', 'Tariq Mahmood', 'Horizon Architecture', 'tariq@horizonarchitects.ae', '+971 4 391 0022', 1, 19500, 'Active', '2026-07-22', 'Luxury Architecture', 'Minimalist 3D architectural portfolio site with cinematic AI fly-through videos.'),
('client-8', 'Maya Lin', 'ZenPulse Wellness', 'maya@zenpulse.app', '+1 (555) 782-4409', 0, 12000, 'Completed', '2026-08-14', 'Health & Wellness Mobile', 'Mobile app onboarding wireframes completed. Retainer currently paused for funding round.')
ON CONFLICT (id) DO NOTHING;

-- 3. Leads
INSERT INTO public.crm_leads (id, name, email, phone, service, source, status, follow_up_date, budget, budget_number, notes)
VALUES
('lead-1', 'Tariq Siddiqui', 'tariq@siddiquigroup.com', '+92 321 8849102', 'Web Development', 'Website Contact Form', 'Proposal Sent', '2026-10-18', '$12,500', 12500, 'Enterprise corporate portal overhaul with custom bilingual portal (English/Urdu) and employee intranet.'),
('lead-2', 'Sophia Ramirez', 's.ramirez@lumencosmetics.io', '+1 (415) 892-4410', 'AI Video Production', 'LinkedIn', 'In Discussion', '2026-10-19', '$8,000', 8000, 'Wants 6 high-gloss AI generated promotional videos for winter cosmetics line. Needs photorealistic human avatars.'),
('lead-3', 'Bilal Mehmood', 'bilal@primelogistics.pk', '+92 333 4291883', 'UI/UX Design', 'Referral', 'New', '2026-10-20', '$6,500', 6500, 'Logistics fleet tracking dispatch dashboard redesign. Current software is cluttered and confusing dispatchers.'),
('lead-4', 'Clara Zimmerman', 'clara@nordicfin.de', '+49 89 542 1902', 'Digital Marketing', 'Google Ads', 'Won', '2026-10-14', '$15,000', 15000, 'Approved 3-month performance marketing retainer for DACH region. Moving to onboarding and client contract.'),
('lead-5', 'Omar Farooq', 'omar.farooq@crestholding.com', '+971 50 782 9134', 'Web Development', 'Cold Outreach', 'Contacted', '2026-10-22', '$22,000', 22000, 'Dubai real estate listing engine with WhatsApp CRM lead routing. Demo call scheduled for Tuesday 3 PM.'),
('lead-6', 'Jennifer Wu', 'jen@bamboopure.com', '+1 (206) 555-0194', 'AI Video Production', 'Instagram', 'In Discussion', '2026-10-21', '$5,200', 5200, 'UGC-style AI video reels and TikTok creative testing for eco-friendly home goods brand.'),
('lead-7', 'Hamza Qureshi', 'h.qureshi@skylineedu.pk', '+92 300 7712390', 'UI/UX Design', 'Website Contact Form', 'Proposal Sent', '2026-10-23', '$4,800', 4800, 'LMS mobile app design with course progress trackers and student community forums.'),
('lead-8', 'Rachel Adams', 'radams@momentumfit.com', '+1 (312) 904-8831', 'Digital Marketing', 'Referral', 'Contacted', '2026-10-25', '$9,500', 9500, 'Meta & TikTok paid user acquisition for fitness subscription app. Aiming for $18 customer acquisition cost.'),
('lead-9', 'Saad Al-Maktoum', 'saad@alnoorinvest.ae', '+971 55 210 9876', 'Web Development', 'LinkedIn', 'Lost', '2026-10-10', '$14,000', 14000, 'Client decided to defer website initiative to Q1 2027 due to executive team restructuring.')
ON CONFLICT (id) DO NOTHING;

-- 4. Projects
INSERT INTO public.crm_projects (id, name, client, category, assigned_team, deadline, status, progress, budget, description)
VALUES
('proj-1', 'Apex E-Commerce Redesign', 'Apex Retail Co', 'Web Dev & UI/UX', '["Ahmed Raza", "Fatima Noor", "Ayesha Khan"]'::jsonb, '2026-11-15', 'In Progress', 72, '$32,000', 'High-converting headless Shopify storefront with custom design system and Meta retargeting ads.'),
('proj-2', 'Lumina Health Portal', 'Lumina Health Group', 'Healthcare UI & Web', '["Fatima Noor", "Ahmed Raza"]'::jsonb, '2026-11-30', 'In Progress', 58, '$24,500', 'HIPAA-compliant telemedicine dashboard with appointment booking and secure doctor messaging.'),
('proj-3', 'Nova FinTech Onboarding', 'Nova FinTech Solutions', 'Web Development', '["Ahmed Raza"]'::jsonb, '2026-12-10', 'Planning', 25, '$45,000', 'Multi-step biometric customer onboarding funnel with identity verification API integrations.'),
('proj-4', 'UrbanStyle 3D AI Campaign', 'UrbanStyle Apparel', 'AI Video Production', '["Ali Hassan"]'::jsonb, '2026-10-31', 'In Progress', 85, '$15,800', 'Cutting-edge AI video lookbook and short-form video reels featuring synthetic virtual models.'),
('proj-5', 'GreenScape Organics Rebrand', 'GreenScape Organics', 'UI/UX & Marketing', '["Fatima Noor", "Ayesha Khan"]'::jsonb, '2026-11-20', 'In Progress', 40, '$18,200', 'Complete brand guidelines, sustainable packaging mockups, and organic search SEO audit.'),
('proj-6', 'Elevate SaaS Growth Q4', 'Elevate SaaS Platform', 'Growth & AI Media', '["Ayesha Khan", "Ali Hassan"]'::jsonb, '2026-12-05', 'In Progress', 64, '$28,400', 'Performance advertising blitz across Google, LinkedIn, and AI video product demo explainers.')
ON CONFLICT (id) DO NOTHING;

-- 5. Tasks (3 tasks for each Urdu team member)
INSERT INTO public.crm_tasks (id, title, assigned_to, project, due_date, priority, status, completed, description)
VALUES
('task-1', 'Develop Headless Shopify Cart API', 'Ahmed Raza', 'Apex E-Commerce Redesign', '2026-10-18', 'High', 'In Progress', FALSE, 'Build GraphQL store-front query resolvers and connect sticky slide-out cart drawer.'),
('task-2', 'Optimize Core Web Vitals for Lumina Portal', 'Ahmed Raza', 'Lumina Health Portal', '2026-10-12', 'Medium', 'Completed', TRUE, 'Refactor image loader pipelines, defer non-critical JS chunks, achieve 95+ PageSpeed score.'),
('task-3', 'Build Custom FinTech Webhook Endpoints', 'Ahmed Raza', 'Nova FinTech Onboarding', '2026-10-25', 'High', 'Pending', FALSE, 'Implement HMAC-SHA256 signature verification for real-time KYC identity verification webhook callbacks.'),
('task-4', 'Design Design System & UI Components in Figma', 'Fatima Noor', 'Apex E-Commerce Redesign', '2026-10-14', 'High', 'Completed', TRUE, 'Create responsive auto-layout components, color tokens, button variants, and modal sheets.'),
('task-5', 'Create Mobile Wireframes for Patient Dashboard', 'Fatima Noor', 'Lumina Health Portal', '2026-10-19', 'High', 'In Progress', FALSE, 'Draft 14 low-fidelity user flow screens for telehealth appointment bookings and lab report downloads.'),
('task-6', 'Brand Identity Guidelines & Typography Guide', 'Fatima Noor', 'GreenScape Organics Rebrand', '2026-10-10', 'Medium', 'Completed', TRUE, 'Finalize brand book with color harmonies, secondary font pairings, and social media template grids.'),
('task-7', 'Generate 4K AI Product Teaser Video', 'Ali Hassan', 'UrbanStyle 3D AI Campaign', '2026-10-17', 'Urgent', 'In Progress', FALSE, 'Prompt and upscale Runway Gen-2 video clips with photorealistic fabric motion and neon street lighting.'),
('task-8', 'Synthesize Multilingual AI Voiceovers', 'Ali Hassan', 'Elevate SaaS Growth Q4', '2026-10-11', 'Medium', 'Completed', TRUE, 'Generate high-clarity voice tracks in English, German, and Spanish using ElevenLabs custom voice clones.'),
('task-9', 'Render 15s Instagram Reels with Runway Gen-2', 'Ali Hassan', 'UrbanStyle 3D AI Campaign', '2026-10-26', 'High', 'Pending', FALSE, 'Composite dynamic camera moves with sound design and motion text overlays for streetwear campaign.'),
('task-10', 'Set Up Google Search & Performance Max Ads', 'Ayesha Khan', 'Elevate SaaS Growth Q4', '2026-10-13', 'High', 'Completed', TRUE, 'Configure conversion tracking tags, audience signals, and negative keyword exclusions.'),
('task-11', 'Conduct Competitor SEO & Keyword Gap Analysis', 'Ayesha Khan', 'GreenScape Organics Rebrand', '2026-10-21', 'Medium', 'In Progress', FALSE, 'Identify top 50 high-intent transactional search keywords with low keyword difficulty for content roadmap.'),
('task-12', 'Design High-Converting Meta Retargeting Funnel', 'Ayesha Khan', 'Apex E-Commerce Redesign', '2026-10-28', 'Urgent', 'Pending', FALSE, 'Structure custom audience tiers for abandoned carts and 30-day site visitors with dynamic catalog ads.')
ON CONFLICT (id) DO NOTHING;

-- 6. Activities
INSERT INTO public.crm_activities (id, text, time, type)
VALUES
('act-1', 'Task "Set Up Google Search Ads" marked completed by Ayesha Khan', '10 mins ago', 'task'),
('act-2', 'New Lead Tariq Siddiqui ($12,500) received via Website Contact Form', '25 mins ago', 'lead'),
('act-3', 'Ali Hassan uploaded AI Video render for UrbanStyle 3D AI Campaign', '1 hour ago', 'project'),
('act-4', 'Client Apex Retail Co approved Q4 Milestone 2 milestone invoice', '3 hours ago', 'client'),
('act-5', 'Fatima Noor finalized Figma components for Apex E-Commerce', '5 hours ago', 'task')
ON CONFLICT (id) DO NOTHING;
