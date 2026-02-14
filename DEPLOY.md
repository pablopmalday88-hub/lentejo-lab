# 🚀 Deploy Lentejo Lab en Railway

## Pasos para Desplegar

### 1️⃣ Crear Cuenta en Railway
1. Ve a: https://railway.app
2. Click en "Login" → "Login with GitHub"
3. Autoriza Railway con tu GitHub

### 2️⃣ Conectar Repositorio

**Opción A: Deploy desde GitHub (Recomendado)**
1. Sube este proyecto a GitHub:
   ```bash
   # Desde tu ordenador local
   cd /ruta/a/lentejo-lab
   git remote add origin https://github.com/TU_USUARIO/lentejo-lab.git
   git push -u origin master
   ```

2. En Railway:
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Selecciona `lentejo-lab`
   - Railway detectará automáticamente que es Node.js

**Opción B: Deploy directo desde CLI**
1. Instalar Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Deploy desde el servidor:
   ```bash
   cd /home/claw1/.openclaw/workspace/lentejo-lab
   railway init
   railway up
   ```

### 3️⃣ Configurar Variables (Opcional)
No necesitas variables de entorno por ahora. Todo funciona out-of-the-box.

### 4️⃣ Obtener URL Pública
1. En el dashboard de Railway → click en tu proyecto
2. Ve a "Settings" → "Generate Domain"
3. Copia la URL (ej: `lentejo-lab-production.up.railway.app`)

## ⚠️ IMPORTANTE: Persistencia de Datos

**Railway resetea los archivos en cada deploy**, así que `data/ideas.json` y `data/posts.json` se borrarán.

### Soluciones:

**Opción 1: Railway Volumes (Beta)**
1. En Railway dashboard → tu proyecto
2. Variables → "Add Variable"
3. Añadir: `RAILWAY_VOLUME_MOUNT_PATH=/app/data`
4. Railway automáticamente creará un volumen persistente

**Opción 2: Migrar a MongoDB (futuro)**
Si acumulas muchos datos, podemos migrar a MongoDB Atlas (gratis) para persistencia real.

**Opción 3: Aceptar reset temporal**
Por ahora, los datos se resetean pero es temporal mientras pruebas. Más adelante migramos a DB real.

## 📱 Usar la App

Una vez deployed:
1. Abre la URL de Railway
2. Guarda ideas y posts directamente desde el navegador
3. También puedes mandarme comandos por Telegram y yo los guardo

## 🔧 Actualizaciones

Para actualizar la app después de cambios:

**Con GitHub:**
```bash
git add .
git commit -m "Actualización: descripción"
git push
```
Railway hace auto-deploy.

**Con CLI:**
```bash
railway up
```

## 🐕 Listo!

Una vez deployed, tendrás Lentejo Lab accesible desde cualquier dispositivo con internet.

**Ejemplo URL:** `https://lentejo-lab-production.up.railway.app`

---

**¿Problemas?** Avísame y lo arreglamos juntos 🐕
