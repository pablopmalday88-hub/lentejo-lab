# 🐕 Lentejo Lab - Información de Acceso

## 🌐 URLs de Acceso

**Desde el servidor (localhost):**
```
http://localhost:3100
```

**Desde cualquier dispositivo (red local o internet):**
```
http://212.227.231.40:3100
```

⚠️ **IMPORTANTE:** Necesitas abrir el puerto 3100 en el firewall si quieres acceder desde fuera del servidor.

## 🔓 Abrir Puerto (si quieres acceso remoto)

```bash
sudo ufw allow 3100/tcp
sudo ufw reload
```

## 📱 Cómo Usar

### Desde el Navegador
1. Abre la URL en cualquier navegador
2. Pestaña **Ideas**: Captura pensamientos rápidos
3. Pestaña **Posts**: Guarda contenido interesante

### Desde Telegram (a través de Lentejo)
Solo dime:
- "Guarda esta idea: [tu idea]" → Yo la guardo en Lentejo Lab
- "Guarda este post: [URL]" → Yo lo guardo con notas

## 🎨 Características

✅ **Diseño minimalista oscuro** (inspirado en Linear/Notion)
✅ **Totalmente responsive** (móvil, tablet, desktop)
✅ **Categorización automática** de ideas
✅ **Timestamps relativos** (hace 2h, hace 3d, etc.)
✅ **Sin login** (app personal)
✅ **Datos en JSON** (fácil de backupear/migrar)

## 🗂️ Categorías Disponibles

**Ideas:**
- General
- TribuClaw
- OpenClaw
- Producto
- Marketing
- Contenido

**Posts:**
- Twitter
- LinkedIn
- TikTok
- YouTube
- Otra

## 🔧 Gestión del Servidor

**Ver estado:**
```bash
ps aux | grep "node server.js"
```

**Ver logs:**
```bash
tail -f /home/claw1/.openclaw/workspace/lentejo-lab/lentejo-lab.log
```

**Reiniciar:**
```bash
pkill -f "node server.js"
cd /home/claw1/.openclaw/workspace/lentejo-lab
nohup node server.js > lentejo-lab.log 2>&1 &
```

## 💾 Backup de Datos

Tus datos están en:
```
/home/claw1/.openclaw/workspace/lentejo-lab/data/
  ├── ideas.json
  └── posts.json
```

Para hacer backup:
```bash
cp -r /home/claw1/.openclaw/workspace/lentejo-lab/data /ruta/backup/
```

---

**¡Listo para usar!** 🐕
