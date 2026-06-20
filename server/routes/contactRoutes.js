import { Router } from 'express'
import { ContactRequest, CONTACT_STATUSES } from '../models/ContactRequest.js'
import { makeSubmissionController } from '../controllers/submissionController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const ctrl = makeSubmissionController(ContactRequest, CONTACT_STATUSES)

// Public: generic contact-us submissions.
router.post('/', ctrl.create)

// Admin-only management.
router.get('/', requireAuth, ctrl.list)
router.get('/stats', requireAuth, ctrl.stats)
router.patch('/:id', requireAuth, ctrl.updateStatus)
router.delete('/:id', requireAuth, ctrl.remove)

export default router
