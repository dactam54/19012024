import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetProductById } from '../../apis/product'
import { renderStar, formatNumber } from '../../utils/fn'
import { Images, BuyOptions, Section, Specification} from '../../components'
import DOMPurify from "dompurify";
import icons from '../../utils/icons'
const { AiFillCaretDown, AiFillCaretUp } = icons

const Detail = () => {
    const { pid } = useParams()
    const [product, setProduct] = useState(null)
    const [sku, setSku] = useState(null)
    const [isViewMore, setIsViewMore] = useState(false)
    const [isShowFullSpec, setIsShowFullSpec] = useState(false)
    const [isVote, setIsVote] = useState(false)
    const [render, setRender] = useState(false)
    const fetchProduct = async () => {
        const response = await apiGetProductById(pid)
        if (response.err === 0) setProduct(response.productDatas)
    }
    useEffect(() => {
        if (!isVote || pid) fetchProduct()
        window.scrollTo(0, 0)
    }, [pid, isVote, render])
    useEffect(() => {
        if (product) setSku(product?.variants[0]?.sku)
    }, [product])
    // console.log(product) 
    return (
        <div className='w-full relative bg-white mt-[30px]'>
    
            <div className='w-main h-fit m-auto py-4'>
                <div className='w-full flex items-center gap-1 pb-2 border-b-2 border-gray-200'>
                    <h2 className='text-[18px] font-bold'>{product?.name}</h2>
                    <span className='flex'>{renderStar(product?.star)?.map((item, index) => (<span key={index}>{item}</span>))}</span>
                    <span className='text-sm text-gray-500'>{`${formatNumber(product?.votes?.length)} đánh giá`}</span>
                </div>
                <div className='flex w-full pb-8 mt-4'>
                    <div className='w-[398px] pr-4 flex-none'>
                        <Images variants={product?.variants} sku={sku} />
                    </div>
                    <div className='flex-auto'>
                        <BuyOptions
                            variants={product?.variants}
                            setSku={setSku}
                            sku={sku}
                            discountNumber={product?.discount}
                            quantity={product?.quantity}
                            pid={pid}
                        />
                    </div>
                    <div className='w-[360px] flex-none pl-4'>
                        <div className='w-full bg-gray-100 border border-gray-300 rounded-md p-4'>
                            <h3 className='text-base font-bold text-[#444444]'>Thông tin sản phẩm</h3>
                            <ul className='mt-3 text-sm list-[square]'>
                                {typeof (product?.policy) === 'string' ? product?.policy : product?.policy?.map((item, index) => (
                                    <li key={index + 1000} className='ml-6 py-2'>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='w-full flex gap-4 pb-20'>
                    <div className={`w-[70%] relative bg-white rounded-md shadow-md p-4 border`}>
                        <div className='text-base font-bold mb-2'>Mô tả chi tiết sản phẩm</div>
                        <div
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.desc) }}
                            className={`w-full ${isViewMore ? 'overflow-auto' : 'h-[700px] overflow-hidden'}`}

                        ></div>
                        {!isViewMore && <div className='bg-gradient-to-t from-white to-transparent py-4 absolute flex justify-center bottom-0 left-0 right-0'>
                        </div>}
                        <div className='py-4 absolute shadow-md border-x border-b bg-white flex justify-center top-full left-[-1px] right-[-1px]'>
                            <button
                                type='button'
                                className='px-4 py-2 bg-white flex gap-1 items-center border shadow-md justify-center rounded-md'
                                onClick={() => setIsViewMore(prev => !prev)}
                            >
                                <span>{isViewMore ? 'Thu gọn' : 'Xem thêm'}</span>
                                <span>{isViewMore ? <AiFillCaretUp /> : <AiFillCaretDown />}</span>
                            </button>
                        </div>
                    </div>
                    <div className='w-[30%] flex-auto'>
                        <Specification
                            title='Thông số kỹ thuật'
                            setIsShowFullSpec={setIsShowFullSpec}
                            overviews={product?.overviews}
                        />
                        <div className='flex justify-center mt-4'>
                            <button
                                type='button'
                                onClick={() => {
                                    window.scrollTo(0, 0)
                                    setIsShowFullSpec(true)
                                }}
                                className='px-4 py-2 bg-white flex gap-1 items-center border hover:border-red-500 shadow-md justify-center rounded-md'
                            >
                                <span className='text-sm'> Xem chi tiết cấu hình</span>
                                <span><AiFillCaretDown /></span>
                            </button>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    )
}

export default Detail