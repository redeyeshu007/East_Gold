/**
 * Admin user — credentials for the admin dashboard.
 * Stored in the `admin_users` collection. Passwords are bcrypt-hashed.
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Administrator', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true, collection: 'admin_users' },
)

/** Set (and hash) the password. */
adminUserSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, 10)
}

/** Verify a plaintext password against the stored hash. */
adminUserSchema.methods.verifyPassword = function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

export const AdminUser = mongoose.model('AdminUser', adminUserSchema)
export default AdminUser
