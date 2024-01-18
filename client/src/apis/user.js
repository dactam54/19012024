import axios from '../axios'

export const apiRegister = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/user/register',
            data: payload,
            credentials: 'include',
            withCredentials: true
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/user/login',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetCurrent = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/user/current',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiUpdateWishlist = (pid) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/user/wishlist',
            data: { pid }
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiUpdateCart = (pid) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/user/cart',
            data: { pid }
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiUpdateCurrent = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/user/current',
            data
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiSecureAdminRoute = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/user/admin',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetUsers = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/user/admin/all',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiUpdateUserByAdmin = (uid, data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/user/admin/' + uid,
            data
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiDeleteUserByAdmin = (uid) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'delete',
            url: '/api/v1/user/admin/' + uid,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiResetPass = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/user/resetpassword',
            data
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiForgotPass = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/user/forgotpassword',
            data
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiGetHistories = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/user/histories',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiClearCart = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/user/clearcart',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})