/**
 * Website enquiry — a submission from the public consultation form.
 * Stored in the `users_enquiries` collection.
 */
import mongoose from 'mongoose'

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Closed']

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    message: { type: String, default: '', trim: true },
    // Optional context captured by the consultation form.
    area: { type: String, default: '', trim: true },
    service: { type: String, default: '', trim: true },
    typeOfGold: { type: String, default: '', trim: true },
    callTime: { type: String, default: '', trim: true },
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'New', index: true },
  },
  { timestamps: true, collection: 'users_enquiries' },
)

// Text index powers the admin search box (name / phone / email / message).
enquirySchema.index({ name: 'text', phone: 'text', email: 'text', message: 'text' })

export const Enquiry = mongoose.model('Enquiry', enquirySchema)
export default Enquiry
