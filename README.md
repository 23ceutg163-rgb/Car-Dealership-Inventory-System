# 🚗 AutoVault — Car Dealership Inventory System

> A full-stack Car Dealership Inventory Management System built with **Node.js + Express + MongoDB** backend and a **React + Vite** frontend.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [My AI Usage](#-my-ai-usage)

---

## 🏢 Project Overview

**AutoVault** is a modern SaaS-style admin dashboard for car dealerships. Staff and administrators can track inventory in real time, record vehicle purchases, restock low-stock vehicles, and manage the full CRUD lifecycle of vehicles.

The system uses **role-based access control (RBAC)** — regular staff can browse and purchase, while **admin** users have full control including delete and restock operations.

---

## ✨ Features

| Area | Highlights |
|------|-----------|
| 🔐 **Auth** | JWT login/register, auto-logout on 401, Staff & Admin roles |
| 📊 **Dashboard** | KPI cards (models, units, value, out-of-stock), category breakdown, low-stock banner |
| 🚗 **Vehicles** | Paginated searchable list, add/edit/delete, vehicle detail page, admin-only delete dialog |
| 📦 **Inventory** | Purchase (−1 unit), Restock (+N units, admin only), before/after stock preview |
| 👤 **Profile** | User info, live inventory stats, session & sign-out |
| 🛡️ **Polish** | Error Boundary, 404 page, skeleton loaders, page transitions, dynamic breadcrumb, responsive sidebar |

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 19 (JSX) | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling |
| TanStack Query v5 | Server state & caching |
| Axios | HTTP client with JWT interceptor |
| React Router v7 | Client-side routing |
| React Hook Form + Zod | Forms & validation |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Auth & password hashing |
| Jest + Supertest | TDD test suite |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+, npm, MongoDB Atlas URI

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret_key
```

```bash
node server.js        # API runs at http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # App runs at http://localhost:5173
```

### Admin Access

Register via `/register`, then open MongoDB Atlas/Compass and set `isAdmin: true` on your user document.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/vehicles` | Protected | Get all vehicles |
| `GET` | `/api/vehicles/:id` | Protected | Get a single vehicle |
| `GET` | `/api/vehicles/search` | Protected | Search by make/model/category/price |
| `POST` | `/api/vehicles` | Protected | Create a vehicle |
| `PUT` | `/api/vehicles/:id` | Protected | Update a vehicle |
| `DELETE` | `/api/vehicles/:id` | **Admin** | Delete a vehicle |
| `POST` | `/api/vehicles/:id/purchase` | Protected | Buy 1 unit (stock −1) |
| `POST` | `/api/vehicles/:id/restock` | **Admin** | Add units to stock |

---

## 🤖 My AI Usage

### Tool Used

**Google Gemini** — accessed via the **Antigravity AI coding assistant** (Google DeepMind's agentic coding environment).

---

### How I Used AI

The project was built in structured phases. I acted as the architect and decision-maker; the AI generated code under my direction.

#### Phase 0 — Backend (Test-Driven Development)
The entire REST API was built using **strict RED → GREEN → REFACTOR TDD**. For each of the 10 endpoints, I gave the AI one instruction at a time:

- **RED** — AI wrote only failing Jest + Supertest tests. No implementation was touched.
- **GREEN** — AI wrote only the minimum code to make those tests pass. No extras added.
- **REFACTOR** — AI improved code quality and consistency without changing any test.

Endpoints built this way: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/search`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id` (admin), `POST /api/vehicles/:id/purchase`, `POST /api/vehicles/:id/restock` (admin), `GET /api/vehicles/:id`.

Result: **36 passing tests** across 2 suites, covering happy paths, edge cases (out-of-stock, invalid input), and role-based access (401, 403, 404) for every endpoint.

#### Phase 1 — Frontend Foundation & Auth
I described the tech stack (React JSX — no TypeScript) and API structure. The AI set up Vite + Tailwind CSS v4 with a full CSS design-token system, built `AuthContext` with localStorage persistence and an Axios JWT interceptor, and created Login/Register pages with React Hook Form + Zod validation.

#### Phase 2 — Dashboard
I asked for a real-time dashboard. The AI built 4 KPI cards, a category breakdown with progress bars, a recent-vehicles table, and a low-stock banner — all computed client-side from a single `GET /api/vehicles` call.

#### Phase 3 — Vehicles CRUD
I requested full CRUD. The AI built a searchable/sortable/paginated list, a shared Zod-validated `VehicleForm` for Add and Edit, a Vehicle Detail page, and an admin-only Delete dialog.

#### Phase 4 — Inventory
I asked for Purchase and Restock actions. The AI built a card-grid layout (avoiding UI repetition with the Vehicles table), a `PurchaseDialog` with before/after stock preview, a `RestockDialog` with live quantity calculation, and an admin Restock page sorted by urgency.

#### Phase 5 — Profile
I asked for an informational profile page (no update endpoint by my constraint). The AI built a gradient hero with user initials, read-only account info, live inventory stats, and a session/sign-out card.

#### Phase 6 — Polish
I requested production-level polish. The AI added a global Error Boundary, animated 404 page, client-side pagination with ellipsis, page fade transitions, a dynamic breadcrumb reading from TanStack Query cache, and ScrollToTop on navigation.

#### Sample Prompts I Used

> *"Build a modern SaaS Admin Dashboard — strictly no TypeScript, only React JSX."*

> *"We are following strict TDD. Current Feature: POST /api/vehicles. Current Phase: RED."*

> *"Do not commit by yourself — write the commit command and give it to me."*

> *"Change price to INR not $."*

---

### My Reflection on How AI Impacted My Workflow

**What worked well:**

- **Speed** — The backend (36 tests, 10 endpoints) and frontend (~60 files) were both completed far faster than solo development would allow.
- **Discipline** — The AI respected every constraint I set: no TypeScript, no skipping TDD phases, no auto-commits, no implementing features before their tests existed.
- **Consistency** — The AI maintained a uniform design system and coding style across all files without drift.
- **Smart suggestions** — It proposed reading vehicle names from TanStack Query's cache for breadcrumbs instead of making an extra API call — a small but elegant optimisation I hadn't thought of.

**What I had to guide:**

- I had to explicitly enforce the **"no TypeScript"** rule — the AI defaults to TypeScript.
- I set the **"no auto-commits"** rule after Phase 2 when the AI committed automatically.
- I had to provide the **API structure upfront** so the AI used the correct endpoints.

**Overall impact:**

AI transformed this from a multi-week project into a single-session build. My role shifted from *writing every line* to *making architectural decisions, enforcing constraints, and reviewing outputs*. The most important skill in AI-assisted development is not prompting — it is **knowing what to ask for, in what order, and critically reviewing what you receive**.

---

## 📄 License

Submitted for educational purposes as part of a university course assignment.

---

*Built with React, Node.js, MongoDB, and AI assistance from Google Gemini (Antigravity)*