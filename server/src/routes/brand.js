import express from 'express'
import * as controllers from '../controllers'
import uploadCloud from '../config/cloudinary.config'
import { verifyToken, isAdmin } from '../middlewares/auth'
const router = express.Router()

router.get('/', controllers.getBrands)
router.post('/', [verifyToken, isAdmin], uploadCloud.single('image'), controllers.createBrand)
router.delete('/:bid', [verifyToken, isAdmin], controllers.deleteBrand)
router.put('/:bid', [verifyToken, isAdmin], uploadCloud.single('image'), controllers.updateBrand)



export default router