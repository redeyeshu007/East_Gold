/**
 * Shared CRUD controllers for "submission" collections (enquiries + contact
 * requests) — both have the same name/phone/email/message/status shape, so a
 * single factory builds the create/list/update-status/delete/stats handlers
 * for either model.
 */
import { asyncHandler } from '../middleware/async-handler.js'

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Escape a user-supplied string for safe use inside a RegExp. */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function makeSubmissionController(Model, statuses) {
  /** POST (public) → create a submission. */
  const create = asyncHandler(async (req, res) => {
    const { name, phone } = req.body || {}
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' })
    }
    const doc = await Model.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: req.body.email ? String(req.body.email).trim() : '',
      message: req.body.message ? String(req.body.message).trim() : '',
      area: req.body.area ? String(req.body.area).trim() : undefined,
      service: req.body.service ? String(req.body.service).trim() : undefined,
      typeOfGold: req.body.typeOfGold ? String(req.body.typeOfGold).trim() : undefined,
      callTime: req.body.callTime ? String(req.body.callTime).trim() : undefined,
    })
    res.status(201).json(doc)
  })

  /** GET (auth) → list with optional ?search= and ?status= filters. */
  const list = asyncHandler(async (req, res) => {
    const query = {}

    const status = (req.query.status || '').trim()
    if (status && statuses.includes(status)) query.status = status

    const search = (req.query.search || '').trim()
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i')
      query.$or = [{ name: rx }, { phone: rx }, { email: rx }, { message: rx }]
    }

    const items = await Model.find(query).sort({ createdAt: -1 }).limit(500)
    res.json(items)
  })

  /** GET (auth) → dashboard counts. */
  const stats = asyncHandler(async (_req, res) => {
    const [total, todayCount, newCount, contacted, closed] = await Promise.all([
      Model.countDocuments(),
      Model.countDocuments({ createdAt: { $gte: startOfToday() } }),
      Model.countDocuments({ status: 'New' }),
      Model.countDocuments({ status: 'Contacted' }),
      Model.countDocuments({ status: 'Closed' }),
    ])
    res.json({ total, today: todayCount, new: newCount, contacted, closed })
  })

  /** PATCH (auth) → update status. */
  const updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body || {}
    if (!statuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${statuses.join(', ')}.` })
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!doc) return res.status(404).json({ message: 'Not found.' })
    res.json(doc)
  })

  /** DELETE (auth). */
  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found.' })
    res.json({ ok: true, id: req.params.id })
  })

  return { create, list, stats, updateStatus, remove }
}
