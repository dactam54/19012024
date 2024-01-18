import db from '../models'

export const createNewCoupon = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Coupon.findOrCreate({
            where: { code: data.code },
            defaults: {
                code: data.code,
                expiry: Date.now() + +data.expiry * 24 * 60 * 60 * 1000,
                discount: +data.discount
            }
        })
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Created' : 'Something went wrong!',
            newCoupon: response[1] ? response[0] : null
        })

    } catch (error) {
        reject(error)
    }
})
export const getCoupons = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Coupon.findAll()
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Something went wrong!',
            coupons: response
        })

    } catch (error) {
        reject(error)
    }
})
export const updateCoupon = (cid, data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Coupon.update(data, { where: { id: cid } })
        resolve({
            err: response[0] > 0 ? 0 : 1,
            mes: response[0] > 0 ? 'Updated' : 'Something went wrong!',
        })

    } catch (error) {
        reject(error)
    }
})
export const deleteCoupon = (cid) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Coupon.destroy({ where: { id: cid } })
        resolve({
            err: response > 0 ? 0 : 1,
            mes: response > 0 ? 'Deleted' : 'Something went wrong!',
        })

    } catch (error) {
        reject(error)
    }
})