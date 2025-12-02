-- migrations/10_bot_sessions.sql
CREATE TABLE IF NOT EXISTS bot_sessions (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  session_json TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
