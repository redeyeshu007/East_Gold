/**
 * Gold rate management. Each update inserts a new `gold_rates` document, so the
 * collection doubles as the rate history; the current rate is the latest doc.
 */
import { GoldRate } from '../models/GoldRate.js'
import { DEFAULT_GOLD_RATE } from '../config.js'
import { asyncHandler } from '../middleware/async-handler.js'

/**
 * Serialise a GoldRate doc into the API shape. Keeps `oneGramRate`/`updatedAt`
 * (and an `id`) for backward compatibility with the public website, while
 * adding the new `eightGramRate`/`updatedBy` fields.
 */
function serialise(doc) {
  if (!doc) {
    return {
      id: null,
      oneGramRate: DEFAULT_GOLD_RATE.oneGramRate,
      eightGramRate: DEFAULT_GOLD_RATE.eightGramRate,
      updatedBy: DEFAULT_GOLD_RATE.updatedBy,
      updatedAt: new Date().toISOString(),
    }
  }
  return {
    id: doc.id,
    oneGramRate: doc.oneGramRate,
    eightGramRate: doc.eightGramRate,
    updatedBy: doc.updatedBy,
    updatedAt: doc.updatedAt,
  }
}

/** GET /api/gold-rate (public) → current active rate. */
export const getCurrent = asyncHandler(async (_req, res) => {
  const doc = await GoldRate.current()
  res.json(serialise(doc))
})

/** GET /api/gold-rate/history (auth) → recent rate history. */
export const getHistory = asyncHandler(async (_req, res) => {
  const items = await GoldRate.find().sort({ createdAt: -1 }).limit(100)
  res.json(items.map(serialise))
})

/**
 * PUT /api/gold-rate (auth) → record a new rate.
 * `eightGramRate` is optional; if omitted it is derived as 8 × oneGramRate.
 */
export const update = asyncHandler(async (req, res) => {
  const oneGramRate = Number(req.body?.oneGramRate)
  if (!Number.isFinite(oneGramRate) || oneGramRate < 0) {
    return res.status(400).json({ message: 'oneGramRate must be a valid non-negative number.' })
  }

  let eightGramRate = Number(req.body?.eightGramRate)
  if (!Number.isFinite(eightGramRate) || eightGramRate < 0) {
    eightGramRate = oneGramRate * 8
  }

  const doc = await GoldRate.create({
    oneGramRate,
    eightGramRate,
    updatedBy: req.admin?.username || 'admin',
  })
  res.json(serialise(doc))
})
