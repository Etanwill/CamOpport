import {
  pgTable, text, integer, boolean, timestamp,
  varchar, pgEnum, serial, jsonb, doublePrecision
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const listingPlanEnum = pgEnum("listing_plan", ["starter", "standard", "featured"]);

export const userRoleEnum = pgEnum("user_role", ["job_seeker", "employer", "admin"]);

export const regionEnum = pgEnum("cameroon_region", [
  "Centre", "Littoral", "West", "Northwest", "Southwest",
  "North", "Adamawa", "East", "South", "Far North"
]);

export const jobTypeEnum = pgEnum("job_type", [
  "full-time", "part-time", "contract", "one-day", "gig", "internship"
]);

export const jobCategoryEnum = pgEnum("job_category", [
  "technology", "marketing", "finance", "agriculture", "transport",
  "healthcare", "education", "hospitality", "creative", "admin", "manual", "other"
]);

export const salaryPeriodEnum = pgEnum("salary_period", ["hour", "day", "month", "project"]);

export const competitionStatusEnum = pgEnum("competition_status", ["upcoming", "active", "ended"]);

export const competitionTypeEnum = pgEnum("competition_type", [
  "hackathon", "case-study", "coding", "business", "creative", "quiz"
]);

export const quizDifficultyEnum = pgEnum("quiz_difficulty", ["beginner", "intermediate", "advanced"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending", "reviewed", "shortlisted", "rejected", "hired"
]);

export const bitTransactionTypeEnum = pgEnum("bit_transaction_type", [
  "signup_bonus", "purchase", "spend", "refund", "admin_adjustment"
]);

export const industrySectorEnum = pgEnum("industry_sector", [
  "technology", "finance", "healthcare", "education", "agriculture",
  "manufacturing", "retail", "construction", "transport", "media",
  "hospitality", "energy", "telecom", "ngo", "government", "other"
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "entry", "junior", "mid", "senior", "executive"
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          varchar("name", { length: 200 }).notNull(),
  email:         varchar("email", { length: 255 }).notNull().unique(),
  passwordHash:  text("password_hash").notNull(),
  role:          userRoleEnum("role").default("job_seeker").notNull(),
  // Whether the user has explicitly chosen job_seeker/employer. Always true
  // for accounts created through the normal email/password registration form
  // (which requires picking a role up front). Google sign-ins that auto-create
  // a brand-new account start this as false so we can route them to the
  // "choose your role" screen right after their first login.
  roleSelected:  boolean("role_selected").default(true).notNull(),
  avatar:        text("avatar"),
  city:          varchar("city", { length: 100 }),
  region:        regionEnum("region"),
  bio:           text("bio"),
  xp:            integer("xp").default(0).notNull(),
  // Whether to also email the user when we create an in-app notification
  // for them (application updates, new matching jobs, quiz results, etc.).
  // Defaults on so people don't miss anything; toggleable from Profile.
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  // Bits balance — the currency job seekers spend to apply to jobs.
  // New accounts start with a free signup bonus (see lib/bits.ts).
  bits:          integer("bits").default(20).notNull(),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),

  // ── Job Seeker fields ──
  skills:              jsonb("skills").$type<string[]>().default([]),
  experienceLevel:     experienceLevelEnum("experience_level"),
  currentJobTitle:     varchar("current_job_title", { length: 150 }),
  resumeUrl:           text("resume_url"),
  linkedinUrl:         text("linkedin_url"),
  portfolioUrl:        text("portfolio_url"),
  preferredJobTypes:   jsonb("preferred_job_types").$type<string[]>().default([]),
  preferredCategories: jsonb("preferred_categories").$type<string[]>().default([]),
  phone:               varchar("phone", { length: 30 }),

  // ── Employer fields ──
  companyName:        varchar("company_name", { length: 200 }),
  companySize:        varchar("company_size", { length: 50 }),
  industrySector:     industrySectorEnum("industry_sector"),
  companyWebsite:     text("company_website"),
  companyDescription: text("company_description"),
  companyLogo:        text("company_logo"),
  contactPhone:       varchar("contact_phone", { length: 30 }),
  isVerified:         boolean("is_verified").default(false).notNull(),
});

