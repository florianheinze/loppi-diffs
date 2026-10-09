# Task Tracker

Small full-stack demo app: React client, Express server, shared types.

## Layout
- `packages/shared` – types and constants used by both sides
- `server` – Express API (`/api/tasks`)
- `client` – React + Vite UI

## API
| Method | Path | Notes |
|---|---|---|
| GET | `/api/tasks` | filters: `status`, `priority`, `tag`, `search` |
| POST/PATCH/DELETE | `/api/tasks[/:id]` | tasks have `priority` and `tags` |
| GET | `/api/stats` | counts by status/priority, overdue |

Errors are returned as `{ "error": { "code", "message" } }`.

## Scripts
- `npm test` – run all tests
- `npm run dev:server` / `npm run dev:client`
