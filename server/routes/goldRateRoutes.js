import { Router } from 'express'
import { getCurrent, getHistory, update } from '../controllers/goldRateController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', getCurrent) // public
router.get('/history', requireAuth, getHistory)
router.put('/', requireAuth, update)

export default router
