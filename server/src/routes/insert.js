import express from 'express'
import * as controllers from '../controllers'

const router = express.Router()

router.post('/brand', controllers.insertBrand)
router.post('/product', controllers.insertProduct)



export default router