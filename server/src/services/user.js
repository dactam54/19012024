import db from '../models'
import { v4 as genId } from 'uuid'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import sendMail from '../ultils/sendMail'
import crypto from 'crypto'


export const register = (data) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({ where: { email: data.email } })
        const token = genId()
        if (!user) {
            await db.User.create({
                email: 'notactived',
                password: data.password,
                name: data.name,
                id: token
            })
        }
        resolve({
            err: !user ? 0 : 1,
            mes: user ? 'Email đã được đăng ký' : 'Hãy check mail để kích hoạt tài khoản',
            // payload: {
            //     token: hashToken,
            //     user: data
            // }
        })
        if (!user) {
            const subject = 'Xác minh email đăng ký'
            const html = `Xin vui lòng click vào link dưới đây để hoàn tất đăng ký tài khoản của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.SERVER_URL}/api/v1/user/registerfinal/${data.email}/${token}>Click here</a>`
            await sendMail({ email: data.email, html, subject })
            setTimeout(async () => {
                await db.User.destroy({ where: { id: token } })
            }, [60000])
        }
    } catch (error) {
        reject(error)
    }
})
export const finalRegister = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.create({ ...payload, id: genId() })
        resolve({
            err: response ? 0 : 1,
            rs: response ? 'Register done' : 'Something went wrong!',
        })

    } catch (error) {
        reject(error)
    }
})
export const getUsers = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findAll({
            attributes: {
                exclude: ['passwordResetToken', 'passwordTokenExpiry', 'password']
            }
        })
        resolve({
            err: response ? 0 : 1,
            rs: response ? response : 'Something went wrong!',
        })

    } catch (error) {
        reject(error)
    }
})
export const getOne = (id, isCurr) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id },
            attributes: {
                exclude: ['password', 'role', 'passwordResetToken', 'passwordTokenExpiry']
            },
        })
        const cart = response && await db.Product.findAll({
            where: { id: response.cart },
            include: [
                { model: db.Varriant, as: 'variants' }
            ]
        })
        if (isCurr) {
            const rs = await db.Visited.findOne({ where: { uid: id } })
            if (rs) {
                await rs.increment('times', { by: 1 })
            } else {
                await db.Visited.create({ uid: id })
            }
        }
        if (response && cart) response.cart = cart
        resolve({
            err: response ? 0 : 1,
            rs: response ? response : 'Something went wrong!',
        })

    } catch (error) {
        reject(error)
    }
})
export const login = ({ email, password, carts }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email },
            raw: true
        })
        const isCorrectPass = response && bcrypt.compareSync(password, response.password)
        const accessToken = isCorrectPass && jwt.sign({ id: response.id, role: response.role }, process.env.JWT_SECRET, { expiresIn: '3d' })
        if (accessToken) {
            if (typeof response.cart === 'string') response.cart = JSON.parse(response.cart)
            const currCart = response.cart || []
            const updatedCart = currCart?.concat(carts)
            console.log(updatedCart);
            const uniqueCart = updatedCart?.filter((el, index, self) => self.indexOf(el) === index)
            await db.User.update({ cart: uniqueCart }, { where: { email } })
        }
        resolve({
            err: accessToken ? 0 : 1,
            rs: accessToken ? 'OK' : response ? 'Password is wrong' : 'Email not found!',
            accessToken
        })

    } catch (error) {
        reject(error)
    }
})
export const addWishlist = (uid, pid) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findByPk(uid)
        if (!user.wishlist) user.wishlist = []
        let wishlist = user.wishlist.some(i => i === pid) ? user.wishlist.filter(i => i !== pid) : [...user.wishlist, pid]
        if (wishlist.length === 0) wishlist = null
        const response = await db.User.update({ wishlist }, {
            where: { id: uid },
        })
        resolve({
            err: response[0] ? 0 : 1,
            mes: response[0] ? 'Updated product to your wishlist' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const updateCurrent = (payload, id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.update(payload, { where: { id } })
        resolve({
            err: response[0] ? 0 : 1,
            mes: response[0] ? 'Updated profile is successfully!' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const addCart = (uid, pid) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findByPk(uid)
        if (!user.cart) user.cart = []
        let cart = user.cart.some(i => i === pid) ? user.cart.filter(i => i !== pid) : [...user.cart, pid]
        if (cart.length === 0) cart = null
        const response = await db.User.update({ cart }, {
            where: { id: uid },
        })
        resolve({
            err: response[0] ? 0 : 1,
            mes: response[0] ? 'Updated product to your cart' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const createAdmin = ({ email, password, name }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                id: genId(),
                password,
                role: 'admin',
                name
            }
        })
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Register is successfully. Now go login!' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const updateUserByAdmin = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const rs = await db.User.update(data, { where: { id } })
        resolve({
            err: rs[0] ? 0 : 1,
            mes: rs[0] ? 'Updated' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const deleteUserByAdmin = (uid) => new Promise(async (resolve, reject) => {
    try {
        const rs = await db.User.destroy({ where: { id: uid } })
        resolve({
            err: rs ? 0 : 1,
            mes: rs ? 'Deleted' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const forgotPassword = (email) => new Promise(async (resolve, reject) => {
    try {

        const rs = await db.User.findOne({ where: { email } })
        if (rs) {
            const token = crypto.randomBytes(32).toString('hex')
            const subject = 'Reset mật khẩu'
            const html = `Xin vui lòng click vào link dưới đây để hoàn tất reset mật khẩu.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-mat-khau/${token}>Click here</a>`
            const updated = await db.User.update({
                passwordResetToken: token,
                passwordTokenExpiry: Date.now() + 15 * 60 * 1000
            }, {
                where: { email }
            })
            resolve({
                err: updated[0] > 0 ? 0 : 1,
                mes: updated[0] ? 'Vui lòng check mail của bạn.' : 'Something went wrong!'
            })
            await sendMail({ email, html, subject })
        } else {
            resolve({
                err: 1,
                mes: 'Email không đúng',
            })
        }
    } catch (error) {
        reject(error)
    }
})
export const resetPassword = ({ password, token }) => new Promise(async (resolve, reject) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        const rs = await db.User.findOne({ where: { passwordResetToken: hashedToken } })
        if (rs) {
            const updated = await db.User.update(
                {
                    password,
                    passwordResetToken: '',
                    passwordTokenExpiry: Date.now()
                },
                { where: { id: rs.id } }
            )
            resolve({
                err: updated[0] > 0 ? 0 : 1,
                mes: updated[0] > 0 ? 'Reset mật khẩu thành công.' : 'Something went wrong'
            })
        } else {
            resolve({
                err: 1,
                mes: 'Reset token invalid'
            })
        }
    } catch (error) {
        reject(error)
    }
})
export const getBuyHistories = (uid) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Bill.findAll({
            where: { uid: uid },
            include: [
                {
                    model: db.Bipro,
                    as: 'billDetails',
                    include: [{ model: db.Product, as: 'products' }]
                },
                {
                    model: db.Coupon,
                    as: 'selectedCoupon'
                }
            ],
        })
        resolve({
            err: response ? 0 : 1,
            mes: response ? response : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
export const clearCart = (uid) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.update({ cart: null }, { where: { id: uid } })
        resolve({
            err: response ? 0 : 1,
            mes: response ? response : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})