import axios from '../axios'

export const apiUpdateBrandByAdmin = (bid, data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'put',
            url: '/api/v1/brand/' + bid,
            data
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiDeleteBrandByAdmin = (bid) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'delete',
            url: '/api/v1/brand/' + bid
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const apiCreateBrandByAdmin = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/brand/',
            data
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})