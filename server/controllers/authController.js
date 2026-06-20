/**
 * Admin authentication + profile.
 */
import jwt from 'jsonwebtoken'
import { JWT_SECRET, TOKEN_TTL } from '../config.js'
import { AdminUser } from '../models/AdminUser.js'
import { asyncHandler } from '../middleware/async-handler.js'

/** POST /api/admin/login → { token } */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  const admin = await AdminUser.findOne({ username: username.trim() })
  if (!admin || !(await admin.verifyPassword(password))) {
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  })
  res.json({ token })
})

/** GET /api/admin/me → current admin profile (auth). */
export const me = asyncHandler(async (req, res) => {
  const admin = await AdminUser.findById(req.admin.sub).select('-passwordHash')
  if (!admin) return res.status(404).json({ message: 'Admin not found.' })
  res.json(admin)
})

/** PATCH /api/admin/me → update profile / password (auth). */
export const updateProfile = asyncHandler(async (req, res) => {
  const admin = await AdminUser.findById(req.admin.sub)
  if (!admin) return res.status(404).json({ message: 'Admin not found.' })

  const { name, email, password } = req.body || {}
  if (typeof name === 'string') admin.name = name.trim()
  if (typeof email === 'string') admin.email = email.trim()
  if (typeof password === 'string' && password.length > 0) {
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }
    await admin.setPassword(password)
  }

  await admin.save()
  const { passwordHash, ...safe } = admin.toObject()
  void passwordHash
  res.json(safe)
})
