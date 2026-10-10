import { Competition, Job, Quiz, LeaderboardEntry, User } from "@/types";

export const CAMEROON_REGIONS = [
  "Centre", "Littoral", "West", "Northwest", "Southwest",
  "North", "Adamawa", "East", "South", "Far North"
];

export const CAMEROON_CITIES = [
  "Yaoundé", "Douala", "Bafoussam", "Bamenda", "Garoua",
  "Maroua", "Ngaoundéré", "Bertoua", "Ebolowa", "Buea", "Limbe", "Kumba"
];

export const mockUsers: User[] = [
  {
    id: "1", name: "Jean-Pierre Mbarga", email: "jp@example.com",
    role: "job_seeker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    city: "Yaoundé", region: "Centre", bio: "Computer Science student at University of Yaoundé I",
    skills: ["Python", "JavaScript", "Machine Learning"], xp: 4850,
    badges: [{ id: "b1", name: "Quiz Master", icon: "🏆", color: "gold", earnedAt: "2024-01-15" }],
    createdAt: "2023-09-01"
  },
  {
    id: "2", name: "Aisha Fouda", email: "aisha@example.com",
    role: "employer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    city: "Douala", region: "Littoral", bio: "Software Engineer with 3 years experience",
    skills: ["React", "Node.js", "PostgreSQL"], xp: 6200,
    badges: [
      { id: "b2", name: "Hackathon Winner", icon: "🥇", color: "purple", earnedAt: "2024-02-10" },
      { id: "b3", name: "Top Coder", icon: "💻", color: "blue", earnedAt: "2024-03-05" }
    ],
    createdAt: "2022-06-15"
  },
  {
    id: "3", name: "Emmanuel Tabi", email: "etabi@example.com",
    role: "job_seeker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel",
    city: "Buea", region: "Southwest", bio: "Engineering student passionate about robotics",
    skills: ["C++", "Arduino", "CAD"], xp: 3100,
    badges: [{ id: "b4", name: "Rising Star", icon: "⭐", color: "orange", earnedAt: "2024-01-20" }],
    createdAt: "2023-10-12"
  },
  {
    id: "4", name: "Marie-Claire Nkeng", email: "marie@example.com",
    role: "employer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    city: "Bafoussam", region: "West", bio: "UX Designer and digital artist",
    skills: ["Figma", "Adobe XD", "Photoshop"], xp: 5500,
    badges: [{ id: "b5", name: "Design Guru", icon: "🎨", color: "pink", earnedAt: "2024-02-28" }],
    createdAt: "2022-11-20"
  },
  {
    id: "5", name: "Paul Ateba", email: "pateba@example.com",
    role: "job_seeker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul",
    city: "Yaoundé", region: "Centre", bio: "Finance student at ESSEC Douala",
    skills: ["Excel", "Financial Modeling", "Python"], xp: 2800,
    badges: [],
    createdAt: "2024-01-05"
  },
];

