import express from 'express'
import cors from 'cors'
require('dotenv').config()
import connectDatabase from './src/config/connect-database'
import initRoutes from './src/routes'
import cookie from 'cookie-parser'


const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'DELETE', 'PUT'],
    credentials: true
}))
app.use(cookie())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDatabase()
initRoutes(app)
const port = process.env.PORT || 8668

app.listen(port, () => {
    console.log('App is running on the port : ' + port);
})