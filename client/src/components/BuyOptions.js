import React, { memo, useState, useEffect } from 'react'

import icons from '../utils/icons'
import { apiUpdateCart,  } from '../apis'
import { useNavigate } from 'react-router-dom'
import path from '../utils/path'
import { useDispatch, useSelector } from 'react-redux'
import actionTypes from '../store/actions/actionTypes'

const { AiFillGift, MdOutlineAddShoppingCart, MdOutlineRemoveShoppingCart } = icons

const BuyOptions = ({ variants, discountNumber, setSku, sku, quantity, pid }) => {
    const [activeVariant, setActiveVariant] = useState(null)
   
    const { cart } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    useEffect(() => {
        variants && setActiveVariant(variants[0])
    }, [variants])
  

    useEffect(() => {
        setActiveVariant(variants?.find(item => item.sku === sku))
    }, [sku])


    const handleBuyClick = async () => {
        if (cart.some(el => el === pid)) {
            navigate(`/${path.SYSTEM}/${path.BUY}`)
        } else {
            const rs = await apiUpdateCart(pid)
            if (rs.err === 0) {
                dispatch({ type: actionTypes.CART, cart: pid })
                navigate(`/${path.SYSTEM}/${path.BUY}`)
            }
        }
    }
    const updateCart = async () => {
        dispatch({ type: actionTypes.LOADING, flag: true })
        const response = await apiUpdateCart(pid)
        dispatch({ type: actionTypes.LOADING, flag: false })
        if (response.err === 0) {
            dispatch({ type: actionTypes.UPDATE_CURRENT })
            dispatch({ type: actionTypes.CART, cart: pid })
        }
    }
    
    return (
        <div className='w-full'>
            <span className='flex items-center justify-between gap-3 mb-4'>
                <span className='flex items-center gap-3'>
                </span>
                <span>{`(Kho: ${quantity})`}</span>
            </span>
            <h3 className='font-bold text-[#444444] text-sm'>Màu sắc</h3>
            <div className='mb-4'>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    className='text-white bg-red-500 h-[60px] flex-auto font-bold rounded-md'
                    onClick={handleBuyClick}
                >
                    Xuất ngay
                </button>

                {!cart?.some(el => (el === pid))
                    ? <button
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation()
                            updateCart()
                        }}
                        className='text-red-500 bg-white border-2 text-sm flex items-center justify-center border-red-500 w-[60px] h-[60px] flex-none rounded-md flex-col'
                    >
                        <span><MdOutlineAddShoppingCart size={25} color='red' /></span>
                        <span className='text-[8px] font-bold'>Xuất hàng</span>
                    </button>
                    : <button
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation()
                            updateCart()
                        }}
                        className='text-red-500 bg-white border-2 text-sm flex items-center justify-center border-red-500 w-[60px] h-[60px] flex-none rounded-md flex-col'
                    >
                        <span><MdOutlineRemoveShoppingCart size={25} color='red' /></span>
                        <span className='text-[8px] font-bold'>Xóa khỏi giỏ</span>
                    </button>}
            </div>
         
        </div>
    )
}

export default memo(BuyOptions)