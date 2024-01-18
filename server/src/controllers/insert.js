import * as services from '../services'

export const insertBrand = async (req, res) => {
    try {
        const response = await services.insertBrand()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server' + error
        })
    }
}

export const insertProduct = async (req, res) => {
    try {
        const response = await services.insertProduct()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server' + error
        })
    }
}