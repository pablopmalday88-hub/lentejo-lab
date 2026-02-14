// Auth state
let authToken = localStorage.getItem('lentejoAuthToken');
let allIdeas = [];
let allPosts = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSearch = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    showApp();
  } else {
    showLogin();
  }
  
  setupEventListeners();
});

function setupEventListeners() {
  // Login
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  
  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  
  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderIdeas();
    });
  });
  
  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderIdeas();
  });
}

async function handleLogin() {
  const password = document.getElementById('password-input').value;
  const errorEl = document.getElementById('login-error');
  
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (res.ok) {
      authToken = password;
      localStorage.setItem('lentejoAuthToken', password);
      showApp();
    } else {
      errorEl.textContent = 'Contraseña incorrecta';
    }
  } catch (err) {
    errorEl.textContent = 'Error de conexión';
  }
}

function handleLogout() {
  authToken = null;
  localStorage.removeItem('lentejoAuthToken');
  showLogin();
}

function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  loadData();
}

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
}

async function loadData() {
  await Promise.all([loadIdeas(), loadPosts(), loadStats()]);
}

async function loadIdeas() {
  try {
    const res = await fetch('/api/ideas', {
      headers: { 'X-Access-Password': authToken }
    });
    allIdeas = await res.json();
    renderIdeas();
    renderCategoryFilters();
  } catch (err) {
    console.error('Error loading ideas:', err);
  }
}

async function loadPosts() {
  try {
    const res = await fetch('/api/posts', {
      headers: { 'X-Access-Password': authToken }
    });
    allPosts = await res.json();
    renderPosts();
  } catch (err) {
    console.error('Error loading posts:', err);
  }
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats', {
      headers: { 'X-Access-Password': authToken }
    });
    const stats = await res.json();
    
    document.getElementById('stat-active').textContent = stats.active;
    document.getElementById('stat-completed').textContent = stats.completed;
    
    const percentage = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0;
    document.getElementById('stat-percentage').textContent = percentage + '%';
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

function renderCategoryFilters() {
  const categories = [...new Set(allIdeas.map(i => i.category))];
  const container = document.getElementById('category-filters');
  
  if (categories.length === 0) return;
  
  container.innerHTML = categories.map(cat => `
    <button class="filter-btn category-filter ${currentCategory === cat ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');
  
  container.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderIdeas();
    });
  });
}

function renderIdeas() {
  let filtered = allIdeas;
  
  // Filter by status
  if (currentFilter === 'active') {
    filtered = filtered.filter(i => !i.completed);
  } else if (currentFilter === 'completed') {
    filtered = filtered.filter(i => i.completed);
  }
  
  // Filter by category
  if (currentCategory !== 'all') {
    filtered = filtered.filter(i => i.category === currentCategory);
  }
  
  // Filter by search
  if (currentSearch) {
    filtered = filtered.filter(i => 
      (i.title && i.title.toLowerCase().includes(currentSearch)) ||
      i.content.toLowerCase().includes(currentSearch) ||
      (i.inspiration && i.inspiration.toLowerCase().includes(currentSearch))
    );
  }
  
  const container = document.getElementById('ideas-list');
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💡</div>
        <p>No hay ideas aquí.<br>¡Dile a Lentejo que añada algo!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(idea => `
    <div class="item-card ${idea.completed ? 'completed' : ''}" data-id="${idea.id}">
      <div class="item-header">
        <div>
          ${idea.title ? `<div class="item-title">${escapeHtml(idea.title)}</div>` : ''}
          <div class="item-meta">
            <span class="badge category">${idea.category}</span>
            <span class="badge">${formatDate(idea.createdAt)}</span>
            ${idea.completed ? `<span class="badge">✅ ${formatDate(idea.completedAt)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="item-content">${escapeHtml(idea.content).replace(/\n/g, '<br>')}</div>
      ${idea.inspiration ? `<div class="item-inspiration">${escapeHtml(idea.inspiration)}</div>` : ''}
      <div class="item-actions">
        <button class="action-btn complete" onclick="toggleComplete('${idea.id}', ${!idea.completed})">
          ${idea.completed ? '↩️ Reactivar' : '✅ Completar'}
        </button>
        <button class="action-btn delete" onclick="deleteIdea('${idea.id}')">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

function renderPosts() {
  const container = document.getElementById('posts-list');
  
  if (allPosts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔖</div>
        <p>No hay posts guardados.<br>¡Dile a Lentejo que guarde algo interesante!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = allPosts.map(post => `
    <div class="item-card" data-id="${post.id}">
      <div class="item-header">
        <div>
          ${post.title ? `<div class="item-title">${escapeHtml(post.title)}</div>` : ''}
          <div class="item-meta">
            <span class="badge category">${post.platform}</span>
            <span class="badge">${formatDate(post.savedAt)}</span>
          </div>
        </div>
      </div>
      ${post.description ? `<div class="item-content">${escapeHtml(post.description).replace(/\n/g, '<br>')}</div>` : ''}
      <a href="${post.url}" target="_blank" class="item-link">Ver post →</a>
      <div class="item-actions">
        <button class="action-btn delete" onclick="deletePost('${post.id}')">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

async function toggleComplete(id, completed) {
  try {
    await fetch(`/api/ideas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Password': authToken
      },
      body: JSON.stringify({ completed })
    });
    
    await loadData();
  } catch (err) {
    console.error('Error toggling complete:', err);
  }
}

async function deleteIdea(id) {
  if (!confirm('¿Eliminar esta idea?')) return;
  
  try {
    await fetch(`/api/ideas/${id}`, {
      method: 'DELETE',
      headers: { 'X-Access-Password': authToken }
    });
    
    await loadData();
  } catch (err) {
    console.error('Error deleting idea:', err);
  }
}

async function deletePost(id) {
  if (!confirm('¿Eliminar este post?')) return;
  
  try {
    await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'X-Access-Password': authToken }
    });
    
    await loadData();
  } catch (err) {
    console.error('Error deleting post:', err);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
