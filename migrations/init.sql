
CREATE TABLE IF NOT EXISTS clients (
  id serial PRIMARY KEY,
  phone varchar(50) NOT NULL,
  name text,
  business_name text,
  theme_choice text,
  payload jsonb,
  status varchar(30) DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wa_sessions (
  id serial PRIMARY KEY,
  session_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id serial PRIMARY KEY,
  name text,
  number_encrypted text,
  receiver_name text,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_candidates (
  id serial PRIMARY KEY,
  client_id integer REFERENCES clients(id),
  screenshot_url text,
  ocr_text text,
  confidence numeric,
  status varchar(30) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS logs (
  id serial PRIMARY KEY,
  type text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_links (
  id serial PRIMARY KEY,
  category text,
  url text,
  safe boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
