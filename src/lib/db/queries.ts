// src/lib/db/queries.ts
import { db } from "./index";
import { eq, desc, asc, ilike, and, or, count, sql, inArray, ne } from "drizzle-orm";
import {
  users, jobs, jobApplications, competitions,
  competitionRegistrations, quizzes, quizQuestions, quizAttempts, badges,
  reviews, faqs, discussions,
  savedOpportunities, notifications, likes,
  mockInterviews, mockInterviewMessages,
  conversations, messages, bitTransactions
} from "./schema";
import bcrypt from "bcryptjs";
import { SIGNUP_FREE_BITS, getBitPackage } from "@/lib/bits";
import { sendNotificationEmail } from "@/lib/email";

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createUser(data: {
  name: string; email: string; password?: string;
  role?: "job_seeker" | "employer";
  roleSelected?: boolean;
  avatar?: string;
  city?: string; region?: string;
  // Job Seeker
  skills?: string[]; experienceLevel?: string; currentJobTitle?: string;
  linkedinUrl?: string; portfolioUrl?: string;
  preferredJobTypes?: string[]; preferredCategories?: string[];
  // Employer
  companyName?: string; companySize?: string; industrySector?: string;
  companyWebsite?: string; companyDescription?: string; contactPhone?: string;
}) {
  // OAuth-provisioned accounts (Google, etc.) have no password of their own —
  // give them a random, never-shared hash so they can never log in via the
  // credentials form with a guessed password.
  const passwordHash = await bcrypt.hash(data.password ?? crypto.randomUUID(), 10);
  const result = await db.insert(users).values({
    name:               data.name,
    email:              data.email,
    passwordHash,
    role:               data.role ?? "job_seeker",
    roleSelected:       data.roleSelected ?? true,
    avatar:             data.avatar,
    city:               data.city,
    region:             data.region as any,
    xp:                 0,
    bits:               SIGNUP_FREE_BITS,
    // Job Seeker fields
    skills:             data.skills ?? [],
    experienceLevel:    data.experienceLevel as any,
    currentJobTitle:    data.currentJobTitle,
    linkedinUrl:        data.linkedinUrl,
    portfolioUrl:       data.portfolioUrl,
    preferredJobTypes:  data.preferredJobTypes ?? [],
    preferredCategories: data.preferredCategories ?? [],
    // Employer fields
    companyName:        data.companyName,
    companySize:        data.companySize,
    industrySector:     data.industrySector as any,
    companyWebsite:     data.companyWebsite,
    companyDescription: data.companyDescription,
    contactPhone:       data.contactPhone,
  }).returning();

  const user = result[0];

  // Log the free signup bonus so the bits balance is auditable.
  await db.insert(bitTransactions).values({
    userId:       user.id,
    type:         "signup_bonus",
    amount:       SIGNUP_FREE_BITS,
    balanceAfter: SIGNUP_FREE_BITS,
    description:  "Free bits for joining CamOpport",
  });

  return user;
}

