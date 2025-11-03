# ExpenseIQ Frontend

Next.js app for Expense Tracker.

## Setup

1. Clone repo: `git clone <repo-url> expense-tracker-frontend`
2. Install deps: `npm install`
3. Copy `.env.local.example` to `.env.local` and set API_BASE (e.g., http://localhost:4000/api).
4. Run: `npm run dev` (port 3000).

## Features

- Auth: Login/Register with JWT storage.
- Dashboard: Summary cards and navigations.
- Transactions: Table with search/sort/filter/paginate, add/edit/delete.
- Categories: Manage, auto-create on transaction.
- Reports: Date-range charts (Recharts).
- Uses React Query for caching/optimistic updates, Tailwind for UI.

## Pages

- / : Dashboard
- /login, /register
- /transactions, /transactions/new
- /categories
- /reports
- /profile

## Optimizations

- Lazy load charts: Dynamic import in reports.
- Guest mode: Not implemented (server-first), but localStorage fallback possible.

Sample: After backend setup, register/login at localhost:3000/register.
