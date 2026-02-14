// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(targetTab).classList.add('active');
  });
});

// === IDEAS ===
async function loadIdeas() {
  const res = await fetch('/api/ideas');
  const ideas = await res.json();
  const container = document.getElementById('ideas-list');
  
  if (ideas.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💡</div>
        <p>No hay ideas guardadas aún.<br>¡Empieza a capturar tus pensamientos!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = ideas.map(idea => `
    <div class="item-card">
      <div class="item-header">
        <div>
          ${idea.title ? `<div class="item-title">${escapeHtml(idea.title)}</div>` : ''}
          <div class="item-meta">
            <span class="badge category">${idea.category}</span>
            <span class="badge">${formatDate(idea.createdAt)}</span>
          </div>
        </div>
        <button class="delete-btn" onclick="deleteIdea('${idea.id}')">✕</button>
      </div>
      <div class="item-content">${escapeHtml(idea.content).replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');
}

document.getElementById('idea-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  await fetch('/api/ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category')
    })
  });
  
  e.target.reset();
  loadIdeas();
});

async function deleteIdea(id) {
  if (!confirm('¿Eliminar esta idea?')) return;
  await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
  loadIdeas();
}

// === POSTS ===
async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const container = document.getElementById('posts-list');
  
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔖</div>
        <p>No hay posts guardados aún.<br>¡Guarda contenido interesante para consultar después!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = posts.map(post => `
    <div class="item-card">
      <div class="item-header">
        <div>
          ${post.title ? `<div class="item-title">${escapeHtml(post.title)}</div>` : ''}
          <div class="item-meta">
            <span class="badge category">${post.platform}</span>
            <span class="badge">${formatDate(post.savedAt)}</span>
          </div>
        </div>
        <button class="delete-btn" onclick="deletePost('${post.id}')">✕</button>
      </div>
      ${post.description ? `<div class="item-content">${escapeHtml(post.description).replace(/\n/g, '<br>')}</div>` : ''}
      <a href="${post.url}" target="_blank" class="item-link">Ver post →</a>
    </div>
  `).join('');
}

document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: formData.get('url'),
      title: formData.get('title'),
      description: formData.get('description'),
      platform: formData.get('platform')
    })
  });
  
  e.target.reset();
  loadPosts();
});

async function deletePost(id) {
  if (!confirm('¿Eliminar este post?')) return;
  await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  loadPosts();
}

// === UTILS ===
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

// Initial load
loadIdeas();
loadPosts();
