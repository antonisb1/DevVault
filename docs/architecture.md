# DevVault Architecture

DevVault is a monorepo containing:

- `backend/` — FastAPI + SQLAlchemy + PostgreSQL + Alembic
- `frontend/` — React + Vite + TypeScript + Tailwind + Ant Design + React Query + Zustand

## Key decisions

- Access tokens are stored client-side and refresh tokens are stored as httpOnly cookies.
- Dashboard metrics are aggregated in the backend.
- Tags are modeled using explicit many-to-many tables for each entity.
- The frontend uses native `fetch` instead of Axios.
