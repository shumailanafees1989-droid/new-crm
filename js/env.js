/**
 * Bright Digital Agency CRM - Browser Environment Config Fallback
 * This file is automatically loaded if running in static file mode (file://).
 * If running via server.ps1, the CRM automatically fetches config directly from .env via /api/config.
 */
window.CRM_ENV = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-supabase-anon-key-here"
};
