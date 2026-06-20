import { Router } from 'express'
import { Enquiry, ENQUIRY_STATUSES } from '../models/Enquiry.js'
import { makeSubmissionController } from '../controllers/submissionController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const ctrl = makeSubmissionController(Enquiry, ENQUIRY_STATUSES)

// Public: the website form posts here.
router.post('/', ctrl.create)

// Admin-only management.
router.get('/', requireAuth, ctrl.list)
router.get('/stats', requireAuth, ctrl.stats)
router.patch('/:id', requireAuth, ctrl.updateStatus)
router.delete('/:id', requireAuth, ctrl.remove)

export default router