export const mockJobs: Job[] = [
  {
    id: "j1", title: "Junior Software Developer",
    company: "AfricaTech Solutions", companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=ATS",
    description: "We are looking for a motivated Junior Developer to join our growing team in Douala. You will work on web applications serving thousands of Cameroonian users.",
    requirements: ["JavaScript or Python basics", "Git knowledge", "Problem-solving mindset", "Diploma in IT or related field"],
    category: "technology", type: "full-time",
    city: "Douala", region: "Littoral",
    salary: { min: 150000, max: 250000, currency: "XAF", period: "month" },
    deadline: "2024-09-30", postedAt: "2024-08-01",
    applicants: 47, isRemote: false, tags: ["JavaScript", "React", "Junior"]
  },
  {
    id: "j2", title: "Delivery Driver (Motorbike) – Daily Pay",
    company: "QuickDeliver Cameroun",
    description: "We need reliable motorbike riders to deliver packages in Yaoundé. Work by the day, get paid same day. You choose your days.",
    requirements: ["Valid motorbike license", "Own motorbike (or we can discuss)", "Know Yaoundé roads well", "Phone with WhatsApp"],
    category: "transport", type: "one-day",
    city: "Yaoundé", region: "Centre",
    salary: { min: 5000, max: 10000, currency: "XAF", period: "day" },
    deadline: "2024-12-31", postedAt: "2024-08-05",
    applicants: 23, isRemote: false, tags: ["Delivery", "Motorbike", "Daily Pay", "Flexible"]
  },
  {
    id: "j3", title: "Social Media Manager",
    company: "Beautée Cameroun", companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=BC",
    description: "Manage our Instagram, Facebook and TikTok pages. Create content, respond to customers, run campaigns. Can be done remotely.",
    requirements: ["Experience with social media platforms", "Basic graphic design (Canva ok)", "Good writing in French and/or English", "Creative mindset"],
    category: "marketing", type: "part-time",
    city: "Douala", region: "Littoral",
    salary: { min: 50000, max: 80000, currency: "XAF", period: "month" },
    deadline: "2024-09-15", postedAt: "2024-08-03",
    applicants: 62, isRemote: true, tags: ["Social Media", "Marketing", "Remote", "Creative"]
  },
  {
    id: "j4", title: "Cargo Transport – Douala to Yaoundé",
    company: "Trans-Cam Logistics",
    description: "Need experienced truck driver to move goods from Douala port to Yaoundé warehouse. One trip, paid on completion. Vehicle provided.",
    requirements: ["Valid heavy truck license (permis C)", "At least 2 years truck driving", "Clean record", "Available this weekend"],
    category: "transport", type: "one-day",
    city: "Douala", region: "Littoral",
    salary: { min: 25000, max: 35000, currency: "XAF", period: "project" },
    deadline: "2024-08-20", postedAt: "2024-08-10",
    applicants: 8, isRemote: false, tags: ["Transport", "Truck", "One-time", "Logistics"]
  },
  {
    id: "j5", title: "Accountant",
    company: "MTN Cameroon", companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=MTN",
    description: "MTN Cameroon is recruiting a qualified accountant to join the finance team in Yaoundé. You will handle financial reporting, budgeting, and compliance.",
    requirements: ["Degree in Accounting or Finance", "CPA or equivalent preferred", "3+ years experience", "Strong Excel and ERP skills"],
    category: "finance", type: "full-time",
    city: "Yaoundé", region: "Centre",
    salary: { min: 400000, max: 650000, currency: "XAF", period: "month" },
    deadline: "2024-09-10", postedAt: "2024-07-28",
    applicants: 134, isRemote: false, tags: ["Finance", "Accounting", "Senior", "MTN"]
  },
  {
    id: "j6", title: "Farm Workers – Harvest Season",
    company: "Agri-Ouest SARL",
    description: "We need 20 farm workers for tomato and pepper harvest in Bafoussam area. Accommodation provided. 2-week contract with daily pay.",
    requirements: ["Physically fit", "Willing to work outdoors", "Experience in farming is a plus but not required"],
    category: "agriculture", type: "contract",
    city: "Bafoussam", region: "West",
    salary: { min: 3500, max: 5000, currency: "XAF", period: "day" },
    deadline: "2024-09-01", postedAt: "2024-08-08",
    applicants: 31, isRemote: false, tags: ["Agriculture", "Farm", "Seasonal", "Accommodation"]
  },
  {
    id: "j7", title: "English Teacher (Primary School)",
    company: "Bilingual School of Bamenda",
    description: "Seeking a passionate English teacher for primary school classes. Full-time position for the 2024-2025 academic year.",
    requirements: ["Bachelor's degree in Education or English", "DIPES I or II", "Good classroom management", "Patience and creativity"],
    category: "education", type: "full-time",
    city: "Bamenda", region: "Northwest",
    salary: { min: 80000, max: 120000, currency: "XAF", period: "month" },
    deadline: "2024-09-05", postedAt: "2024-08-01",
    applicants: 19, isRemote: false, tags: ["Teaching", "English", "Education", "Bamenda"]
  },
  {
    id: "j8", title: "Graphic Designer – Logo & Branding",
    company: "Creative Hub Cameroun",
    description: "One-time project to design a logo and brand identity for a new restaurant in Yaoundé. Remote work, 5-day project.",
    requirements: ["Adobe Illustrator or Photoshop", "Portfolio required", "Fast turnaround", "Good communication"],
    category: "creative", type: "gig",
    city: "Yaoundé", region: "Centre",
    salary: { min: 30000, max: 60000, currency: "XAF", period: "project" },
    deadline: "2024-08-25", postedAt: "2024-08-09",
    applicants: 14, isRemote: true, tags: ["Design", "Branding", "Logo", "Remote", "Freelance"]
  },
];

