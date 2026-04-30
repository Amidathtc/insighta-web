# Insighta Labs+ Web Portal

A premium, dark-mode web portal for the Insighta Labs+ Profile Intelligence System, built with **Next.js 14** and **Vanilla CSS**.

## Features

- **GitHub OAuth login** with PKCE — no password required
- **HTTP-only cookies** — tokens are never accessible via JavaScript
- **Role-based UI** — admins see different capabilities than analysts
- **Profiles list** with filtering, sorting, and pagination
- **Natural language search** — try "young males from nigeria"
- **CSV export** — download filtered profiles
- **Profile detail view** with all data fields
- **Account page** with permissions matrix and logout

## Pages

| Page | Route |
|---|---|
| Login | `/` |
| Dashboard | `/dashboard` |
| Profiles | `/profiles` |
| Profile Detail | `/profiles/[id]` |
| Search | `/search` |
| Account | `/account` |

## Setup

```bash
git clone <repo-url>
cd insighta-web
npm install
cp .env.example .env.local
# Fill in BACKEND_URL
npm run dev
```

The portal runs on **port 3001** by default.

## Environment Variables

| Variable | Description |
|---|---|
| `BACKEND_URL` | Backend API URL (server-side requests) |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL (client-side, for CSV download) |

## Authentication Security

- Tokens stored **only** in HTTP-only cookies (`Secure`, `SameSite=Strict`)
- Not accessible from JavaScript — protected against XSS
- PKCE parameters (state + verifier) stored in short-lived HTTP-only cookies during the OAuth round-trip
- Middleware redirects unauthenticated users from all protected routes
- Server Components fetch data server-side — credentials never exposed to the browser

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (dark mode, glass effects) |
| Font | Inter + JetBrains Mono |
| Auth | GitHub OAuth + PKCE via HTTP-only cookies |
