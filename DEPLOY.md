# 🚀 Guía de Despliegue en Vercel con PostgreSQL

## Prerequisitos

- Cuenta en Vercel
- Base de datos PostgreSQL en Neon (ya configurada)
- Repositorio en GitHub

## Método 1: Desde la Web (Recomendado)

### Paso 1: Preparar el Código

1. Sube tu código a GitHub si aún no lo has hecho
2. Asegúrate de que `.env` esté en `.gitignore` (ya lo está)

### Paso 2: Configurar en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar GitHub)
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. **IMPORTANTE:** Antes de hacer deploy, configura las variables de entorno:
   - Ve a "Environment Variables"
   - Agrega: `DATABASE_URL` con el valor de tu conexión de Neon
   - Marca las casillas: Production, Preview, Development
5. En "Build & Development Settings":
   - Build Command: `npx prisma generate && next build`
   - Install Command: `npm install`
6. Click en "Deploy"

### Paso 3: Primera Migración (Solo una vez)

Después del primer despliegue exitoso, ejecuta desde tu máquina local:

```bash
# Aplicar las migraciones a la base de datos
npx prisma migrate deploy

# Poblar con los usuarios iniciales
npx prisma db seed
```

## Método 2: Desde la Terminal

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Asegúrate de que DATABASE_URL esté configurado en Vercel

# 4. Desplegar
vercel

# 5. Para producción
vercel --prod
```

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

- ✅ Los datos ahora se guardan en PostgreSQL (Neon)
- ✅ Los pagos persisten entre sesiones y dispositivos
- ✅ Ya no depende de localStorage
- ✅ Compatible con el Free Plan de Vercel
- ✅ La base de datos ya está creada y configurada
- ⚠️ **IMPORTANTE:** Debes configurar `DATABASE_URL` en Vercel

## 📊 Variable de Entorno Requerida

En Vercel, configura:

```
DATABASE_URL=postgresql://neondb_owner:npg_UI6AaO1yxEqr@ep-icy-cake-a8oo2yye-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🎯 Después del Despliegue

1. Vercel te dará una URL tipo: `tu-app.vercel.app`
2. Puedes agregar un dominio personalizado gratis
3. Los deploys automáticos se activan con cada push a main
4. Puedes ver logs y analytics en el dashboard de Vercel

## 🛠️ Solución de Problemas

**Si el build falla:**

- Asegúrate de que `DATABASE_URL` esté configurada en Vercel
- Verifica que el build command sea: `npx prisma generate && next build`
- Revisa los logs en el dashboard de Vercel

**Si no puedes hacer login:**

- Verifica que hayas ejecutado `npx prisma db seed` después del primer despliegue
- Conéctate a tu base de datos de Neon y verifica que existan usuarios en la tabla `users`

**Si los pagos no se guardan:**

- Verifica que `DATABASE_URL` esté correctamente configurada
- Revisa los logs de las funciones serverless en Vercel
- Asegúrate de que las tablas existan en la base de datos

## 📱 Compartir con tus Amigos

Una vez desplegado, simplemente comparte el link:

- `https://tu-app.vercel.app` para Marcos
- `https://tu-app.vercel.app` para Jair

Cada uno inicia sesión con su usuario y ve su deuda personalizada.

**Todos los pagos que registren se guardarán en la base de datos PostgreSQL y persistirán permanentemente.**

## 🔧 Comandos Útiles

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Aplicar migraciones en producción
npx prisma migrate deploy

# Poblar la base de datos con usuarios iniciales
npx prisma db seed

# Ver datos en Prisma Studio (interfaz visual)
npx prisma studio
```

## 📊 Estructura de la Base de Datos

La aplicación usa 3 tablas:

- **users** - Usuarios con sus préstamos originales
- **capital_payments** - Abonos extraordinarios a capital
- **installment_payments** - Pagos de cuotas mensuales
