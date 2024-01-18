import express from 'express'
import * as controllers from '../controllers'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

router.post('/', verifyToken, controllers.createComment)



export default router