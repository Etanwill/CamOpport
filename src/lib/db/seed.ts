/**
 * SEED SCRIPT — Run once to populate the database with demo data
 * Usage: npm run db:seed
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding CamOpport database...\n");

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log("👤 Creating users...");
  const passwordHash = await bcrypt.hash("demo123", 10);

  const insertedUsers = await db.insert(schema.users).values([
    {
      name: "Jean-Pierre Mbarga", email: "jp@example.com", passwordHash,
      role: "job_seeker", city: "Yaoundé", region: "Centre",
      bio: "Computer Science student at University of Yaoundé I",
      skills: ["Python", "JavaScript", "Machine Learning"], xp: 4850,
    },
    {
      name: "Aisha Fouda", email: "aisha@example.com", passwordHash,
      role: "employer", city: "Douala", region: "Littoral",
      bio: "Software Engineer with 3 years experience",
      skills: ["React", "Node.js", "PostgreSQL"], xp: 6200,
      companyName: "TechCam Solutions", industrySector: "technology", companySize: "11-50",
    },
    {
      name: "Emmanuel Tabi", email: "etabi@example.com", passwordHash,
      role: "job_seeker", city: "Buea", region: "Southwest",
      bio: "Engineering student passionate about robotics",
      skills: ["C++", "Arduino", "CAD"], xp: 3100,
    },
    {
      name: "Marie-Claire Nkeng", email: "marie@example.com", passwordHash,
      role: "employer", city: "Bafoussam", region: "West",
      bio: "UX Designer and digital artist",
      skills: ["Figma", "Adobe XD", "Photoshop"], xp: 5500,
      companyName: "Nkeng Creative Agency", industrySector: "media", companySize: "1-10",
    },
    {
      name: "Paul Ateba", email: "pateba@example.com", passwordHash,
      role: "job_seeker", city: "Yaoundé", region: "Centre",
      bio: "Finance student at ESSEC Douala",
      skills: ["Excel", "Financial Modeling", "Python"], xp: 2800,
    },
  ]).returning();

  console.log(`   ✅ ${insertedUsers.length} users created`);

  // ── Badges ─────────────────────────────────────────────────────────────────
  console.log("🏆 Creating badges...");
  await db.insert(schema.badges).values([
    { userId: insertedUsers[0].id, name: "Quiz Master", icon: "🏆", color: "gold" },
    { userId: insertedUsers[1].id, name: "Hackathon Winner", icon: "🥇", color: "purple" },
    { userId: insertedUsers[1].id, name: "Top Coder", icon: "💻", color: "blue" },
    { userId: insertedUsers[2].id, name: "Rising Star", icon: "⭐", color: "orange" },
    { userId: insertedUsers[3].id, name: "Design Guru", icon: "🎨", color: "pink" },
  ]);
  console.log("   ✅ Badges created");

  // ── Jobs ───────────────────────────────────────────────────────────────────
  console.log("💼 Creating jobs...");
  await db.insert(schema.jobs).values([
    {
      title: "Junior Software Developer",
      company: "AfricaTech Solutions",
      description: "We are looking for a motivated Junior Developer to join our growing team in Douala. You will work on web applications serving thousands of Cameroonian users.",
      requirements: ["JavaScript or Python basics", "Git knowledge", "Problem-solving mindset", "Diploma in IT or related field"],
      category: "technology", type: "full-time",
      city: "Douala", region: "Littoral",
      salaryMin: 150000, salaryMax: 250000, salaryPeriod: "month",
      isRemote: false, tags: ["JavaScript", "React", "Junior"],
      deadline: new Date("2024-09-30"),
    },
    {
      title: "Delivery Driver (Motorbike) – Daily Pay",
      company: "QuickDeliver Cameroun",
      description: "We need reliable motorbike riders to deliver packages in Yaoundé. Work by the day, get paid same day. You choose your days.",
      requirements: ["Valid motorbike license", "Own motorbike (or we can discuss)", "Know Yaoundé roads well", "Phone with WhatsApp"],
      category: "transport", type: "one-day",
      city: "Yaoundé", region: "Centre",
      salaryMin: 5000, salaryMax: 10000, salaryPeriod: "day",
      isRemote: false, tags: ["Delivery", "Motorbike", "Daily Pay", "Flexible"],
      deadline: new Date("2024-12-31"),
    },
    {
      title: "Social Media Manager",
      company: "Beautée Cameroun",
      description: "Manage our Instagram, Facebook and TikTok pages. Create content, respond to customers, run campaigns. Can be done remotely.",
      requirements: ["Experience with social media platforms", "Basic graphic design (Canva ok)", "Good writing in French and/or English"],
      category: "marketing", type: "part-time",
      city: "Douala", region: "Littoral",
      salaryMin: 50000, salaryMax: 80000, salaryPeriod: "month",
      isRemote: true, tags: ["Social Media", "Marketing", "Remote"],
      deadline: new Date("2024-09-15"),
    },
    {
      title: "Cargo Transport – Douala to Yaoundé",
      company: "Trans-Cam Logistics",
      description: "Need experienced truck driver to move goods from Douala port to Yaoundé warehouse. One trip, paid on completion. Vehicle provided.",
      requirements: ["Valid heavy truck license (permis C)", "At least 2 years truck driving", "Available this weekend"],
      category: "transport", type: "one-day",
      city: "Douala", region: "Littoral",
      salaryMin: 25000, salaryMax: 35000, salaryPeriod: "project",
      isRemote: false, tags: ["Transport", "Truck", "One-time"],
      deadline: new Date("2024-08-20"),
    },
    {
      title: "Accountant",
      company: "MTN Cameroon",
      description: "MTN Cameroon is recruiting a qualified accountant to join the finance team in Yaoundé.",
      requirements: ["Degree in Accounting or Finance", "CPA or equivalent preferred", "3+ years experience", "Strong Excel and ERP skills"],
      category: "finance", type: "full-time",
      city: "Yaoundé", region: "Centre",
      salaryMin: 400000, salaryMax: 650000, salaryPeriod: "month",
      isRemote: false, tags: ["Finance", "Accounting", "Senior", "MTN"],
      deadline: new Date("2024-09-10"),
    },
    {
      title: "Farm Workers – Harvest Season",
      company: "Agri-Ouest SARL",
      description: "We need 20 farm workers for tomato and pepper harvest in Bafoussam area. Accommodation provided. 2-week contract with daily pay.",
      requirements: ["Physically fit", "Willing to work outdoors"],
      category: "agriculture", type: "contract",
      city: "Bafoussam", region: "West",
      salaryMin: 3500, salaryMax: 5000, salaryPeriod: "day",
      isRemote: false, tags: ["Agriculture", "Farm", "Seasonal"],
      deadline: new Date("2024-09-01"),
    },
    {
      title: "English Teacher (Primary School)",
      company: "Bilingual School of Bamenda",
      description: "Seeking a passionate English teacher for primary school classes. Full-time position for the 2024-2025 academic year.",
      requirements: ["Bachelor's degree in Education or English", "DIPES I or II", "Good classroom management"],
      category: "education", type: "full-time",
      city: "Bamenda", region: "Northwest",
      salaryMin: 80000, salaryMax: 120000, salaryPeriod: "month",
      isRemote: false, tags: ["Teaching", "English", "Education"],
      deadline: new Date("2024-09-05"),
    },
    {
      title: "Graphic Designer – Logo & Branding",
      company: "Creative Hub Cameroun",
      description: "One-time project to design a logo and brand identity for a new restaurant in Yaoundé. Remote work, 5-day project.",
      requirements: ["Adobe Illustrator or Photoshop", "Portfolio required", "Fast turnaround"],
      category: "creative", type: "gig",
      city: "Yaoundé", region: "Centre",
      salaryMin: 30000, salaryMax: 60000, salaryPeriod: "project",
      isRemote: true, tags: ["Design", "Branding", "Logo", "Freelance"],
      deadline: new Date("2024-08-25"),
    },
  ]);
  console.log("   ✅ Jobs created");

  // ── Competitions ────────────────────────────────────────────────────────────
  console.log("🏆 Creating competitions...");
  await db.insert(schema.competitions).values([
    {
      title: "CamTech Hackathon 2024",
      organizer: "Tech Hub Cameroun",
      description: "Build innovative tech solutions for Cameroon's pressing challenges in agriculture, health, and education. 48-hour hackathon with mentors from leading tech companies.",
      type: "hackathon", status: "active",
      startDate: new Date("2024-08-15"), endDate: new Date("2024-08-17"),
      registrationDeadline: new Date("2024-08-13"),
      prizes: [
        { rank: 1, label: "1st Place", amount: 500000, extras: ["Incubation support", "Tech equipment"] },
        { rank: 2, label: "2nd Place", amount: 250000, extras: ["Mentorship program"] },
        { rank: 3, label: "3rd Place", amount: 100000 },
      ],
      maxTeamSize: 4, minTeamSize: 2,
      eligibility: "Open to all students and young professionals under 35",
      tags: ["Tech", "Innovation", "Agriculture", "Health"],
      city: "Douala", region: "Littoral", isOnline: false,
    },
    {
      title: "Business Case Competition – Littoral",
      organizer: "ESSEC Business School",
      description: "Analyze real business challenges from top Cameroonian companies and present strategic solutions.",
      type: "case-study", status: "upcoming",
      startDate: new Date("2024-09-10"), endDate: new Date("2024-09-12"),
      registrationDeadline: new Date("2024-09-05"),
      prizes: [
        { rank: 1, label: "Winner", amount: 300000, extras: ["Internship at Orange Cameroun"] },
        { rank: 2, label: "Runner-up", amount: 150000 },
      ],
      maxTeamSize: 3, minTeamSize: 1,
      eligibility: "Business and economics students only",
      tags: ["Business", "Strategy", "Finance"],
      city: "Douala", region: "Littoral", isOnline: false,
    },
    {
      title: "Code Challenge Cameroun – Online",
      organizer: "DevCameroun Community",
      description: "Monthly coding challenge for developers across Cameroon. Solve algorithmic problems and climb the national leaderboard.",
      type: "coding", status: "active",
      startDate: new Date("2024-08-01"), endDate: new Date("2024-08-31"),
      registrationDeadline: new Date("2024-08-20"),
      prizes: [
        { rank: 1, label: "Top Coder", amount: 100000 },
        { rank: 2, label: "2nd Place", amount: 50000 },
        { rank: 3, label: "3rd Place", amount: 25000 },
      ],
      maxTeamSize: 1, minTeamSize: 1,
      eligibility: "Open to all Cameroonians",
      tags: ["Coding", "Algorithms", "Online"],
      isOnline: true,
    },
  ]);
  console.log("   ✅ Competitions created");

  // ── Quizzes ─────────────────────────────────────────────────────────────────
  console.log("⚡ Creating quizzes...");
  const insertedQuizzes = await db.insert(schema.quizzes).values([
    {
      title: "Cameroon General Knowledge",
      description: "Test your knowledge about Cameroon's history, culture, geography and politics.",
      category: "General Knowledge", difficulty: "beginner",
      totalPoints: 50, timeLimit: 600, tags: ["Cameroon", "History", "Culture"],
    },
    {
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of core JavaScript concepts used in modern web development.",
      category: "Technology", difficulty: "intermediate",
      totalPoints: 75, timeLimit: 900, tags: ["JavaScript", "Programming", "Web Dev"],
    },
    {
      title: "Business & Entrepreneurship in Africa",
      description: "Test your understanding of business concepts, African markets, and entrepreneurship.",
      category: "Business", difficulty: "intermediate",
      totalPoints: 60, timeLimit: 720, tags: ["Business", "Africa", "Entrepreneurship"],
    },
  ]).returning();

  // Quiz 1 questions
  await db.insert(schema.quizQuestions).values([
    { quizId: insertedQuizzes[0].id, question: "What is the capital city of Cameroon?", options: ["Douala", "Yaoundé", "Bafoussam", "Bamenda"], correctAnswer: 1, points: 10, timeLimit: 30, orderIndex: 0, explanation: "Yaoundé is the political capital, while Douala is the economic capital." },
    { quizId: insertedQuizzes[0].id, question: "In what year did Cameroon gain independence?", options: ["1956", "1958", "1960", "1961"], correctAnswer: 2, points: 10, timeLimit: 30, orderIndex: 1, explanation: "French Cameroon gained independence on January 1, 1960." },
    { quizId: insertedQuizzes[0].id, question: "How many regions does Cameroon have?", options: ["8", "9", "10", "12"], correctAnswer: 2, points: 10, timeLimit: 30, orderIndex: 2, explanation: "Cameroon has 10 regions, each with its own governor." },
    { quizId: insertedQuizzes[0].id, question: "What are the two official languages of Cameroon?", options: ["French and German", "French and English", "English and Fulfulde", "French and Ewondo"], correctAnswer: 1, points: 10, timeLimit: 30, orderIndex: 3, explanation: "Cameroon is officially bilingual with French and English." },
    { quizId: insertedQuizzes[0].id, question: "What is the currency of Cameroon?", options: ["CFA Franc", "Cameroon Dollar", "XAF Pound", "African Franc"], correctAnswer: 0, points: 10, timeLimit: 30, orderIndex: 4, explanation: "Cameroon uses the Central African CFA Franc (XAF)." },
  ]);

  // Quiz 2 questions
  await db.insert(schema.quizQuestions).values([
    { quizId: insertedQuizzes[1].id, question: "Which keyword declares a block-scoped variable in JavaScript?", options: ["var", "let", "const", "def"], correctAnswer: 1, points: 15, timeLimit: 45, orderIndex: 0, explanation: "'let' declares block-scoped variables, unlike 'var' which is function-scoped." },
    { quizId: insertedQuizzes[1].id, question: "What does 'typeof null' return in JavaScript?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correctAnswer: 2, points: 15, timeLimit: 45, orderIndex: 1, explanation: "This is a known bug in JavaScript — typeof null returns 'object'." },
    { quizId: insertedQuizzes[1].id, question: "Which method removes the last element from an array?", options: ["shift()", "pop()", "splice()", "remove()"], correctAnswer: 1, points: 15, timeLimit: 45, orderIndex: 2 },
    { quizId: insertedQuizzes[1].id, question: "What is a Promise in JavaScript?", options: ["A synchronous function", "An object representing eventual completion or failure", "A type of loop", "A way to declare constants"], correctAnswer: 1, points: 15, timeLimit: 45, orderIndex: 3, explanation: "A Promise represents the eventual completion or failure of an async operation." },
    { quizId: insertedQuizzes[1].id, question: "What does the spread operator (...) do?", options: ["Deletes array elements", "Multiplies numbers", "Expands iterable elements", "Creates a new function"], correctAnswer: 2, points: 15, timeLimit: 45, orderIndex: 4 },
  ]);

  // Quiz 3 questions
  await db.insert(schema.quizQuestions).values([
    { quizId: insertedQuizzes[2].id, question: "What does OHADA stand for?", options: ["Organisation for Harmonization of Business Law in Africa", "African Development Bank", "West African Economic Community", "African Union Trade Agreement"], correctAnswer: 0, points: 20, timeLimit: 40, orderIndex: 0, explanation: "OHADA is key for doing business in Cameroon and 16 other African countries." },
    { quizId: insertedQuizzes[2].id, question: "What is the main stock exchange in Central Africa?", options: ["Lagos Stock Exchange", "DSX (Douala Stock Exchange)", "BRVM", "JSE"], correctAnswer: 1, points: 20, timeLimit: 40, orderIndex: 1, explanation: "The Douala Stock Exchange (DSX) is Cameroon's main capital market." },
    { quizId: insertedQuizzes[2].id, question: "What percentage of African businesses are SMEs?", options: ["50%", "70%", "80%", "Over 90%"], correctAnswer: 3, points: 20, timeLimit: 40, orderIndex: 2, explanation: "Over 90% of businesses in Africa are SMEs — the backbone of African economies." },
  ]);

  console.log("   ✅ Quizzes and questions created");
  console.log("\n✅ Database seeded successfully!");
  console.log("\n📋 Demo login credentials:");
  console.log("   Email: jp@example.com");
  console.log("   Password: demo123");
  console.log("\n   (All 5 demo users use password: demo123)");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
