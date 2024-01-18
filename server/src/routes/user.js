import express from 'express'
import * as controllers from '../controllers'
import { isAdmin, verifyToken } from '../middlewares/auth'

const router = express.Router()

router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.get('/', controllers.getUsers)
router.post('/forgotpassword', controllers.forgotPassword)
router.post('/resetpassword', controllers.resetPassword)
router.get('/current', verifyToken, controllers.getCurrent)
router.put('/wishlist', verifyToken, controllers.addWishlist)
router.put('/clearcart', verifyToken, controllers.clearCart)
router.get('/histories', verifyToken, controllers.getBuyHistories)
router.put('/current', verifyToken, controllers.updateCurrent)
router.put('/cart', verifyToken, controllers.addCart)
router.post('/admin', controllers.createAdmin)
router.get('/admin', [verifyToken, isAdmin], (req, res) => res.status(200).json({ err: 0, mes: 'OKE' }))
router.get('/admin/all', [verifyToken, isAdmin], controllers.getUsers)
router.get('/registerfinal/:email/:token', controllers.finalRegister)
router.put('/admin/:uid', [verifyToken, isAdmin], controllers.updateUserByAdmin)
router.delete('/admin/:uid', [verifyToken, isAdmin], controllers.deleteUserByAdmin)



export default router