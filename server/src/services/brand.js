import db from '../models'

export const getBrands = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Brand.findAll()
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Something went wrong!',
            brandDatas: response
        })

    } catch (error) {
        reject(error)
    }
})

export const createBrand = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Brand.findOrCreate({
            where: { name: data.name },
            defaults: data
        })
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Thêm mới thành công' : 'Thêm mới không thành công',
            createdBrand: response[1] ? response[0] : null
        })

    } catch (error) {
        reject(error)
    }
})
export const updateBrand = (bid, data) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Brand.update(data, { where: { id: bid } })
        resolve({
            err: response[0] > 0 ? 0 : 1,
            mes: response[0] > 0 ? 'Cập nhật thành công' : 'Cập nhật không thành công',
        })

    } catch (error) {
        reject(error)
    }
})
export const deleteBrand = (bids) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Brand.destroy({ where: { id: bids } })
        resolve({
            err: response > 0 ? 0 : 1,
            mes: response > 0 ? 'Xóa thành công ' : 'Xóa không thành công',
        })

    } catch (error) {
        reject(error)
    }
})