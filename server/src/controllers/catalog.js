import * as services from '../services'

export const getCatalogs = async (req, res) => {
    try {
        const response = await services.getCatalogs(req.body.id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}