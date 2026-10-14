# Bright Digital Agency - Modern CRM Dashboard

A modern, responsive, light-themed CRM web dashboard designed for **Bright Digital Agency**. Built with clean HTML5, CSS3, and reactive JavaScript with **Supabase PostgreSQL Cloud Database** integration and `.env` configuration.

---

## 🚀 Quick Start

### Option 1: Local HTTP Server (with .env API)
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open in browser: **[http://localhost:3000/](http://localhost:3000/)**

### Option 2: Direct File Open
Open [`index.html`](file:///c:/Users/AU/Desktop/new%20crm/index.html) directly in any modern web browser.

---

## ⚡ Supabase Database Setup & .env

The CRM is fully integrated with **Supabase PostgreSQL** for real-time cloud data persistence:

### 1. Configure `.env`
Edit the [`.env`](file:///c:/Users/AU/Desktop/new%20crm/.env) file in the root folder:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
PORT=3000
```
*(You can also configure or update these credentials anytime inside the CRM using the **"Supabase Database"** settings modal in the UI!)*

### 2. Run Database Schema in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** > **New Query**.
3. Copy all code from [`supabase-schema.sql`](file:///c:/Users/AU/Desktop/new%20crm/supabase-schema.sql) and click **Run**.
4. This instantly creates all 6 tables (`crm_team_members`, `crm_clients`, `crm_leads`, `crm_projects`, `crm_tasks`, `crm_activities`), enables RLS policies, and inserts all agency seed records.

### 3. Sync & Load Everything
- In the top header or sidebar, click **"Supabase Database"** or the status pill.
- Click **"⚡ Ping Supabase"** to verify connection.
- Click **"Seed / Push All to Supabase"** to push all local data to the cloud.
- Click **"Load All from Supabase"** to pull live cloud records into your CRM.
- When connected, every **Add**, **Edit**, **Delete**, **Convert Lead**, and **Task Toggle** automatically syncs to Supabase!

---

## 🌟 Key Features & Pages

### 1. 📊 Dashboard
- **Top 5 Metric Cards:** Total Clients, Active Projects, Total Leads, Pending Tasks, Completed Tasks.
- **Team Workload Overview:** Live progress bars and completion percentages for all Urdu team members.
- **Active Projects Table:** Real-time progress tracker and assigned team avatar stacks.
- **Recent Activities Feed:** Live event notifications for added leads, completed tasks, and client conversions.
- **Quick Add Menu:** 1-click modal launchers for Leads, Clients, Tasks, and Projects.

### 2. 👥 Clients Directory
- Enterprise and SMB client accounts with full business details.
- Columns: Company & Contact Name, Email, Phone, Active Projects, Total Spent ($), Status, Joined Date, Actions.
- Search and filter by Active/Completed status.
- Add Client modal & View Client Details modal.
- Delete client with auto-sync to Supabase.

### 3. 🎯 Leads Pipeline
- Complete inbound agency lead tracking with all 9 fields:
  1. **Name**
  2. **Email**
  3. **Phone**
  4. **Required Service** (Web Development, UI/UX Design, AI Video Production, Digital Marketing)
  5. **Lead Source** (Website Form, LinkedIn, Referral, Google Ads, Cold Outreach, Instagram)
  6. **Status** (New, Contacted, In Discussion, Proposal Sent, Won, Lost)
  7. **Follow-up Date**
  8. **Budget**
  9. **Notes**
- Single-click **"+ Convert"** button that automatically migrates a won lead into an active client!
- Filters by Status and Service, and real-time search.

### 4. 🚀 Projects
- Interactive project cards showing:
  - Project name & client
  - Category tags (e.g. Web Dev & UI/UX, AI Video Production)
  - Assigned team member avatar stacks
  - Deadlines & budgets
  - Visual animated progress bar (%)
  - Status chips (In Progress, Planning, Completed)
  - **"View Details"** and **"Delete Project"** actions.

### 5. 👥 Agency Team
4 core specialists with Urdu names:
1. **Ahmed Raza** — Web Developer (Full-Stack, React, APIs, PostgreSQL)
2. **Fatima Noor** — UI/UX Designer (Design Systems, Figma, Mobile UI)
3. **Ali Hassan** — AI Video Creator (Runway Gen-2, Midjourney, ElevenLabs)
4. **Ayesha Khan** — Marketing Specialist (Meta & Google Ads, SEO Growth, Funnels)

- Live Task Performance Tracker with Total Tasks, Completed, Pending, and % Done progress bar.
- Direct **"+ Assign Task"** button on each card (pre-selects the team member).

### 6. ✅ Task Management
- **Team Task Completion Banner:** Top real-time scorecard for each member:
  - Total Tasks, Completed Tasks, Pending Tasks, and Completion Percentage.
- **12 Realistic Sample Tasks:** Pre-assigned across team members with priority badges (Urgent, High, Medium) and due dates.
- **Interactive Checkbox:** Checking any task instantly toggles it between Completed and In Progress, dynamically recalculating all dashboard metrics, team completion stats, and syncing to Supabase!
- Filters by Assignee, Status, and Priority.

### 7. 💾 Backup & Data Management
- **Export Backup:** Download full CRM state as JSON backup anytime.
- **Reset Demo Data:** One-click reset to initial agency seed state.

---

## 📁 Directory Structure
```
c:\Users\AU\Desktop\new crm\
├── .env                  # Supabase & server environment configuration
├── .env.example          # Example environment configuration
├── supabase-schema.sql   # Complete PostgreSQL schema, RLS policies & seed data
├── server.ps1            # Local HTTP server with /api/config endpoint
├── index.html            # Main single-page application & modals
├── css\
│   └── style.css         # Clean light theme design system & Supabase UI
├── js\
│   ├── env.js            # Browser fallback environment config
│   ├── supabase-client.js# Supabase SDK bridge, real-time sync & CRUD handlers
│   ├── data.js           # Seed data for team, clients, leads, projects, tasks
│   └── app.js            # Main reactive CRM logic & event orchestrator
└── README.md             # Documentation
```
