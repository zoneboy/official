-- =============================================================================
-- RAN Website — Neon Database Schema (with bcrypt + TOTP 2FA)
-- Run this ONCE in the Neon SQL Editor (https://console.neon.tech)
-- =============================================================================

CREATE TABLE IF NOT EXISTS leaders (
  id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT '',
  dept TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS regional_coordinators (
  id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', region TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS state_coordinators (
  id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '', tag TEXT NOT NULL DEFAULT 'Conference',
  description TEXT NOT NULL DEFAULT '', event_date DATE, event_time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '', loc_type TEXT NOT NULL DEFAULT 'physical',
  image TEXT NOT NULL DEFAULT '', link TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '', tag TEXT NOT NULL DEFAULT 'Insights',
  description TEXT NOT NULL DEFAULT '', publish_date DATE, image TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', company TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin users table with bcrypt hash + TOTP secret
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret TEXT NOT NULL DEFAULT '',
  totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- SEED DATA (same as before — leaders, coordinators, events, articles)
-- ═══════════════════════════════════════════════════════
INSERT INTO leaders (id,name,role,dept,sort_order) VALUES
  ('l1','Rita Idehai','Immediate Past President','Advisory',1),
  ('l2','Harold Okonoboh','President','Executive HQ',2),
  ('l3','Victor Okunola','Vice President','Strategic Planning',3),
  ('l4','Oluwaseyi Olatunbosun','Treasurer','Treasury',4),
  ('l5','Cajetan Okeke','General Secretary','National Secretariat',5),
  ('l6','Idu Okeahialam','Public & Social Relations','Communications',6),
  ('l7','Taofeek Lateef','Provost & Membership Reg. Officer','Administration',7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO regional_coordinators (id,name,region,sort_order) VALUES
  ('r1','Daniel Ntia','South-South',1),('r2','Owoeye Femi','North-Central',2),
  ('r3','Hapsat Sali','North-East',3),('r4','Amunnadi Obinna','South-East',4),
  ('r5','','South-West',5),('r6','','North-West',6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO state_coordinators (id,name,state,sort_order) VALUES
  ('s1','Uche Orji','Abia State',1),('s2','Sadiq Mahmud','Adamawa State',2),('s3','Blessing Udoh','Akwa Ibom State',3),
  ('s4','Chika Nwosu','Anambra State',4),('s5','Isa Danladi','Bauchi State',5),('s6','Timi Preye','Bayelsa State',6),
  ('s7','Terkura Akem','Benue State',7),('s8','Mustapha Zulum','Borno State',8),('s9','Etim Bassey','Cross River State',9),
  ('s10','Oghenekaro Efe','Delta State',10),('s11','Nnamdi Chukwu','Ebonyi State',11),('s12','Osaro Igbinedion','Edo State',12),
  ('s13','Femi Adebayo','Ekiti State',13),('s14','Obinna Eze','Enugu State',14),('s15','Aliyu Usman','Gombe State',15),
  ('s16','Emeka Ike','Imo State',16),('s17','Suleiman Danjuma','Jigawa State',17),('s18','Ahmed Ibrahim','Kaduna State',18),
  ('s19','Zainab Bello','Kano State',19),('s20','Kabir Masari','Katsina State',20),('s21','Farouk Aliyu','Kebbi State',21),
  ('s22','Idris Abubakar','Kogi State',22),('s23','Tunde Salman','Kwara State',23),('s24','Emeka Nwachukwu','Lagos State',24),
  ('s25','Tanko Ibrahim','Nasarawa State',25),('s26','Musa Babangida','Niger State',26),('s27','Kunle Afolayan','Ogun State',27),
  ('s28','Segun Adewale','Ondo State',28),('s29','Wale Adeleke','Osun State',29),('s30','Abiola Ojo','Oyo State',30),
  ('s31','Gideon Daling','Plateau State',31),('s32','Tamuno George','Rivers State',32),('s33','Aliyu Shehu','Sokoto State',33),
  ('s34','Danladi Ishaya','Taraba State',34),('s35','Ibrahim Bukar','Yobe State',35),('s36','Abdulaziz Kabir','Zamfara State',36)
ON CONFLICT (id) DO NOTHING;

INSERT INTO events (id,title,tag,description,event_date,event_time,location,loc_type,link,sort_order) VALUES
  ('ev-1','3rd Annual Recyclers Conference','Conference','Smart Recycling Frontiers: Integrating Technology, Intelligence, and Innovation for a greener planet','2026-04-30','09:00 AM WAT','Muson Centre, Onikan, Lagos, Nigeria','physical','https://bit.ly/RANCONFERENCE2026',1),
  ('ev-2','Business Clinic 1.0','Workshop','Financial Resilience in a Volatile Market','2026-03-18','12:00 PM WAT','Online (Google Meet)','virtual','https://bit.ly/RANBusinessClinc',2),
  ('ev-3','The NEW TAX LAW','Webinar','Understanding the implications for green businesses','2025-12-17','12:00 PM WAT','Online (Google Meet)','virtual','https://bit.ly/RANWebinarTax',3),
  ('ev-4','ELV Recycling in Nigeria','Webinar','Opportunities in End-of-Life Vehicle Recycling in Nigeria','2025-12-12','11:00 AM WAT','Online (Google Meet)','virtual','https://bit.ly/RANWebinarELV',4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO articles (id,title,tag,description,publish_date,author,phone,company,content,sort_order) VALUES
  ('art-1','The Crude Reality: How Global Oil Prices Shape Nigeria''s Plastic Recycling Landscape','Insights','As a petroleum-dependent nation, fluctuations in oil markets profoundly impact the cost and demand for recycled plastics.','2026-04-09','Opeyemi Olaleye','+234 80-3218-2446','The M.O.T. Environmental Solutions Limited','Nigeria''s burgeoning recycling sector holds immense potential for job creation, waste reduction, and economic diversification.
The relationship is fundamentally inverse. Plastic, at its core, is a petroleum product.
Impact on Nigerian Recyclers:
• Cost Competitiveness: When oil prices are low, Nigerian recyclers compete with cheaper virgin plastic.
• Inventory Management: Recyclers may find the value of their stock plummet if oil prices suddenly drop.
• Investment and Growth: Sustained periods of low oil prices can stifle growth across the industry.
Navigating the Volatility
Despite these challenges, the Nigerian plastic recycling sector shows resilience.
• Diversification of Products: Exploring recycled materials for niche markets.
• Technological Advancement: Investing in more efficient processing technologies.
• Advocacy for Policy Support: Working with government to incentivize recycled content use.
By understanding these dynamics, Nigerian recyclers can continue to transform waste into valuable resources.',1)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- DEFAULT ADMIN USER
-- Password: ran2026admin  (bcrypt hash with 12 rounds)
-- TOTP not enabled yet — admin sets it up on first login
-- ═══════════════════════════════════════════════════════
INSERT INTO admin_users (username, password_hash, totp_secret, totp_enabled) VALUES
  ('admin', '$2a$12$LJ3m4ys4Rz0hXqOTQhQJyeKZ7F3Nm5l6X5AxjKqap8DhT3.hSMkW.', '', FALSE)
ON CONFLICT (username) DO NOTHING;

-- NOTE: The hash above is for password "ran2026admin".
-- To change it, run:  node scripts/hash-password.js YourNewPassword
-- Then update with:   UPDATE admin_users SET password_hash = '<new_hash>' WHERE username = 'admin';
