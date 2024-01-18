import * as services from '../services'

export const createNewCoupon = async (req, res) => {
    try {
        const { code, discount, expiry } = req.body
        if (!code || !discount || !expiry) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.createNewCoupon(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const getCoupons = async (req, res) => {
    try {
        const response = await services.getCoupons()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const updateCoupon = async (req, res) => {
    try {
        const { cid } = req.params
        const response = await services.updateCoupon(cid, req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const deleteCoupon = async (req, res) => {
    try {
        const { cid } = req.params
        const response = await services.deleteCoupon(cid)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}