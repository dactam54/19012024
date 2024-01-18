import express from 'express'
import * as controllers from '../controllers'
import { verifyToken, isAdmin } from '../middlewares/auth'
const router = express.Router()

router.get('/', controllers.getCoupons)
router.post('/', [verifyToken, isAdmin], controllers.createNewCoupon)
router.put('/:cid', [verifyToken, isAdmin], controllers.updateCoupon)
router.delete('/:cid', [verifyToken, isAdmin], controllers.deleteCoupon)



export default router