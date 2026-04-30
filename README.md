# Pixel-Art Portfolio

A performance-optimized MERN stack personal portfolio with pixel-art aesthetics.

**Core constraint:** Visitors view the portfolio for 50–60 seconds. Every millisecond counts.

## Architecture

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS — prerendered to static HTML at build time
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Font**: Press Start 2P (Latin subset, self-hosted, ~12KB woff2)
- **SSG**: Custom prerender script bakes all content into static HTML at build time

## Quick Start

```bash
# Install all dependencies
npm install

# Start dev (client + server concurrently)
npm run dev

# Build static site
npm run build

# Seed database
npm run seed
```

## Environment Variables

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:3001
```

### Server (`server/.env`)
```
PORT=3001
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/pixel-portfolio
JWT_SECRET=change-me-to-a-random-string
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=ayushkawane05@gmail.com
ADMIN_PASSWORD=Update_PASSWORD
REBUILD_WEBHOOK_URL=
```

> **Note:** If MongoDB is not available locally, the server automatically falls back to an in-memory MongoDB instance (via `mongodb-memory-server`). Data will not persist across restarts in this mode.

---

## API Endpoints

### Public (cached at edge)

```bash
# Health check
curl http://localhost:3001/api/health

# Get ALL public content (batched — profile + education + experience + achievements + projects)
curl http://localhost:3001/api/content

# Get public visit count
curl http://localhost:3001/api/visits/count

# Track a visit (fires from sendBeacon on the client)
curl -X POST http://localhost:3001/api/track \
  -H "Content-Type: application/json" \
  -d '{"path":"/","referrer":"https://google.com"}'
```

### Auth

```bash
# Login (sets httpOnly JWT cookie)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ayushkawane05@gmail.com","password":"Update_PASSWORD"}' \
  -c cookies.txt

# Check current auth
curl http://localhost:3001/api/auth/me -b cookies.txt

# Logout (clears cookie)
curl -X POST http://localhost:3001/api/auth/logout -b cookies.txt
```

### Admin (JWT required — use `-b cookies.txt` from login)

```bash
# Update profile
curl -X PUT http://localhost:3001/api/admin/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Ayush Kawane","tagline":"Developer","bio":"Updated bio"}'

# ── Education CRUD ──
curl http://localhost:3001/api/admin/education -b cookies.txt

curl -X POST http://localhost:3001/api/admin/education \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"institution":"VIT Pune","degree":"B.Tech AI/DS","startYear":2022,"endYear":2026,"detail":"CGPA 8.51","orderIndex":0}'

curl -X PUT http://localhost:3001/api/admin/education/<ID> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"detail":"Updated detail"}'

curl -X DELETE http://localhost:3001/api/admin/education/<ID> -b cookies.txt

# ── Experience CRUD ──
curl -X POST http://localhost:3001/api/admin/experience \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"role":"Intern","company":"Darwinbox","startDate":"Jan 2026","endDate":"Present","bullets":["Built services"],"orderIndex":0}'

# ── Projects CRUD ──
curl -X POST http://localhost:3001/api/admin/projects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"AI Chat","stack":["Python","LLMs"],"outcome":"Finalist","orderIndex":0}'

# ── Achievements CRUD ──
curl -X POST http://localhost:3001/api/admin/achievements \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"type":"paper","title":"IoT Research","description":"Smart city system","year":2025,"orderIndex":0}'

# ── Image upload ──
curl -X POST http://localhost:3001/api/admin/upload \
  -b cookies.txt \
  -F "image=@/path/to/image.jpg" \
  -F "folder=portfolio"

# ── Analytics ──
curl http://localhost:3001/api/admin/visits?limit=50&page=1 -b cookies.txt
curl http://localhost:3001/api/admin/visits/aggregate?days=30 -b cookies.txt

# ── Rebuild (triggers Vercel/Cloudflare Pages webhook) ──
curl -X POST http://localhost:3001/api/admin/rebuild -b cookies.txt

# ── Change password ──
curl -X PUT http://localhost:3001/api/admin/password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"currentPassword":"Update_PASSWORD","newPassword":"NewSecure123!"}'
```

---

## Lighthouse Results

| Metric | Target | Phase 1 Result |
|--------|--------|----------------|
| Performance Score | ≥ 95 | **100** |
| FCP | < 800ms | 1.3s* |
| LCP | < 1.2s | 1.5s* |
| TBT | < 50ms | **0 ms** |
| CLS | 0 | **0** |

*FCP/LCP measured on localhost — will be faster on CDN edge.*

## Build Output

```
HTML:  4.71 KB (1.80 KB gzipped)  ← target: < 30KB gzipped ✅
CSS:   9.84 KB (2.91 KB gzipped)
JS:    4.40 KB (2.02 KB gzipped)  ← main bundle (React hydration)
Font:  12.5 KB                    ← Press Start 2P Latin subset

Total above-fold: ~17.2 KB       ← target: < 80KB ✅
```

---

*Phase 3+ documentation will be added as development continues.*
