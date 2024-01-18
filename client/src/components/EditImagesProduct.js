import React, { memo, useState } from 'react'
import { getBase64 } from '../utils/fn'
import icons from '../utils/icons'
import { InputField } from './'
import { apiUpdateVariants } from '../apis'
import { toast } from 'react-toastify'

const { AiFillCamera } = icons

const EditImagesProduct = ({ setIsEditImage, isEditImage }) => {

    const [thumb, setThumb] = useState('')
    const [images, setImages] = useState('')
    
    const [payload, setPayload] = useState({
        thumb: '',
        images: '',
    })

    const handleThumb = async (e) => {
        setPayload(prev => ({ ...prev, thumb: e.target.files[0] }))
        const thumbBase64 = await getBase64(e.target.files[0])
        setThumb(thumbBase64)
    }

    const handleMutilImages = async (e) => {
        setPayload(prev => ({ ...prev, images: e.target.files }))
        const images = []
        for (let file of e.target.files) {
            const base64 = await getBase64(file)
            images.push(base64)
        }
        setImages(images)
    }

    const handleUpdateFiles = async () => {
        const formData = new FormData()
        if (payload.thumb) formData.append('thumb', payload.thumb)
        for (let i of payload.images)
            formData.append('images', i)
        const response = await apiUpdateVariants(isEditImage.id, formData)
        if (response.err === 0) {
            toast.success('Thêm biến thể thành công!')
            setThumb('')
            setImages('')
            setPayload({
                thumb: '',
                images: '',
            })
        } else {
            toast.error('Thêm biến thể thất bại!')
        }
    }
    return (
        <div className='absolute top-0 bottom-0 left-0 right-0 bg-white'>
            <h3 className='font-bold text-[30px] pb-4 '>Chỉnh sửa cho sản phẩm <span className='text-main'>{isEditImage.name}</span></h3>
            <div>
                <div className='flex flex-col gap-2 py-4'>
                    <span className='font-bold flex items-center gap-4'>
                        <span className='flex-1'>Ảnh đại diện sản phẩm:</span>
                        <span className='flex-1'>Preview:</span>
                    </span>
                    <div className='flex gap-4'>
                        <label className='w-full flex-1 border-2 h-[207px] gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md bg-gray-100' htmlFor="products">
                            <AiFillCamera size={60} color='gray' />
                            <span className='text-gray-500 italic text-xs'>Chỉ hỗ trợ cái file ảnh có đuôi mở rộng .JPG và .PNG</span>
                            <span className='text-gray-500 italic text-xs'>Chọn 1 ảnh</span>
                        </label>
                        <div className='flex-1'>
                            <img src={thumb} alt="" className='h-[207px] object-contain' />
                        </div>
                    </div>
                    <input type="file" id="products" hidden value='' onChange={handleThumb} />
                </div>
                <div className='flex flex-col gap-2 py-4'>
                    <span className='font-bold'>Các hình ảnh sản phẩm:</span>
                    <label className='w-full border-2 h-[200px] gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md bg-gray-100' htmlFor="images">
                        <AiFillCamera size={60} color='gray' />
                        <span className='text-gray-500 italic text-xs'>Chỉ hỗ trợ cái file ảnh có đuôi mở rộng .JPG và .PNG</span>
                        <span className='text-gray-500 italic text-xs'>Chọn tối đa 10 ảnh</span>
                    </label>
                    <div className='flex flex-wrap'>
                        {images && images?.map(el => (
                            <div className='w-1/4'>
                                <img src={el} alt="preview" className='h-[207px] object-contain' />
                            </div>
                        ))}
                    </div>
                    <input
                        type="file"
                        id="images"
                        hidden
                        multiple
                        onChange={handleMutilImages}
                    />
                </div>
                <div className='flex py-4 items-center w-full justify-end gap-4'>
                    <button
                        type='button'
                        onClick={() => setIsEditImage(null)}
                        className='py-2 px-4 bg-orange-600 rounded-md text-white font-semibold flex items-center justify-center gap-2'
                    >
                        <span>Hủy bỏ</span>
                    </button>
                    <button
                        type='button'
                        onClick={handleUpdateFiles}
                        className='py-2 px-4 bg-blue-600 rounded-md text-white font-semibold flex items-center justify-center gap-2'
                    >
                        <span>Cập nhật</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default memo(EditImagesProduct)