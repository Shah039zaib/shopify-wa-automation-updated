
# Architecture Notes

This system is designed for zero-budget prototype usage:
- Bot (Baileys) recommended to run locally to avoid ephemeral disks.
- Server: stateless API for leads, sessions, payments, admin.
- DB: Neon (Postgres) for persistence; sessions are encrypted before saving.
- Admin: React SPA (Vite).

Session persistence: server endpoints /api/session allow saving/retrieving encrypted session when ALLOW_REMOTE_SESSION=true (protected by ADMIN_SECRET in production).

OCR: default server-side using tesseract.js; option to run OCR locally in bot (faster).

Demo-store search: uses internal `demo_links` table populated with safe demo URLs (no agency mentions). Admin can add demo links.

