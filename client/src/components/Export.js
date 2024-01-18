import React, { memo,  } from 'react'
import icons from '../utils/icons'
import { apiUpdateCart,  } from '../apis'
import { useDispatch, useSelector } from 'react-redux'
import actionTypes from '../store/actions/actionTypes'

const { MdOutlineAddShoppingCart, MdOutlineRemoveShoppingCart } = icons

const ExportCart = ({ pid }) => {

    const { cart } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const updateCart = async () => {
        // dispatch({ type: actionTypes.LOADING, flag: true })
        const response = await apiUpdateCart(pid)
        // dispatch({ type: actionTypes.LOADING, flag: false })
        if (response.err === 0) {
            dispatch({ type: actionTypes.UPDATE_CURRENT })
            dispatch({ type: actionTypes.CART, cart: pid })
        }
    }
    return (
        <div className='w-full'>

            
            <div className='flex items-center gap-2'>
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

export default memo(ExportCart)