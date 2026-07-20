<!-- # El Mahdi Bellaziz — Portfolio (MERN + Aurora)

A premium, fully-responsive developer portfolio with an **aurora-glass** design system, dark/light theming, and a complete **admin CMS** — built on the MERN stack.

> DevSecOps Engineer & Full-Stack Developer · secure by design, automated by default.

## ✨ Features

- **Aurora-glass UI** — animated aurora background, glassmorphism, gradient text, magnetic buttons, custom cursor, scroll progress, scroll-reveal animations.
- **Dark / light theme** — system-aware, persisted, no flash on load.
- **Signature features**
  - ⌘K **command palette** (navigate, switch theme, copy email, jump to actions).
  - **AI "ask me" assistant** — a chat widget grounded in your real profile/projects/skills (Claude-powered, with a graceful keyword fallback when no API key is set).
  - **Live GitHub stats** — profile, top languages, repos and (with a token) a contribution heatmap, pulled through a cached backend proxy.
  - **Animated experience timeline** — a scroll-filled vertical journey.
- **Full admin dashboard** (`/admin`) — JWT-secured, with CRUD for Projects, Experience, Skills, a Profile editor, and a contact-message inbox.
- **Secure backend** — Helmet, CORS, rate limiting, httpOnly-cookie auth, bcrypt, input validation.
- **Resilient** — the public site renders complete fallback content even before the database is connected.

## 🧱 Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, TanStack Query, cmdk, lucide-react |
| Backend  | Node, Express, Mongoose (MongoDB Atlas), JWT, bcrypt, Helmet, express-rate-limit |
| AI       | `@anthropic-ai/sdk` (Claude) |

## 📁 Structure

```
portfolio/
├── client/          # React + Vite + Tailwind
│   └── src/
│       ├── components/ (ui, layout, admin, CommandPalette, AIAssistant)
│       ├── sections/   (Hero, About, Skills, Projects, Experience, Github, Contact)
│       ├── pages/      (Home, NotFound, admin/*)
│       ├── context/    (Theme, AdminAuth)
│       ├── hooks/       and lib/
└── server/          # Express + MongoDB API
    └── src/
        ├── models/ controllers/ routes/ middleware/ config/ utils/
```

## 🚀 Getting started

### Prerequisites
- Node 18+ and npm
- A MongoDB Atlas connection string (optional in dev — see below)

### 1. Server

```bash
cd portfolio/server
npm install
# configure server/.env (see below)
npm run dev          # http://localhost:5000
```

On first boot the server **auto-seeds** an admin user + starter content. You can also re-seed manually: `npm run seed`.

### 2. Client

```bash
cd portfolio/client
npm install
npm run dev          # http://localhost:5173  (proxies /api -> :5000)
```

Open **http://localhost:5173**. Admin is at **http://localhost:5173/admin**.

## 🗄️ Database

Set `MONGODB_URI` in `server/.env` to your Atlas string. **URL-encode special characters in the password** (`@` → `%40`, `:` → `%3A`, `/` → `%2F`).

> **Dev fallback:** if Atlas can't be reached in development, the server automatically starts an **in-memory MongoDB** so the whole app (admin, CRUD, inbox) works locally. That data resets on restart — set a valid `MONGODB_URI` for persistence. This never runs in production (`NODE_ENV=production`).

## 🔐 Admin access

Seeded from `ADMIN_*` in `server/.env` (defaults: `admin@bellaziz.dev` / `ChangeMe!2026`).
**Change these**, then log in at `/admin`. You can update your password from the API (`PUT /api/auth/password`).

## ⚙️ Environment variables (`server/.env`)

| Var | Purpose |
|-----|---------|
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Allowed CORS origin (dev: `http://localhost:5173`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `ADMIN_NAME/EMAIL/PASSWORD` | Seeded admin credentials |
| `GITHUB_USERNAME` | Handle for the live GitHub section |
| `GITHUB_TOKEN` | *(optional)* raises GitHub rate limits + enables the contribution heatmap |
| `ANTHROPIC_API_KEY` | *(optional)* enables the live AI assistant |
| `ANTHROPIC_MODEL` | AI model (default `claude-haiku-4-5`; use `claude-opus-4-8` for max quality) |

The client reads `VITE_API_URL` (defaults to `/api`).

## 🏗️ Production build

```bash
cd portfolio/client && npm run build      # outputs client/dist
```

Serve `client/dist` behind any static host and run the API with `NODE_ENV=production npm start` (point `CLIENT_URL` at your domain, set `secure` cookies via HTTPS).

## 🛡️ Security notes

- Never commit `server/.env` (it's gitignored). Rotate any secret that has been shared.
- Auth uses an httpOnly cookie (XSS-safe) + bcrypt-hashed passwords; sensitive endpoints are rate-limited.
- Set a strong unique `JWT_SECRET` and admin password before deploying.

---

Built with 💜 using the MERN stack & Tailwind. -->
