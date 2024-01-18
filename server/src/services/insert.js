import db from '../models'
import brandData from '../../data/brand.json'
import productData from '../../data/product.json'
import productData_1 from '../../data/product1.json'
import productData_2 from '../../data/product2.json'
import { v4 as genId } from 'uuid'
import { makeid } from '../ultils/fn'
import userData, { coupons } from '../ultils/userData'
import { formatVietnameseToString } from '../ultils/fn'

const catalogNames = [
    'Đồng hồ',
    'Điện thoại',
    'Laptop',
    'Máy tính bảng',
    'Âm thanh',
    'Nhà thông minh',
    'Phụ kiện',
    'PC - Màn hình',
    'Tivi',
    'Thu cũ',
    'Hàng cũ',
    'Khuyến mãi'
]
const fullData = [productData, productData_1, productData_2]

export const insertBrand = () => new Promise(async (resolve, reject) => {
    try {
        brandData.forEach(async (item) => {
            await db.Brand.create({
                name: item?.name,
                desc: item?.desc,
                country: item?.country,
                head_quarters: item?.headQuarters,
                founded: item?.founded,
                image: item?.image
            })
        })
        resolve('Done')

    } catch (error) {
        reject(error)
    }
})
const fn2 = async (i, pid, discount) => {
    await db.Varriant.create({
        pid,
        sku: i?.sku,
        name: i?.variantName,
        price: i?.price !== '0' ? +i?.price * (1 - discount / 100) : (Math.round(Math.random() * 10000) + 1000) * 1000,
        images: i?.images
    })
}
const fn = async (item, uids) => {

    const pid = genId()
    const score = Math.round(Math.random() * 5)
    const discount = Math.round(Math.random() * 30)

    await db.Product.create({
        id: pid,
        name: item?.productName,
        thumb: item?.thumb,
        brand: item?.brandName,
        policy: item?.productPolicies,
        detail: item?.detailSpecs,
        images: item?.hightLightImgs,
        catalog: item?.productCatalog,
        catalogslug: formatVietnameseToString(item?.productCatalog),
        overviews: item?.overviewSpecs,
        spec_thumb: item?.specThumb,
        discount,
        desc: item?.productDesc,
        star: score,
        quantity: Math.round(Math.random() * 1000)
    })
    await db.Vote.create({
        pid,
        uid: uids[Math.round(Math.random() * 4)],
        score,
        comment: makeid(Math.round(Math.random() * 30))
    })
    const promise = []
    for (let i of item?.variants) {
        promise.push(await fn2(i, pid, discount))
    }
    await Promise.all(promise)

}
export const insertProduct = () => new Promise(async (resolve, reject) => {
    try {
        const catalogs = []
        productData.forEach(item => {
            if (!catalogs.some(i => i.link === item?.link)) catalogs.push({ link: item?.link, name: item?.productCatalog })
        })
        productData_1.forEach(item => {
            if (!catalogs.some(i => i.link === item?.link)) catalogs.push({ link: item?.link, name: item?.productCatalog })
        })
        productData_2.forEach(item => {
            if (!catalogs.some(i => i.link === item?.link)) catalogs.push({ link: item?.link, name: item?.productCatalog })
        })
        const catalogsData = catalogs.map(item => ({
            link: item?.link === 'dtdd' ? 'đien-thoai' : item?.link === 'dong-ho-thong-minh' ? 'đong-ho-thong-minh' : item?.link,
            value: catalogNames.find(i => item?.name?.includes(i))
        }))
        await Promise.all([db.User.bulkCreate(userData), db.Coupon.bulkCreate(coupons), db.Catalog.bulkCreate(catalogsData)])
        const uids = userData.map(el => el.id)
        const promises = []
        productData.forEach(el => promises.push(fn(el, uids)))
        productData_1.forEach(el => promises.push(fn(el, uids)))
        productData_2.forEach(el => promises.push(fn(el, uids)))
        await Promise.all(promises)
        resolve('Done')

    } catch (error) {
        reject(error)
    }
})
export const prepare = () => {
    const data1 = productData_1.filter((el, index) => Array.from(Array(100).keys()).some(n => n === index))
    const score = Math.round(Math.random() * 5)
    const discount = Math.round(Math.random() * 30)
    data1.map((item, index) => {
        return ({
            id: index + 1,
            name: item?.productName,
            thumb: item?.thumb,
            brand: item?.brandName,
            policy: item?.productPolicies,
            detail: item?.detailSpecs,
            images: item?.hightLightImgs,
            catalog: item?.productCatalog,
            catalogslug: formatVietnameseToString(item?.productCatalog),
            overviews: item?.overviewSpecs,
            spec_thumb: item?.specThumb,
            discount,
            desc: item?.productDesc,
            star: score,
            quantity: Math.round(Math.random() * 1000)
        })
    })
    return data1
}