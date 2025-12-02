
# Run locally (updated)

1. Copy .env.example to .env and fill DATABASE_URL, ENCRYPTION_KEY (32+ chars), APP_BASE_URL (if server reachable), ADMIN_SECRET.
2. Start server:
   cd server
   pnpm install
   pnpm start
3. Start bot (in another terminal):
   cd bot
   pnpm install
   pnpm start
   - Scan QR printed in terminal with your WhatsApp Business number.
4. Start admin:
   cd admin
   pnpm install
   pnpm run dev
   - Set VITE_API_BASE in admin/.env or in browser to http://localhost:3000

Notes:
- To enable remote session persistence set ALLOW_REMOTE_SESSION=true (use with caution).
- For OCR heavy work, prefer local bot OCR (bot will POST OCR result to server).