export const badges = pgTable("badges", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name:      varchar("name", { length: 100 }).notNull(),
  icon:      varchar("icon", { length: 10 }).notNull(),
  color:     varchar("color", { length: 50 }).notNull(),
  earnedAt:  timestamp("earned_at").defaultNow().notNull(),
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const jobs = pgTable("jobs", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:        varchar("title", { length: 200 }).notNull(),
  company:      varchar("company", { length: 200 }).notNull(),
  companyLogo:  text("company_logo"),
  description:  text("description").notNull(),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  category:     jobCategoryEnum("category").notNull(),
  type:         jobTypeEnum("type").notNull(),
  city:         varchar("city", { length: 100 }).notNull(),
  region:       regionEnum("region").notNull(),
  // Specific zone/neighbourhood/address within the city (e.g. "Bonapriso,
  // near Total station") that the employer types in when posting. Geocoded
  // client-side (Nominatim) at post time into latitude/longitude below, which
  // the map then uses for precise pin placement and turn-by-turn directions
  // instead of just the city-center fallback.
  zone:         varchar("zone", { length: 250 }),
  latitude:     doublePrecision("latitude"),
  longitude:    doublePrecision("longitude"),
  salaryMin:    integer("salary_min").notNull(),
  salaryMax:    integer("salary_max").notNull(),
  salaryPeriod: salaryPeriodEnum("salary_period").notNull(),
  isRemote:     boolean("is_remote").default(false).notNull(),
  tags:         jsonb("tags").$type<string[]>().default([]),
  deadline:     timestamp("deadline").notNull(),
  postedById:   text("posted_by_id").references(() => users.id),
  isActive:     boolean("is_active").default(true).notNull(),
  // Listing plan — legacy paid-listing fields, kept for backward compatibility
  // with existing rows. Posting a job is now free; these are no longer set
  // for new jobs (plan stays "starter", planExpiresAt stays null).
  plan:         listingPlanEnum("plan").default("starter").notNull(),
  planExpiresAt: timestamp("plan_expires_at"),
  isFeatured:   boolean("is_featured").default(false).notNull(),
  // Bits cost — how many bits a job seeker must spend to apply to this job.
  // Set by the employer when posting (free to post, no cost to them).
  bitsCost:     integer("bits_cost").default(5).notNull(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId:        text("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  // Formal application fields
  coverLetter:  text("cover_letter"),
  resumeUrl:    text("resume_url"),
  linkedinUrl:  text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  // Casual application fields
  phone:        varchar("phone", { length: 30 }),
  availability: varchar("availability", { length: 200 }),
  note:         text("note"),
  // Meta
  isCasual:     boolean("is_casual").default(false).notNull(),
  status:       applicationStatusEnum("status").default("pending").notNull(),
  appliedAt:    timestamp("applied_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

// ─── Competitions ──────────────────────────────────────────────────────────────

export const competitions = pgTable("competitions", {
  id:                   text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:                varchar("title", { length: 200 }).notNull(),
  organizer:            varchar("organizer", { length: 200 }).notNull(),
  organizerLogo:        text("organizer_logo"),
  description:          text("description").notNull(),
  type:                 competitionTypeEnum("type").notNull(),
  status:               competitionStatusEnum("status").default("upcoming").notNull(),
  startDate:            timestamp("start_date").notNull(),
  endDate:              timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  prizes:               jsonb("prizes").$type<{ rank: number; label: string; amount: number; extras?: string[] }[]>().default([]),
  maxTeamSize:          integer("max_team_size").default(1).notNull(),
  minTeamSize:          integer("min_team_size").default(1).notNull(),
  eligibility:          text("eligibility"),
  tags:                 jsonb("tags").$type<string[]>().default([]),
  city:                 varchar("city", { length: 100 }),
  region:               regionEnum("region"),
  // Same zone/geocoding pattern as jobs — precise venue location for the map.
  zone:                 varchar("zone", { length: 250 }),
  latitude:             doublePrecision("latitude"),
  longitude:            doublePrecision("longitude"),
  isOnline:             boolean("is_online").default(false).notNull(),
  postedById:           text("posted_by_id").references(() => users.id),
  // Listing plan
  plan:                 listingPlanEnum("plan").default("starter").notNull(),
  planExpiresAt:        timestamp("plan_expires_at"),
  isFeatured:           boolean("is_featured").default(false).notNull(),
  createdAt:            timestamp("created_at").defaultNow().notNull(),
});

export const registrationStatusEnum = pgEnum("registration_status", [
  "registered", "confirmed", "waitlisted", "disqualified", "winner"
]);

export const competitionRegistrations = pgTable("competition_registrations", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  competitionId: text("competition_id").notNull().references(() => competitions.id, { onDelete: "cascade" }),
  userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  teamName:      varchar("team_name", { length: 100 }),
  status:        registrationStatusEnum("status").default("registered").notNull(),
  note:          text("note"),
  registeredAt:  timestamp("registered_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),
});

// ─── Quizzes ──────────────────────────────────────────────────────────────────

export const quizzes = pgTable("quizzes", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:       varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category:    varchar("category", { length: 100 }).notNull(),
  difficulty:  quizDifficultyEnum("difficulty").notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
  timeLimit:   integer("time_limit_seconds").default(600).notNull(),
  tags:        jsonb("tags").$type<string[]>().default([]),
  isActive:    boolean("is_active").default(true).notNull(),
  createdById: text("created_by_id").references(() => users.id),
  companyName: varchar("company_name", { length: 200 }),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  quizId:        text("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  question:      text("question").notNull(),
  options:       jsonb("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation:   text("explanation"),
  points:        integer("points").default(10).notNull(),
  timeLimit:     integer("time_limit_seconds").default(30).notNull(),
  orderIndex:    integer("order_index").default(0).notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  quizId:      text("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score:       integer("score").default(0).notNull(),
  totalPoints: integer("total_points").notNull(),
  answers:     jsonb("answers").$type<(number | null)[]>().default([]),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});


// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  targetType:   varchar("target_type", { length: 20 }).notNull(), // "job" | "competition"
  targetId:     text("target_id").notNull(),
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating:       integer("rating").notNull(),          // 1–5
  title:        varchar("title", { length: 150 }),
  body:         text("body").notNull(),
  isVerified:   boolean("is_verified").default(false).notNull(), // applied/registered user
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const faqs = pgTable("faqs", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  targetType: varchar("target_type", { length: 20 }).notNull(), // "job" | "competition"
  targetId:   text("target_id").notNull(),
  question:   text("question").notNull(),
  answer:     text("answer"),                           // null = unanswered
  askedById:  text("asked_by_id").references(() => users.id, { onDelete: "set null" }),
  answeredById: text("answered_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
  answeredAt: timestamp("answered_at"),
});

// ─── Discussions ───────────────────────────────────────────────────────────────

export const discussions = pgTable("discussions", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  targetType: varchar("target_type", { length: 20 }).notNull(), // "job" | "competition"
  targetId:   text("target_id").notNull(),
  parentId:   text("parent_id"),                       // null = top-level, else reply
  userId:     text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body:       text("body").notNull(),
  likes:      integer("likes").default(0).notNull(),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
  updatedAt:  timestamp("updated_at").defaultNow().notNull(),
});

// ─── Relations ─────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  badges:                   many(badges),
  jobApplications:          many(jobApplications),
  competitionRegistrations: many(competitionRegistrations),
  quizAttempts:             many(quizAttempts),
  postedJobs:               many(jobs),
  postedCompetitions:       many(competitions),
  createdQuizzes:           many(quizzes),
  bitTransactions:          many(bitTransactions),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  postedBy:     one(users, { fields: [jobs.postedById], references: [users.id] }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job:  one(jobs,  { fields: [jobApplications.jobId],  references: [jobs.id]  }),
  user: one(users, { fields: [jobApplications.userId], references: [users.id] }),
}));

export const competitionsRelations = relations(competitions, ({ one, many }) => ({
  postedBy:      one(users, { fields: [competitions.postedById], references: [users.id] }),
  registrations: many(competitionRegistrations),
}));

export const competitionRegistrationsRelations = relations(competitionRegistrations, ({ one }) => ({
  competition: one(competitions, { fields: [competitionRegistrations.competitionId], references: [competitions.id] }),
  user:        one(users,        { fields: [competitionRegistrations.userId],        references: [users.id]        }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  createdBy: one(users, { fields: [quizzes.createdById], references: [users.id] }),
  questions: many(quizQuestions),
  attempts:  many(quizAttempts),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, { fields: [quizAttempts.quizId], references: [quizzes.id] }),
  user: one(users,   { fields: [quizAttempts.userId], references: [users.id]  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const faqsRelations = relations(faqs, ({ one }) => ({
  askedBy:    one(users, { fields: [faqs.askedById],    references: [users.id] }),
  answeredBy: one(users, { fields: [faqs.answeredById], references: [users.id] }),
}));

export const discussionsRelations = relations(discussions, ({ one }) => ({
  user: one(users, { fields: [discussions.userId], references: [users.id] }),
}));

// ─── Saved Opportunities ───────────────────────────────────────────────────────

export const savedOpportunities = pgTable("saved_opportunities", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:      text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetType:  varchar("target_type", { length: 20 }).notNull(), // "job" | "competition"
  targetId:    text("target_id").notNull(),
  savedAt:     timestamp("saved_at").defaultNow().notNull(),
});

// ─── Notifications ─────────────────────────────────────────────────────────────

export const notificationTypeEnum = pgEnum("notification_type", [
  "application_update", "competition_update", "new_job", "new_competition",
  "quiz_result", "general"
]);

export const notifications = pgTable("notifications", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type:      notificationTypeEnum("type").notNull(),
  title:     varchar("title", { length: 200 }).notNull(),
  body:      text("body").notNull(),
  link:      text("link"),           // e.g. /jobs/abc or /competitions/xyz
  isRead:    boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Relations (additions) ─────────────────────────────────────────────────────

export const savedOpportunitiesRelations = relations(savedOpportunities, ({ one }) => ({
  user: one(users, { fields: [savedOpportunities.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// ─── Likes ────────────────────────────────────────────────────────────────────

export const likes = pgTable("likes", {
  id:         text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:     text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type", { length: 20 }).notNull(), // "job" | "competition"
  targetId:   text("target_id").notNull(),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

// ─── Mock Interviews ──────────────────────────────────────────────────────────

export const interviewTypeEnum = pgEnum("interview_type", [
  "behavioural", "technical", "hr", "mixed"
]);

export const interviewStatusEnum = pgEnum("interview_status", [
  "in_progress", "completed", "abandoned"
]);

export const mockInterviews = pgTable("mock_interviews", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:         text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobId:          text("job_id").references(() => jobs.id, { onDelete: "set null" }),
  jobTitle:       varchar("job_title", { length: 200 }),
  company:        varchar("company", { length: 200 }),
  interviewType:  interviewTypeEnum("interview_type").notNull().default("mixed"),
  totalQuestions: integer("total_questions").notNull().default(5),
  currentQuestion: integer("current_question").notNull().default(0),
  status:         interviewStatusEnum("status").notNull().default("in_progress"),
  // Scores (0–100), set on completion
  scoreOverall:   integer("score_overall"),
  scoreClarity:   integer("score_clarity"),
  scoreRelevance: integer("score_relevance"),
  scoreConfidence:integer("score_confidence"),
  feedback:       text("feedback"),   // overall AI feedback paragraph
  createdAt:      timestamp("created_at").defaultNow().notNull(),
  completedAt:    timestamp("completed_at"),
});

export const mockInterviewMessages = pgTable("mock_interview_messages", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  interviewId: text("interview_id").notNull().references(() => mockInterviews.id, { onDelete: "cascade" }),
  role:        varchar("role", { length: 10 }).notNull(), // "assistant" | "user"
  content:     text("content").notNull(),
  questionNo:  integer("question_no"),  // which question number this belongs to
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

export const mockInterviewsRelations = relations(mockInterviews, ({ one, many }) => ({
  user:     one(users,    { fields: [mockInterviews.userId], references: [users.id] }),
  job:      one(jobs,     { fields: [mockInterviews.jobId],  references: [jobs.id] }),
  messages: many(mockInterviewMessages),
}));

export const mockInterviewMessagesRelations = relations(mockInterviewMessages, ({ one }) => ({
  interview: one(mockInterviews, { fields: [mockInterviewMessages.interviewId], references: [mockInterviews.id] }),
}));
// ─── 100 Days of Code ─────────────────────────────────────────────────────────

export const codingDifficultyEnum = pgEnum("coding_difficulty", ["easy", "medium", "hard"]);
export const codingLanguageEnum   = pgEnum("coding_language",   ["javascript", "python", "typescript", "java", "cpp", "c"]);
export const submissionStatusEnum = pgEnum("submission_status", ["accepted", "wrong_answer", "runtime_error", "time_limit", "pending"]);

export const codingChallenges = pgTable("coding_challenges", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  dayNumber:    integer("day_number").notNull(), // sequential index — no longer capped at 100, no longer unique
  title:        varchar("title", { length: 200 }).notNull(),
  slug:         varchar("slug", { length: 200 }).notNull().unique(),
  difficulty:   codingDifficultyEnum("difficulty").notNull(),
  category:     varchar("category", { length: 80 }).notNull(), // "arrays", "strings", etc.
  description:  text("description").notNull(),           // markdown
  examples:     jsonb("examples").$type<{ input: string; output: string; explanation?: string }[]>().default([]),
  constraints:  jsonb("constraints").$type<string[]>().default([]),
  hints:        jsonb("hints").$type<string[]>().default([]),
  tags:         jsonb("tags").$type<string[]>().default([]),
  // Starter code per language
  starterCode:  jsonb("starter_code").$type<Record<string, string>>().default({}),
  // Hidden test cases used for judging
  testCases:    jsonb("test_cases").$type<{ input: string; expectedOutput: string; isHidden?: boolean }[]>().default([]),
  // XP reward on first solve
  xpReward:     integer("xp_reward").default(50).notNull(),
  // Codeforces source metadata
  source:       varchar("source", { length: 20 }).default("custom"),     // "codeforces" | "custom"
  cfContestId:  integer("cf_contest_id"),
  cfIndex:      varchar("cf_index", { length: 5 }),
  cfRating:     integer("cf_rating"),                                     // Codeforces difficulty rating (800-3500)
  externalUrl:  text("external_url"),                                    // link to the official problem page
  descriptionSource: varchar("description_source", { length: 20 }).default("fallback"), // "live" | "fallback"
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

export const codingSubmissions = pgTable("coding_submissions", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  challengeId:   text("challenge_id").notNull().references(() => codingChallenges.id, { onDelete: "cascade" }),
  userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  language:      codingLanguageEnum("language").notNull(),
  code:          text("code").notNull(),
  status:        submissionStatusEnum("status").default("pending").notNull(),
  passedTests:   integer("passed_tests").default(0).notNull(),
  totalTests:    integer("total_tests").default(0).notNull(),
  runtime:       integer("runtime_ms"),
  errorMessage:  text("error_message"),
  isFirstSolve:  boolean("is_first_solve").default(false).notNull(),
  submittedAt:   timestamp("submitted_at").defaultNow().notNull(),
});

export const codingProgress = pgTable("coding_progress", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:        text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  currentDay:    integer("current_day").default(1).notNull(),
  streak:        integer("streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  totalSolved:   integer("total_solved").default(0).notNull(),
  lastSolvedAt:  timestamp("last_solved_at"),
  startedAt:     timestamp("started_at").defaultNow().notNull(),
  completedDays: jsonb("completed_days").$type<number[]>().default([]), // array of day numbers solved
});

export const codingChallengesRelations = relations(codingChallenges, ({ many }) => ({
  submissions: many(codingSubmissions),
}));

export const codingSubmissionsRelations = relations(codingSubmissions, ({ one }) => ({
  challenge: one(codingChallenges, { fields: [codingSubmissions.challengeId], references: [codingChallenges.id] }),
  user:      one(users,            { fields: [codingSubmissions.userId],      references: [users.id]            }),
}));

export const codingProgressRelations = relations(codingProgress, ({ one }) => ({
  user: one(users, { fields: [codingProgress.userId], references: [users.id] }),
}));

// ─── Messaging (Job Seeker ↔ Employer chat) ────────────────────────────────────
// One conversation per (job, job seeker) pair — lets a seeker discuss a specific
// gig / retail / one-day job directly with the employer who posted it.

export const conversations = pgTable("conversations", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId:         text("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  jobSeekerId:   text("job_seeker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  employerId:    text("employer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId:       text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body:           text("body").notNull(),
  isRead:         boolean("is_read").default(false).notNull(),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
});

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  job:       one(jobs,  { fields: [conversations.jobId],       references: [jobs.id]  }),
  jobSeeker: one(users, { fields: [conversations.jobSeekerId], references: [users.id] }),
  employer:  one(users, { fields: [conversations.employerId],  references: [users.id] }),
  messages:  many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender:       one(users,         { fields: [messages.senderId],       references: [users.id]          }),
}));

// ─── Bits (job seeker application currency) ────────────────────────────────────
// Every credit/debit to a user's bits balance is logged here so the balance
// is always auditable: free signup bonus, paid top-ups, and spends on job
// applications.

export const bitTransactions = pgTable("bit_transactions", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type:         bitTransactionTypeEnum("type").notNull(),
  amount:       integer("amount").notNull(),          // positive = credit, negative = debit
  balanceAfter: integer("balance_after").notNull(),
  jobId:        text("job_id").references(() => jobs.id, { onDelete: "set null" }),
  packageId:    varchar("package_id", { length: 50 }), // which bit package was purchased, if any
  description:  text("description"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

export const bitTransactionsRelations = relations(bitTransactions, ({ one }) => ({
  user: one(users, { fields: [bitTransactions.userId], references: [users.id] }),
  job:  one(jobs,  { fields: [bitTransactions.jobId],  references: [jobs.id]  }),
}));