export const mockCompetitions: Competition[] = [
  {
    id: "c1", title: "CamTech Hackathon 2024",
    organizer: "Tech Hub Cameroun", organizerLogo: "https://api.dicebear.com/7.x/initials/svg?seed=THC",
    description: "Build innovative tech solutions for Cameroon's pressing challenges in agriculture, health, and education. 48-hour hackathon with mentors from leading tech companies.",
    type: "hackathon", status: "active",
    startDate: "2024-08-15", endDate: "2024-08-17",
    registrationDeadline: "2024-08-13",
    prizes: [
      { rank: 1, label: "1st Place", amount: 500000, currency: "XAF", extras: ["Incubation support", "Tech equipment"] },
      { rank: 2, label: "2nd Place", amount: 250000, currency: "XAF", extras: ["Mentorship program"] },
      { rank: 3, label: "3rd Place", amount: 100000, currency: "XAF" }
    ],
    participants: 234, maxTeamSize: 4, minTeamSize: 2,
    eligibility: "Open to all students and young professionals under 35",
    tags: ["Tech", "Innovation", "Agriculture", "Health"],
    city: "Douala", region: "Littoral", isOnline: false,
  },
  {
    id: "c2", title: "Business Case Competition – Littoral",
    organizer: "ESSEC Business School",
    description: "Analyze real business challenges from top Cameroonian companies and present strategic solutions. Solo or team participation.",
    type: "case-study", status: "upcoming",
    startDate: "2024-09-10", endDate: "2024-09-12",
    registrationDeadline: "2024-09-05",
    prizes: [
      { rank: 1, label: "Winner", amount: 300000, currency: "XAF", extras: ["Internship at Orange Cameroun"] },
      { rank: 2, label: "Runner-up", amount: 150000, currency: "XAF" }
    ],
    participants: 89, maxTeamSize: 3, minTeamSize: 1,
    eligibility: "Business and economics students only",
    tags: ["Business", "Strategy", "Finance"],
    city: "Douala", region: "Littoral", isOnline: false,
  },
  {
    id: "c3", title: "Code Challenge Cameroun – Online",
    organizer: "DevCameroun Community",
    description: "Monthly coding challenge for developers across Cameroon. Solve algorithmic problems and climb the national leaderboard. All levels welcome.",
    type: "coding", status: "active",
    startDate: "2024-08-01", endDate: "2024-08-31",
    registrationDeadline: "2024-08-20",
    prizes: [
      { rank: 1, label: "Top Coder", amount: 100000, currency: "XAF" },
      { rank: 2, label: "2nd Place", amount: 50000, currency: "XAF" },
      { rank: 3, label: "3rd Place", amount: 25000, currency: "XAF" }
    ],
    participants: 512, maxTeamSize: 1, minTeamSize: 1,
    eligibility: "Open to all Cameroonians",
    tags: ["Coding", "Algorithms", "Online"],
    isOnline: true,
  },
  {
    id: "c4", title: "Agri-Innovation Challenge – West Region",
    organizer: "MINADER Cameroun",
    description: "Propose innovative solutions to improve farming productivity and sustainability in the West Region. Both tech and non-tech solutions welcome.",
    type: "business", status: "upcoming",
    startDate: "2024-09-20", endDate: "2024-09-22",
    registrationDeadline: "2024-09-15",
    prizes: [
      { rank: 1, label: "Gold", amount: 750000, currency: "XAF", extras: ["Government partnership", "Land grant"] },
      { rank: 2, label: "Silver", amount: 300000, currency: "XAF" }
    ],
    participants: 67, maxTeamSize: 5, minTeamSize: 1,
    eligibility: "Open to farmers, students, and entrepreneurs",
    tags: ["Agriculture", "Innovation", "Sustainability"],
    city: "Bafoussam", region: "West", isOnline: false,
  },
  {
    id: "c5", title: "Creative Design Showdown",
    organizer: "Orange Cameroun",
    description: "Design the next Orange Cameroun marketing campaign. Show your creativity in graphic design, motion design, or photography.",
    type: "creative", status: "ended",
    startDate: "2024-07-01", endDate: "2024-07-31",
    registrationDeadline: "2024-07-10",
    prizes: [
      { rank: 1, label: "Winner", amount: 400000, currency: "XAF", extras: ["Campaign goes live!", "Internship offer"] },
      { rank: 2, label: "Runner-up", amount: 150000, currency: "XAF" }
    ],
    participants: 178, maxTeamSize: 2, minTeamSize: 1,
    eligibility: "Open to all creative professionals and students",
    tags: ["Design", "Creative", "Marketing", "Orange"],
    isOnline: true,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "q1", title: "Cameroon General Knowledge", companyName: "CamOpport",
    description: "Test your knowledge about Cameroon's history, culture, geography and politics.",
    category: "General Knowledge", difficulty: "beginner",
    totalPoints: 100, timeLimit: 600, participants: 1240,
    tags: ["Cameroon", "History", "Culture"],
    questions: [
      {
        id: "q1_1", question: "What is the capital city of Cameroon?",
        options: ["Douala", "Yaoundé", "Bafoussam", "Bamenda"],
        correctAnswer: 1, points: 10, timeLimit: 30,
        explanation: "Yaoundé is the capital and political center of Cameroon, while Douala is the economic capital."
      },
      {
        id: "q1_2", question: "In what year did Cameroon gain independence?",
        options: ["1956", "1958", "1960", "1961"],
        correctAnswer: 2, points: 10, timeLimit: 30,
        explanation: "French Cameroon gained independence on January 1, 1960, and Southern Cameroons joined in 1961."
      },
      {
        id: "q1_3", question: "How many regions does Cameroon have?",
        options: ["8", "9", "10", "12"],
        correctAnswer: 2, points: 10, timeLimit: 30,
        explanation: "Cameroon has 10 regions, each with its own regional governor."
      },
      {
        id: "q1_4", question: "What are the two official languages of Cameroon?",
        options: ["French and German", "French and English", "English and Fulfulde", "French and Ewondo"],
        correctAnswer: 1, points: 10, timeLimit: 30,
        explanation: "Cameroon is officially bilingual with French and English as the two official languages."
      },
      {
        id: "q1_5", question: "What is the currency of Cameroon?",
        options: ["CFA Franc", "Cameroon Dollar", "XAF Pound", "African Franc"],
        correctAnswer: 0, points: 10, timeLimit: 30,
        explanation: "Cameroon uses the Central African CFA Franc (XAF), shared with other CEMAC countries."
      },
    ]
  },
  {
    id: "q2", title: "JavaScript Fundamentals", companyName: "MTN Cameroon",
    description: "Test your knowledge of core JavaScript concepts used in modern web development.",
    category: "Technology", difficulty: "intermediate",
    totalPoints: 150, timeLimit: 900, participants: 456,
    tags: ["JavaScript", "Programming", "Web Dev"],
    questions: [
      {
        id: "q2_1", question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
        options: ["var", "let", "const", "def"],
        correctAnswer: 1, points: 15, timeLimit: 45,
        explanation: "'let' declares block-scoped variables, unlike 'var' which is function-scoped."
      },
      {
        id: "q2_2", question: "What does 'typeof null' return in JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correctAnswer: 2, points: 15, timeLimit: 45,
        explanation: "This is a known bug in JavaScript. typeof null returns 'object' for historical reasons."
      },
      {
        id: "q2_3", question: "Which method removes the last element from an array?",
        options: ["shift()", "pop()", "splice()", "remove()"],
        correctAnswer: 1, points: 15, timeLimit: 45,
        explanation: "pop() removes the last element and returns it. shift() removes the first element."
      },
      {
        id: "q2_4", question: "What is a Promise in JavaScript?",
        options: [
          "A synchronous function",
          "An object representing an eventual completion or failure",
          "A type of loop",
          "A way to declare constants"
        ],
        correctAnswer: 1, points: 15, timeLimit: 45,
        explanation: "A Promise represents the eventual completion (or failure) of an async operation."
      },
      {
        id: "q2_5", question: "What does the spread operator (...) do?",
        options: [
          "Deletes array elements",
          "Multiplies numbers",
          "Expands iterable elements",
          "Creates a new function"
        ],
        correctAnswer: 2, points: 15, timeLimit: 45,
        explanation: "The spread operator expands an iterable (like an array) into individual elements."
      },
    ]
  },
  {
    id: "q3", title: "Business & Entrepreneurship in Africa", companyName: "Afriland First Bank",
    description: "Test your understanding of business concepts, African markets, and entrepreneurship.",
    category: "Business", difficulty: "intermediate",
    totalPoints: 120, timeLimit: 720, participants: 328,
    tags: ["Business", "Africa", "Entrepreneurship"],
    questions: [
      {
        id: "q3_1", question: "What does OHADA stand for?",
        options: [
          "Organisation for Harmonization of Business Law in Africa",
          "African Development Bank",
          "West African Economic Community",
          "African Union Trade Agreement"
        ],
        correctAnswer: 0, points: 20, timeLimit: 40,
        explanation: "OHADA is the Organisation for the Harmonization of Business Law in Africa, key for doing business in Cameroon."
      },
      {
        id: "q3_2", question: "What is the main stock exchange in Central Africa called?",
        options: ["Lagos Stock Exchange", "DSX (Douala Stock Exchange)", "BRVM", "JSE"],
        correctAnswer: 1, points: 20, timeLimit: 40,
        explanation: "The Douala Stock Exchange (DSX) is Cameroon's main capital market."
      },
      {
        id: "q3_3", question: "What percentage of African businesses are classified as SMEs (Small and Medium Enterprises)?",
        options: ["50%", "70%", "80%", "Over 90%"],
        correctAnswer: 3, points: 20, timeLimit: 40,
        explanation: "Over 90% of businesses in Africa are SMEs, making them the backbone of African economies."
      },
    ]
  },
];

export const mockLeaderboard: LeaderboardEntry[] = mockUsers
  .map((user, index) => ({
    rank: index + 1,
    user,
    xp: user.xp,
    competitions: Math.floor(Math.random() * 10) + 1,
    quizzes: Math.floor(Math.random() * 20) + 5,
    badges: user.badges.length,
  }))
  .sort((a, b) => b.xp - a.xp)
  .map((entry, index) => ({ ...entry, rank: index + 1 }));
