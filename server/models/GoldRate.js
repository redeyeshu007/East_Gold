/**
 * Gold rate record. Stored in the `gold_rates` collection.
 *
 * Each update inserts a new document, so the collection IS the rate history.
 * The "current active rate" is simply the most recently created document.
 */
import mongoose from 'mongoose'

const goldRateSchema = new mongoose.Schema(
  {
    oneGramRate: { type: Number, required: true, min: 0 },
    eightGramRate: { type: Number, required: true, min: 0 },
    updatedBy: { type: String, default: 'admin', trim: true },
  },
  { timestamps: true, collection: 'gold_rates' },
)

/** The current active rate — most recently created document. */
goldRateSchema.statics.current = function current() {
  return this.findOne().sort({ createdAt: -1 })
}

export const GoldRate = mongoose.model('GoldRate', goldRateSchema)
export default GoldRate
