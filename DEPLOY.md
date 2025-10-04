# 🚀 Guía Rápida de Despliegue en Vercel

## Método 1: Desde la Web (Más Fácil)

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar GitHub)
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub (sube tu código a GitHub primero)
4. Vercel detectará automáticamente que es Next.js
5. Click en "Deploy"
6. ¡Listo! Tu app estará en línea en menos de 2 minutos

## Método 2: Desde la Terminal

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Desplegar
vercel

# 4. Para producción
vercel --prod
```

## Método 3: Un Solo Click

Si tu código está en GitHub, simplemente agrega este botón a tu README:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=TU_REPO_URL)

## 🔥 Probar Localmente

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Abrir http://localhost:3000
```

## 👤 Usuarios de Prueba

- **marcos** / marcos123
- **jair** / jair123
- **santiago** / santiago123

## ⚡ Notas Importantes

- No necesitas configurar variables de entorno
- No necesitas base de datos (usa LocalStorage)
- Los datos se guardan en el navegador del usuario
- Compatible con el Free Plan de Vercel
- Se despliega en menos de 2 minutos

## 🎯 Después del Despliegue

1. Vercel te dará una URL tipo: `tu-app.vercel.app`
2. Puedes agregar un dominio personalizado gratis
3. Los deploys automáticos se activan con cada push a main
4. Puedes ver logs y analytics en el dashboard de Vercel

## 🛠️ Solución de Problemas

**Si el build falla:**

- Asegúrate de que `package.json` tenga todas las dependencias
- Verifica que `next.config.js` esté presente
- Revisa los logs en el dashboard de Vercel

**Si las rutas no funcionan:**

- Vercel configura automáticamente las rutas de Next.js
- No necesitas configuración adicional para las API routes

## 📱 Compartir con tus Amigos

Una vez desplegado, simplemente comparte el link:

- `https://tu-app.vercel.app` para Marcos
- `https://tu-app.vercel.app` para Jair

Cada uno inicia sesión con su usuario y ve su deuda personalizada.
