/**
 * Server configuration. Values fall back to safe defaults so the API runs
 * out-of-the-box for local use, but every secret can be overridden via env.
 *
 * Create a `server/.env` file (gitignored) to set production values — see
 * `server/.env.example` for the full list.
 */
import 'dotenv/config'

export const PORT = Number(process.env.PORT) || 3000

// Change this in production via the JWT_SECRET environment variable.
export const JWT_SECRET = process.env.JWT_SECRET || 'eastgold-admin-secret-change-me'

export const TOKEN_TTL = process.env.TOKEN_TTL || '8h'

// MongoDB Atlas connection string. Defaults to a local instance so the app is
// runnable without Atlas during development; set MONGODB_URI for Atlas.
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eastgold'

// Allowed origins for CORS (the Vite dev/preview servers, by default).
export const CORS_ORIGINS = (
  process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173'
)
  .split(',')
  .map((o) => o.trim())

// Bootstrap admin account, seeded into `admin_users` on first run. The login
// flow authenticates against the database; these values seed that first user.
export const ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin@123',
}

// Initial gold rate seeded into `gold_rates` when the collection is empty.
export const DEFAULT_GOLD_RATE = {
  oneGramRate: 9500,
  eightGramRate: 76000,
  updatedBy: 'system',
}
