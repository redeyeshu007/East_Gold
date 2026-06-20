/**
 * Contact request — a generic "contact us" submission.
 * Stored in the `contact_requests` collection. Kept separate from enquiries so
 * the two intake channels can be reported on independently.
 */
import mongoose from 'mongoose'

export const CONTACT_STATUSES = ['New', 'Contacted', 'Closed']

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    message: { type: String, default: '', trim: true },
    status: { type: String, enum: CONTACT_STATUSES, default: 'New', index: true },
  },
  { timestamps: true, collection: 'contact_requests' },
)

contactRequestSchema.index({ name: 'text', phone: 'text', email: 'text', message: 'text' })

export const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema)
export default ContactRequest
