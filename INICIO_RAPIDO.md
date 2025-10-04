# 🎯 Inicio Rápido - Portal de Cobros

## ▶️ Correr la Aplicación AHORA

```bash
npm run dev
```

Luego abre: **http://localhost:3000**

## 🔑 Usuarios y Contraseñas

| Usuario    | Contraseña    | Nombre        | Préstamo    |
| ---------- | ------------- | ------------- | ----------- |
| `marcos`   | `marcos123`   | Marcos Arango | $10,465,300 |
| `jair`     | `jair123`     | Jair Viana    | $14,585,050 |
| `santiago` | `santiago123` | Santiago      | $1,431,871  |

## 💰 Información de la Deuda

- **Deuda Total**: $26,482,221 COP
- **Tasa Mensual**: 3.199%
- **Plazo Original**: 12 cuotas

## ✨ Características Principales

### 1. Login Seguro

- Cada usuario solo ve su información
- Credenciales quemadas en el código

### 2. Dashboard Personal

- Muestra tu préstamo individual
- Calcula tu cuota mensual automáticamente
- Tabla de amortización completa

### 3. Abonos a Capital

- Agrega pagos adelantados
- El sistema recalcula automáticamente
- **IMPORTANTE**: Los abonos NO reducen la cuota, solo acortan el plazo
- Debes seguir pagando la cuota mensual hasta terminar

### 4. Tabla de Amortización

- Ve todas tus cuotas futuras
- Desglose de interés y capital
- Saldo restante en cada cuota

## 📱 Cómo Usar la App

1. **Ingresar**

   - Abre http://localhost:3000
   - Usa tu usuario y contraseña
   - Click en "Iniciar Sesión"

2. **Ver tu Dashboard**

   - Verás 4 tarjetas con información clave
   - Tu cuota mensual está destacada
   - Revisa cuántas cuotas te faltan

3. **Agregar un Abono**

   - Click en "➕ Agregar Abono"
   - Selecciona la fecha
   - Ingresa el monto
   - Click en "Guardar Abono"
   - La tabla se actualizará automáticamente

4. **Revisar la Tabla**
   - Desplázate hacia abajo
   - Ve todas tus cuotas
   - Revisa cómo se distribuye el pago entre interés y capital

## 🚀 Desplegar en Vercel (5 minutos)

### Opción 1: GitHub + Vercel (Recomendado)

```bash
# 1. Inicializar git
git init
git add .
git commit -m "Initial commit"

# 2. Subir a GitHub
# - Crea un repo en github.com
# - Conecta tu repo local:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main

# 3. Ve a vercel.com
# - Login con GitHub
# - "Import Project"
# - Selecciona tu repo
# - Click "Deploy"
# - ¡Listo!
```

### Opción 2: Vercel CLI

```bash
# 1. Instalar Vercel
npm i -g vercel

# 2. Login
vercel login

# 3. Desplegar
vercel --prod
```

## 🎓 Ejemplo de Uso

**Escenario**: Marcos hace un abono de $5,000,000

1. Marcos ingresa con `marcos` / `marcos123`
2. Ve que su cuota mensual es ~$1,203,000
3. Click en "➕ Agregar Abono"
4. Fecha: 2025-10-15
5. Monto: 5000000
6. "Guardar Abono"

**Resultado**:

- La tabla muestra que ahora pagará menos cuotas
- Su cuota mensual sigue siendo ~$1,203,000
- Pero terminará de pagar antes del mes 12

## 📊 Cálculos

El sistema usa la fórmula de **amortización francesa**:

```
Cuota = Principal × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]

Donde:
- Principal = Tu préstamo
- r = 0.03199 (tasa mensual)
- n = 12 (número de cuotas)
```

## ❓ Preguntas Frecuentes

**¿Los datos se guardan?**

- Sí, en el navegador (LocalStorage)
- Cada usuario tiene sus propios datos

**¿Puedo acceder desde mi celular?**

- Sí, una vez desplegado en Vercel
- La UI es completamente responsive

**¿Qué pasa si hago un abono mayor al saldo?**

- El sistema lo detecta y ajusta
- El saldo nunca será negativo

**¿Puedo eliminar un abono?**

- Sí, click en el botón 🗑️ al lado del abono
- La tabla se recalculará

## 🎨 Personalización

Si quieres cambiar los montos o tasas, edita:

```typescript
// data/users.ts
export const TOTAL_DEBT = 26482221;
export const MONTHLY_RATE = 0.03199;
export const TOTAL_INSTALLMENTS = 12;
```

## 🤝 Soporte

Si algo no funciona:

1. Verifica que tengas Node.js instalado
2. Corre `npm install` de nuevo
3. Revisa que el puerto 3000 esté libre
4. Revisa los logs en la terminal

---

**¡Listo para usar! 🎉**

Comparte el link de Vercel con Marcos y Jair, y ellos podrán ver sus cuotas y hacer abonos cuando quieran.
