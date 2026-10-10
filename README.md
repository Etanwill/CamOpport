# 🇨🇲 CamOpport — with Neon Database

Full-stack Cameroon opportunity platform using **Next.js 14 + Neon (PostgreSQL) + Drizzle ORM**.

---

## 🗄️ What is Neon?

Neon is a **free serverless PostgreSQL database** — perfect for this app.
- Free tier: 0.5 GB storage, unlimited API calls
- Sign up at: https://neon.tech (no credit card needed)

---

## 🚀 Setup Guide (Step by Step)

### STEP 1 — Install Node.js
Download from https://nodejs.org → choose **LTS** → install.

---

### STEP 2 — Create a Neon Database (FREE)

1. Go to **https://neon.tech** and click **Sign Up** (use GitHub or Google)
2. Click **New Project** → give it a name like `camopport`
3. Select region: **EU Central** (closest to Cameroon) → Create
4. On the dashboard, click **Connection string**
5. Copy the string that looks like:
   ```
   postgresql://username:password@ep-something.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

---

### STEP 3 — Configure Environment Variables

Open the file `.env.local` in the project folder and replace the placeholder:

```env
DATABASE_URL="postgresql://YOUR_CONNECTION_STRING_HERE"
NEXTAUTH_SECRET="any-random-long-string-here-like-abc123xyz789"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a good NEXTAUTH_SECRET, run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### STEP 4 — Install Dependencies

Open terminal in the project folder and run:
```bash
npm install
```

---

### STEP 5 — Create Database Tables

This pushes the schema to your Neon database:
```bash
npm run db:push
```

You should see: ✅ All tables created

---

### STEP 6 — Seed with Demo Data

This fills the database with sample jobs, competitions, quizzes and users:
```bash
npm run db:seed
```

You should see:
```
✅ 5 users created
✅ Badges created
✅ Jobs created
✅ Competitions created
✅ Quizzes and questions created
✅ Database seeded successfully!
```

---

### STEP 7 — Run the App

```bash
npm run dev
```

Open **http://localhost:3000** in your browser 🎉

---

## 🔐 Demo Login Credentials

| Email | Password | Role |
|---|---|---|
| jp@example.com | demo123 | Student |
| aisha@example.com | demo123 | Professional |
| etabi@example.com | demo123 | Student |
| marie@example.com | demo123 | Professional |
| pateba@example.com | demo123 | Student |

---

## 🗃️ Database Tables

| Table | Description |
|---|---|
| `users` | All registered users |
| `badges` | Earned badges per user |
| `jobs` | Job listings |
| `job_applications` | Who applied to what |
| `competitions` | Hackathons and challenges |
| `competition_registrations` | Who registered |
| `quizzes` | Quiz metadata |
| `quiz_questions` | Questions per quiz |
| `quiz_attempts` | User quiz results + scores |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/signin` | Login (NextAuth) |
| GET | `/api/jobs` | List jobs (with filters) |
| POST | `/api/jobs` | Create a job |
| POST | `/api/jobs/[id]/apply` | Apply to a job (+10 XP) |
| GET | `/api/competitions` | List competitions |
| POST | `/api/competitions/[id]/register` | Register (+25 XP) |
| GET | `/api/quiz` | List quizzes |
| POST | `/api/quiz/[id]/attempt` | Submit quiz answers |
| GET | `/api/leaderboard` | Get top users by XP |
| GET | `/api/profile` | Get current user profile |
| PATCH | `/api/profile` | Update profile |

---

## 🛠 Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push schema to Neon (no migration files)
npm run db:seed      # Fill database with demo data
npm run db:studio    # Open Drizzle Studio (visual DB editor)
npm run db:generate  # Generate migration files
```

---

## 📁 New Files Added

```
src/
├── lib/db/
│   ├── index.ts      ← Neon connection
│   ├── schema.ts     ← All database tables
│   ├── queries.ts    ← All DB operations (CRUD)
│   └── seed.ts       ← Demo data seeder
├── app/api/
│   ├── auth/
│   │   ├── [...nextauth]/route.ts  ← Login/logout
│   │   └── register/route.ts       ← Registration
│   ├── jobs/route.ts               ← List + create jobs
│   ├── jobs/[id]/apply/route.ts    ← Apply to job
│   ├── competitions/route.ts       ← List competitions
│   ├── competitions/[id]/register/ ← Register for competition
│   ├── quiz/route.ts               ← List quizzes
│   ├── quiz/[id]/attempt/route.ts  ← Submit quiz
│   ├── leaderboard/route.ts        ← Leaderboard
│   └── profile/route.ts            ← Profile CRUD
drizzle.config.ts    ← Drizzle Kit config
.env.local           ← Your secrets (never commit this!)
```

---

Built with ❤️ for Cameroon 🇨🇲
