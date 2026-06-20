/**
 * Idempotent seed: ensures the bootstrap admin user and an initial gold rate
 * exist. Safe to run repeatedly — it never overwrites existing data.
 *
 * Run standalone with `npm run seed`, or call `seed()` from the app on boot.
 */
import { ADMIN, DEFAULT_GOLD_RATE } from './config.js'
import { AdminUser } from './models/AdminUser.js'
import { GoldRate } from './models/GoldRate.js'

export async function seed() {
  // Bootstrap admin user.
  const existingAdmin = await AdminUser.findOne({ username: ADMIN.username })
  if (!existingAdmin) {
    const admin = new AdminUser({ username: ADMIN.username, name: 'Administrator' })
    await admin.setPassword(ADMIN.password)
    await admin.save()
    console.log(`✓ Seeded admin user "${ADMIN.username}"`)
  }

  // Initial gold rate.
  const hasRate = await GoldRate.exists({})
  if (!hasRate) {
    await GoldRate.create(DEFAULT_GOLD_RATE)
    console.log('✓ Seeded initial gold rate')
  }
}

// Allow running directly: `node seed.js`.
const { pathToFileURL } = await import('node:url')
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { connectDB } = await import('./db.js')
  const mongoose = (await import('mongoose')).default
  await connectDB()
  await seed()
  await mongoose.disconnect()
  console.log('✓ Seed complete')
  process.exit(0)
}
