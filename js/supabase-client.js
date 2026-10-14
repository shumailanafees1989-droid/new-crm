/**
 * Bright Digital Agency CRM - Supabase Database Client & Real-Time Sync
 * Connects CRM frontend seamlessly with Supabase PostgreSQL cloud database.
 * Supports auto-loading credentials from .env, runtime config modal, and local fallback.
 */

const SupabaseBridge = {
  client: null,
  config: {
    url: '',
    anonKey: ''
  },
  isConnected: false,
  status: 'unconfigured', // 'unconfigured' | 'connecting' | 'connected' | 'error'
  statusMessage: 'Supabase credentials not configured',
  listeners: [],

  /**
   * Register status change listener
   */
  onStatusChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      callback(this.getStatus());
    }
  },

  notifyListeners() {
    const current = this.getStatus();
    this.listeners.forEach(fn => {
      try { fn(current); } catch (e) { console.error(e); }
    });
  },

  getStatus() {
    return {
      isConnected: this.isConnected,
      status: this.status,
      message: this.statusMessage,
      url: this.config.url,
      hasKey: Boolean(this.config.anonKey)
    };
  },

  /**
   * Initialize Supabase client
   * Priority: 1. /api/config (.env) -> 2. localStorage -> 3. window.CRM_ENV
   */
  async init() {
    this.status = 'connecting';
    this.statusMessage = 'Detecting Supabase configuration...';
    this.notifyListeners();

    let envConfig = null;

    // 1. Try reading from server /api/config (.env)
    try {
      const resp = await fetch('/api/config');
      if (resp.ok) {
        envConfig = await resp.json();
      }
    } catch (e) {
      // Running standalone/file:// mode
    }

    // 2. Try localStorage override
    let localConfig = null;
    try {
      const stored = localStorage.getItem('bright_crm_supabase_config');
      if (stored) {
        localConfig = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read local Supabase config', e);
    }

    // 3. Fallback to window.CRM_ENV
    const fallbackEnv = window.CRM_ENV || {};

    const url = (localConfig && localConfig.url) || 
                (envConfig && envConfig.SUPABASE_URL) || 
                fallbackEnv.SUPABASE_URL || '';

    const anonKey = (localConfig && localConfig.anonKey) || 
                    (envConfig && envConfig.SUPABASE_ANON_KEY) || 
                    fallbackEnv.SUPABASE_ANON_KEY || '';

    this.config.url = url.trim();
    this.config.anonKey = anonKey.trim();

    // Check if credentials are set and not placeholder
    const isPlaceholder = !this.config.url || 
                          this.config.url.includes('your-project') || 
                          !this.config.anonKey || 
                          this.config.anonKey.includes('your-supabase-anon');

    if (isPlaceholder) {
      this.status = 'unconfigured';
      this.isConnected = false;
      this.statusMessage = 'Supabase credentials not configured in .env';
      this.notifyListeners();
      return false;
    }

    // Initialize Supabase official SDK
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      this.status = 'error';
      this.isConnected = false;
      this.statusMessage = 'Supabase SDK not loaded';
      this.notifyListeners();
      return false;
    }

    try {
      this.client = window.supabase.createClient(this.config.url, this.config.anonKey, {
        auth: {
          persistSession: false
        }
      });

      const test = await this.testConnection();
      if (test.success) {
        this.status = 'connected';
        this.isConnected = true;
        this.statusMessage = 'Connected to Supabase live database';
        this.notifyListeners();
        return true;
      } else {
        this.status = 'error';
        this.isConnected = false;
        this.statusMessage = test.message || 'Connection failed';
        this.notifyListeners();
        return false;
      }
    } catch (err) {
      this.status = 'error';
      this.isConnected = false;
      this.statusMessage = err.message || 'Error initializing Supabase';
      this.notifyListeners();
      return false;
    }
  },

  /**
   * Test live connection to database
   */
  async testConnection() {
    if (!this.client) {
      return { success: false, message: 'Supabase client is not initialized.' };
    }

    try {
      // Test querying crm_team_members or clients
      const { data, error } = await this.client
        .from('crm_team_members')
        .select('id')
        .limit(1);

      if (error) {
        // Table might not exist yet
        if (error.code === '42P01') {
          return {
            success: false,
            message: 'Connected to Supabase, but CRM tables not created yet. Run supabase-schema.sql in Supabase SQL editor.'
          };
        }
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Database connection verified!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Save new configuration (from UI modal)
   * Saves to localStorage and updates .env via /api/config
   */
  async updateConfig(url, anonKey) {
    this.config.url = (url || '').trim();
    this.config.anonKey = (anonKey || '').trim();

    try {
      localStorage.setItem('bright_crm_supabase_config', JSON.stringify({
        url: this.config.url,
        anonKey: this.config.anonKey
      }));
    } catch (e) {}

    // Also update .env file on server
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SUPABASE_URL: this.config.url,
          SUPABASE_ANON_KEY: this.config.anonKey
        })
      });
    } catch (e) {
      console.warn('Could not update .env on server', e);
    }

    return await this.init();
  },

  /**
   * Reset/Disconnect Supabase credentials
   */
  disconnect() {
    try {
      localStorage.removeItem('bright_crm_supabase_config');
    } catch (e) {}
    this.client = null;
    this.config = { url: '', anonKey: '' };
    this.isConnected = false;
    this.status = 'unconfigured';
    this.statusMessage = 'Disconnected. Using local storage mode.';
    this.notifyListeners();
  },

  /**
   * Load all data from Supabase
   * Maps snake_case database schema to CRM camelCase models
   */
  async loadAllData() {
    if (!this.isConnected || !this.client) {
      throw new Error('Supabase is not connected.');
    }

    const [
      teamRes,
      clientsRes,
      leadsRes,
      projectsRes,
      tasksRes,
      actsRes
    ] = await Promise.all([
      this.client.from('crm_team_members').select('*').order('created_at', { ascending: true }),
      this.client.from('crm_clients').select('*').order('created_at', { ascending: false }),
      this.client.from('crm_leads').select('*').order('created_at', { ascending: false }),
      this.client.from('crm_projects').select('*').order('created_at', { ascending: false }),
      this.client.from('crm_tasks').select('*').order('created_at', { ascending: false }),
      this.client.from('crm_activities').select('*').order('created_at', { ascending: false }).limit(20)
    ]);

    if (teamRes.error) throw teamRes.error;
    if (clientsRes.error) throw clientsRes.error;
    if (leadsRes.error) throw leadsRes.error;
    if (projectsRes.error) throw projectsRes.error;
    if (tasksRes.error) throw tasksRes.error;
    if (actsRes.error) throw actsRes.error;

    const team = (teamRes.data || []).map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      department: row.department,
      email: row.email,
      phone: row.phone,
      avatarInitials: row.avatar_initials,
      avatarColor: row.avatar_color,
      colorHex: row.color_hex,
      status: row.status,
      skills: Array.isArray(row.skills) ? row.skills : (row.skills ? JSON.parse(row.skills) : []),
      bio: row.bio
    }));

    const clients = (clientsRes.data || []).map(row => ({
      id: row.id,
      name: row.name,
      company: row.company,
      email: row.email,
      phone: row.phone,
      activeProjects: Number(row.active_projects) || 0,
      totalSpent: Number(row.total_spent) || 0,
      status: row.status,
      joinedDate: row.joined_date,
      industry: row.industry,
      notes: row.notes
    }));

    const leads = (leadsRes.data || []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      service: row.service,
      source: row.source,
      status: row.status,
      followUpDate: row.follow_up_date,
      budget: row.budget,
      budgetNumber: Number(row.budget_number) || 0,
      notes: row.notes
    }));

    const projects = (projectsRes.data || []).map(row => ({
      id: row.id,
      name: row.name,
      client: row.client,
      category: row.category,
      assignedTeam: Array.isArray(row.assigned_team) ? row.assigned_team : (row.assigned_team ? JSON.parse(row.assigned_team) : []),
      deadline: row.deadline,
      status: row.status,
      progress: Number(row.progress) || 0,
      budget: row.budget,
      description: row.description
    }));

    const tasks = (tasksRes.data || []).map(row => ({
      id: row.id,
      title: row.title,
      assignedTo: row.assigned_to,
      project: row.project,
      dueDate: row.due_date,
      priority: row.priority,
      status: row.status,
      completed: Boolean(row.completed),
      description: row.description
    }));

    const activities = (actsRes.data || []).map(row => ({
      id: row.id,
      text: row.text,
      time: row.time,
      type: row.type
    }));

    const totalRecords = team.length + clients.length + leads.length + projects.length + tasks.length;

    return {
      totalRecords,
      team,
      clients,
      leads,
      projects,
      tasks,
      activities
    };
  },

  /**
   * Sync / Push all local data to Supabase (Initial seed or full sync)
   */
  async syncAllToSupabase(state) {
    if (!this.isConnected || !this.client) {
      throw new Error('Supabase is not connected. Configure credentials first.');
    }

    // 1. Team Members
    const teamPayload = (state.team || []).map(m => ({
      id: m.id,
      name: m.name,
      role: m.role,
      department: m.department,
      email: m.email,
      phone: m.phone,
      avatar_initials: m.avatarInitials,
      avatar_color: m.avatarColor,
      color_hex: m.colorHex,
      status: m.status,
      skills: m.skills,
      bio: m.bio
    }));
    if (teamPayload.length > 0) {
      const { error } = await this.client.from('crm_team_members').upsert(teamPayload, { onConflict: 'id' });
      if (error) throw new Error(`Team sync error: ${error.message}`);
    }

    // 2. Clients
    const clientsPayload = (state.clients || []).map(c => ({
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      phone: c.phone,
      active_projects: c.activeProjects,
      total_spent: c.totalSpent,
      status: c.status,
      joined_date: c.joinedDate,
      industry: c.industry,
      notes: c.notes
    }));
    if (clientsPayload.length > 0) {
      const { error } = await this.client.from('crm_clients').upsert(clientsPayload, { onConflict: 'id' });
      if (error) throw new Error(`Clients sync error: ${error.message}`);
    }

    // 3. Leads
    const leadsPayload = (state.leads || []).map(l => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      service: l.service,
      source: l.source,
      status: l.status,
      follow_up_date: l.followUpDate,
      budget: l.budget,
      budget_number: l.budgetNumber,
      notes: l.notes
    }));
    if (leadsPayload.length > 0) {
      const { error } = await this.client.from('crm_leads').upsert(leadsPayload, { onConflict: 'id' });
      if (error) throw new Error(`Leads sync error: ${error.message}`);
    }

    // 4. Projects
    const projectsPayload = (state.projects || []).map(p => ({
      id: p.id,
      name: p.name,
      client: p.client,
      category: p.category,
      assigned_team: p.assignedTeam,
      deadline: p.deadline,
      status: p.status,
      progress: p.progress,
      budget: p.budget,
      description: p.description
    }));
    if (projectsPayload.length > 0) {
      const { error } = await this.client.from('crm_projects').upsert(projectsPayload, { onConflict: 'id' });
      if (error) throw new Error(`Projects sync error: ${error.message}`);
    }

    // 5. Tasks
    const tasksPayload = (state.tasks || []).map(t => ({
      id: t.id,
      title: t.title,
      assigned_to: t.assignedTo,
      project: t.project,
      due_date: t.dueDate,
      priority: t.priority,
      status: t.status,
      completed: Boolean(t.completed),
      description: t.description
    }));
    if (tasksPayload.length > 0) {
      const { error } = await this.client.from('crm_tasks').upsert(tasksPayload, { onConflict: 'id' });
      if (error) throw new Error(`Tasks sync error: ${error.message}`);
    }

    // 6. Activities
    const actsPayload = (state.activities || []).map(a => ({
      id: a.id,
      text: a.text,
      time: a.time,
      type: a.type
    }));
    if (actsPayload.length > 0) {
      const { error } = await this.client.from('crm_activities').upsert(actsPayload, { onConflict: 'id' });
      if (error) throw new Error(`Activities sync error: ${error.message}`);
    }

    return {
      success: true,
      counts: {
        team: teamPayload.length,
        clients: clientsPayload.length,
        leads: leadsPayload.length,
        projects: projectsPayload.length,
        tasks: tasksPayload.length,
        activities: actsPayload.length
      }
    };
  },

  // -------------------------------------------------------------
  // Real-Time Asynchronous Single-Entity Sync Helpers
  // -------------------------------------------------------------

  async upsertClient(client) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_clients').upsert({
        id: client.id,
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        active_projects: client.activeProjects,
        total_spent: client.totalSpent,
        status: client.status,
        joined_date: client.joinedDate,
        industry: client.industry,
        notes: client.notes
      });
    } catch (e) {
      console.warn('Supabase upsertClient error:', e);
    }
  },

  async deleteClient(id) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_clients').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteClient error:', e);
    }
  },

  async upsertLead(lead) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_leads').upsert({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        source: lead.source,
        status: lead.status,
        follow_up_date: lead.followUpDate,
        budget: lead.budget,
        budget_number: lead.budgetNumber,
        notes: lead.notes
      });
    } catch (e) {
      console.warn('Supabase upsertLead error:', e);
    }
  },

  async deleteLead(id) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_leads').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteLead error:', e);
    }
  },

  async upsertProject(project) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_projects').upsert({
        id: project.id,
        name: project.name,
        client: project.client,
        category: project.category,
        assigned_team: project.assignedTeam,
        deadline: project.deadline,
        status: project.status,
        progress: project.progress,
        budget: project.budget,
        description: project.description
      });
    } catch (e) {
      console.warn('Supabase upsertProject error:', e);
    }
  },

  async deleteProject(id) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteProject error:', e);
    }
  },

  async upsertTask(task) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_tasks').upsert({
        id: task.id,
        title: task.title,
        assigned_to: task.assignedTo,
        project: task.project,
        due_date: task.dueDate,
        priority: task.priority,
        status: task.status,
        completed: Boolean(task.completed),
        description: task.description
      });
    } catch (e) {
      console.warn('Supabase upsertTask error:', e);
    }
  },

  async deleteTask(id) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_tasks').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteTask error:', e);
    }
  },

  async logActivity(act) {
    if (!this.isConnected || !this.client) return;
    try {
      await this.client.from('crm_activities').upsert({
        id: act.id,
        text: act.text,
        time: act.time,
        type: act.type
      });
    } catch (e) {
      console.warn('Supabase logActivity error:', e);
    }
  }
};

window.SupabaseBridge = SupabaseBridge;
