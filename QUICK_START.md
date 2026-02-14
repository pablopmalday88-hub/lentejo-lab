# ⚡ Quick Start: Deploy en Railway (2 minutos)

## 🎯 Opción más rápida (CLI desde el servidor)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login (abrirá navegador para autorizar)
railway login

# 3. Inicializar proyecto
cd /home/claw1/.openclaw/workspace/lentejo-lab
railway init

# 4. Deploy (sube todo automáticamente)
railway up

# 5. Obtener URL pública
railway domain
```

**¡Listo!** En 2 minutos tendrás Lentejo Lab online.

## 🌐 O Deploy desde GitHub (más pro)

1. Crea repo en GitHub: https://github.com/new
2. Sube el código:
   ```bash
   cd /home/claw1/.openclaw/workspace/lentejo-lab
   git remote add origin https://github.com/TU_USUARIO/lentejo-lab.git
   git branch -M main
   git push -u origin main
   ```
3. En Railway: "New Project" → "Deploy from GitHub" → selecciona el repo
4. Railway auto-detecta Node.js y hace deploy

## 📱 Resultado

URL pública tipo: `lentejo-lab-production.up.railway.app`

Accesible desde cualquier dispositivo 🐕

---

Ver `DEPLOY.md` para instrucciones completas y gestión de datos.
