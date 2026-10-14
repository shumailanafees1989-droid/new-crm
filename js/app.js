/**
 * Bright Digital Agency CRM - Main Application Logic
 * Clean, lightweight, fully reactive JavaScript architecture.
 */

const STORAGE_KEY = 'bright_digital_agency_crm_state_v2';

const BrightCRM = {
  // Application State
  state: {
    team: [],
    clients: [],
    leads: [],
    projects: [],
    tasks: [],
    activities: [],
    currentPage: 'dashboard'
  },

  // Color generator & avatar helpers
  memberColors: {
    'Ahmed Raza': { bg: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', initials: 'AR' },
    'Fatima Noor': { bg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', initials: 'FN' },
    'Ali Hassan': { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', initials: 'AH' },
    'Ayesha Khan': { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', initials: 'AK' }
  },

  /**
   * Initialize CRM
   */
  init() {
    this.loadState();
    this.setupEventListeners();
    this.setupRouting();
    this.populateProjectSelects();
    this.renderAll();
    this.initSupabaseIntegration();
    console.log('Bright Digital Agency CRM initialized successfully.');
  },

  /**
   * Load state from localStorage or load defaults
   */
  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.state = JSON.parse(saved);
      } else {
        this.resetToDefaults();
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
      this.resetToDefaults();
    }
  },

  /**
   * Persist current state
   */
  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  },

  /**
   * Reset data to seed defaults
   */
  resetToDefaults() {
    this.state = {
      team: JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS)),
      clients: JSON.parse(JSON.stringify(DEFAULT_CLIENTS)),
      leads: JSON.parse(JSON.stringify(DEFAULT_LEADS)),
      projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
      tasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
      activities: JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES)),
      currentPage: 'dashboard'
    };
    this.saveState();
  },

  /**
   * Add a new activity item
   */
  logActivity(text, type = 'general') {
    const newAct = {
      id: 'act-' + Date.now(),
      text,
      time: 'Just now',
      type
    };
    this.state.activities.unshift(newAct);
    if (this.state.activities.length > 15) {
      this.state.activities.pop();
    }
    this.saveState();
    if (window.SupabaseBridge) {
      window.SupabaseBridge.logActivity(newAct);
    }
  },

  /**
   * Populate project options in task form
   */
  populateProjectSelects() {
    const taskProjSelect = document.getElementById('taskProjectSelect');
    if (!taskProjSelect) return;

    taskProjSelect.innerHTML = this.state.projects.map(p => 
      `<option value="${p.name}">${p.name} (${p.client})</option>`
    ).join('');
  },

  /**
   * Calculate real-time task statistics for each team member
   */
  getTeamMemberStats(memberName) {
    const memberTasks = this.state.tasks.filter(t => t.assignedTo === memberName);
    const total = memberTasks.length;
    const completed = memberTasks.filter(t => t.completed || t.status === 'Completed').length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  },

  /**
   * Global and Page-level Re-rendering
   */
  renderAll() {
    this.updateSidebarBadges();
    this.renderDashboardMetrics();
    this.renderDashboardTeamWorkload();
    this.renderDashboardProjects();
    this.renderDashboardActivities();
    this.renderClientsTable();
    this.renderLeadsTable();
    this.renderProjectsGrid();
    this.renderTeamCards();
    this.renderTasksMemberOverview();
    this.renderTasksTable();
  },

  /**
   * Update sidebar counter badges
   */
  updateSidebarBadges() {
    const pendingTasks = this.state.tasks.filter(t => !t.completed && (t.status === 'Pending' || t.status === 'In Progress')).length;
    document.getElementById('sidebarClientsBadge').textContent = this.state.clients.length;
    document.getElementById('sidebarLeadsBadge').textContent = this.state.leads.length;
    document.getElementById('sidebarProjectsBadge').textContent = this.state.projects.length;
    document.getElementById('sidebarTeamBadge').textContent = this.state.team.length;
    document.getElementById('sidebarTasksBadge').textContent = pendingTasks;
  },

  /**
   * Render Dashboard Metrics
   * Shows: Total Clients, Active Projects, Total Leads, Pending Tasks, Completed Tasks
   */
  renderDashboardMetrics() {
    const totalClients = this.state.clients.length;
    const activeProjects = this.state.projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
    const totalLeads = this.state.leads.length;
    const pendingTasks = this.state.tasks.filter(t => !t.completed && (t.status === 'Pending' || t.status === 'In Progress')).length;
    const completedTasks = this.state.tasks.filter(t => t.completed || t.status === 'Completed').length;

    document.getElementById('statTotalClients').textContent = totalClients;
    document.getElementById('statActiveProjects').textContent = activeProjects;
    document.getElementById('statTotalLeads').textContent = totalLeads;
    document.getElementById('statPendingTasks').textContent = pendingTasks;
    document.getElementById('statCompletedTasks').textContent = completedTasks;
  },

  /**
   * Render Dashboard Team Workload snapshot
   */
  renderDashboardTeamWorkload() {
    const container = document.getElementById('dashboardTeamWorkloadGrid');
    if (!container) return;

    let html = '';
    this.state.team.forEach(member => {
      const stats = this.getTeamMemberStats(member.name);
      const color = this.memberColors[member.name] || { bg: '#4f46e5', initials: 'TM' };

      html += `
        <div class="team-workload-card">
          <div class="workload-header">
            <div class="member-avatar" style="background: ${color.bg};">
              ${color.initials}
            </div>
            <div class="workload-title-col">
              <div class="member-name">${member.name}</div>
              <div class="member-role">${member.role}</div>
            </div>
          </div>
          <div class="workload-stats-row">
            <span>Tasks: <strong>${stats.completed}/${stats.total} Done</strong></span>
            <span style="font-weight: 700; color: var(--primary);">${stats.percentage}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill primary" style="width: ${stats.percentage}%;"></div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  /**
   * Render Dashboard Recent Activity
   */
  renderDashboardActivities() {
    const container = document.getElementById('dashboardActivityList');
    if (!container) return;

    if (this.state.activities.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem;">No recent activities.</div>`;
      return;
    }

    container.innerHTML = this.state.activities.slice(0, 5).map(act => {
      let iconColor = 'var(--primary-light)';
      let textColor = 'var(--primary)';
      if (act.type === 'lead') {
        iconColor = 'var(--purple-light)';
        textColor = 'var(--purple)';
      } else if (act.type === 'task') {
        iconColor = 'var(--success-light)';
        textColor = 'var(--success)';
      }

      return `
        <div class="activity-item">
          <div class="activity-icon" style="background: ${iconColor}; color: ${textColor};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
          </div>
          <div class="activity-text-wrap">
            <div class="activity-text">${act.text}</div>
            <div class="activity-time">${act.time}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render Dashboard Active Projects Table
   */
  renderDashboardProjects() {
    const tbody = document.getElementById('dashboardProjectsTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.state.projects.slice(0, 4).map(p => {
      const statusClass = p.status.toLowerCase().replace(/\s+/g, '');
      return `
        <tr>
          <td>
            <strong>${p.name}</strong>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${p.category}</div>
          </td>
          <td>${p.client}</td>
          <td>
            <div class="team-avatar-stack">
              ${p.assignedTeam.map(name => {
                const c = this.memberColors[name] || { bg: '#4f46e5', initials: 'TM' };
                return `<div class="avatar-stack-item" style="background: ${c.bg};" title="${name}">${c.initials}</div>`;
              }).join('')}
            </div>
          </td>
          <td>${p.deadline}</td>
          <td style="min-width: 120px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 4px; font-weight: 600;">
              <span>${p.progress}%</span>
            </div>
            <div class="progress-track" style="height: 6px;">
              <div class="progress-fill primary" style="width: ${p.progress}%;"></div>
            </div>
          </td>
          <td>
            <span class="status-pill status-${statusClass}">${p.status}</span>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Render Clients Table
   */
  renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    const statusFilter = document.getElementById('clientStatusFilter')?.value || 'All';
    const searchQuery = (document.getElementById('clientSearchInput')?.value || '').toLowerCase().trim();

    const filtered = this.state.clients.filter(c => {
      const matchStatus = (statusFilter === 'All') || (c.status === statusFilter);
      const matchSearch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery) ||
        c.company.toLowerCase().includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery) ||
        c.industry.toLowerCase().includes(searchQuery);
      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">No clients found matching filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">${c.company}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${c.name} • ${c.industry || 'Client'}</div>
        </td>
        <td>
          <div style="font-weight: 500;">${c.email}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${c.phone}</div>
        </td>
        <td>
          <span style="font-weight: 700; background: var(--bg-muted); padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.78rem;">
            ${c.activeProjects} Active
          </span>
        </td>
        <td>
          <span style="font-weight: 700; color: var(--text-main);">$${Number(c.totalSpent).toLocaleString()}</span>
        </td>
        <td>
          <span class="status-pill status-${c.status.toLowerCase()}">${c.status}</span>
        </td>
        <td style="color: var(--text-muted); font-size: 0.82rem;">${c.joinedDate}</td>
        <td style="text-align: right;">
          <button class="table-action-btn" onclick="BrightCRM.viewClientDetails('${c.id}')">View</button>
          <button class="table-action-btn btn-delete" onclick="BrightCRM.deleteClient('${c.id}')" title="Delete Client">✕</button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Render Leads Table
   * Lead fields: Name, Email, Phone, Required Service, Lead Source, Status, Follow-up Date, Budget, Notes.
   */
  renderLeadsTable() {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    const statusFilter = document.getElementById('leadStatusFilter')?.value || 'All';
    const serviceFilter = document.getElementById('leadServiceFilter')?.value || 'All';
    const searchQuery = (document.getElementById('leadSearchInput')?.value || '').toLowerCase().trim();

    const filtered = this.state.leads.filter(lead => {
      const matchStatus = (statusFilter === 'All') || (lead.status === statusFilter);
      const matchService = (serviceFilter === 'All') || (lead.service === serviceFilter);
      const matchSearch = !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery) ||
        lead.email.toLowerCase().includes(searchQuery) ||
        lead.service.toLowerCase().includes(searchQuery) ||
        lead.source.toLowerCase().includes(searchQuery) ||
        (lead.notes && lead.notes.toLowerCase().includes(searchQuery));
      return matchStatus && matchService && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 30px; color: var(--text-muted);">No leads found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(lead => {
      const statusSlug = lead.status.toLowerCase().replace(/\s+/g, '');
      const notesSnippet = lead.notes && lead.notes.length > 45 ? lead.notes.substring(0, 45) + '...' : (lead.notes || 'No notes');

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">${lead.name}</div>
          </td>
          <td>
            <div style="font-weight: 500; font-size: 0.84rem;">${lead.email}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.phone}</div>
          </td>
          <td>
            <span style="font-size: 0.8rem; font-weight: 600; background: var(--primary-light); color: var(--primary); padding: 3px 8px; border-radius: var(--radius-sm);">
              ${lead.service}
            </span>
          </td>
          <td style="font-size: 0.82rem; color: var(--text-muted);">${lead.source}</td>
          <td>
            <span style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${lead.budget}</span>
          </td>
          <td style="font-size: 0.82rem; color: var(--text-muted); white-space: nowrap;">
            📅 ${lead.followUpDate}
          </td>
          <td>
            <span class="status-pill status-${statusSlug}">${lead.status}</span>
          </td>
          <td style="max-width: 180px; font-size: 0.78rem; color: var(--text-muted);" title="${lead.notes || ''}">
            ${notesSnippet}
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="table-action-btn" onclick="BrightCRM.viewLeadDetails('${lead.id}')">View</button>
            <button class="table-action-btn" onclick="BrightCRM.convertLeadToClient('${lead.id}')" title="Convert to Client" style="color: var(--success); font-weight: 700;">+ Convert</button>
            <button class="table-action-btn btn-delete" onclick="BrightCRM.deleteLead('${lead.id}')" title="Delete Lead">✕</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Render Projects Grid
   * Show: project name, assigned team members, deadline, status, progress.
   */
  renderProjectsGrid() {
    const container = document.getElementById('projectsGridContainer');
    if (!container) return;

    const statusFilter = document.getElementById('projectStatusFilter')?.value || 'All';
    const searchQuery = (document.getElementById('projectSearchInput')?.value || '').toLowerCase().trim();

    const filtered = this.state.projects.filter(p => {
      const matchStatus = (statusFilter === 'All') || (p.status === statusFilter);
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.client.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery);
      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No projects found matching filters.</div>`;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const statusSlug = p.status.toLowerCase().replace(/\s+/g, '');
      return `
        <div class="project-card">
          <div class="project-card-header">
            <div>
              <span class="project-category-tag">${p.category}</span>
              <h3 class="project-card-title">${p.name}</h3>
              <div class="project-client-name">Client: <strong>${p.client}</strong></div>
            </div>
            <span class="status-pill status-${statusSlug}">${p.status}</span>
          </div>

          <p class="project-description">${p.description || 'Deliverables in active production sprint.'}</p>

          <div class="project-progress-block">
            <div class="progress-info-row">
              <span>Overall Progress</span>
              <span style="color: var(--primary); font-weight: 700;">${p.progress}%</span>
            </div>
            <div class="progress-track" style="height: 8px;">
              <div class="progress-fill primary" style="width: ${p.progress}%;"></div>
            </div>
          </div>

          <div class="project-card-footer">
            <div class="team-avatar-stack">
              ${p.assignedTeam.map(name => {
                const c = this.memberColors[name] || { bg: '#4f46e5', initials: 'TM' };
                return `<div class="avatar-stack-item" style="background: ${c.bg};" title="${name}">${c.initials}</div>`;
              }).join('')}
            </div>
            <div>
              <span>Deadline: <strong>${p.deadline}</strong></span>
            </div>
          </div>

          <div class="project-card-actions">
            <button class="table-action-btn" onclick="BrightCRM.viewProjectDetails('${p.id}')">View Details</button>
            <button class="table-action-btn btn-delete" onclick="BrightCRM.deleteProject('${p.id}')" title="Delete Project">✕</button>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render Team Cards (Page 5)
   * 4 members with Urdu names:
   * Ahmed Raza (Web Developer), Fatima Noor (UI/UX Designer),
   * Ali Hassan (AI Video Creator), Ayesha Khan (Marketing Specialist)
   */
  renderTeamCards() {
    const container = document.getElementById('teamCardsGrid');
    if (!container) return;

    container.innerHTML = this.state.team.map(member => {
      const stats = this.getTeamMemberStats(member.name);
      const color = this.memberColors[member.name] || { bg: '#4f46e5', initials: 'TM' };

      return `
        <div class="team-member-card">
          <div class="team-card-top">
            <div class="large-avatar" style="background: ${color.bg};">
              ${color.initials}
            </div>
            <div class="team-title-wrap">
              <h3 class="team-member-name">${member.name}</h3>
              <span class="team-member-role-badge">${member.role}</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 3px;">
                ${member.department} &bull; <span style="color: var(--success); font-weight: 600;">&bull; ${member.status}</span>
              </div>
            </div>
          </div>

          <p class="team-card-bio">${member.bio}</p>

          <!-- Real-Time Task Performance Box -->
          <div class="member-performance-box">
            <div class="perf-title-row">
              <span>Task Performance Tracker</span>
              <span style="color: var(--primary); font-weight: 800;">${stats.percentage}% Done</span>
            </div>
            <div class="perf-stats-grid">
              <div class="perf-stat-item">
                <div class="perf-stat-num">${stats.total}</div>
                <div class="perf-stat-lbl">Total Tasks</div>
              </div>
              <div class="perf-stat-item">
                <div class="perf-stat-num" style="color: var(--success);">${stats.completed}</div>
                <div class="perf-stat-lbl">Completed</div>
              </div>
              <div class="perf-stat-item">
                <div class="perf-stat-num" style="color: var(--warning);">${stats.pending}</div>
                <div class="perf-stat-lbl">Pending</div>
              </div>
            </div>
            <div class="progress-track" style="height: 6px;">
              <div class="progress-fill primary" style="width: ${stats.percentage}%;"></div>
            </div>
          </div>

          <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;">
            Core Skills & Tools
          </div>
          <div class="team-skills-row">
            ${member.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>

          <div class="team-card-footer">
            <div style="font-size: 0.75rem;">
              <div>📧 ${member.email}</div>
              <div>📞 ${member.phone}</div>
            </div>
            <button class="btn-secondary" style="padding: 5px 10px; font-size: 0.78rem;" onclick="BrightCRM.openAddTaskForMember('${member.name}')">
              + Assign Task
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render Task Member Overview Summary (Page 6 top banner)
   * Shows each member's total tasks, completed tasks, pending tasks, and completion percentage.
   */
  renderTasksMemberOverview() {
    const container = document.getElementById('tasksMemberSummaryGrid');
    if (!container) return;

    container.innerHTML = this.state.team.map(member => {
      const stats = this.getTeamMemberStats(member.name);
      const color = this.memberColors[member.name] || { bg: '#4f46e5', initials: 'TM' };

      return `
        <div class="member-summary-tile">
          <div class="member-tile-header">
            <div class="tile-avatar" style="background: ${color.bg};">
              ${color.initials}
            </div>
            <div class="tile-name-wrap">
              <div class="tile-name">${member.name}</div>
              <div class="tile-role">${member.role}</div>
            </div>
          </div>
          <div class="tile-badges-row">
            <span>Total: <strong>${stats.total}</strong></span>
            <span style="color: var(--success);">Done: <strong>${stats.completed}</strong></span>
            <span style="color: var(--warning);">Pending: <strong>${stats.pending}</strong></span>
            <span style="color: var(--primary); font-weight: 700;">${stats.percentage}%</span>
          </div>
          <div class="progress-track" style="height: 6px;">
            <div class="progress-fill primary" style="width: ${stats.percentage}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render 12 Sample Tasks Table (Page 6)
   */
  renderTasksTable() {
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) return;

    const assigneeFilter = document.getElementById('taskAssigneeFilter')?.value || 'All';
    const statusFilter = document.getElementById('taskStatusFilter')?.value || 'All';
    const priorityFilter = document.getElementById('taskPriorityFilter')?.value || 'All';
    const searchQuery = (document.getElementById('taskSearchInput')?.value || '').toLowerCase().trim();

    const filtered = this.state.tasks.filter(t => {
      const matchAssignee = (assigneeFilter === 'All') || (t.assignedTo === assigneeFilter);
      const isCompleted = t.completed || t.status === 'Completed';
      let matchStatus = true;
      if (statusFilter === 'Completed') matchStatus = isCompleted;
      else if (statusFilter === 'Pending') matchStatus = !isCompleted && t.status === 'Pending';
      else if (statusFilter === 'In Progress') matchStatus = !isCompleted && t.status === 'In Progress';

      const matchPriority = (priorityFilter === 'All') || (t.priority === priorityFilter);
      const matchSearch = !searchQuery ||
        t.title.toLowerCase().includes(searchQuery) ||
        t.project.toLowerCase().includes(searchQuery) ||
        t.assignedTo.toLowerCase().includes(searchQuery);

      return matchAssignee && matchStatus && matchPriority && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 30px; color: var(--text-muted);">No tasks found matching filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const isDone = t.completed || t.status === 'Completed';
      const color = this.memberColors[t.assignedTo] || { bg: '#4f46e5', initials: 'TM' };
      const priorityClass = 'priority-' + t.priority.toLowerCase();
      const statusClass = 'status-' + t.status.toLowerCase().replace(/\s+/g, '');

      return `
        <tr>
          <td>
            <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} onchange="BrightCRM.toggleTaskStatus('${t.id}')" title="Mark Done / Pending">
          </td>
          <td>
            <div class="task-title-text ${isDone ? 'completed' : ''}">${t.title}</div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${t.description || ''}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 26px; height: 26px; border-radius: 50%; background: ${color.bg}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 700;">
                ${color.initials}
              </div>
              <span style="font-weight: 600; font-size: 0.85rem;">${t.assignedTo}</span>
            </div>
          </td>
          <td style="font-size: 0.82rem; color: var(--text-muted);">${t.project}</td>
          <td style="font-size: 0.82rem; color: var(--text-muted); white-space: nowrap;">📅 ${t.dueDate}</td>
          <td>
            <span class="priority-pill ${priorityClass}">${t.priority}</span>
          </td>
          <td>
            <span class="status-pill ${statusClass}">${t.status}</span>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="table-action-btn" onclick="BrightCRM.viewTaskDetails('${t.id}')">View</button>
            <button class="table-action-btn btn-delete" onclick="BrightCRM.deleteTask('${t.id}')" title="Delete Task">✕</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Toggle Task Status (Completed / In Progress)
   * Automatically recalculates all metrics and team member percentages!
   */
  toggleTaskStatus(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    task.status = task.completed ? 'Completed' : 'In Progress';

    this.logActivity(`Task "${task.title}" updated to ${task.status} (${task.assignedTo})`, 'task');
    this.saveState();
    if (window.SupabaseBridge) {
      window.SupabaseBridge.upsertTask(task);
    }
    this.renderAll();

    this.toast(`Task marked as ${task.status}!`, 'success');
  },

  /**
   * Convert Lead to Full Client
   */
  convertLeadToClient(leadId) {
    const lead = this.state.leads.find(l => l.id === leadId);
    if (!lead) return;

    const newClient = {
      id: 'client-' + Date.now(),
      name: lead.name,
      company: lead.name + ' Ventures',
      email: lead.email,
      phone: lead.phone,
      activeProjects: 1,
      totalSpent: lead.budgetNumber || 10000,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      industry: lead.service,
      notes: `Converted from inbound lead. Original Notes: ${lead.notes}`
    };

    lead.status = 'Won';

    this.state.clients.unshift(newClient);
    this.logActivity(`Lead ${lead.name} converted to Client (${newClient.company})!`, 'client');
    this.saveState();

    if (window.SupabaseBridge) {
      window.SupabaseBridge.upsertLead(lead);
      window.SupabaseBridge.upsertClient(newClient);
    }

    this.renderAll();
    this.toast(`🎉 Lead converted to Active Client!`, 'success');
  },

  /**
   * Delete Client
   */
  deleteClient(clientId) {
    if (!confirm('Are you sure you want to remove this client from CRM?')) return;
    const client = this.state.clients.find(c => c.id === clientId);
    this.state.clients = this.state.clients.filter(c => c.id !== clientId);
    this.logActivity(`Client "${client?.company || clientId}" removed`, 'general');
    this.saveState();
    if (window.SupabaseBridge) {
      window.SupabaseBridge.deleteClient(clientId);
    }
    this.renderAll();
    this.toast('Client removed successfully', 'info');
  },

  /**
   * Delete Lead
   */
  deleteLead(leadId) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    const lead = this.state.leads.find(l => l.id === leadId);
    this.state.leads = this.state.leads.filter(l => l.id !== leadId);
    this.logActivity(`Lead "${lead?.name || leadId}" removed`, 'general');
    this.saveState();
    if (window.SupabaseBridge) {
      window.SupabaseBridge.deleteLead(leadId);
    }
    this.renderAll();
    this.toast('Lead removed', 'info');
  },

  /**
   * Delete Task
   */
  deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const task = this.state.tasks.find(t => t.id === taskId);
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    this.logActivity(`Task "${task?.title || taskId}" removed`, 'task');
    this.saveState();
    if (window.SupabaseBridge) {
      window.SupabaseBridge.deleteTask(taskId);
    }
    this.renderAll();
    this.toast('Task deleted', 'info');
  },

  /**
   * Delete Project
   */
  deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const project = this.state.projects.find(p => p.id === projectId);
    this.state.projects = this.state.projects.filter(p => p.id !== projectId);
    this.logActivity(`Project "${project?.name || projectId}" deleted`, 'project');
    this.saveState();
    this.populateProjectSelects();
    if (window.SupabaseBridge) {
      window.SupabaseBridge.deleteProject(projectId);
    }
    this.renderAll();
    this.toast('Project deleted', 'info');
  },

  /**
   * View Project Details Modal
   */
  viewProjectDetails(projectId) {
    const p = this.state.projects.find(item => item.id === projectId);
    if (!p) return;

    document.getElementById('detailsModalTitle').textContent = `Project: ${p.name}`;
    document.getElementById('detailsModalContent').innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Project Name:</span>
        <span class="detail-value">${p.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Client Name:</span>
        <span class="detail-value">${p.client}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Category / Service:</span>
        <span class="detail-value">${p.category}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Budget:</span>
        <span class="detail-value">${p.budget || 'Not specified'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Deadline:</span>
        <span class="detail-value">${p.deadline}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">${p.status}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Completion Progress:</span>
        <span class="detail-value" style="font-weight: 700; color: var(--primary);">${p.progress}%</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Assigned Specialists:</span>
        <span class="detail-value">${Array.isArray(p.assignedTeam) ? p.assignedTeam.join(', ') : p.assignedTeam}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Scope & Summary:</span>
        <span class="detail-value" style="font-weight: normal; font-size: 0.85rem;">${p.description || 'No description provided'}</span>
      </div>
    `;

    document.getElementById('detailsModalFooter').innerHTML = `
      <button type="button" class="btn-danger" style="background: var(--danger-light); color: var(--danger); border: 1px solid var(--danger-border); padding: 8px 16px; border-radius: var(--radius-md); font-weight: 600;" onclick="BrightCRM.deleteProject('${p.id}'); BrightCRM.closeModal('detailsModal');">Delete Project</button>
      <button type="button" class="btn-secondary" onclick="BrightCRM.closeModal('detailsModal')">Close</button>
    `;

    this.openModal('detailsModal');
  },

  /**
   * View Client Details Modal
   */
  viewClientDetails(clientId) {
    const c = this.state.clients.find(item => item.id === clientId);
    if (!c) return;

    document.getElementById('detailsModalTitle').textContent = `Client: ${c.company}`;
    document.getElementById('detailsModalContent').innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Company Name:</span>
        <span class="detail-value">${c.company}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Primary Contact:</span>
        <span class="detail-value">${c.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${c.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">${c.phone}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Industry:</span>
        <span class="detail-value">${c.industry || 'Not specified'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Active Projects:</span>
        <span class="detail-value">${c.activeProjects}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total Spend:</span>
        <span class="detail-value">$${Number(c.totalSpent).toLocaleString()}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">${c.status}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Joined Date:</span>
        <span class="detail-value">${c.joinedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Account Notes:</span>
        <span class="detail-value" style="font-weight: normal; font-size: 0.85rem;">${c.notes || 'None'}</span>
      </div>
    `;

    this.openModal('detailsModal');
  },

  /**
   * View Lead Details Modal
   */
  viewLeadDetails(leadId) {
    const l = this.state.leads.find(item => item.id === leadId);
    if (!l) return;

    document.getElementById('detailsModalTitle').textContent = `Lead: ${l.name}`;
    document.getElementById('detailsModalContent').innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Lead Name:</span>
        <span class="detail-value">${l.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${l.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">${l.phone}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Required Service:</span>
        <span class="detail-value">${l.service}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Lead Source:</span>
        <span class="detail-value">${l.source}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">${l.status}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Follow-up Date:</span>
        <span class="detail-value">${l.followUpDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Budget:</span>
        <span class="detail-value">${l.budget}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Notes:</span>
        <span class="detail-value" style="font-weight: normal; font-size: 0.85rem;">${l.notes || 'No notes provided'}</span>
      </div>
    `;

    document.getElementById('detailsModalFooter').innerHTML = `
      <button type="button" class="btn-primary" onclick="BrightCRM.convertLeadToClient('${l.id}'); BrightCRM.closeModal('detailsModal');">Convert to Client</button>
      <button type="button" class="btn-secondary" onclick="BrightCRM.closeModal('detailsModal')">Close</button>
    `;

    this.openModal('detailsModal');
  },

  /**
   * View Task Details Modal
   */
  viewTaskDetails(taskId) {
    const t = this.state.tasks.find(item => item.id === taskId);
    if (!t) return;

    document.getElementById('detailsModalTitle').textContent = `Task: ${t.title}`;
    document.getElementById('detailsModalContent').innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Task Name:</span>
        <span class="detail-value">${t.title}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Assigned To:</span>
        <span class="detail-value">${t.assignedTo}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Project:</span>
        <span class="detail-value">${t.project}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span class="detail-value">${t.dueDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Priority:</span>
        <span class="detail-value">${t.priority}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">${t.status}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Deliverable Details:</span>
        <span class="detail-value" style="font-weight: normal; font-size: 0.85rem;">${t.description || 'No description provided'}</span>
      </div>
    `;

    document.getElementById('detailsModalFooter').innerHTML = `
      <button type="button" class="btn-primary" onclick="BrightCRM.toggleTaskStatus('${t.id}'); BrightCRM.closeModal('detailsModal');">Toggle Status</button>
      <button type="button" class="btn-secondary" onclick="BrightCRM.closeModal('detailsModal')">Close</button>
    `;

    this.openModal('detailsModal');
  },

  /**
   * Open Task Modal Pre-selected for a specific team member
   */
  openAddTaskForMember(memberName) {
    const select = document.getElementById('taskAssigneeSelect');
    if (select) {
      select.value = memberName;
    }
    this.openModal('addTaskModal');
  },

  /**
   * Modal Management
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  },

  /**
   * Toast notification system
   */
  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;
    toastEl.innerHTML = `
      <div style="font-size: 1.1rem;">
        ${type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'}
      </div>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      setTimeout(() => toastEl.remove(), 250);
    }, 3200);
  },

  /**
   * Hash routing and view switching
   */
  setupRouting() {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      this.navigate(hash, false);
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
  },

  navigate(pageId, updateHash = true) {
    const validPages = ['dashboard', 'clients', 'leads', 'projects', 'team', 'tasks'];
    const targetPage = validPages.includes(pageId) ? pageId : 'dashboard';

    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${targetPage}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === targetPage) {
        link.classList.add('active');
      }
    });

    this.state.currentPage = targetPage;
    if (updateHash) {
      window.location.hash = targetPage;
    }

    // Close mobile sidebar if open
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Setup UI Event Listeners
   */
  setupEventListeners() {
    // Nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigate(page);
      });
    });

    // Mobile sidebar toggle
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.add('mobile-open');
    });

    document.getElementById('sidebarCloseBtn')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('mobile-open');
    });

    // Quick Action Dropdown
    const quickActionBtn = document.getElementById('quickActionBtn');
    const quickActionDropdown = document.getElementById('quickActionDropdown');
    quickActionBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      quickActionDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      quickActionDropdown?.classList.remove('show');
    });

    // Quick Action buttons inside dropdown
    document.getElementById('quickAddLeadBtn')?.addEventListener('click', () => {
      this.openModal('addLeadModal');
    });
    document.getElementById('quickAddClientBtn')?.addEventListener('click', () => {
      this.openModal('addClientModal');
    });
    document.getElementById('quickAddTaskBtn')?.addEventListener('click', () => {
      this.openModal('addTaskModal');
    });
    document.getElementById('quickAddProjectBtn')?.addEventListener('click', () => {
      this.openModal('addProjectModal');
    });

    // Dashboard Action Buttons
    document.getElementById('dashAddLeadBtn')?.addEventListener('click', () => this.openModal('addLeadModal'));
    document.getElementById('dashAddProjectBtn')?.addEventListener('click', () => this.openModal('addProjectModal'));
    document.getElementById('dashAddTaskBtn')?.addEventListener('click', () => this.openModal('addTaskModal'));

    // Open Modal buttons on individual views
    document.getElementById('openAddClientModalBtn')?.addEventListener('click', () => this.openModal('addClientModal'));
    document.getElementById('openAddLeadModalBtn')?.addEventListener('click', () => this.openModal('addLeadModal'));
    document.getElementById('openAddProjectModalBtn')?.addEventListener('click', () => this.openModal('addProjectModal'));
    document.getElementById('openAddTaskModalBtn')?.addEventListener('click', () => this.openModal('addTaskModal'));

    // Reset Data Button
    document.getElementById('resetDataBtn')?.addEventListener('click', () => {
      if (confirm('Reset all demo data back to default Bright Digital Agency seed data?')) {
        this.resetToDefaults();
        this.populateProjectSelects();
        this.renderAll();
        this.toast('CRM data restored to initial demo state', 'info');
      }
    });

    // Notification button
    document.getElementById('notifBtn')?.addEventListener('click', () => {
      this.toast('You have 3 unread team milestone notifications.', 'info');
    });

    // Global Search Bar
    document.getElementById('globalSearchInput')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      // Sync with active view search if applicable
      if (this.state.currentPage === 'clients') {
        const inp = document.getElementById('clientSearchInput');
        if (inp) { inp.value = q; this.renderClientsTable(); }
      } else if (this.state.currentPage === 'leads') {
        const inp = document.getElementById('leadSearchInput');
        if (inp) { inp.value = q; this.renderLeadsTable(); }
      } else if (this.state.currentPage === 'tasks') {
        const inp = document.getElementById('taskSearchInput');
        if (inp) { inp.value = q; this.renderTasksTable(); }
      } else if (this.state.currentPage === 'projects') {
        const inp = document.getElementById('projectSearchInput');
        if (inp) { inp.value = q; this.renderProjectsGrid(); }
      }
    });

    // Page-specific filter listeners
    document.getElementById('clientStatusFilter')?.addEventListener('change', () => this.renderClientsTable());
    document.getElementById('clientSearchInput')?.addEventListener('input', () => this.renderClientsTable());

    document.getElementById('leadStatusFilter')?.addEventListener('change', () => this.renderLeadsTable());
    document.getElementById('leadServiceFilter')?.addEventListener('change', () => this.renderLeadsTable());
    document.getElementById('leadSearchInput')?.addEventListener('input', () => this.renderLeadsTable());

    document.getElementById('projectStatusFilter')?.addEventListener('change', () => this.renderProjectsGrid());
    document.getElementById('projectSearchInput')?.addEventListener('input', () => this.renderProjectsGrid());

    document.getElementById('taskAssigneeFilter')?.addEventListener('change', () => this.renderTasksTable());
    document.getElementById('taskStatusFilter')?.addEventListener('change', () => this.renderTasksTable());
    document.getElementById('taskPriorityFilter')?.addEventListener('change', () => this.renderTasksTable());
    document.getElementById('taskSearchInput')?.addEventListener('input', () => this.renderTasksTable());

    // Modal Close Buttons and Backdrop click
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.close;
        this.closeModal(targetId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
      }
    });

    // Form Submissions
    this.setupFormSubmissions();
  },

  /**
   * Setup Form Handlers
   */
  setupFormSubmissions() {
    // 1. Add Lead Form Submission
    document.getElementById('addLeadForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const budgetRaw = form.leadBudget.value.trim();
      const numBudget = parseInt(budgetRaw.replace(/[^0-9]/g, ''), 10) || 5000;

      const newLead = {
        id: 'lead-' + Date.now(),
        name: form.leadName.value.trim(),
        email: form.leadEmail.value.trim(),
        phone: form.leadPhone.value.trim(),
        service: form.leadService.value,
        source: form.leadSource.value,
        status: form.leadStatus.value,
        followUpDate: form.leadFollowUpDate.value,
        budget: budgetRaw.startsWith('$') ? budgetRaw : '$' + budgetRaw,
        budgetNumber: numBudget,
        notes: form.leadNotes.value.trim()
      };

      this.state.leads.unshift(newLead);
      this.logActivity(`New Lead added: ${newLead.name} (${newLead.budget})`, 'lead');
      this.saveState();
      if (window.SupabaseBridge) {
        window.SupabaseBridge.upsertLead(newLead);
      }
      this.renderAll();
      this.closeModal('addLeadModal');
      form.reset();
      this.toast(`Lead "${newLead.name}" saved successfully!`, 'success');
    });

    // 2. Add Client Form Submission
    document.getElementById('addClientForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;

      const newClient = {
        id: 'client-' + Date.now(),
        name: form.clientName.value.trim(),
        company: form.clientCompany.value.trim(),
        email: form.clientEmail.value.trim(),
        phone: form.clientPhone.value.trim(),
        activeProjects: 1,
        totalSpent: Number(form.clientTotalSpent.value) || 0,
        status: form.clientStatus.value,
        joinedDate: form.clientJoinedDate.value,
        industry: form.clientIndustry.value.trim() || 'General Client',
        notes: form.clientNotes.value.trim()
      };

      this.state.clients.unshift(newClient);
      this.logActivity(`New Client created: ${newClient.company}`, 'client');
      this.saveState();
      if (window.SupabaseBridge) {
        window.SupabaseBridge.upsertClient(newClient);
      }
      this.renderAll();
      this.closeModal('addClientModal');
      form.reset();
      this.toast(`Client "${newClient.company}" added!`, 'success');
    });

    // 3. Add Task Form Submission
    document.getElementById('addTaskForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const initialStatus = form.taskStatus.value;

      const newTask = {
        id: 'task-' + Date.now(),
        title: form.taskTitle.value.trim(),
        assignedTo: form.taskAssignedTo.value,
        project: form.taskProject.value,
        dueDate: form.taskDueDate.value,
        priority: form.taskPriority.value,
        status: initialStatus,
        completed: initialStatus === 'Completed',
        description: form.taskDescription.value.trim()
      };

      this.state.tasks.unshift(newTask);
      this.logActivity(`Task "${newTask.title}" assigned to ${newTask.assignedTo}`, 'task');
      this.saveState();
      if (window.SupabaseBridge) {
        window.SupabaseBridge.upsertTask(newTask);
      }
      this.renderAll();
      this.closeModal('addTaskModal');
      form.reset();
      this.toast(`Task assigned to ${newTask.assignedTo}!`, 'success');
    });

    // 4. Add Project Form Submission
    document.getElementById('addProjectForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const selectedMembers = Array.from(form.projectAssignedTeam.selectedOptions).map(o => o.value);

      const newProject = {
        id: 'proj-' + Date.now(),
        name: form.projectName.value.trim(),
        client: form.projectClient.value.trim(),
        category: form.projectCategory.value.trim(),
        assignedTeam: selectedMembers.length > 0 ? selectedMembers : ['Ahmed Raza'],
        deadline: form.projectDeadline.value,
        status: 'In Progress',
        progress: Number(form.projectProgress.value) || 10,
        budget: form.projectBudget.value.trim() || '$10,000',
        description: form.projectDescription.value.trim()
      };

      this.state.projects.unshift(newProject);
      this.populateProjectSelects();
      this.logActivity(`New Project created: ${newProject.name}`, 'project');
      this.saveState();
      if (window.SupabaseBridge) {
        window.SupabaseBridge.upsertProject(newProject);
      }
      this.renderAll();
      this.closeModal('addProjectModal');
      form.reset();
      this.toast(`Project "${newProject.name}" created!`, 'success');
    });
  },

  /**
   * Supabase Integration Setup & Handlers
   */
  initSupabaseIntegration() {
    if (!window.SupabaseBridge) return;

    // Listen for status changes and update UI badges
    window.SupabaseBridge.onStatusChange((statusObj) => {
      this.updateSupabaseUI(statusObj);
    });

    // Wire Supabase UI Elements
    document.getElementById('supabaseHeaderBtn')?.addEventListener('click', () => {
      this.openModal('supabaseSettingsModal');
    });

    document.getElementById('sidebarSupabaseBtn')?.addEventListener('click', () => {
      this.openModal('supabaseSettingsModal');
    });

    // Test connection button
    document.getElementById('btnTestSupabase')?.addEventListener('click', async () => {
      const btn = document.getElementById('btnTestSupabase');
      if (btn) btn.textContent = 'Testing...';
      const res = await window.SupabaseBridge.testConnection();
      if (btn) btn.textContent = '⚡ Ping Supabase';
      if (res.success) {
        this.toast('✓ Successfully connected to Supabase PostgreSQL database!', 'success');
      } else {
        this.toast('Connection error: ' + res.message, 'warning');
      }
    });

    // Save credentials form
    document.getElementById('supabaseConfigForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = document.getElementById('inputSupabaseUrl').value.trim();
      const key = document.getElementById('inputSupabaseAnonKey').value.trim();
      const saveBtn = document.getElementById('btnSaveSupabaseConfig');
      if (saveBtn) saveBtn.textContent = 'Connecting...';

      const connected = await window.SupabaseBridge.updateConfig(url, key);
      if (saveBtn) saveBtn.textContent = 'Save Credentials & Connect';

      if (connected) {
        this.toast('Supabase connected! Ready to sync database.', 'success');
      } else {
        this.toast('Saved, but connection check returned warnings. Check credentials and schema.', 'warning');
      }
    });

    // Disconnect button
    document.getElementById('btnDisconnectSupabase')?.addEventListener('click', () => {
      window.SupabaseBridge.disconnect();
      this.toast('Disconnected from Supabase. Working in local storage mode.', 'info');
    });

    // Push All to Supabase button
    document.getElementById('btnSyncAllToSupabase')?.addEventListener('click', async () => {
      const btn = document.getElementById('btnSyncAllToSupabase');
      if (!window.SupabaseBridge.isConnected) {
        this.toast('Please connect to Supabase first by providing valid credentials.', 'warning');
        return;
      }
      try {
        if (btn) btn.textContent = 'Pushing Data...';
        const result = await window.SupabaseBridge.syncAllToSupabase(this.state);
        this.toast(`✓ All data pushed to Supabase! (${result.counts.clients} clients, ${result.counts.leads} leads, ${result.counts.projects} projects, ${result.counts.tasks} tasks)`, 'success');
      } catch (err) {
        this.toast(`Sync failed: ${err.message}`, 'danger');
      } finally {
        if (btn) btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>Seed / Push All to Supabase</span>
        `;
      }
    });

    // Pull All from Supabase button
    document.getElementById('btnPullFromSupabase')?.addEventListener('click', async () => {
      const btn = document.getElementById('btnPullFromSupabase');
      if (!window.SupabaseBridge.isConnected) {
        this.toast('Please connect to Supabase first by providing valid credentials.', 'warning');
        return;
      }
      try {
        if (btn) btn.textContent = 'Loading...';
        const remoteData = await window.SupabaseBridge.loadAllData();
        if (remoteData.totalRecords === 0) {
          this.toast('Supabase tables are currently empty. Click "Push All to Supabase" to seed them!', 'info');
        } else {
          if (remoteData.team && remoteData.team.length > 0) this.state.team = remoteData.team;
          if (remoteData.clients) this.state.clients = remoteData.clients;
          if (remoteData.leads) this.state.leads = remoteData.leads;
          if (remoteData.projects) this.state.projects = remoteData.projects;
          if (remoteData.tasks) this.state.tasks = remoteData.tasks;
          if (remoteData.activities) this.state.activities = remoteData.activities;

          this.saveState();
          this.populateProjectSelects();
          this.renderAll();
          this.toast(`✓ Loaded ${remoteData.totalRecords} records live from Supabase!`, 'success');
        }
      } catch (err) {
        this.toast(`Load failed: ${err.message}`, 'danger');
      } finally {
        if (btn) btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>Load All from Supabase</span>
        `;
      }
    });

    // Copy SQL Schema button
    document.getElementById('btnCopySqlSchema')?.addEventListener('click', async () => {
      try {
        const resp = await fetch('/supabase-schema.sql');
        let sql = '';
        if (resp.ok) {
          sql = await resp.text();
        } else {
          sql = document.getElementById('sqlSchemaPreview')?.textContent || '';
        }
        await navigator.clipboard.writeText(sql);
        this.toast('📋 Supabase SQL Schema copied to clipboard!', 'success');
      } catch (e) {
        this.toast('Could not copy automatically. You can copy supabase-schema.sql directly.', 'info');
      }
    });

    // Export Data Backup (JSON)
    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
      this.exportDataBackup();
    });

    // Boot Supabase Bridge asynchronously
    window.SupabaseBridge.init().then(async (connected) => {
      if (connected) {
        console.log('Supabase auto-connected successfully.');
        // If connected, automatically load live records from Supabase
        try {
          const remote = await window.SupabaseBridge.loadAllData();
          if (remote.totalRecords > 0) {
            if (remote.team && remote.team.length > 0) this.state.team = remote.team;
            if (remote.clients) this.state.clients = remote.clients;
            if (remote.leads) this.state.leads = remote.leads;
            if (remote.projects) this.state.projects = remote.projects;
            if (remote.tasks) this.state.tasks = remote.tasks;
            if (remote.activities) this.state.activities = remote.activities;
            this.saveState();
            this.populateProjectSelects();
            this.renderAll();
            this.toast('Synced with Supabase PostgreSQL cloud database.', 'success');
          }
        } catch (e) {
          console.warn('Could not auto-fetch remote data', e);
        }
      }
    });
  },

  updateSupabaseUI(statusObj) {
    const headerBtn = document.getElementById('supabaseHeaderBtn');
    const headerLabel = document.getElementById('supabaseStatusLabel');
    const banner = document.getElementById('dbStatusBanner');
    const bannerTitle = document.getElementById('dbModalStatusTitle');
    const bannerDesc = document.getElementById('dbModalStatusDesc');
    const sidebarBadge = document.getElementById('sidebarDbBadge');
    const inputUrl = document.getElementById('inputSupabaseUrl');
    const inputKey = document.getElementById('inputSupabaseAnonKey');

    if (inputUrl && statusObj.url) inputUrl.value = statusObj.url;
    if (inputKey && statusObj.hasKey && !inputKey.value) inputKey.value = window.SupabaseBridge.config.anonKey;

    if (headerBtn) {
      headerBtn.className = `supabase-status-btn ${statusObj.status}`;
    }

    if (headerLabel) {
      if (statusObj.status === 'connected') {
        headerLabel.textContent = '⚡ Supabase: Connected';
      } else if (statusObj.status === 'connecting') {
        headerLabel.textContent = 'Supabase: Connecting...';
      } else if (statusObj.status === 'error') {
        headerLabel.textContent = 'Supabase: Error';
      } else {
        headerLabel.textContent = 'Supabase: Demo Mode';
      }
    }

    if (banner) {
      banner.className = `db-status-banner ${statusObj.status}`;
    }

    if (bannerTitle) {
      if (statusObj.status === 'connected') {
        bannerTitle.textContent = 'Connected to Supabase';
      } else if (statusObj.status === 'connecting') {
        bannerTitle.textContent = 'Connecting to Supabase...';
      } else if (statusObj.status === 'error') {
        bannerTitle.textContent = 'Connection Error';
      } else {
        bannerTitle.textContent = 'Local Storage Mode';
      }
    }

    if (bannerDesc) {
      bannerDesc.textContent = statusObj.message;
    }

    if (sidebarBadge) {
      sidebarBadge.style.display = statusObj.status === 'connected' ? 'inline-block' : 'none';
    }
  },

  exportDataBackup() {
    const backupJson = JSON.stringify(this.state, null, 2);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bright_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast('CRM data backup downloaded as JSON', 'success');
  }
};

// Auto-boot upon DOM readiness
document.addEventListener('DOMContentLoaded', () => {
  BrightCRM.init();
});