// Used right after a first-time Google sign-in creates a bare-bones account —
// lets the person pick job_seeker/employer on the "choose your role" screen,
// after which roleSelected flips to true and they're never asked again.
export async function setUserRole(
  userId: string,
  role: "job_seeker" | "employer",
  extra?: { companyName?: string }
) {
  const result = await db.update(users)
    .set({
      role,
      roleSelected: true,
      ...(extra?.companyName ? { companyName: extra.companyName } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  return result[0] ?? null;
}

export async function verifyPassword(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function updateUserProfile(id: string, data: Partial<{
  name: string; bio: string; city: string; region: string; skills: string[]; avatar: string | null;
  experienceLevel: string; currentJobTitle: string; linkedinUrl: string;
  portfolioUrl: string; preferredJobTypes: string[]; preferredCategories: string[];
  companyName: string; companySize: string; industrySector: string;
  companyWebsite: string; companyDescription: string; contactPhone: string;
  emailNotifications: boolean;
}>) {
  const result = await db.update(users)
    .set({ ...data as any, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function addXP(userId: string, amount: number) {
  await db.update(users)
    .set({ xp: sql`${users.xp} + ${amount}`, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function getLeaderboard(opts?: { limit?: number; region?: string }) {
  const conditions = [eq(users.role, "job_seeker")];
  if (opts?.region && opts.region !== "all") {
    conditions.push(eq(users.region, opts.region as any));
  }

  return db.select({
    id:     users.id,
    name:   users.name,
    avatar: users.avatar,
    city:   users.city,
    region: users.region,
    xp:     users.xp,
    // Real per-user counts, computed with correlated subqueries so the
    // leaderboard reflects actual competitions/quizzes/badges, not mock data.
    competitionsCount: sql<number>`(
      select count(*)::int from ${competitionRegistrations}
      where ${competitionRegistrations.userId} = ${users.id}
    )`,
    quizzesCount: sql<number>`(
      select count(*)::int from ${quizAttempts}
      where ${quizAttempts.userId} = ${users.id}
    )`,
    badgesCount: sql<number>`(
      select count(*)::int from ${badges}
      where ${badges.userId} = ${users.id}
    )`,
    topBadgeName: sql<string | null>`(
      select ${badges.name} from ${badges}
      where ${badges.userId} = ${users.id}
      order by ${badges.earnedAt} desc limit 1
    )`,
    topBadgeIcon: sql<string | null>`(
      select ${badges.icon} from ${badges}
      where ${badges.userId} = ${users.id}
      order by ${badges.earnedAt} desc limit 1
    )`,
  })
  .from(users)
  .where(and(...conditions))
  .orderBy(desc(users.xp))
  .limit(opts?.limit ?? 100);
}

// ─── JOBS ─────────────────────────────────────────────────────────────────────

export async function getJobs(filters?: {
  search?: string; type?: string; category?: string; region?: string; limit?: number;
}) {
  const conditions = [];
  if (filters?.search) {
    conditions.push(or(
      ilike(jobs.title, `%${filters.search}%`),
      ilike(jobs.company, `%${filters.search}%`),
      ilike(jobs.description, `%${filters.search}%`)
    ));
  }
  if (filters?.type && filters.type !== "all") conditions.push(eq(jobs.type, filters.type as any));
  if (filters?.category && filters.category !== "all") conditions.push(eq(jobs.category, filters.category as any));
  if (filters?.region && filters.region !== "all") conditions.push(eq(jobs.region, filters.region as any));
  conditions.push(eq(jobs.isActive, true));

  return db.select().from(jobs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(jobs.createdAt))
    .limit(filters?.limit ?? 50);
}

export async function getJobById(id: string) {
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getJobsByEmployer(employerId: string) {
  return db.select().from(jobs)
    .where(eq(jobs.postedById, employerId))
    .orderBy(desc(jobs.createdAt));
}

export async function getJobsByEmployerWithCounts(employerId: string) {
  return db.select({
    job:            jobs,
    applicantCount: count(jobApplications.id),
  })
  .from(jobs)
  .leftJoin(jobApplications, eq(jobApplications.jobId, jobs.id))
  .where(eq(jobs.postedById, employerId))
  .groupBy(jobs.id)
  .orderBy(desc(jobs.createdAt));
}

export async function createJob(data: {
  title: string; company: string; description: string; requirements: string[];
  category: string; type: string; city: string; region: string;
  salaryMin: number; salaryMax: number; salaryPeriod: string;
  isRemote: boolean; tags: string[]; deadline: Date; postedById: string;
  bitsCost?: number;
  zone?: string | null; latitude?: number | null; longitude?: number | null;
}) {
  const result = await db.insert(jobs).values(data as any).returning();
  return result[0];
}

// Employer edits their own job posting. Ownership is enforced by the WHERE
// clause (employerId must match postedById) — if the job belongs to someone
// else, or doesn't exist, the update simply affects zero rows.
export async function updateJob(id: string, employerId: string, data: Partial<{
  title: string; description: string; requirements: string[];
  category: string; type: string; city: string; region: string;
  salaryMin: number; salaryMax: number; salaryPeriod: string;
  isRemote: boolean; tags: string[]; deadline: Date;
  bitsCost: number; isActive: boolean;
  zone: string | null; latitude: number | null; longitude: number | null;
}>) {
  const result = await db.update(jobs)
    .set({ ...data, updatedAt: new Date() } as any)
    .where(and(eq(jobs.id, id), eq(jobs.postedById, employerId)))
    .returning();
  return result[0] ?? null;
}

export async function applyToJob(jobId: string, userId: string, data: {
  // formal
  coverLetter?: string; resumeUrl?: string; linkedinUrl?: string; portfolioUrl?: string;
  // casual
  phone?: string; availability?: string; note?: string;
  isCasual?: boolean;
} = {}) {
  const existing = await db.select().from(jobApplications)
    .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.userId, userId)))
    .limit(1);
  if (existing.length > 0) return { error: "Already applied" };

  const job = await getJobById(jobId);
  if (!job) return { error: "Job not found" };

  const cost = job.bitsCost ?? 0;

  if (cost > 0) {
    // Atomic, race-safe deduction: the WHERE clause only lets the update
    // succeed if the user still has enough bits at the moment it runs.
    const deducted = await db.update(users)
      .set({ bits: sql`${users.bits} - ${cost}`, updatedAt: new Date() })
      .where(and(eq(users.id, userId), sql`${users.bits} >= ${cost}`))
      .returning({ bits: users.bits });

    if (deducted.length === 0) {
      return { error: "insufficient_bits", bitsCost: cost };
    }

    await db.insert(bitTransactions).values({
      userId,
      type:         "spend",
      amount:       -cost,
      balanceAfter: deducted[0].bits,
      jobId,
      description:  `Applied to "${job.title}" at ${job.company}`,
    });
  }

  const result = await db.insert(jobApplications)
    .values({ jobId, userId, ...data })
    .returning();

  await addXP(userId, 10);
  return result[0];
}

// ─── BITS ─────────────────────────────────────────────────────────────────────

export async function purchaseBits(userId: string, packageId: string) {
  const pkg = getBitPackage(packageId);
  if (!pkg) return { error: "Invalid bit package" };

  const result = await db.update(users)
    .set({ bits: sql`${users.bits} + ${pkg.bits}`, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning({ bits: users.bits });

  if (result.length === 0) return { error: "User not found" };

  await db.insert(bitTransactions).values({
    userId,
    type:         "purchase",
    amount:       pkg.bits,
    balanceAfter: result[0].bits,
    packageId:    pkg.id,
    description:  `Purchased ${pkg.name} (${pkg.bits} bits)`,
  });

  return { bits: result[0].bits, package: pkg };
}

export async function getUserBitTransactions(userId: string, limit = 20) {
  return db.select().from(bitTransactions)
    .where(eq(bitTransactions.userId, userId))
    .orderBy(desc(bitTransactions.createdAt))
    .limit(limit);
}

export async function getUserApplications(userId: string) {
  return db.select({
    application: jobApplications,
    job:         jobs,
  })
  .from(jobApplications)
  .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
  .where(eq(jobApplications.userId, userId))
  .orderBy(desc(jobApplications.appliedAt));
}

export async function getJobApplicants(jobId: string) {
  return db.select({
    application: jobApplications,
    applicant:   users,
  })
  .from(jobApplications)
  .innerJoin(users, eq(jobApplications.userId, users.id))
  .where(eq(jobApplications.jobId, jobId))
  .orderBy(desc(jobApplications.appliedAt));
}

export async function getUserApplicationForJob(userId: string, jobId: string) {
  const result = await db.select().from(jobApplications)
    .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

export async function getJobApplicantCount(jobId: string) {
  const result = await db.select({ count: count() })
    .from(jobApplications)
    .where(eq(jobApplications.jobId, jobId));
  return result[0]?.count ?? 0;
}

export async function updateApplicationStatus(
  applicationId: string, status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired"
) {
  return db.update(jobApplications)
    .set({ status, updatedAt: new Date() })
    .where(eq(jobApplications.id, applicationId))
    .returning();
}

// ─── COMPETITIONS ─────────────────────────────────────────────────────────────

export async function getCompetitions(filters?: {
  status?: string; type?: string; search?: string;
}) {
  const conditions = [];
  if (filters?.status && filters.status !== "all") conditions.push(eq(competitions.status, filters.status as any));
  if (filters?.type && filters.type !== "all") conditions.push(eq(competitions.type, filters.type as any));
  if (filters?.search) {
    conditions.push(or(
      ilike(competitions.title, `%${filters.search}%`),
      ilike(competitions.organizer, `%${filters.search}%`)
    ));
  }

  return db.select().from(competitions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(competitions.createdAt));
}

export async function getCompetitionById(id: string) {
  const result = await db.select().from(competitions).where(eq(competitions.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getCompetitionsByEmployer(employerId: string) {
  return db.select().from(competitions)
    .where(eq(competitions.postedById, employerId))
    .orderBy(desc(competitions.createdAt));
}

export async function getCompetitionsByEmployerWithCounts(employerId: string) {
  return db.select({
    competition:     competitions,
    registrantCount: count(competitionRegistrations.id),
  })
  .from(competitions)
  .leftJoin(competitionRegistrations, eq(competitionRegistrations.competitionId, competitions.id))
  .where(eq(competitions.postedById, employerId))
  .groupBy(competitions.id)
  .orderBy(desc(competitions.createdAt));
}

export async function createCompetition(data: {
  title: string; organizer: string; description: string;
  type: string; status: string;
  startDate: Date; endDate: Date; registrationDeadline: Date;
  prizes: any[]; maxTeamSize: number; minTeamSize: number;
  eligibility?: string; tags: string[];
  city?: string; region?: string; isOnline: boolean;
  postedById: string;
  zone?: string | null; latitude?: number | null; longitude?: number | null;
}) {
  const result = await db.insert(competitions).values(data as any).returning();
  return result[0];
}

// Employer edits their own competition posting (same ownership pattern as updateJob).
export async function updateCompetition(id: string, employerId: string, data: Partial<{
  title: string; description: string;
  type: string; status: string;
  startDate: Date; endDate: Date; registrationDeadline: Date;
  prizes: any[]; maxTeamSize: number; minTeamSize: number;
  eligibility: string; tags: string[];
  city: string; region: string; isOnline: boolean;
  zone: string | null; latitude: number | null; longitude: number | null;
}>) {
  const result = await db.update(competitions)
    .set({ ...data } as any)
    .where(and(eq(competitions.id, id), eq(competitions.postedById, employerId)))
    .returning();
  return result[0] ?? null;
}

export async function registerForCompetition(competitionId: string, userId: string, teamName?: string) {
  const existing = await db.select().from(competitionRegistrations)
    .where(and(
      eq(competitionRegistrations.competitionId, competitionId),
      eq(competitionRegistrations.userId, userId)
    )).limit(1);
  if (existing.length > 0) return { error: "Already registered" };

  const result = await db.insert(competitionRegistrations)
    .values({ competitionId, userId, teamName })
    .returning();

  await addXP(userId, 25);
  return result[0];
}

export async function getCompetitionParticipantCount(competitionId: string) {
  const result = await db.select({ count: count() })
    .from(competitionRegistrations)
    .where(eq(competitionRegistrations.competitionId, competitionId));
  return result[0]?.count ?? 0;
}

// ─── QUIZZES ──────────────────────────────────────────────────────────────────

export async function getQuizzes(category?: string) {
  if (category && category !== "all") {
    return db.select().from(quizzes)
      .where(and(eq(quizzes.category, category), eq(quizzes.isActive, true)))
      .orderBy(desc(quizzes.createdAt));
  }
  return db.select().from(quizzes)
    .where(eq(quizzes.isActive, true))
    .orderBy(desc(quizzes.createdAt));
}

export async function getQuizWithQuestions(quizId: string) {
  const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quiz[0]) return null;

  const questions = await db.select().from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.orderIndex));

  return { ...quiz[0], questions };
}

export async function getQuizzesByEmployer(employerId: string) {
  return db.select().from(quizzes)
    .where(eq(quizzes.createdById, employerId))
    .orderBy(desc(quizzes.createdAt));
}

export async function createQuiz(data: {
  title: string; description?: string; category: string;
  difficulty: string; totalPoints: number; timeLimit: number;
  tags: string[]; createdById: string; companyName?: string;
  questions: { question: string; options: string[]; correctAnswer: number; explanation?: string; points: number; timeLimit: number; }[];
}) {
  const { questions, ...quizData } = data;
  const quiz = await db.insert(quizzes).values(quizData as any).returning();
  const quizId = quiz[0].id;

  if (questions.length > 0) {
    await db.insert(quizQuestions).values(
      questions.map((q, i) => ({ ...q, quizId, orderIndex: i }))
    );
  }

  return quiz[0];
}

export async function saveQuizAttempt(data: {
  quizId: string; userId: string; score: number; totalPoints: number; answers: (number | null)[];
}) {
  const result = await db.insert(quizAttempts).values(data).returning();

  const pct = Math.round((data.score / data.totalPoints) * 100);
  const xpEarned = pct >= 80 ? 50 : pct >= 50 ? 25 : 10;
  await addXP(data.userId, xpEarned);

  if (pct === 100) {
    await db.insert(badges).values({
      userId: data.userId,
      name: "Quiz Master",
      icon: "🏆",
      color: "gold",
    });
  }

  return { attempt: result[0], xpEarned };
}

export async function getUserQuizAttempts(userId: string) {
  return db.select({
    attempt: quizAttempts,
    quiz:    quizzes,
  })
  .from(quizAttempts)
  .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
  .where(eq(quizAttempts.userId, userId))
  .orderBy(desc(quizAttempts.completedAt));
}

export async function getQuizAttemptCount(quizId: string) {
  const result = await db.select({ count: count() })
    .from(quizAttempts)
    .where(eq(quizAttempts.quizId, quizId));
  return result[0]?.count ?? 0;
}

// ─── BADGES ──────────────────────────────────────────────────────────────────

export async function getUserBadges(userId: string) {
  return db.select().from(badges).where(eq(badges.userId, userId)).orderBy(asc(badges.earnedAt));
}

// ─── COMPETITION REGISTRATION TRACKING ───────────────────────────────────────

export async function getCompetitionRegistrants(competitionId: string) {
  return db.select({
    registration: competitionRegistrations,
    user:         users,
  })
  .from(competitionRegistrations)
  .innerJoin(users, eq(competitionRegistrations.userId, users.id))
  .where(eq(competitionRegistrations.competitionId, competitionId))
  .orderBy(desc(competitionRegistrations.registeredAt));
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: "registered" | "confirmed" | "waitlisted" | "disqualified" | "winner",
  note?: string
) {
  return db.update(competitionRegistrations)
    .set({ status, note, updatedAt: new Date() })
    .where(eq(competitionRegistrations.id, registrationId))
    .returning();
}

export async function getUserRegistration(competitionId: string, userId: string) {
  const result = await db.select().from(competitionRegistrations)
    .where(and(
      eq(competitionRegistrations.competitionId, competitionId),
      eq(competitionRegistrations.userId, userId)
    )).limit(1);
  return result[0] ?? null;
}

export async function getUserCompetitionRegistrations(userId: string) {
  return db.select({
    registration: competitionRegistrations,
    competition:  competitions,
  })
  .from(competitionRegistrations)
  .innerJoin(competitions, eq(competitionRegistrations.competitionId, competitions.id))
  .where(eq(competitionRegistrations.userId, userId))
  .orderBy(desc(competitionRegistrations.registeredAt));
}

export async function getUserJobApplications(userId: string) {
  return db.select({
    application: jobApplications,
    job:         jobs,
  })
  .from(jobApplications)
  .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
  .where(eq(jobApplications.userId, userId))
  .orderBy(desc(jobApplications.appliedAt));
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export async function getReviews(targetType: string, targetId: string) {
  return db.select({
    review: reviews,
    user:   { id: users.id, name: users.name, role: users.role, city: users.city },
  })
  .from(reviews)
  .innerJoin(users, eq(reviews.userId, users.id))
  .where(and(eq(reviews.targetType, targetType), eq(reviews.targetId, targetId)))
  .orderBy(desc(reviews.createdAt));
}

export async function createReview(data: {
  targetType: string; targetId: string; userId: string;
  rating: number; title?: string; body: string; isVerified?: boolean;
}) {
  // One review per user per target
  const existing = await db.select().from(reviews)
    .where(and(
      eq(reviews.targetType, data.targetType),
      eq(reviews.targetId,   data.targetId),
      eq(reviews.userId,     data.userId)
    )).limit(1);
  if (existing.length > 0) return { error: "You have already reviewed this." };
  const result = await db.insert(reviews).values(data).returning();
  return result[0];
}

export async function deleteReview(reviewId: string, userId: string) {
  return db.delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, userId)));
}

export async function getReviewStats(targetType: string, targetId: string) {
  const all = await db.select({ rating: reviews.rating }).from(reviews)
    .where(and(eq(reviews.targetType, targetType), eq(reviews.targetId, targetId)));
  if (all.length === 0) return { avg: 0, count: 0, breakdown: { 1:0,2:0,3:0,4:0,5:0 } };
  const breakdown: Record<number,number> = {1:0,2:0,3:0,4:0,5:0};
  all.forEach(r => { breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1; });
  const avg = all.reduce((s,r) => s + r.rating, 0) / all.length;
  return { avg: Math.round(avg * 10) / 10, count: all.length, breakdown };
}

// ─── FAQS ─────────────────────────────────────────────────────────────────────

export async function getFaqs(targetType: string, targetId: string) {
  return db.select({
    faq:        faqs,
    askedBy:    { id: users.id, name: users.name },
  })
  .from(faqs)
  .innerJoin(users, eq(faqs.askedById, users.id))
  .where(and(eq(faqs.targetType, targetType), eq(faqs.targetId, targetId)))
  .orderBy(desc(faqs.createdAt));
}

export async function createFaq(data: {
  targetType: string; targetId: string; question: string; askedById: string;
}) {
  const result = await db.insert(faqs).values(data).returning();
  return result[0];
}

export async function answerFaq(faqId: string, answer: string, answeredById: string) {
  const result = await db.update(faqs)
    .set({ answer, answeredById, answeredAt: new Date() })
    .where(eq(faqs.id, faqId))
    .returning();
  return result[0];
}

export async function deleteFaq(faqId: string, userId: string) {
  return db.delete(faqs).where(and(eq(faqs.id, faqId), eq(faqs.askedById, userId)));
}

// ─── DISCUSSIONS ──────────────────────────────────────────────────────────────

export async function getDiscussions(targetType: string, targetId: string) {
  return db.select({
    discussion: discussions,
    user:       { id: users.id, name: users.name, role: users.role },
  })
  .from(discussions)
  .innerJoin(users, eq(discussions.userId, users.id))
  .where(and(eq(discussions.targetType, targetType), eq(discussions.targetId, targetId)))
  .orderBy(asc(discussions.createdAt));
}

export async function createDiscussion(data: {
  targetType: string; targetId: string; userId: string;
  body: string; parentId?: string;
}) {
  const result = await db.insert(discussions).values(data).returning();
  return result[0];
}

export async function likeDiscussion(discussionId: string) {
  return db.update(discussions)
    .set({ likes: sql`${discussions.likes} + 1` })
    .where(eq(discussions.id, discussionId));
}

export async function deleteDiscussion(discussionId: string, userId: string) {
  return db.delete(discussions)
    .where(and(eq(discussions.id, discussionId), eq(discussions.userId, userId)));
}

// ─── SAVED OPPORTUNITIES ──────────────────────────────────────────────────────

export async function getSavedOpportunities(userId: string) {
  return db.select().from(savedOpportunities)
    .where(eq(savedOpportunities.userId, userId))
    .orderBy(desc(savedOpportunities.savedAt));
}

export async function isOpportunitySaved(
  userId: string, targetType: "job" | "competition", targetId: string
) {
  const result = await db.select().from(savedOpportunities)
    .where(and(
      eq(savedOpportunities.userId, userId),
      eq(savedOpportunities.targetType, targetType),
      eq(savedOpportunities.targetId, targetId),
    )).limit(1);
  return result.length > 0;
}

export async function saveOpportunity(
  userId: string, targetType: "job" | "competition", targetId: string
) {
  const result = await db.insert(savedOpportunities)
    .values({ userId, targetType, targetId })
    .onConflictDoNothing()
    .returning();
  return result[0] ?? null;
}

export async function unsaveOpportunity(
  userId: string, targetType: "job" | "competition", targetId: string
) {
  await db.delete(savedOpportunities)
    .where(and(
      eq(savedOpportunities.userId, userId),
      eq(savedOpportunities.targetType, targetType),
      eq(savedOpportunities.targetId, targetId),
    ));
}

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────

export async function getNotifications(userId: string, limit = 20) {
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationCount(userId: string) {
  const result = await db.select({ cnt: count() }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.cnt ?? 0;
}

export async function markNotificationsRead(userId: string, ids?: string[]) {
  const where = ids?.length
    ? and(eq(notifications.userId, userId), sql`${notifications.id} = ANY(${ids})`)
    : eq(notifications.userId, userId);
  await db.update(notifications).set({ isRead: true }).where(where!);
}

export async function createNotification(data: {
  userId: string;
  type: "application_update" | "competition_update" | "new_job" | "new_competition" | "quiz_result" | "general";
  title: string;
  body: string;
  link?: string;
}) {
  const result = await db.insert(notifications).values(data).returning();
  const notification = result[0];

  // Also email the user, unless they've turned email notifications off.
  // Fire-and-forget: a slow/failed email must never block notification
  // creation or bubble up as an error to the caller.
  getUserById(data.userId)
    .then((user) => {
      if (user?.email && user.emailNotifications) {
        return sendNotificationEmail({
          to:    user.email,
          name:  user.name,
          type:  data.type,
          title: data.title,
          body:  data.body,
          link:  data.link,
        });
      }
    })
    .catch((err) => console.error("[notifications] failed to send email:", err));

  return notification;
}

// ─── LIKES ────────────────────────────────────────────────────────────────────

export async function getLikeCount(targetType: "job" | "competition", targetId: string) {
  const result = await db.select({ cnt: count() }).from(likes)
    .where(and(eq(likes.targetType, targetType), eq(likes.targetId, targetId)));
  return result[0]?.cnt ?? 0;
}

export async function isLiked(userId: string, targetType: "job" | "competition", targetId: string) {
  const result = await db.select().from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.targetType, targetType), eq(likes.targetId, targetId)))
    .limit(1);
  return result.length > 0;
}

export async function toggleLike(userId: string, targetType: "job" | "competition", targetId: string) {
  const existing = await db.select().from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.targetType, targetType), eq(likes.targetId, targetId)))
    .limit(1);
  if (existing.length > 0) {
    await db.delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.targetType, targetType), eq(likes.targetId, targetId)));
    return false;
  } else {
    await db.insert(likes).values({ userId, targetType, targetId });
    return true;
  }
}

export async function getLikedOpportunities(userId: string) {
  return db.select().from(likes)
    .where(eq(likes.userId, userId))
    .orderBy(desc(likes.createdAt));
}

// ─── MOCK INTERVIEWS ──────────────────────────────────────────────────────────

export async function createMockInterview(data: {
  userId: string;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  interviewType: "behavioural" | "technical" | "hr" | "mixed";
  totalQuestions: number;
}) {
  const result = await db.insert(mockInterviews).values(data).returning();
  return result[0];
}

export async function getMockInterview(id: string) {
  const result = await db.select().from(mockInterviews).where(eq(mockInterviews.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getInterviewMessages(interviewId: string) {
  return db.select().from(mockInterviewMessages)
    .where(eq(mockInterviewMessages.interviewId, interviewId))
    .orderBy(asc(mockInterviewMessages.createdAt));
}

export async function addInterviewMessage(data: {
  interviewId: string;
  role: "assistant" | "user";
  content: string;
  questionNo?: number;
}) {
  const result = await db.insert(mockInterviewMessages).values(data).returning();
  return result[0];
}

export async function updateInterviewProgress(id: string, currentQuestion: number) {
  await db.update(mockInterviews)
    .set({ currentQuestion })
    .where(eq(mockInterviews.id, id));
}

export async function completeInterview(id: string, scores: {
  scoreOverall: number;
  scoreClarity: number;
  scoreRelevance: number;
  scoreConfidence: number;
  feedback: string;
}) {
  await db.update(mockInterviews)
    .set({ ...scores, status: "completed", completedAt: new Date() })
    .where(eq(mockInterviews.id, id));
}

export async function getUserInterviews(userId: string) {
  return db.select().from(mockInterviews)
    .where(eq(mockInterviews.userId, userId))
    .orderBy(desc(mockInterviews.createdAt))
    .limit(20);
}
// ─── LOGO SYNC ────────────────────────────────────────────────────────────────

/**
 * When an employer updates their logo, propagate it to all their existing
 * job listings and competition listings so they always show the latest logo.
 */
export async function syncEmployerLogoToListings(employerId: string, logoUrl: string) {
  await Promise.all([
    db.update(jobs)
      .set({ companyLogo: logoUrl })
      .where(eq(jobs.postedById, employerId)),
    db.update(competitions)
      .set({ organizerLogo: logoUrl })
      .where(eq(competitions.postedById, employerId)),
  ]);
}
// ─── 100 Days of Code ─────────────────────────────────────────────────────────

import {
  codingChallenges, codingSubmissions, codingProgress,
} from "./schema";

export async function getCodingChallenge(dayNumber: number) {
  const [challenge] = await db.select().from(codingChallenges)
    .where(eq(codingChallenges.dayNumber, dayNumber))
    .limit(1);
  return challenge ?? null;
}

export async function getCodingChallenges() {
  return db.select({
    id: codingChallenges.id,
    dayNumber: codingChallenges.dayNumber,
    title: codingChallenges.title,
    slug: codingChallenges.slug,
    difficulty: codingChallenges.difficulty,
    category: codingChallenges.category,
    xpReward: codingChallenges.xpReward,
    tags: codingChallenges.tags,
    source: codingChallenges.source,
    cfRating: codingChallenges.cfRating,
    externalUrl: codingChallenges.externalUrl,
  }).from(codingChallenges)
    .orderBy(codingChallenges.dayNumber);
}

export async function getUserCodingProgress(userId: string) {
  const [progress] = await db.select().from(codingProgress)
    .where(eq(codingProgress.userId, userId))
    .limit(1);
  return progress ?? null;
}

export async function upsertCodingProgress(userId: string, data: Partial<{
  currentDay: number;
  streak: number;
  longestStreak: number;
  totalSolved: number;
  lastSolvedAt: Date;
  completedDays: number[];
}>) {
  const existing = await getUserCodingProgress(userId);
  if (existing) {
    const [updated] = await db.update(codingProgress)
      .set(data)
      .where(eq(codingProgress.userId, userId))
      .returning();
    return updated;
  } else {
    const [created] = await db.insert(codingProgress)
      .values({ userId, ...data })
      .returning();
    return created;
  }
}

export async function createCodingSubmission(data: {
  challengeId: string;
  userId: string;
  language: "javascript" | "python" | "typescript" | "java" | "cpp" | "c";
  code: string;
  status: "accepted" | "wrong_answer" | "runtime_error" | "time_limit" | "pending";
  passedTests: number;
  totalTests: number;
  runtime?: number;
  errorMessage?: string;
  isFirstSolve: boolean;
}) {
  const [submission] = await db.insert(codingSubmissions)
    .values(data)
    .returning();
  return submission;
}

export async function getUserSubmissionsForChallenge(userId: string, challengeId: string) {
  return db.select().from(codingSubmissions)
    .where(
      and(
        eq(codingSubmissions.userId, userId),
        eq(codingSubmissions.challengeId, challengeId)
      )
    )
    .orderBy(desc(codingSubmissions.submittedAt))
    .limit(10);
}

export async function seedCodingChallenges(challenges: any[]) {
  for (const c of challenges) {
    await db.insert(codingChallenges)
      .values(c)
      .onConflictDoUpdate({
        target: codingChallenges.slug,
        set: {
          dayNumber:    c.dayNumber,
          title:        c.title,
          difficulty:   c.difficulty,
          category:     c.category,
          description:  c.description,
          examples:     c.examples,
          constraints:  c.constraints,
          hints:        c.hints,
          tags:         c.tags,
          starterCode:  c.starterCode,
          testCases:    c.testCases,
          xpReward:     c.xpReward,
          source:       c.source,
          cfContestId:  c.cfContestId,
          cfIndex:      c.cfIndex,
          cfRating:     c.cfRating,
          externalUrl:  c.externalUrl,
          descriptionSource: c.descriptionSource,
        },
      });
  }
}

// ─── MESSAGING (Job Seeker ↔ Employer chat) ────────────────────────────────────

// Fetch an existing conversation for a (job, job seeker) pair, or create one.
// employerId is trusted from the job record so a seeker can't spoof who they chat with.
export async function getOrCreateConversation(jobId: string, jobSeekerId: string, employerId: string) {
  const existing = await db.select().from(conversations)
    .where(and(eq(conversations.jobId, jobId), eq(conversations.jobSeekerId, jobSeekerId)))
    .limit(1);
  if (existing.length > 0) return existing[0];

  const result = await db.insert(conversations)
    .values({ jobId, jobSeekerId, employerId })
    .returning();
  return result[0];
}

export async function getConversationById(id: string) {
  const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return result[0] ?? null;
}

// All conversations a user (job seeker or employer) is part of, newest first,
// with the job title/company and the other participant's info attached.
export async function getUserConversations(userId: string) {
  const rows = await db.select({
    conversation: conversations,
    job:          jobs,
    jobSeeker:    users,
  })
  .from(conversations)
  .innerJoin(jobs,   eq(conversations.jobId, jobs.id))
  .innerJoin(users,  eq(conversations.jobSeekerId, users.id))
  .where(or(eq(conversations.jobSeekerId, userId), eq(conversations.employerId, userId)))
  .orderBy(desc(conversations.lastMessageAt));

  // Attach employer info + unread count + last message per conversation
  const employerIds = Array.from(new Set(rows.map(r => r.conversation.employerId)));
  const employers = employerIds.length
    ? await db.select().from(users).where(inArray(users.id, employerIds))
    : [];
  const employerMap = new Map(employers.map(e => [e.id, e]));

  const results = [];
  for (const row of rows) {
    const [lastMsg] = await db.select().from(messages)
      .where(eq(messages.conversationId, row.conversation.id))
      .orderBy(desc(messages.createdAt))
      .limit(1);
    const [{ cnt: unreadCount }] = await db.select({ cnt: count() }).from(messages)
      .where(and(
        eq(messages.conversationId, row.conversation.id),
        eq(messages.isRead, false),
        ne(messages.senderId, userId)
      ));

    const isEmployer = row.conversation.employerId === userId;
    results.push({
      conversation: row.conversation,
      job:          row.job,
      otherUser:    isEmployer ? row.jobSeeker : (employerMap.get(row.conversation.employerId) ?? null),
      lastMessage:  lastMsg ?? null,
      unreadCount,
    });
  }
  return results;
}

// Single conversation with job + other-participant info attached, for the thread header.
// Returns null if `userId` is not a participant.
export async function getConversationDetail(conversationId: string, userId: string) {
  const convo = await getConversationById(conversationId);
  if (!convo) return null;
  if (convo.jobSeekerId !== userId && convo.employerId !== userId) return null;

  const [job] = await db.select().from(jobs).where(eq(jobs.id, convo.jobId)).limit(1);
  const isEmployer = convo.employerId === userId;
  const otherUserId = isEmployer ? convo.jobSeekerId : convo.employerId;
  const [otherUser] = await db.select().from(users).where(eq(users.id, otherUserId)).limit(1);

  return { conversation: convo, job: job ?? null, otherUser: otherUser ?? null, isEmployer };
}

export async function getConversationMessages(conversationId: string, limit = 100) {
  const rows = await db.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
    .limit(limit);
  return rows;
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const [message] = await db.insert(messages)
    .values({ conversationId, senderId, body })
    .returning();
  await db.update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId));
  return message;
}

// Mark every message NOT sent by `userId` in this conversation as read.
export async function markConversationRead(conversationId: string, userId: string) {
  await db.update(messages)
    .set({ isRead: true })
    .where(and(
      eq(messages.conversationId, conversationId),
      ne(messages.senderId, userId)
    ));
}

export async function getUnreadMessageCount(userId: string) {
  const result = await db.select({ cnt: count() })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .where(and(
      or(eq(conversations.jobSeekerId, userId), eq(conversations.employerId, userId)),
      eq(messages.isRead, false),
      ne(messages.senderId, userId)
    ));
  return result[0]?.cnt ?? 0;
}