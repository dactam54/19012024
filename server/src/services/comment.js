import db from '../models'
require('dotenv').config()
const { v4 } = require('uuid')

export const createComment = (body) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Comment.create({ ...body, id: v4() })
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Created comment' : 'Something went wrong!',
        })
    } catch (error) {
        reject(error)
    }
})
// export const getComments = (body) => new Promise(async (resolve, reject) => {
//     try {
//         const response = await db.Comment.create({...body, id: v4()})
//         resolve({
//             err: response ? 0 : 1,
//             mes: response ? 'Created comment' : 'Something went wrong!',
//         })
//     } catch (error) {
//         reject(error)
//     }
// })