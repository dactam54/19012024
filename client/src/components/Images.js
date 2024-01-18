import React, { memo, useState, useEffect } from 'react'
import Slider from "react-slick";

const Images = ({ variants, sku }) => {

    const settings = {
        arrows: false,
        dots: false,
        pauseOnHover: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        fade: false,
        variableWidth: false,
        slidesToShow: 7,
        slidesToScroll: 1,
        rows: 1
    }
    const [activeImage, setActiveImage] = useState(null)
    
    useEffect(() => {
        sku && setActiveImage(variants?.find(i => i.sku === sku)?.images[1][0])
    }, [sku])

    return (
        <div className='w-full'>
            <div className='bg-white border w-full h-[398px] rounded-lg flex justify-center items-center border-gray-300 p-4'>
                <img src={activeImage} alt="detail-images" className='w-full object-contain m-auto' />
            </div>
            <div className='mt-6 w-full h-[55px] overflow-y-hidden bg-white'>
                <Slider {...settings}>
                    {variants?.find(i => i.sku === sku)?.images[1]?.map(item => (
                        <span
                            key={item}
                            className='mr-1 outline-none'
                        >
                            <img
                                src={item.startsWith('https') ? item : `https:${item}`}
                                alt="image-item"
                                onClick={() => setActiveImage(item)}
                                className={`w-[50px] h-[50px] object-cover rounded-md border cursor-pointer ${activeImage === item ? 'border-red-400' : 'border-gray-200'}`}
                            />
                        </span>
                    ))}
                </Slider>
            </div>

        </div>
    )
}

export default memo(Images)