// src/app/api/seed/route.ts
// Run once: GET /api/seed (only works if DB is empty or in dev mode)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, jobs, competitions, quizzes, quizQuestions } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  // Safety check — only seed if no jobs exist yet
  const existing = await db.select({ cnt: count() }).from(jobs);
  if ((existing[0]?.cnt ?? 0) > 0) {
    return NextResponse.json({ message: "DB already has data. Skipping seed." });
  }

  // ── 1. Employer accounts ───────────────────────────────────────────────────
  const hash = await bcrypt.hash("password123", 10);

  const employerRows = await db.insert(users).values([
    {
      name: "MTN Cameroon HR", email: "hr@mtn.cm", passwordHash: hash, role: "employer",
      city: "Yaoundé", region: "Centre", companyName: "MTN Cameroon",
      companySize: "1000+", industrySector: "telecom",
      companyDescription: "Leading mobile network operator in Cameroon.",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/MTN_Logo.svg/200px-MTN_Logo.svg.png",
      contactPhone: "+237 6 55 00 00 00", xp: 0,
    },
    {
      name: "Orange Cameroun RH", email: "rh@orange.cm", passwordHash: hash, role: "employer",
      city: "Douala", region: "Littoral", companyName: "Orange Cameroun",
      companySize: "1000+", industrySector: "telecom",
      companyDescription: "Orange is one of the world's leading telecommunications operators.",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png",
      contactPhone: "+237 6 99 00 00 00", xp: 0,
    },
    {
      name: "Afriland First Bank", email: "jobs@afriland.cm", passwordHash: hash, role: "employer",
      city: "Yaoundé", region: "Centre", companyName: "Afriland First Bank",
      companySize: "500-999", industrySector: "finance",
      companyDescription: "Premier Cameroonian bank with pan-African ambitions.",
      contactPhone: "+237 2 22 23 00 00", xp: 0,
    },
    {
      name: "Camrail Recrutement", email: "jobs@camrail.net", passwordHash: hash, role: "employer",
      city: "Douala", region: "Littoral", companyName: "Camrail",
      companySize: "500-999", industrySector: "transport",
      companyDescription: "Rail transport company operating across Cameroon.",
      xp: 0,
    },
    {
      name: "CSPH Recrutement", email: "recrutement@csph.cm", passwordHash: hash, role: "employer",
      city: "Yaoundé", region: "Centre", companyName: "CSPH",
      companySize: "200-499", industrySector: "energy",
      companyDescription: "Caisse de Stabilisation des Prix des Hydrocarbures.",
      xp: 0,
    },
    {
      name: "Digital Agency Douala", email: "jobs@digitalagency.cm", passwordHash: hash, role: "employer",
      city: "Douala", region: "Littoral", companyName: "Digital Agency CM",
      companySize: "10-49", industrySector: "technology",
      companyDescription: "Full-service digital agency building products for African markets.",
      xp: 0,
    },
    {
      name: "StartupCam Hub", email: "team@startupcam.cm", passwordHash: hash, role: "employer",
      city: "Buea", region: "Southwest", companyName: "StartupCam",
      companySize: "1-9", industrySector: "technology",
      companyDescription: "Silicon Mountain startup hub building the next generation of African tech.",
      xp: 0,
    },
    {
      name: "TotalEnergies CM", email: "hr@totalenergies.cm", passwordHash: hash, role: "employer",
      city: "Douala", region: "Littoral", companyName: "TotalEnergies Cameroun",
      companySize: "200-499", industrySector: "energy",
      companyDescription: "TotalEnergies is a global multi-energy company operating in Cameroon.",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/TotalEnergies_logo.svg/200px-TotalEnergies_logo.svg.png",
      xp: 0,
    },
  ] as any[]).returning();

  const [mtn, orange, afriland, camrail, csph, digitalAgency, startupCam, total] = employerRows;

  // ── 2. Jobs ────────────────────────────────────────────────────────────────
  const deadline90  = new Date(Date.now() + 90  * 24 * 60 * 60 * 1000);
  const deadline60  = new Date(Date.now() + 60  * 24 * 60 * 60 * 1000);
  const deadline30  = new Date(Date.now() + 30  * 24 * 60 * 60 * 1000);
  const deadline14  = new Date(Date.now() + 14  * 24 * 60 * 60 * 1000);
  const deadline7   = new Date(Date.now() + 7   * 24 * 60 * 60 * 1000);

  await db.insert(jobs).values([
    // MTN Jobs
    {
      title: "Software Engineer – Mobile Money",
      company: "MTN Cameroon", postedById: mtn.id,
      description: "Join MTN's Mobile Money team to build and maintain the backend services powering MoMo transactions for millions of Cameroonians. You will work on high-availability APIs, fraud detection systems, and real-time payment processing pipelines.\n\nKey responsibilities:\n• Design and implement RESTful APIs for mobile payment flows\n• Optimize database queries for high-throughput transaction processing\n• Collaborate with product teams to deliver new MoMo features\n• Monitor and ensure 99.9% uptime of payment infrastructure",
      requirements: ["3+ years Node.js or Java", "Experience with microservices", "PostgreSQL or MySQL", "REST API design", "Knowledge of payment systems"],
      category: "technology", type: "full-time",
      city: "Yaoundé", region: "Centre",
      salaryMin: 450000, salaryMax: 700000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: true,
      tags: ["nodejs", "java", "mobile-money", "fintech", "api"],
      deadline: deadline60,
    },
    {
      title: "Network Operations Engineer",
      company: "MTN Cameroon", postedById: mtn.id,
      description: "Maintain and optimize MTN's nationwide telecommunications network. You will monitor network performance, troubleshoot outages, and implement upgrades to support growing subscriber demand across all 10 regions of Cameroon.",
      requirements: ["Degree in Telecoms or Electrical Engineering", "Cisco CCNA/CCNP certification", "4G/5G network experience", "Fluent in French and English"],
      category: "technology", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 380000, salaryMax: 550000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["networking", "telecoms", "cisco", "4g", "5g"],
      deadline: deadline90,
    },
    {
      title: "Customer Experience Agent (MoMo)",
      company: "MTN Cameroon", postedById: mtn.id,
      description: "Handle customer inquiries related to MTN MoMo transactions, troubleshoot payment issues, and provide excellent service to our mobile money users.",
      requirements: ["Baccalauréat minimum", "French + English", "Good communication skills", "Basic computer skills"],
      category: "other", type: "full-time",
      city: "Yaoundé", region: "Centre",
      salaryMin: 120000, salaryMax: 180000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["customer-service", "momo", "telecoms"],
      deadline: deadline30,
    },
    // Orange Jobs
    {
      title: "Full Stack Developer",
      company: "Orange Cameroun", postedById: orange.id,
      description: "Build and maintain Orange's digital products including the Orange Money app and the Orange & Me customer portal. Work in an agile team delivering high-quality features for 8 million Orange subscribers in Cameroon.\n\nYou will:\n• Develop responsive web and mobile interfaces using React and React Native\n• Build robust backend services in Node.js\n• Integrate with Orange's payment and messaging APIs\n• Participate in code reviews and architectural decisions",
      requirements: ["React / React Native", "Node.js + Express", "PostgreSQL", "Git", "3+ years experience"],
      category: "technology", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 400000, salaryMax: 650000, salaryPeriod: "month",
      isRemote: true, isActive: true, isFeatured: true,
      tags: ["react", "nodejs", "fullstack", "mobile", "remote"],
      deadline: deadline60,
    },
    {
      title: "Data Analyst – Business Intelligence",
      company: "Orange Cameroun", postedById: orange.id,
      description: "Turn Orange's vast subscriber and revenue data into actionable business insights. Build dashboards, run analyses, and present findings to senior management.",
      requirements: ["Python or R", "SQL", "Power BI or Tableau", "Statistics background", "2+ years experience"],
      category: "technology", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 300000, salaryMax: 480000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["data", "analytics", "python", "sql", "powerbi"],
      deadline: deadlineDays(45),
    },
    // Afriland Jobs
    {
      title: "Credit Risk Analyst",
      company: "Afriland First Bank", postedById: afriland.id,
      description: "Assess credit risk for corporate and retail loan applications, prepare detailed credit reports, and make recommendations to the credit committee. You will manage a portfolio of SME and large corporate clients.",
      requirements: ["Finance or Economics degree", "3+ years in banking", "Financial modelling skills", "Knowledge of OHADA law", "Bilingual"],
      category: "finance", type: "full-time",
      city: "Yaoundé", region: "Centre",
      salaryMin: 350000, salaryMax: 500000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: true,
      tags: ["finance", "banking", "credit", "risk"],
      deadline: deadline30,
    },
    {
      title: "Branch Manager – Bafoussam",
      company: "Afriland First Bank", postedById: afriland.id,
      description: "Lead the Bafoussam branch team to achieve commercial targets, ensure regulatory compliance, and deliver excellent customer service. Responsible for P&L of the branch.",
      requirements: ["5+ years banking experience", "Leadership skills", "West Region network preferred", "MBA or equivalent"],
      category: "other", type: "full-time",
      city: "Bafoussam", region: "West",
      salaryMin: 500000, salaryMax: 750000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["banking", "management", "leadership", "bafoussam"],
      deadline: deadline60,
    },
    {
      title: "Banking Intern – Operations",
      company: "Afriland First Bank", postedById: afriland.id,
      description: "6-month internship in our Douala operations department. You will assist with account opening, transaction processing, KYC documentation, and customer onboarding.",
      requirements: ["BTS or Licence in Finance/Accounting", "Good Excel skills", "Attention to detail", "French required"],
      category: "finance", type: "internship",
      city: "Douala", region: "Littoral",
      salaryMin: 60000, salaryMax: 80000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["internship", "banking", "finance", "operations"],
      deadline: deadline14,
    },
    // Tech startup jobs
    {
      title: "React Native Developer",
      company: "Digital Agency CM", postedById: digitalAgency.id,
      description: "Build cross-platform mobile apps for our growing portfolio of African startup clients. You'll own features end-to-end from design handoff to App Store deployment.",
      requirements: ["React Native", "TypeScript", "Redux or Zustand", "2+ years", "Portfolio required"],
      category: "technology", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 250000, salaryMax: 420000, salaryPeriod: "month",
      isRemote: true, isActive: true, isFeatured: true,
      tags: ["react-native", "mobile", "typescript", "remote"],
      deadline: deadline30,
    },
    {
      title: "UI/UX Designer",
      company: "Digital Agency CM", postedById: digitalAgency.id,
      description: "Design beautiful, user-centred interfaces for web and mobile apps. You'll run user research sessions, create wireframes and high-fidelity prototypes in Figma, and collaborate closely with developers.",
      requirements: ["Figma proficiency", "2+ years UX experience", "Portfolio required", "Mobile-first design experience"],
      category: "creative", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 200000, salaryMax: 350000, salaryPeriod: "month",
      isRemote: true, isActive: true, isFeatured: false,
      tags: ["figma", "ux", "design", "mobile", "remote"],
      deadline: deadlineDays(45),
    },
    {
      title: "Backend Developer (Python/Django)",
      company: "StartupCam", postedById: startupCam.id,
      description: "Join Silicon Mountain's fastest-growing startup! Build the APIs and data pipelines powering our agri-tech platform connecting farmers to markets across Central Africa.",
      requirements: ["Python", "Django or FastAPI", "PostgreSQL", "Docker", "1+ years"],
      category: "technology", type: "full-time",
      city: "Buea", region: "Southwest",
      salaryMin: 200000, salaryMax: 350000, salaryPeriod: "month",
      isRemote: true, isActive: true, isFeatured: true,
      tags: ["python", "django", "backend", "startup", "agritech"],
      deadline: deadline30,
    },
    {
      title: "DevOps Engineer",
      company: "StartupCam", postedById: startupCam.id,
      description: "Set up and manage our cloud infrastructure on AWS. Implement CI/CD pipelines, manage Kubernetes clusters, and ensure our platform scales to serve farmers across the continent.",
      requirements: ["AWS or GCP", "Kubernetes", "Terraform", "CI/CD (GitHub Actions)", "2+ years"],
      category: "technology", type: "full-time",
      city: "Buea", region: "Southwest",
      salaryMin: 300000, salaryMax: 500000, salaryPeriod: "month",
      isRemote: true, isActive: true, isFeatured: false,
      tags: ["devops", "aws", "kubernetes", "docker", "remote"],
      deadline: deadline60,
    },
    // Gig / casual jobs
    {
      title: "Delivery Rider – Yaoundé",
      company: "MTN Cameroon", postedById: mtn.id,
      description: "Deliver SIM cards, MoMo agents kits, and promotional materials across Yaoundé. Paid per delivery. Flexible hours — work when you want.",
      requirements: ["Valid motorcycle licence", "Smartphone", "Knowledge of Yaoundé roads", "Reliable"],
      category: "transport", type: "gig",
      city: "Yaoundé", region: "Centre",
      salaryMin: 5000, salaryMax: 15000, salaryPeriod: "day",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["delivery", "gig", "motorcycle", "flexible"],
      deadline: deadline7,
    },
    {
      title: "Event Promoter – Orange Concert",
      company: "Orange Cameroun", postedById: orange.id,
      description: "Promote Orange's upcoming music festival in Douala. Distribute flyers, manage social media stories, and represent Orange at the event. 3-day assignment.",
      requirements: ["Energetic personality", "Social media savvy", "Available Dec 15-17", "Based in Douala"],
      category: "marketing", type: "gig",
      city: "Douala", region: "Littoral",
      salaryMin: 8000, salaryMax: 12000, salaryPeriod: "day",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["promoter", "gig", "event", "marketing"],
      deadline: deadline14,
    },
    {
      title: "Data Entry Clerk (Remote)",
      company: "Afriland First Bank", postedById: afriland.id,
      description: "Enter and verify customer KYC data from scanned documents into our banking system. Work from home, flexible hours. Paid per batch completed.",
      requirements: ["Fast and accurate typing", "Good French", "Computer with stable internet", "Attention to detail"],
      category: "admin", type: "part-time",
      city: "Yaoundé", region: "Centre",
      salaryMin: 50000, salaryMax: 80000, salaryPeriod: "month",
      isRemote: true, isActive: true, isFeatured: false,
      tags: ["remote", "data-entry", "part-time", "banking"],
      deadline: deadline30,
    },
    // TotalEnergies
    {
      title: "HSE Engineer",
      company: "TotalEnergies Cameroun", postedById: total.id,
      description: "Ensure Health, Safety and Environment compliance at TotalEnergies Cameroun facilities. Conduct risk assessments, lead HSE training, and manage incident reporting.",
      requirements: ["Engineering degree", "HSE certification (NEBOSH preferred)", "3+ years oil & gas", "English + French"],
      category: "other", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 600000, salaryMax: 900000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: true,
      tags: ["hse", "oil-gas", "safety", "engineering"],
      deadline: deadline60,
    },
    {
      title: "Finance Controller",
      company: "TotalEnergies Cameroun", postedById: total.id,
      description: "Oversee financial reporting, budgeting, and cost control for TotalEnergies Cameroun operations. Work closely with regional HQ in Paris.",
      requirements: ["CPA or ACCA qualified", "5+ years finance", "SAP experience", "English required", "IFRS knowledge"],
      category: "finance", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 700000, salaryMax: 1100000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["finance", "accounting", "sap", "ifrs", "oil-gas"],
      deadline: deadline90,
    },
    // Camrail
    {
      title: "Train Driver – Apprentice",
      company: "Camrail", postedById: camrail.id,
      description: "12-month paid apprenticeship training to become a certified train driver on the Camrail network. Full training provided. Long-term employment for top graduates.",
      requirements: ["BEP or CAP in mechanical or electrical field", "Good eyesight", "Clean criminal record", "Age 21-35"],
      category: "transport", type: "internship",
      city: "Douala", region: "Littoral",
      salaryMin: 90000, salaryMax: 120000, salaryPeriod: "month",
      isRemote: false, isActive: true, isFeatured: false,
      tags: ["railway", "apprenticeship", "transport", "camrail"],
      deadline: deadline30,
    },
  ] as any[]).returning();

  // ── 3. Competitions ────────────────────────────────────────────────────────
  await db.insert(competitions).values([
    {
      title: "Cameroon Tech Hackathon 2025",
      organizer: "MTN Cameroon + Silicon Mountain",
      description: "The biggest hackathon in Central Africa returns! Build a tech solution addressing one of Cameroon's greatest challenges: agriculture, healthcare, education, or financial inclusion. 48-hour sprint with mentors from MTN, Orange, and leading Cameroonian startups.\n\nTheme: **Technology for Sustainable Development in Cameroon**\n\nTeams of 2-4 participants. All skill levels welcome — designers, developers, business students. Workshops and pitching sessions included.",
      type: "hackathon", status: "active",
      startDate: new Date(Date.now() + 14 * 86400000),
      endDate:   new Date(Date.now() + 16 * 86400000),
      registrationDeadline: new Date(Date.now() + 10 * 86400000),
      prizes: [
        { rank: 1, label: "Grand Prix", amount: 1500000, extras: ["MTN incubation offer"] },
        { rank: 2, label: "2nd Place",  amount: 750000 },
        { rank: 3, label: "3rd Place",  amount: 300000 },
        { rank: 0, label: "Best Social Impact", amount: 100000 },
      ],
      maxTeamSize: 4, minTeamSize: 2,
      eligibility: "Open to all Cameroonians aged 18+",
      tags: ["hackathon", "tech", "mtn", "innovation", "cameroon"],
      city: "Yaoundé", region: "Centre", isOnline: false,
      postedById: mtn.id,
    },
    {
      title: "Orange Business Case Challenge",
      organizer: "Orange Cameroun",
      description: "Present a business strategy to help Orange capture market share in underserved regions of Cameroon. Teams will analyse real market data, develop go-to-market strategies, and pitch to Orange's executive committee.\n\nFinalists will present in Douala in front of a jury including Orange's CEO and external business leaders.",
      type: "case-study", status: "active",
      startDate: new Date(Date.now() + 7  * 86400000),
      endDate:   new Date(Date.now() + 30 * 86400000),
      registrationDeadline: new Date(Date.now() + 5 * 86400000),
      prizes: [
        { rank: 1, label: "Winner", amount: 1000000, extras: ["Orange internship offer"] },
        { rank: 2, label: "Runner-up", amount: 400000 },
        { rank: 3, label: "3rd Place", amount: 150000 },
      ],
      maxTeamSize: 3, minTeamSize: 2,
      eligibility: "Business and engineering students, Cameroon universities",
      tags: ["business", "strategy", "orange", "case-study"],
      city: "Douala", region: "Littoral", isOnline: false,
      postedById: orange.id,
    },
    {
      title: "Silicon Mountain Coding Contest",
      organizer: "StartupCam",
      description: "Individual online coding competition testing algorithmic problem solving, data structures, and software design. 3-hour contest with 5 problems of increasing difficulty. All programming languages allowed.",
      type: "coding", status: "active",
      startDate: new Date(Date.now() + 3 * 86400000),
      endDate:   new Date(Date.now() + 3 * 86400000 + 3 * 3600000),
      registrationDeadline: new Date(Date.now() + 2 * 86400000),
      prizes: [
        { rank: 1, label: "1st Place", amount: 500000, extras: ["Job offer at StartupCam"] },
        { rank: 2, label: "2nd Place", amount: 200000 },
        { rank: 3, label: "3rd Place", amount: 100000 },
      ],
      maxTeamSize: 1, minTeamSize: 1,
      eligibility: "Open to all — individual participation only",
      tags: ["coding", "algorithms", "programming", "online"],
      isOnline: true,
      postedById: startupCam.id,
    },
    {
      title: "Cameroon Creative Advertising Challenge",
      organizer: "Digital Agency CM",
      description: "Create a digital advertising campaign for a Cameroonian brand of your choice. Submit a social media strategy, 3 creative assets, and a 2-minute pitch video. Judged by Cameroon's top marketing professionals.",
      type: "creative", status: "upcoming",
      startDate: new Date(Date.now() + 21 * 86400000),
      endDate:   new Date(Date.now() + 45 * 86400000),
      registrationDeadline: new Date(Date.now() + 18 * 86400000),
      prizes: [
        { rank: 1, label: "Best Campaign", amount: 600000, extras: ["Agency contract"] },
        { rank: 2, label: "Runner-up", amount: 250000 },
      ],
      maxTeamSize: 2, minTeamSize: 1,
      eligibility: "Open to designers, marketers, and creatives across Cameroon",
      tags: ["creative", "advertising", "design", "marketing"],
      isOnline: true,
      postedById: digitalAgency.id,
    },
    {
      title: "Afriland FinTech Innovation Prize",
      organizer: "Afriland First Bank",
      description: "Propose an innovative financial technology solution to improve banking access in rural Cameroon. Submit a written proposal and a working prototype or mockup. Winning solution may be piloted by Afriland.",
      type: "business", status: "active",
      startDate: new Date(Date.now() + 1 * 86400000),
      endDate:   new Date(Date.now() + 60 * 86400000),
      registrationDeadline: new Date(Date.now() + 5 * 86400000),
      prizes: [
        { rank: 1, label: "Grand Prize", amount: 2000000, extras: ["Pilot partnership"] },
        { rank: 2, label: "2nd Place", amount: 800000 },
        { rank: 3, label: "3rd Place", amount: 300000 },
      ],
      maxTeamSize: 4, minTeamSize: 1,
      eligibility: "Cameroonian entrepreneurs and tech teams",
      tags: ["fintech", "banking", "innovation", "rural", "africa"],
      city: "Yaoundé", region: "Centre", isOnline: false,
      postedById: afriland.id,
    },
  ] as any[]).returning();

  // ── 4. Quizzes ─────────────────────────────────────────────────────────────
  const quizRows = await db.insert(quizzes).values([
    {
      title: "MTN MoMo & Mobile Banking",
      description: "Test your knowledge of mobile money, MTN MoMo features, and mobile banking in Cameroon.",
      category: "finance", difficulty: "intermediate",
      timeLimit: 600, totalPoints: 150,
      isActive: true, createdById: mtn.id, companyName: "MTN Cameroon",
    },
    {
      title: "Cameroon Tech Ecosystem",
      description: "How well do you know Silicon Mountain, Cameroon's startups, and the African tech landscape?",
      category: "technology", difficulty: "intermediate",
      timeLimit: 480, totalPoints: 100,
      isActive: true, createdById: startupCam.id, companyName: "StartupCam",
    },
    {
      title: "Web Development Fundamentals",
      description: "HTML, CSS, JavaScript, React — test your front-end skills with this comprehensive quiz.",
      category: "technology", difficulty: "advanced",
      timeLimit: 900, totalPoints: 200,
      isActive: true, createdById: digitalAgency.id, companyName: "Digital Agency CM",
    },
    {
      title: "Cameroon Business Law & OHADA",
      description: "Essential knowledge of OHADA commercial law, company formation, and contracts in Cameroon.",
      category: "business", difficulty: "advanced",
      timeLimit: 720, totalPoints: 180,
      isActive: true, createdById: afriland.id, companyName: "Afriland First Bank",
    },
    {
      title: "General Knowledge — Cameroon",
      description: "History, geography, culture, and current affairs of Cameroon. For every proud Cameroonian!",
      category: "general", difficulty: "beginner",
      timeLimit: 300, totalPoints: 75,
      isActive: true, createdById: mtn.id, companyName: "MTN Cameroon",
    },
  ] as any[]).returning();

  const [momoQuiz, techQuiz, webQuiz, lawQuiz, generalQuiz] = quizRows;

  // ── 5. Quiz Questions ──────────────────────────────────────────────────────
  await db.insert(quizQuestions).values([
    // MoMo Quiz
    { quizId: momoQuiz.id, question: "What is the USSD code to access MTN MoMo in Cameroon?", options: ["*126#", "*150#", "*196#", "*100#"], correctAnswer: 0, explanation: "*126# is the MTN MoMo USSD code in Cameroon.", orderIndex: 1 },
    { quizId: momoQuiz.id, question: "What is the maximum single transaction limit for MTN MoMo in Cameroon?", options: ["500,000 XAF", "1,000,000 XAF", "2,000,000 XAF", "5,000,000 XAF"], correctAnswer: 1, explanation: "The maximum single transaction is 1,000,000 XAF for standard MoMo accounts.", orderIndex: 2 },
    { quizId: momoQuiz.id, question: "Which regulatory body supervises mobile money operators in Cameroon?", options: ["BEAC", "COBAC", "ART", "MINFI"], correctAnswer: 1, explanation: "COBAC (Commission Bancaire de l'Afrique Centrale) supervises financial services including mobile money.", orderIndex: 3 },
    { quizId: momoQuiz.id, question: "Orange Money was launched in Cameroon in which year?", options: ["2008", "2010", "2012", "2014"], correctAnswer: 1, explanation: "Orange Money was launched in Cameroon in 2010.", orderIndex: 4 },
    { quizId: momoQuiz.id, question: "What does KYC stand for in banking and mobile money?", options: ["Keep Your Cash", "Know Your Customer", "Key Yield Control", "Know Your Currency"], correctAnswer: 1, explanation: "KYC means Know Your Customer — the process of verifying client identity.", orderIndex: 5 },
    // Tech Quiz
    { quizId: techQuiz.id, question: "What is the nickname of Cameroon's tech hub city?", options: ["Silicon Savanna", "Silicon Mountain", "Silicon Valley Africa", "Tech City"], correctAnswer: 1, explanation: "Buea is known as 'Silicon Mountain' — Cameroon's tech startup hub.", orderIndex: 1 },
    { quizId: techQuiz.id, question: "Which Cameroonian startup created the Njangui digital savings app?", options: ["StartupCam", "InvestHer", "Ejara", "CamTech"], correctAnswer: 2, explanation: "Ejara is a Cameroonian crypto and savings platform with significant traction.", orderIndex: 2 },
    { quizId: techQuiz.id, question: "What year was Silicon Mountain first coined as a term for Buea's tech scene?", options: ["2010", "2013", "2015", "2018"], correctAnswer: 1, explanation: "The term Silicon Mountain emerged around 2013 as Buea's startup ecosystem grew.", orderIndex: 3 },
    { quizId: techQuiz.id, question: "Which African country has the continent's highest mobile money penetration?", options: ["Nigeria", "South Africa", "Kenya", "Ghana"], correctAnswer: 2, explanation: "Kenya leads Africa in mobile money adoption, driven by M-Pesa.", orderIndex: 4 },
    { quizId: techQuiz.id, question: "What does API stand for?", options: ["Application Programming Interface", "Automated Process Integration", "Advanced Program Input", "Application Process Index"], correctAnswer: 0, explanation: "API stands for Application Programming Interface.", orderIndex: 5 },
    // Web Dev Quiz
    { quizId: webQuiz.id, question: "Which CSS property is used to create a flexbox layout?", options: ["display: flex", "layout: flexbox", "position: flex", "flex: true"], correctAnswer: 0, explanation: "display: flex creates a flex container.", orderIndex: 1 },
    { quizId: webQuiz.id, question: "In React, which hook is used for side effects?", options: ["useState", "useEffect", "useRef", "useContext"], correctAnswer: 1, explanation: "useEffect is used for side effects like data fetching and subscriptions.", orderIndex: 2 },
    { quizId: webQuiz.id, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "Structured Queue Language", "System Query Layer"], correctAnswer: 0, explanation: "SQL stands for Structured Query Language.", orderIndex: 3 },
    { quizId: webQuiz.id, question: "Which HTTP method is idempotent and used to update a resource?", options: ["POST", "GET", "PUT", "PATCH"], correctAnswer: 2, explanation: "PUT is idempotent and replaces a resource entirely.", orderIndex: 4 },
    { quizId: webQuiz.id, question: "In JavaScript, what does 'async/await' help with?", options: ["CSS animations", "Asynchronous operations", "Database queries", "Error handling only"], correctAnswer: 1, explanation: "async/await makes working with Promises easier and more readable.", orderIndex: 5 },
    // Law Quiz
    { quizId: lawQuiz.id, question: "OHADA stands for?", options: ["Organisation pour l'Harmonisation en Afrique du Droit des Affaires", "Organisation des Hommes Africains pour le Développement des Affaires", "Organisation Harmonisée Africaine de Droit et d'Arbitrage", "Office d'Harmonisation Africaine des Affaires"], correctAnswer: 0, explanation: "OHADA = Organisation pour l'Harmonisation en Afrique du Droit des Affaires, with 17 member states.", orderIndex: 1 },
    { quizId: lawQuiz.id, question: "How many member states are in the OHADA treaty?", options: ["14", "17", "21", "12"], correctAnswer: 1, explanation: "17 African states have ratified the OHADA treaty.", orderIndex: 2 },
    { quizId: lawQuiz.id, question: "What is the minimum share capital to register a SARL in Cameroon?", options: ["100,000 XAF", "500,000 XAF", "1,000,000 XAF", "No minimum"], correctAnswer: 3, explanation: "Under OHADA reforms, there is no longer a minimum share capital for a SARL.", orderIndex: 3 },
    { quizId: lawQuiz.id, question: "Which court handles OHADA commercial disputes at the highest level?", options: ["CCJA", "ICJ", "African Court", "CEMAC Court"], correctAnswer: 0, explanation: "The CCJA (Common Court of Justice and Arbitration) is the supreme OHADA court.", orderIndex: 4 },
    { quizId: lawQuiz.id, question: "What is the standard VAT rate in Cameroon?", options: ["15%", "17.5%", "19.25%", "20%"], correctAnswer: 2, explanation: "The standard VAT rate in Cameroon is 19.25% (including the municipal surtax).", orderIndex: 5 },
    // General Quiz
    { quizId: generalQuiz.id, question: "What is the capital city of Cameroon?", options: ["Douala", "Yaoundé", "Bafoussam", "Garoua"], correctAnswer: 1, explanation: "Yaoundé is the political capital; Douala is the economic capital.", orderIndex: 1 },
    { quizId: generalQuiz.id, question: "Cameroon is often called 'Africa in miniature' because?", options: ["It is the smallest country in Africa", "It has almost every climate and landscape found in Africa", "It has the most diverse languages", "It was colonised by many nations"], correctAnswer: 1, explanation: "Cameroon has rainforests, savannas, mountains, deserts, and coast — nearly every African ecosystem.", orderIndex: 2 },
    { quizId: generalQuiz.id, question: "What is the currency of Cameroon?", options: ["Naira", "CFA Franc BEAC", "CFA Franc BCEAO", "Cameroonian Dollar"], correctAnswer: 1, explanation: "Cameroon uses the CFA Franc issued by BEAC (Banque des États de l'Afrique Centrale).", orderIndex: 3 },
    { quizId: generalQuiz.id, question: "Mount Cameroon is the highest peak in West and Central Africa. What is its height?", options: ["3,008 m", "4,095 m", "2,740 m", "3,500 m"], correctAnswer: 1, explanation: "Mount Cameroon (Fako) stands at 4,095 metres.", orderIndex: 4 },
    { quizId: generalQuiz.id, question: "Which two languages are official in Cameroon?", options: ["French and German", "French and English", "English and Fulfulde", "French and Ewondo"], correctAnswer: 1, explanation: "Cameroon is officially bilingual — French and English are both national languages.", orderIndex: 5 },
  ] as any[]);

  return NextResponse.json({
    success: true,
    message: "Database seeded successfully!",
    counts: {
      employers:     employerRows.length,
      jobs:          18,
      competitions:  5,
      quizzes:       5,
      questions:     25,
    }
  });
}

// Helper
function deadlineDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}