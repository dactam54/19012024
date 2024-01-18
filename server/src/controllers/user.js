import * as services from '../services'
import bcrypt from 'bcryptjs'
import db from '../models'
import makeId from 'uniqid'

export const register = async (req, res) => {
    const { email, password, name } = req.body
    console.log(email, password, name)
    try {
        if (!email || !password || !name) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.register(req.body)
        // const { payload, ...rs } = response
        // if (response.err === 0) res.cookie('payloadregister', JSON.stringify(payload), { httpOnly: true, maxAge: 15 * 60 * 1000 })
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const finalRegister = async (req, res) => {
    try {
        const { token, email } = req.params
        const response = await db.User.findOne({ where: { id: token }, raw: true })
        if (response) {
            const update = await db.User.update({ email, id: makeId() }, { where: { id: token } })
            if (update[0] > 0)
                res.redirect(`${process.env.CLIENT_URL}/xac-nhan-dang-ky-tai-khoan/1`)
            else {
                await db.User.destroy({ where: { id: token } })
                res.redirect(`${process.env.CLIENT_URL}/xac-nhan-dang-ky-tai-khoan/0`)
            }
        } else {
            await db.User.destroy({ where: { id: token } })
            res.redirect(`${process.env.CLIENT_URL}/xac-nhan-dang-ky-tai-khoan/0`)
        }
        // const { payloadregister } = req.cookies
        // if (payloadregister && bcrypt.compareSync(tk, JSON.parse(payloadregister).token)) {
        //     res.clearCookie('payloadregister', { httpOnly: true, secure: true })
        //     const response = await services.finalRegister(JSON.parse(payloadregister).user)
        //     if (response.err === 0)
        //         res.redirect(`${process.env.CLIENT_URL}/xac-nhan-dang-ky-tai-khoan/1`)
        //     else res.redirect(`${process.env.CLIENT_URL}/xac-nhan-dang-ky-tai-khoan/0`)
        // } else {
        //     res.redirect(`${process.env.CLIENT_URL}/xac-nhan-dang-ky-tai-khoan/0`)
        // }
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const createAdmin = async (req, res) => {
    const { email, password, name } = req.body
    try {
        if (!email || !password || !name) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.createAdmin(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.login(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const getUsers = async (req, res) => {
    try {
        const response = await services.getUsers()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const getCurrent = async (req, res) => {
    const { id } = req.user
    try {
        const response = await services.getOne(id, true)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const addWishlist = async (req, res) => {
    try {
        const { id } = req.user
        const { pid } = req.body
        if (!id || !pid) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.addWishlist(id, pid)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const addCart = async (req, res) => {
    try {
        const { id } = req.user
        const { pid } = req.body
        if (!id || !pid) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.addCart(id, pid)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const updateCurrent = async (req, res) => {
    try {
        const { id } = req.user
        if (!id || Object.keys(req.body).length === 0) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.updateCurrent(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const updateUserByAdmin = async (req, res) => {
    try {
        const { uid } = req.params
        if (Object.keys(req.body).length === 0) return res.status(400).json({
            err: 1,
            mes: 'Missing inputs'
        })
        const response = await services.updateUserByAdmin(uid, req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const deleteUserByAdmin = async (req, res) => {
    try {
        const { uid } = req.params
        const response = await services.deleteUserByAdmin(uid)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const forgotPassword = async (req, res) => {
    try {
        if (!req.body || !req.body.email) return res.status(200).json({
            err: 1,
            mes: "Missing inputs"
        })
        const response = await services.forgotPassword(req.body.email)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body
        if (!token || !password) return res.status(200).json({
            err: 1,
            mes: "Missing inputs"
        })
        const response = await services.resetPassword({ password, token })
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const getBuyHistories = async (req, res) => {
    try {
        const { id } = req.user
        const response = await services.getBuyHistories(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}
export const clearCart = async (req, res) => {
    try {
        const { id } = req.user
        const response = await services.clearCart(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Lỗi server ' + error
        })
    }
}