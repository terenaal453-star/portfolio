// ============================================================
//  PERSONALIZATION FILE
//  Edit ONLY this file to update your entire portfolio
// ============================================================

export const profile = {
  // Personal Identity
  name:         "Alex Rivera",
  role:         "Software Developer",
  education:    "B.Tech Computer Science",
  university:   "VIT Bhopal University",
  location:     "India",

  // Card Details
  developerId:  "DEV-2026-001",
  cardSerial:   "VIT-CS-2026-AR-001",
  issueDate:    "2024-01",
  expiryDate:   "2026-12",

  // Assets
  profileImage: "/assets/profile.jpg",
  logo:         "/assets/logo.png",

  // Contact
  email:        "alex.rivera@email.com",
  github:       "https://github.com/alexrivera",
  linkedin:     "https://linkedin.com/in/alexrivera",
  portfolio:    "https://alexrivera.dev",

  // QR Code
  qrValue:      "https://alexrivera.dev",

} as const;

export type Profile = typeof profile;