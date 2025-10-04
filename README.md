# Portal de Cobros - Sistema de Gestión de Préstamos

Una aplicación web moderna para gestionar préstamos personales con sistema de amortización francesa y seguimiento de abonos a capital.

## 🚀 Características

- **Autenticación Simple**: Login con usuarios predefinidos
- **Dashboard Personalizado**: Vista detallada del préstamo de cada usuario
- **Sistema de Amortización**: Cálculo automático con sistema francés (cuota fija)
- **Abonos a Capital**: Posibilidad de agregar pagos adelantados que acortan el plazo
- **Tabla de Amortización**: Visualización completa de todas las cuotas
- **Diseño Moderno**: UI/UX atractivo y responsive

## 👥 Usuarios Predefinidos

1. **Marcos Arango**

   - Usuario: `marcos`
   - Contraseña: `marcos123`
   - Préstamo: $10,465,300 COP

2. **Jair Viana**

   - Usuario: `jair`
   - Contraseña: `jair123`
   - Préstamo: $14,585,050 COP

3. **Santiago**
   - Usuario: `santiago`
   - Contraseña: `santiago123`
   - Préstamo: $1,431,871 COP

## 📊 Detalles del Sistema

- **Deuda Total de Tarjeta**: $26,482,221 COP
- **Tasa de Interés Mensual**: 3.199%
- **Número de Cuotas**: 12 (puede reducirse con abonos a capital)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🚢 Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Instala Vercel CLI: `npm i -g vercel`
3. Ejecuta: `vercel`
4. Sigue las instrucciones para vincular tu proyecto
5. Tu app estará desplegada en minutos

**O simplemente:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Estructura del Proyecto

```
CobrosApp/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── login/
│   │           └── route.ts
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── page.module.css
├── data/
│   └── users.ts
├── lib/
│   └── amortization.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Funcionalidades Principales

### Sistema de Amortización

- Cálculo automático de cuota mensual fija
- Distribución de intereses y capital en cada cuota
- Fórmula francesa: C = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]

### Abonos a Capital

- Los abonos NO reducen la cuota mensual
- Los abonos ACORTAN el plazo de pago
- Se debe seguir pagando la cuota mensual hasta saldar
- Los abonos se guardan localmente por usuario

## 🔒 Seguridad

Esta es una aplicación de demostración con autenticación simple. Para uso en producción, considera:

- Implementar autenticación JWT o NextAuth.js
- Usar una base de datos real
- Implementar hash de contraseñas
- Agregar middleware de protección de rutas

## 🎨 Tecnologías

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **CSS Modules**: Estilos con scope local
- **LocalStorage**: Persistencia de datos simple

## 📝 Notas

- Los datos se almacenan en LocalStorage (solo para demo)
- Cada usuario tiene su propia tabla de amortización
- Los abonos a capital se pueden agregar y eliminar
- La tabla se recalcula automáticamente con cada cambio

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

MIT
