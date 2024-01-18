import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actionTypes from '../store/actions/actionTypes'

const Alert = () => {
    const dispatch = useDispatch()
    const { alert, callback } = useSelector(state => state.app)
    console.log(alert)
    return (
        <div className='w-[500px] bg-white rounded-md p-4 flex flex-col items-center animate-scale-up-center'>
           
            <span className='text-[18px] font-bold'>Thông báo</span>
            <span className='mt-2 p-4 bg-gray-100 border rounded-md'>{`"${alert}"`}</span>
            <button
                type='button'
                className='bg-blue-500 text-white rounded-md py-2 px-4 mt-8 font-semibold'
                onClick={() => {
                    dispatch({ type: actionTypes.ALERT, alert: '' })
                    if (callback) callback()
                }}
            >
                OK
            </button>
        </div>
    )
}

export default memo(Alert)