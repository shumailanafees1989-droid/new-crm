# ðŸš€ Vercel Deployment Guide â€” Bright Digital Agency CRM

This guide walks you through deploying the **Bright Digital Agency CRM** to **Vercel** with full **Supabase Cloud Database** connectivity.

---

## âš¡ Deployment Options

### Option 1: Deploy with Git & Vercel Dashboard (Recommended)

1. **Initialize Git & Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Bright Digital Agency CRM"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bright-agency-crm.git
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Log into your [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"Add New..."** â†’ **"Project"**.
   - Select your GitHub repository and click **"Import"**.

3. **Configure Environment Variables (Supabase):**
   In the **Environment Variables** section on Vercel, add:
   | Key | Value | Description |
   |---|---|---|
   | `SUPABASE_URL` | `https://xxxx.supabase.co` | Your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase Public Anon Key |

4. **Deploy:**
   - Click **"Deploy"**.
   - In less than 30 seconds, your CRM is live at `https://your-project.vercel.app`!

---

### Option 2: Deploy with Vercel CLI (Direct 1-Command)

1. Open PowerShell or Terminal in the project root:
   ```powershell
   cd "c:\Users\AU\Desktop\new crm"
   ```

2. Run the Vercel deploy command:
   ```bash
   npx vercel
   ```

3. Follow the CLI prompts:
   - *Set up and deploy?* â†’ `y`
   - *Which scope?* â†’ (Select your account)
   - *Link to existing project?* â†’ `n`
   - *Project name?* â†’ `bright-agency-crm`
   - *Directory located?* â†’ `./`

4. For production deployment:
   ```bash
   npx vercel --prod
   ```

---

## ðŸ—„ï¸ How the Vercel Architecture Works

- **Zero-Config Static Hosting:** All HTML, CSS, JavaScript, and SVG icons are cached on Vercel's Edge Network for global <50ms load times.
- **Serverless API Endpoint (`/api/config`):** Vercel runs [`api/config.js`](file:///api/config.js) as a serverless function that securely reads `process.env.SUPABASE_URL` and `process.env.SUPABASE_ANON_KEY` and hands them to the CRM frontend.
- **Clean SPA Routing:** [`vercel.json`](file:///vercel.json) handles client-side hash routing (`#dashboard`, `#clients`, `#leads`, `#projects`, `#team`, `#tasks`) and sets security headers (`X-Frame-Options`, `X-Content-Type-Options`).
- **In-App Credential Override:** Even on Vercel, users can open the **"Supabase Database"** modal in the CRM header to change, test, or re-link database credentials anytime via local persistence!

---

## ðŸ“‹ Supabase Database Setup Reminder

Before or after deploying to Vercel, ensure your Supabase database tables are created:
1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Paste the contents of [`supabase-schema.sql`](file:///supabase-schema.sql).
3. Click **Run**.
4. In your live Vercel app, open the **Supabase Database** modal and click **"Seed / Push All to Supabase"** to populate cloud data in one click!

---

## ðŸ“¦ What's Included in the ZIP Archive

The provided `bright-digital-crm.zip` package is 100% self-contained and ready to deploy:
```
bright-digital-crm/
â”œâ”€â”€ api/
â”‚   â””â”€â”€ config.js              # Vercel serverless function for .env / environment variables
â”œâ”€â”€ css/
â”‚   â””â”€â”€ style.css              # Premium light theme design system
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ app.js                 # Reactive CRM logic, search, filters & state management
â”‚   â”œâ”€â”€ data.js                # Default team, clients, leads, projects & tasks
â”‚   â”œâ”€â”€ env.js                 # Fallback browser environment config
â”‚   â””â”€â”€ supabase-client.js     # Supabase SDK bridge & real-time sync
â”œâ”€â”€ index.html                 # Complete SPA application & modals
â”œâ”€â”€ supabase-schema.sql        # Supabase PostgreSQL schema & seed records
â”œâ”€â”€ vercel.json                # Vercel deployment & routing config
â”œâ”€â”€ package.json               # Node metadata & scripts
â”œâ”€â”€ .gitignore                 # Standard repository ignores
â”œâ”€â”€ .env.example               # Example Supabase credentials
â”œâ”€â”€ server.ps1                 # Local development server with /api/config
â”œâ”€â”€ README.md                  # Complete CRM documentation
â””â”€â”€ VERCEL_DEPLOY.md           # This deployment guide
```