import db from '../models'

export const getCatalogs = (uid) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Catalog.findAll({
            attributes: ['id', 'link', 'value']
        })
        const userId = uid || 'anon'
        const rs = await db.Visited.findOne({ where: { uid: userId } })
        if (rs) {
            await rs.increment('times', { by: 1 })
        } else {
            await db.Visited.create({ uid: userId })
        }
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Something went wrong!',
            catalogDatas: response
        })

    } catch (error) {
        reject(error)
    }
})