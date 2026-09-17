# Fort McKay First Nation — Gym Management

Next.js 14 (App Router) + React + TypeScript + Tailwind + Supabase + Recharts.

## Puesta en marcha
1. `npm install`
2. Copia `.env.example` a `.env.local` y rellena las claves de Supabase.
3. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
4. Crea el usuario del staff en Supabase Auth (Authentication > Users > Add user).
5. `npm run dev`

## Migraciones
Si el proyecto de Supabase ya estaba creado antes de un cambio de esquema,
corre los archivos nuevos en `supabase/migrations/` (en orden) en el SQL
Editor — `schema.sql` solo refleja el estado completo para instalaciones
nuevas.

## Rutas
- `/` portal publico: calendario semanal + reservas sin cuenta.
- `/login` acceso staff (Supabase Auth, email + password).
- `/admin` dashboard, `/admin/members`, `/admin/checkin`, `/admin/calendar`.

## Estructura
```
app/
  (public)/page.tsx            portal publico
  login/page.tsx               login staff
  admin/layout.tsx             shell con sidebar oscuro
  admin/page.tsx               dashboard + KPIs + grafico
  admin/members/page.tsx       CRUD miembros
  admin/checkin/page.tsx       check-in / check-out
  admin/calendar/page.tsx      calendario y clases
components/                    UI reutilizable
lib/                           supabase, tipos, queries, utils
supabase/schema.sql            tablas, indices, RLS
```
