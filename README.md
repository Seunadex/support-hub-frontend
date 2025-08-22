# Support Hub — Frontend

A React + Vite app for a customer support ticketing system.
Talks to the Rails/GraphQL backend with jwt auth, Pundit‑backed capability flags, and file uploads.

---

## Prerequisites

- Node 18+ (LTS)
- yarn
- Running backend (see Support Hub backend [README](https://github.com/Seunadex/support-hub-backend?tab=readme-ov-file#readme))

---

## Quick Start

**Clone & enter**

```bash
  git clone https://github.com/Seunadex/support-hub-frontend.git
  cd support-hub-frontend

  yarn install
```

**Set up environment variables**

Copy `.env.example` to `.env` and update values as needed:

```bash
  cp .env.example .env
```

**Start the development server**

```bash
  yarn dev
```

**Run tests**

```bash
  yarn test
```
