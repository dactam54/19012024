import React, { memo, useState, useEffect } from 'react'
import icons from '../utils/icons'
import { useDispatch,  } from 'react-redux'
import actionTypes from '../store/actions/actionTypes'
import { apiUpdateCart } from '../apis'



const { ImBin, AiFillCaretLeft, AiFillCaretRight } = icons
const OrderItem = ({ image, name,  price, pid }) => {
    const [quantity, setQuantity] = useState(1)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({ type: actionTypes.CAL_PRICE, product: { pid, price: (price) * quantity, quantity } })
    }, [quantity])

 
    
    const updateCart = async () => {
        const response = await apiUpdateCart(pid)
        if (response.err === 0) {
            dispatch({ type: actionTypes.CART, cart: pid })
            dispatch({ type: actionTypes.DEL_ORDER, pid })
        }
    }
    return (
        <div className='p-4 rounded-md flex justify-between gap-2 border border-solid border-gray-300'>
            <div className='flex justify-between '>
                <img src={image} alt="product" className='w-[145px] h-[145px] object-cover rounded-md' />
                <div className='flex flex-col gap-4 ml-3'>
                    <span className='font-bold'>
                        <span>{name}</span>
                    </span>
                    <div className='flex gap-4'>
                    <span className='text-gray-500  flex gap-1 items-center'>
                        </span>
                    </div>
                   
                </div>
            </div>
            <div className='flex flex-col items-end gap-8'>
                <span onClick={updateCart} className='cursor-pointer'><ImBin /></span>
                <div className='flex items-center gap-2'>
                    <span
                        className='cursor-pointer'
                        onClick={() => setQuantity(prev => prev <= 1 ? 1 : prev - 1)}
                    ><AiFillCaretLeft /></span>
                    <input
                        type="text"
                        className='w-[60px] px-4 border'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <span
                        className='cursor-pointer'
                        onClick={() => setQuantity(prev => prev + 1)}
                    ><AiFillCaretRight /></span>
                </div>
            </div>
        </div>
    )
}

export default memo(OrderItem)