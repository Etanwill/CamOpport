# CamOpport — Role System Changes

## What Changed

### Roles: `student` / `professional` → `job_seeker` / `employer`

| Old Role       | New Role     | Description                                    |
|----------------|--------------|------------------------------------------------|
| `student`      | `job_seeker` | Looking for jobs, competitions & quizzes       |
| `professional` | `employer`   | Posts jobs, competitions & creates quizzes     |

---

## Registration — Role-Based Fields

### Job Seeker fields (Step 2)
- Current / Most Recent Job Title
- Experience Level (Entry → Executive)
- Skills (comma-separated)
- Preferred Job Types (multi-select chips)
- Job Categories of Interest (multi-select chips)
- LinkedIn URL
- Portfolio / GitHub URL

### Employer fields (Step 2)
- Company Name *(required)*
- Industry Sector (dropdown)
- Company Size (dropdown)
- Company Website
- Contact Phone
- Company Description

---

## Employer Capabilities

| Feature              | Route                          |
|----------------------|-------------------------------|
| Post a Job           | `/employer/post-job`          |
| Post a Competition   | `/employer/post-competition`  |
| Create a Quiz        | `/employer/create-quiz`       |
| Employer Dashboard   | `/employer/dashboard`         |
| View Applicants      | `/employer/applicants/[jobId]`|
| Update App. Status   | `PATCH /api/applications/[id]`|

API routes `/api/jobs` (POST), `/api/competitions` (POST), `/api/quiz` (POST)
now require `role === "employer"` or return **403 Forbidden**.

---

## Quizzes — Company Attribution

Quizzes now have `createdById` (employer user ID) and `companyName` fields.
Job seekers see "Created by [Company Name]" on quiz cards and the quiz intro screen.
This lets candidates understand a company's standards before applying.

---

## Database Migration

If you have an existing database, run `src/lib/db/migrate.sql` **before** running
`npx drizzle-kit push`. For a fresh setup, just run:

```bash
npx drizzle-kit push
npx tsx src/lib/db/seed.ts
```
