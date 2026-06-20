/**
 * JWT authentication middleware.
 * Verifies the Bearer token and attaches the decoded admin to `req.admin`.
 * Rejects unauthenticated requests with 401 so the client can redirect to login.
 */
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Authentication required.' })
  try {
    req.admin = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' })
  }
}

export default requireAuth
