// ============================================================
//  PERSONALIZATION FILE
//  Edit ONLY this file to update everything
// ============================================================

export const profile = {
  // ── Identity ──
  name:         "Alex Rivera",
  role:         "Software Developer",
  education:    "B.Tech Computer Science",
  university:   "VIT Bhopal University",
  location:     "India",

  // ── Card Details ──
  developerId:  "DEV-2026-001",
  cardSerial:   "VIT-CS-2026-AR-001",
  issueDate:    "2024-01",
  expiryDate:   "2026-12",

  // ── Assets ──
  profileImage: "/assets/profile.jpg",
  logo:         "/assets/logo.png",

  // ── Contact ──
  email:        "alex.rivera@email.com",
  github:       "https://github.com/alexrivera",
  linkedin:     "https://linkedin.com/in/alexrivera",
  portfolio:    "https://alexrivera.dev",
  qrValue:      "https://alexrivera.dev",

  // ── Projects ── (edit freely, just keep the structure)
  projects: [
    {
      name:        "Portfolio Website",
      description: "Interactive 3D developer portfolio with physics-based ID card and terminal.",
      year:        "2024",
      status:      "Live",
      link:        "https://alexrivera.dev",
      tech: [
        { name: "React",      percent: 90 },
        { name: "TypeScript", percent: 80 },
        { name: "CSS",        percent: 70 },
        { name: "Vite",       percent: 60 },
      ],
    },
    {
      name:        "AI Chat App",
      description: "Real-time AI chat application with streaming responses and auth.",
      year:        "2024",
      status:      "In Progress",
      link:        "https://github.com/alexrivera/ai-chat",
      tech: [
        { name: "Python",     percent: 85 },
        { name: "FastAPI",    percent: 75 },
        { name: "React",      percent: 70 },
        { name: "PostgreSQL", percent: 55 },
      ],
    },
    {
      name:        "Task Manager API",
      description: "RESTful API for task management with JWT auth and role-based access.",
      year:        "2023",
      status:      "Completed",
      link:        "https://github.com/alexrivera/task-api",
      tech: [
        { name: "Node.js",    percent: 88 },
        { name: "Express",    percent: 80 },
        { name: "MongoDB",    percent: 72 },
        { name: "Docker",     percent: 50 },
      ],
    },
  ],

  // ── Experience ── (edit freely)
  experience: [
    {
      role:     "Frontend Developer Intern",
      company:  "TechCorp Solutions",
      duration: "Jun 2024 – Aug 2024",
      points: [
        "Built responsive UI components with React and TypeScript",
        "Improved page load speed by 40% through code splitting",
        "Collaborated with design team using Figma",
      ],
    },
    {
      role:     "Open Source Contributor",
      company:  "Various Projects",
      duration: "2023 – Present",
      points: [
        "Contributed to 5+ open source repositories on GitHub",
        "Fixed critical bugs and improved documentation",
        "Reviewed and merged pull requests",
      ],
    },
  ],

  // ── Certificates ── (edit freely)
  certificates: [
    {
      name:   "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date:   "2024",
      id:     "AWS-CP-2024-001",
    },
    {
      name:   "React Developer Certification",
      issuer: "Meta",
      date:   "2023",
      id:     "META-RD-2023-042",
    },
    {
      name:   "Python for Data Science",
      issuer: "IBM",
      date:   "2023",
      id:     "IBM-PDS-2023-117",
    },
  ],

  // ── Achievements ── (edit freely)
  achievements: [
    {
      title:       "Hackathon Winner",
      description: "1st place at VIT Bhopal Hackathon 2024 — built AI proctoring system",
      date:        "2024",
      icon:        "🏆",
    },
    {
      title:       "Open Source Star",
      description: "500+ GitHub stars across personal projects",
      date:        "2024",
      icon:        "⭐",
    },
    {
      title:       "Top 5% Coder",
      description: "Ranked in top 5% on LeetCode with 300+ problems solved",
      date:        "2023",
      icon:        "🎯",
    },
    {
      title:       "Dean's List",
      description: "Academic excellence award — GPA 9.1/10",
      date:        "2023",
      icon:        "📚",
    },
  ],

} as const;

export type Profile = typeof profile;