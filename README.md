# Panza Llena, Corazón Contento

Juego de cocina mística: eres la sacerdotisa de Hestia preparando los sagrados brownies.
Vite + React + Tailwind v4. Es una app 100% estática (no necesita variables de entorno).

## Local
```bash
npm install
npm run dev
```

## Desplegar en Vercel
**Opción A – Dashboard:** sube el proyecto a GitHub, en vercel.com → *Add New Project* → importa el repo → *Deploy*.
Vercel detecta Vite automáticamente (`npm run build` → `dist`).

**Opción B – CLI:**
```bash
npm i -g vercel
vercel --prod
```
