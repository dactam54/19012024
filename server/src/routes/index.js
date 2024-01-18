import insert from './insert'
import product from './product'
import catalog from './catalog'
import user from './user'
import comment from './comment'
import brand from './brand'
import coupon from './coupon'
import { notFound, errorHandler } from '../middlewares/errHandlers'

const initRoutes = (app) => {
    app.use('/api/v1/insert', insert)
    app.use('/api/v1/products', product)
    app.use('/api/v1/catalogs', catalog)
    app.use('/api/v1/user', user)
    app.use('/api/v1/comment', comment)
    app.use('/api/v1/brand', brand)
    app.use('/api/v1/coupon', coupon)

    app.use(notFound)
    app.use(errorHandler)
}

export default initRoutes