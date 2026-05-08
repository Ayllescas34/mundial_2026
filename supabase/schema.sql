-- ============================================================
-- ÁLBUM MUNDIAL 2026 — Schema Supabase
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Selecciones
CREATE TABLE IF NOT EXISTS teams (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  code           TEXT NOT NULL UNIQUE,
  group_name     TEXT NOT NULL,
  flag_emoji     TEXT DEFAULT '',
  total_stickers INT  DEFAULT 20,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- 2. Estampas
CREATE TABLE IF NOT EXISTS stickers (
  id         SERIAL PRIMARY KEY,
  team_id    INT  NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  number     TEXT NOT NULL UNIQUE,   -- ej: "MEX1", "ARG15"
  name       TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('player','squad_photo','badge','special')),
  position   TEXT,                   -- Portero, Defensa, etc.
  is_special BOOLEAN DEFAULT false,
  album_page INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Colección por usuario
CREATE TABLE IF NOT EXISTS user_collection (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_id  INT  NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  quantity    INT  DEFAULT 1 CHECK (quantity >= 0),
  obtained_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, sticker_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_stickers_team    ON stickers(team_id);
CREATE INDEX IF NOT EXISTS idx_collection_user  ON user_collection(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_stick ON user_collection(sticker_id);

-- ============================================================
-- ROW LEVEL SECURITY — Cada usuario solo ve SU colección
-- ============================================================
ALTER TABLE teams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collection   ENABLE ROW LEVEL SECURITY;

-- Teams y stickers: lectura pública (son datos compartidos del álbum)
CREATE POLICY "teams_public_read"    ON teams    FOR SELECT USING (true);
CREATE POLICY "stickers_public_read" ON stickers FOR SELECT USING (true);

-- Colección: solo el dueño puede ver y modificar la suya
CREATE POLICY "collection_select" ON user_collection
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "collection_insert" ON user_collection
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collection_update" ON user_collection
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "collection_delete" ON user_collection
  FOR DELETE USING (auth.uid() = user_id);
