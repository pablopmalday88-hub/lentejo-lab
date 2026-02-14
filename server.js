const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3100;
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'lentejo2026';
const DATA_DIR = path.join(__dirname, 'data');
const IDEAS_FILE = path.join(DATA_DIR, 'ideas.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

app.use(express.json());
app.use(express.static('public'));

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers['x-access-password'];
  if (authHeader === ACCESS_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Inicializar archivos de datos
async function initData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      await fs.access(IDEAS_FILE);
    } catch {
      await fs.writeFile(IDEAS_FILE, JSON.stringify([], null, 2));
    }
    
    try {
      await fs.access(POSTS_FILE);
    } catch {
      await fs.writeFile(POSTS_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('Error inicializando datos:', err);
  }
}

// Public endpoint para verificar password
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (password === ACCESS_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Invalid password' });
  }
});

// === IDEAS (Protected) ===
app.get('/api/ideas', authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(IDEAS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ideas', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags, inspiration } = req.body;
    const data = await fs.readFile(IDEAS_FILE, 'utf8');
    const ideas = JSON.parse(data);
    
    const newIdea = {
      id: Date.now().toString(),
      title: title || '',
      content,
      inspiration: inspiration || '',
      category: category || 'general',
      tags: tags || [],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };
    
    ideas.unshift(newIdea);
    await fs.writeFile(IDEAS_FILE, JSON.stringify(ideas, null, 2));
    res.json(newIdea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/ideas/:id', authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(IDEAS_FILE, 'utf8');
    const ideas = JSON.parse(data);
    const idea = ideas.find(i => i.id === req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Update fields
    if (req.body.completed !== undefined) {
      idea.completed = req.body.completed;
      idea.completedAt = req.body.completed ? new Date().toISOString() : null;
    }
    
    idea.updatedAt = new Date().toISOString();
    
    await fs.writeFile(IDEAS_FILE, JSON.stringify(ideas, null, 2));
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ideas/:id', authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(IDEAS_FILE, 'utf8');
    const ideas = JSON.parse(data);
    const filtered = ideas.filter(i => i.id !== req.params.id);
    await fs.writeFile(IDEAS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === POSTS (Protected) ===
app.get('/api/posts', authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { url, title, description, platform, tags } = req.body;
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    const posts = JSON.parse(data);
    
    const newPost = {
      id: Date.now().toString(),
      url,
      title: title || '',
      description: description || '',
      platform: platform || 'other',
      tags: tags || [],
      savedAt: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    const posts = JSON.parse(data);
    const filtered = posts.filter(p => p.id !== req.params.id);
    await fs.writeFile(POSTS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats endpoint
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const ideasData = await fs.readFile(IDEAS_FILE, 'utf8');
    const ideas = JSON.parse(ideasData);
    
    const active = ideas.filter(i => !i.completed).length;
    const completed = ideas.filter(i => i.completed).length;
    
    res.json({ active, completed, total: ideas.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
initData().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐕 Lentejo Lab corriendo en http://0.0.0.0:${PORT}`);
    console.log(`🔐 Password: ${ACCESS_PASSWORD}`);
  });
});
