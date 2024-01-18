import * as services from '../services'

export const getBrands = async (req, res) => {
    try {
        const response = await services.getBrands()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const createBrand = async (req, res) => {
    const { name } = req.body
    if (!req.file || !req.file.path || !name) return res.status(400).json({
        err: 1,
        mes: 'missing inputs'
    })
    try {
        const response = await services.createBrand({ name, image: req.file.path })
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const updateBrand = async (req, res) => {
    const { bid } = req.params
    if (!bid) return res.status(400).json({
        err: 1,
        mes: 'missing inputs'
    })
    const data = {}
    if (req.body && req.body.name) data.name = req.body.name
    if (req.file && req.file.path) data.image = req.file.path
    try {
        const response = await services.updateBrand(bid, data)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const deleteBrand = async (req, res) => {
    const { bid } = req.params
    if (!bid) return res.status(400).json({
        err: 1,
        mes: 'missing inputs'
    })
    try {
        const response = await services.deleteBrand(bid)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}