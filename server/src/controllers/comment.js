import * as services from '../services'

export const createComment = async (req, res) => {
    try {
        const { pid, content } = req.body
        const { id } = req.user
        if (!pid || !content) return res.status(400).json({
            err: 1,
            mes: 'Missing product ID'
        })
        const response = await services.createComment({ uid: id, ...req.body })
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}