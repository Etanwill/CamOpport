-- ============================================================
--  CamOpport — Full Schema Migration (role rename + new fields)
--  Run this in your Postgres DB if upgrading from the old schema
-- ============================================================

-- 1. Drop old enums and recreate (only if upgrading existing DB)
-- If starting fresh, drizzle push will handle this automatically.

-- Old enum rename: student/professional → job_seeker/employer
DO $$
BEGIN
  -- Rename old user_role enum values if they exist
  IF EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'student') THEN
    ALTER TYPE user_role RENAME VALUE 'student'      TO 'job_seeker';
    ALTER TYPE user_role RENAME VALUE 'professional' TO 'employer';
  END IF;
END$$;

-- 2. Add new columns to users table (safe - adds only if not present)
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills            jsonb DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_level  varchar(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_job_title varchar(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_url        text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url      text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_url     text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_job_types    jsonb DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_categories   jsonb DEFAULT '[]';

ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name        varchar(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_size        varchar(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry_sector     varchar(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_website     text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_description text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_logo        text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_phone       varchar(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified         boolean DEFAULT false;

-- 3. Add posted_by_id to jobs and competitions (employer link)
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS posted_by_id text REFERENCES users(id);
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS posted_by_id text REFERENCES users(id);

-- 4. Add employer fields to quizzes
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS created_by_id text REFERENCES users(id);
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS company_name  varchar(200);

-- ── Round 2: competition_registrations status + tracking ──
ALTER TABLE competition_registrations ADD COLUMN IF NOT EXISTS status   varchar(20) DEFAULT 'registered';
ALTER TABLE competition_registrations ADD COLUMN IF NOT EXISTS note     text;
ALTER TABLE competition_registrations ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();

-- ── Round 2: job_applications new fields ──
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_url    text;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS linkedin_url  text;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS portfolio_url text;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS phone         varchar(30);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS availability  varchar(200);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS note          text;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS is_casual     boolean DEFAULT false;

-- ── Round 2: users phone field ──
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone varchar(30);

-- ── Round 3: listing plan fields ──
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS plan             varchar(20) DEFAULT 'starter';
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS plan_expires_at  timestamp;
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS is_featured       boolean DEFAULT false;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS plan             varchar(20) DEFAULT 'starter';
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS plan_expires_at  timestamp;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS is_featured       boolean DEFAULT false;

-- ── Round 4: reviews, faqs, discussions ──
CREATE TABLE IF NOT EXISTS reviews (
  id           text PRIMARY KEY,
  target_type  varchar(20) NOT NULL,
  target_id    text NOT NULL,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating       integer NOT NULL,
  title        varchar(150),
  body         text NOT NULL,
  is_verified  boolean DEFAULT false,
  created_at   timestamp DEFAULT now(),
  updated_at   timestamp DEFAULT now()
);
CREATE TABLE IF NOT EXISTS faqs (
  id             text PRIMARY KEY,
  target_type    varchar(20) NOT NULL,
  target_id      text NOT NULL,
  question       text NOT NULL,
  answer         text,
  asked_by_id    text REFERENCES users(id) ON DELETE SET NULL,
  answered_by_id text REFERENCES users(id) ON DELETE SET NULL,
  created_at     timestamp DEFAULT now(),
  answered_at    timestamp
);
CREATE TABLE IF NOT EXISTS discussions (
  id           text PRIMARY KEY,
  target_type  varchar(20) NOT NULL,
  target_id    text NOT NULL,
  parent_id    text,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body         text NOT NULL,
  likes        integer DEFAULT 0,
  created_at   timestamp DEFAULT now(),
  updated_at   timestamp DEFAULT now()
);
-- ── Round 5: saved_opportunities + notifications ──────────────────────────────

CREATE TABLE IF NOT EXISTS saved_opportunities (
  id           text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type  varchar(20) NOT NULL,   -- 'job' | 'competition'
  target_id    text NOT NULL,
  saved_at     timestamp DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'application_update', 'competition_update', 'new_job',
      'new_competition', 'quiz_result', 'general'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS notifications (
  id         text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      varchar(200) NOT NULL,
  body       text NOT NULL,
  link       text,
  is_read    boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- ── Round 6: likes table ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS likes (
  id           text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type  varchar(20) NOT NULL,   -- 'job' | 'competition'
  target_id    text NOT NULL,
  created_at   timestamp DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);
-- ── Round 7: 100 Days of Code ─────────────────────────────────────────────────

CREATE TYPE IF NOT EXISTS coding_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE IF NOT EXISTS coding_language   AS ENUM ('javascript', 'python', 'typescript', 'java', 'cpp', 'c');
CREATE TYPE IF NOT EXISTS submission_status AS ENUM ('accepted', 'wrong_answer', 'runtime_error', 'time_limit', 'pending');

CREATE TABLE IF NOT EXISTS coding_challenges (
  id            text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  day_number    integer NOT NULL,
  title         varchar(200) NOT NULL,
  slug          varchar(200) NOT NULL UNIQUE,
  difficulty    coding_difficulty NOT NULL,
  category      varchar(80) NOT NULL,
  description   text NOT NULL,
  examples      jsonb DEFAULT '[]',
  constraints   jsonb DEFAULT '[]',
  hints         jsonb DEFAULT '[]',
  tags          jsonb DEFAULT '[]',
  starter_code  jsonb DEFAULT '{}',
  test_cases    jsonb DEFAULT '[]',
  xp_reward     integer DEFAULT 50 NOT NULL,
  source        varchar(20) DEFAULT 'custom',
  cf_contest_id integer,
  cf_index      varchar(5),
  cf_rating     integer,
  external_url  text,
  description_source varchar(20) DEFAULT 'fallback',
  created_at    timestamp DEFAULT now()
);

-- Migration for existing installs: drop the old UNIQUE constraint on day_number
-- (safe to run even if it was never created)
DO $$
BEGIN
  ALTER TABLE coding_challenges DROP CONSTRAINT IF EXISTS coding_challenges_day_number_key;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Add new columns if the table already existed from a previous version
ALTER TABLE coding_challenges ADD COLUMN IF NOT EXISTS source varchar(20) DEFAULT 'custom';
ALTER TABLE coding_challenges ADD COLUMN IF NOT EXISTS cf_contest_id integer;
ALTER TABLE coding_challenges ADD COLUMN IF NOT EXISTS cf_index varchar(5);
ALTER TABLE coding_challenges ADD COLUMN IF NOT EXISTS cf_rating integer;
ALTER TABLE coding_challenges ADD COLUMN IF NOT EXISTS external_url text;
ALTER TABLE coding_challenges ADD COLUMN IF NOT EXISTS description_source varchar(20) DEFAULT 'fallback';

-- Index for fast lookups by Codeforces source (avoid duplicate imports)
CREATE INDEX IF NOT EXISTS idx_coding_challenges_cf ON coding_challenges (cf_contest_id, cf_index);
CREATE INDEX IF NOT EXISTS idx_coding_challenges_day ON coding_challenges (day_number);

CREATE TABLE IF NOT EXISTS coding_submissions (
  id            text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  challenge_id  text NOT NULL REFERENCES coding_challenges(id) ON DELETE CASCADE,
  user_id       text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language      coding_language NOT NULL,
  code          text NOT NULL,
  status        submission_status DEFAULT 'pending' NOT NULL,
  passed_tests  integer DEFAULT 0 NOT NULL,
  total_tests   integer DEFAULT 0 NOT NULL,
  runtime_ms    integer,
  error_message text,
  is_first_solve boolean DEFAULT false NOT NULL,
  submitted_at  timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coding_progress (
  id             text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id        text NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_day    integer DEFAULT 1 NOT NULL,
  streak         integer DEFAULT 0 NOT NULL,
  longest_streak integer DEFAULT 0 NOT NULL,
  total_solved   integer DEFAULT 0 NOT NULL,
  last_solved_at timestamp,
  started_at     timestamp DEFAULT now(),
  completed_days jsonb DEFAULT '[]'
);

-- ============================================================
--  Messaging: Job Seeker ↔ Employer chat (one thread per job + seeker)
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
  id              text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  job_id          text NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_seeker_id   text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_id     text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message_at timestamp DEFAULT now() NOT NULL,
  created_at      timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id              text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  conversation_id text NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            text NOT NULL,
  is_read         boolean DEFAULT false NOT NULL,
  created_at      timestamp DEFAULT now() NOT NULL
);

-- One conversation per (job, job seeker) pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_job_seeker ON conversations (job_id, job_seeker_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);
-- ============================================================
--  Bits: free-to-post jobs + job-seeker application currency
-- ============================================================

-- Users start with a free bits balance (existing rows default to 20 too;
-- adjust manually if you don't want existing users retroactively credited).
ALTER TABLE users ADD COLUMN IF NOT EXISTS bits integer DEFAULT 20 NOT NULL;

-- Jobs no longer have a paid listing plan — bits_cost is what a job seeker
-- must spend to apply. Existing plan/plan_expires_at/is_featured columns are
-- left in place for backward compatibility but are no longer charged for.
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS bits_cost integer DEFAULT 5 NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bit_transaction_type') THEN
    CREATE TYPE bit_transaction_type AS ENUM (
      'signup_bonus', 'purchase', 'spend', 'refund', 'admin_adjustment'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS bit_transactions (
  id             text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id        text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type           bit_transaction_type NOT NULL,
  amount         integer NOT NULL,
  balance_after  integer NOT NULL,
  job_id         text REFERENCES jobs(id) ON DELETE SET NULL,
  package_id     varchar(50),
  description    text,
  created_at     timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bit_transactions_user ON bit_transactions (user_id, created_at);
-- ============================================================
-- Google OAuth support: track whether a user has explicitly
-- chosen job_seeker/employer. Existing rows default to true
-- (they already picked a role during normal signup); new
-- Google-auto-provisioned accounts are inserted with false so
-- the app can route them to the "choose your role" screen.
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_selected boolean DEFAULT true NOT NULL;

-- ============================================================
-- Email notifications: per-user opt-in/out for receiving an
-- email copy whenever we create an in-app notification for them.
-- Defaults to true so nobody misses updates by default; users
-- can turn it off from their Profile page.
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true NOT NULL;
-- ============================================================
-- Zone + geocoded coordinates for jobs & competitions.
-- "zone" is a free-text specific location (e.g. "Bonapriso, near
-- Total station") the employer types when posting. It gets
-- geocoded (Nominatim) client-side into latitude/longitude so the
-- Location & Directions map can place a precise pin and draw a
-- real road route from the job seeker's current location, instead
-- of only falling back to the city-center coordinates.
-- ============================================================
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS zone       varchar(250);
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS latitude   double precision;
ALTER TABLE jobs         ADD COLUMN IF NOT EXISTS longitude  double precision;

ALTER TABLE competitions ADD COLUMN IF NOT EXISTS zone       varchar(250);
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS latitude   double precision;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS longitude  double precision;