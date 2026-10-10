export type UserRole = "job_seeker" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  city: string;
  region: CameroonRegion;
  bio?: string;
  xp: number;
  badges: Badge[];
  createdAt: string;

  // Job Seeker fields
  skills?: string[];
  experienceLevel?: ExperienceLevel;
  currentJobTitle?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  preferredJobTypes?: string[];
  preferredCategories?: string[];

  // Employer fields
  companyName?: string;
  companySize?: string;
  industrySector?: IndustrySector;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
  contactPhone?: string;
  isVerified?: boolean;
}

export type ExperienceLevel = "entry" | "junior" | "mid" | "senior" | "executive";

export type IndustrySector =
  | "technology" | "finance" | "healthcare" | "education" | "agriculture"
  | "manufacturing" | "retail" | "construction" | "transport" | "media"
  | "hospitality" | "energy" | "telecom" | "ngo" | "government" | "other";

export type CameroonRegion =
  | "Centre"
  | "Littoral"
  | "West"
  | "Northwest"
  | "Southwest"
  | "North"
  | "Adamawa"
  | "East"
  | "South"
  | "Far North";

export type CameroonCity =
  | "Yaoundé"
  | "Douala"
  | "Bafoussam"
  | "Bamenda"
  | "Garoua"
  | "Maroua"
  | "Ngaoundéré"
  | "Bertoua"
  | "Ebolowa"
  | "Buea"
  | "Limbe"
  | "Kumba";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export type JobType = "full-time" | "part-time" | "contract" | "one-day" | "gig" | "internship";
export type JobCategory =
  | "technology"
  | "marketing"
  | "finance"
  | "agriculture"
  | "construction"
  | "transport"
  | "healthcare"
  | "education"
  | "hospitality"
  | "creative"
  | "admin"
  | "manual"
  | "other";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  category: JobCategory;
  type: JobType;
  city: CameroonCity | string;
  region: CameroonRegion;
  // Specific zone/neighbourhood (e.g. "Bonapriso, near Total station") the
  // employer entered when posting, geocoded into latitude/longitude for the
  // Location & Directions map. Both are null/undefined when not provided
  // (e.g. remote jobs), in which case the map falls back to city center.
  zone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  salary: {
    min: number;
    max: number;
    currency: "XAF";
    period: "hour" | "day" | "month" | "project";
  };
  deadline: string;
  postedAt: string;
  postedById?: string;
  applicants: number;
  isRemote: boolean;
  tags: string[];
}

export type CompetitionStatus = "upcoming" | "active" | "ended";
export type CompetitionType = "hackathon" | "case-study" | "coding" | "business" | "creative" | "quiz";

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  organizerLogo?: string;
  description: string;
  type: CompetitionType;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizes: Prize[];
  participants: number;
  maxTeamSize: number;
  minTeamSize: number;
  eligibility: string;
  tags: string[];
  city?: CameroonCity | string;
  region?: CameroonRegion;
  // Same zone/geocoding pattern as Job (see above).
  zone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isOnline: boolean;
  banner?: string;
  postedById?: string;
}

export interface Prize {
  rank: number;
  label: string;
  amount: number;
  currency: "XAF";
  extras?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
  timeLimit: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: QuizQuestion[];
  totalPoints: number;
  timeLimit: number;
  participants: number;
  tags: string[];
  createdById?: string;
  companyName?: string;  // Employer who created this quiz
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  competitions: number;
  quizzes: number;
  badges: number;
}

export const COMPANY_SIZES = [
  { value: "1-10",    label: "1–10 employees (Micro)" },
  { value: "11-50",   label: "11–50 employees (Small)" },
  { value: "51-200",  label: "51–200 employees (Medium)" },
  { value: "201-500", label: "201–500 employees (Large)" },
  { value: "500+",    label: "500+ employees (Enterprise)" },
];

export const INDUSTRY_SECTORS: { value: IndustrySector; label: string }[] = [
  { value: "technology",    label: "Technology & IT" },
  { value: "finance",       label: "Finance & Banking" },
  { value: "healthcare",    label: "Healthcare & Pharma" },
  { value: "education",     label: "Education & Training" },
  { value: "agriculture",   label: "Agriculture & Agribusiness" },
  { value: "manufacturing", label: "Manufacturing & Industry" },
  { value: "retail",        label: "Retail & E-commerce" },
  { value: "construction",  label: "Construction & Real Estate" },
  { value: "transport",     label: "Transport & Logistics" },
  { value: "media",         label: "Media & Communications" },
  { value: "hospitality",   label: "Hospitality & Tourism" },
  { value: "energy",        label: "Energy & Utilities" },
  { value: "telecom",       label: "Telecom & Internet" },
  { value: "ngo",           label: "NGO & Non-Profit" },
  { value: "government",    label: "Government & Public Sector" },
  { value: "other",         label: "Other" },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "entry",     label: "Entry Level (0–1 year)" },
  { value: "junior",    label: "Junior (1–3 years)" },
  { value: "mid",       label: "Mid-Level (3–5 years)" },
  { value: "senior",    label: "Senior (5–10 years)" },
  { value: "executive", label: "Executive / Director (10+ years)" },
];