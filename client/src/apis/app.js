import axios from '../axios'
export const apiGetBrands = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v1/brand'
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

