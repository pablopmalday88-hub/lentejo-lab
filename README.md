# 🐕 Lentejo Lab

Tu espacio personal para capturar ideas y posts interesantes.

## ✨ Características

### 💡 Ideas
- Guarda ideas rápidas con categorías
- Organización automática por fecha
- Categorías: General, TribuClaw, OpenClaw, Producto, Marketing, Contenido

### 🔖 Posts Guardados
- Guarda posts interesantes de cualquier plataforma
- Añade notas y contexto
- Acceso rápido con enlaces directos

## 🚀 Acceso

**URL:** http://localhost:3100

También accesible desde cualquier dispositivo en tu red local usando la IP del servidor.

## 🤖 API (para Lentejo)

### Agregar Idea
```bash
curl -X POST http://localhost:3100/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Nueva funcionalidad: dashboard de métricas",
    "category": "tribuclaw",
    "title": "Dashboard Analytics"
  }'
```

O usando el helper:
```bash
./add-idea.sh "Contenido de la idea" "categoria" "Título opcional"
```

### Agregar Post
```bash
curl -X POST http://localhost:3100/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://twitter.com/user/status/123",
    "description": "Buen ejemplo de growth hacking",
    "platform": "twitter",
    "title": "Thread sobre growth"
  }'
```

O usando el helper:
```bash
./add-post.sh "URL" "descripción" "plataforma" "título"
```

### Listar Todo
```bash
# Ideas
curl http://localhost:3100/api/ideas | jq

# Posts
curl http://localhost:3100/api/posts | jq
```

## 📂 Estructura de Datos

Los datos se guardan en `/data`:
- `ideas.json` - Todas las ideas
- `posts.json` - Todos los posts guardados

## 🎨 Diseño

Minimalista, oscuro, y limpio. Inspirado en herramientas modernas como Linear y Notion.

## 🔧 Gestión

### Iniciar
```bash
npm start
```

### Detener
```bash
pkill -f "node server.js"
```

### Ver logs
```bash
tail -f lentejo-lab.log
```

## 💡 Casos de Uso

**Para Pablo:**
- Capturar ideas de producto mientras navegas
- Guardar threads de Twitter interesantes
- Acumular contenido para TribuClaw

**Para Lentejo:**
- Recibir ideas de Pablo por Telegram y guardarlas automáticamente
- Organizar contenido por categorías
- Tener registro histórico de ideas y decisiones
