# ⚽ Álbum Mundial 2026

App web para llevar el control de tu álbum de estampas del Mundial FIFA 2026.

## Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Hosting**: Vercel

## Setup en 5 pasos

### 1. Crea tu proyecto en Supabase
Ve a [supabase.com](https://supabase.com) → New project

### 2. Ejecuta el schema
En Supabase Dashboard → **SQL Editor**, pega y ejecuta:
```
supabase/schema.sql
```

### 3. Ejecuta el seed (960 estampas)
Luego en el mismo SQL Editor:
```
supabase/seed.sql
```

### 4. Configura variables de entorno
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase
# Las encuentras en: Settings → API
```

### 5. Instala y corre
```bash
npm install
npm run dev
```

## Deploy en Vercel
1. Push tu repo a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Agrega las env vars en Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy ✓

## Funciones
- ✅ Registro y login por email
- ✅ Dashboard con estadísticas globales
- ✅ Vista por selección (48 equipos, 16 grupos)
- ✅ Grilla visual de estampas (tengo / repetida / falta)
- ✅ Abrir sobre — registra estampa por estampa
- ✅ Lista de repetidas con gestión
- ✅ Buscador por nombre o número
- ✅ Progreso por selección y global
- ✅ Multi-usuario con datos aislados por RLS
