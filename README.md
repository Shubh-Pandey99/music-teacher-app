# 🎓 TeacherPro — Attendance & Classroom Management

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)

**A SaaS-ready application for teachers to manage student attendance, track performance, and streamline classroom operations.**

[GitHub Repo](https://github.com/Shubh-Pandey99/music-teacher-app)

</div>

---

## ✨ Features

- 🗓️ **Attendance Management** — Mark and track daily student attendance with a clean calendar UI
- 👨‍🎓 **Student Profiles** — Individual student records with performance history, notes, and progress tracking
- 📊 **Analytics Dashboard** — Visual insights into attendance trends, performance metrics, and class-wide statistics
- 📋 **Session Notes** — Per-session notes and lesson progress for each student
- 🔐 **Secure Auth** — Teacher authentication and protected student data

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database ORM** | Prisma |
| **Styling** | Tailwind CSS |
| **Auth** | NextAuth.js |
| **Deployment** | Vercel |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Shubh-Pandey99/music-teacher-app.git
cd music-teacher-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL and NEXTAUTH_SECRET to .env.local

# Push DB schema
npx prisma generate && npx prisma db push

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📄 License

Open source — feel free to use and adapt.

---

<div align="center">

Made with ❤️ by [Shubh Pandey](https://github.com/Shubh-Pandey99) · [LinkedIn](https://linkedin.com/in/shubhpandey9)

</div>
