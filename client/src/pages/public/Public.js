import React from 'react'
import { Outlet } from 'react-router-dom'


const Public = () => {
    
    return (
        <div className='w-full h-full relative'>
            <div className='w-full bg-repeat-y bg-contain relative bg-white' >
                <div className='fixed z-50 top-0 w-full bg-main shadow-xl text-white'>
                </div>

                <div className='w-full h-full'>
                    <div className='w-full h-16'></div>
                    <div className='w-full h-full'>
                        <Outlet />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Public