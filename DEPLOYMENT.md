# Deployment Guide: Music Teacher App

This guide outlines how to publish your application to the web. Since the app uses **Next.js**, **Prisma**, and **SQLite**, you need a hosting provider that supports persistent storage or a remote database.

## 🚀 Option 1: Railway (Easiest for SQLite)
Railway is the simplest way to host an app with a local SQLite database because it supports **Persistent Volumes**.

1.  **Push to GitHub:** Create a repository on GitHub and push your code.
2.  **Create a New Project:** Go to [Railway.app](https://railway.app/), login, and click **"New Project"**.
3.  **Connect GitHub:** Select your repository.
4.  **Add a Volume:**
    *   In your project settings, go to **"Variables"**.
    *   Add a **Volume** (e.g., 1GB) and mount it to `/app/prisma/data`.
    *   Update your `.env` in Railway: `DATABASE_URL="file:/app/prisma/data/dev.db"`.
5.  **Environment Variables:** Add the following to Railway:
    *   `AUTH_SECRET`: (Generate one using `openssl rand -base64 32`)
    *   `NEXTAUTH_URL`: Your Railway app URL.
6.  **Deploy:** Railway will automatically build and deploy.

---

## 🌩️ Option 2: Vercel + Turso (Best Performance)
Vercel is the best for Next.js, but it **does not support SQLite files**. You should migrate to **Turso** (LibSQL), which is a cloud-based SQLite.

1.  **Install Turso CLI:** `curl -sSfL https://get.turso.tech/install.sh | bash`
2.  **Create Database:** `turso db create music-app`
3.  **Get URL & Token:**
    *   URL: `turso db show music-app --url`
    *   Token: `turso db tokens create music-app`
4.  **Update Prisma:**
    *   Change `provider = "sqlite"` to `provider = "postgresql"` is **NOT** required for Turso, but you need to use the `@libsql/client`.
    *   Follow [Turso Prisma Guide](https://docs.turso.tech/tutorials/get-started-prisma) to sync.
5.  **Deploy to Vercel:**
    *   Push code to GitHub.
    *   Import project into [Vercel](https://vercel.com/).
    *   Add Env Vars: `DATABASE_URL`, `AUTH_SECRET`.

---

## 🛠️ Essential Deployment Steps

### 1. Generate Auth Secret
You **must** have a secure `AUTH_SECRET` for production login to work.
Run this command in your terminal:
```bash
openssl rand -base64 32
```
Copy the output and add it to your hosting provider's environment variables.

### 2. Update Database Schema
Before your app runs in production, the database needs to be initialized. Add this to your `package.json` build script or run it manually:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 3. Domains
Most providers give you a free `your-app.railway.app` or `your-app.vercel.app` domain. You can add a custom domain (e.g., `musicteacher.com`) in the settings of your chosen platform.

---

## Summary Checklist
- [ ] Code pushed to GitHub.
- [ ] Environment variables set (`DATABASE_URL`, `AUTH_SECRET`).
- [ ] Database migrated (`npx prisma migrate deploy`).
- [ ] Default teacher seeded (`npx prisma db seed`).
