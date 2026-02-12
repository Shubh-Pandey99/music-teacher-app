
# MusicPro Manager 🎵

A robust, full-stack application for music teachers to manage their students, tracking attendance, and handling fee payments.

## Features
- **Student Management**: Add, update, and manage student profiles.
- **Attendance Tracking**: Specialized tracking for monthly quotas (e.g., 12 classes/month) with support for extra classes.
- **Fee Management**: Track payments in INR (₹) with status indicators (Paid, Partial, Pending).
- **Dashboard**: Real-time stats on attendance, pending fees, and upcoming schedules.
- **Reports**: Generate monthly reports and export to CSV.
- **Secure Auth**: Authentication via NextAuth.js with bcrypt password hashing and rate limiting.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS 4 & Shadcn UI
- **Auth**: NextAuth.js 5
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```
4. Initialize the database:
   ```bash
   npx prisma db push
   ```
5. Seed the database (optional):
   ```bash
   npm run prisma:seed
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

### Scripts
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint checks.
- `npx prisma studio`: Open database GUI.

## Deployment Notes
The app is designed to be deployed on platforms like Vercel or Railway.
- Ensure `DATABASE_URL` and `AUTH_SECRET` are set in production.
- For SQLite persistence, use a persistent volume (e.g., on Railway) or migrate to PostgreSQL.

## License
MIT
