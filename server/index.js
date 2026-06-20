/**
 * EastGold admin API (MongoDB / Express / Mongoose, MVC).
 *
 * Public endpoints:
 *   GET  /api/gold-rate            → current gold rate
 *   POST /api/enquiries            → store a website enquiry
 *   POST /api/contact              → store a contact request
 *
 * Admin endpoints (Bearer JWT):
 *   POST   /api/admin/login        → { token }
 *   GET    /api/admin/me           → admin profile
 *   PATCH  /api/admin/me           → update profile / password
 *   GET    /api/enquiries          → list (?search=&status=)
 *   GET    /api/enquiries/stats    → dashboard counts
 *   PATCH  /api/enquiries/:id      → update status
 *   DELETE /api/enquiries/:id      → delete
 *   (same surface under /api/contact)
 *   GET    /api/gold-rate/history  → rate history
 *   PUT    /api/gold-rate          → record a new rate
 */
import express from 'express'
import cors from 'cors'
import { pathToFileURL } from 'node:url'
import { CORS_ORIGINS, PORT } from './config.js'
import { connectDB } from './db.js'
import { seed } from './seed.js'
import authRoutes from './routes/authRoutes.js'
import enquiryRoutes from './routes/enquiryRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import goldRateRoutes from './routes/goldRateRoutes.js'
import { errorHandler, notFound } from './middleware/error-handler.js'

const app = express()
app.use(cors({ origin: CORS_ORIGINS }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/admin', authRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/gold-rate', goldRateRoutes)

app.use(notFound)
app.use(errorHandler)

export async function start() {
  await connectDB()
  await seed()
  app.listen(PORT, () => {
    console.log(`EastGold API running on http://localhost:${PORT}`)
  })
}

export { app }

// Only auto-start when run directly (`node index.js`), not when imported.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((err) => {
    console.error('Failed to start server:', err)
    process.exit(1)
  })
}
