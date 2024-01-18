import React, { memo, useState } from 'react'
import { InputField } from './'
import icons from '../utils/icons'
import { getBase64 } from '../utils/fn'
import { apiCreateBrandByAdmin } from '../apis'
import { useDispatch } from 'react-redux'
import actionTypes from '../store/actions/actionTypes'
import { toast } from 'react-toastify'
const { AiOutlineCloudUpload } = icons
const CreateNewBrand = ({ setIsCreate, setRender }) => {
    const [payload, setPayload] = useState({
        name: '',
        image: ''
    })
    const [previewImg, setPreviewImg] = useState('')
    const dispatch = useDispatch()
    const handleChangeFile = async (e) => {
        setPayload(prev => ({ ...prev, image: e.target.files[0] }))
        const base64 = await getBase64(e.target.files[0])
        setPreviewImg(base64)
    }
    const handleCreate = async () => {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('image', payload.image)
        dispatch({ type: actionTypes.LOADING, flag: true })
        const rs = await apiCreateBrandByAdmin(formData)
        dispatch({ type: actionTypes.LOADING, flag: false })
        if (rs.err === 0) {
            setIsCreate(false)
            setRender(prev => !prev)
            toast.success('Thêm nhãn hiệu thành công!')

        }
        
    }
    return (
        <div className='relative flex flex-col items-center'>
            <div className='flex w-full items-center justify-between border-b border-gray-800'>
                <h3 className='font-bold text-[30px] pb-4 '>Tạo mới nhãn hiệu</h3>
                <button
                    type='button'
                    onClick={() => setIsCreate(false)}
                    className='py-2 px-4 bg-orange-600 rounded-md text-white font-semibold flex items-center justify-center gap-2'
                >
                    <span>Hủy bỏ</span>
                </button>
            </div>
            <div className='w-[60%] py-4 mt-8'>
                <InputField
                    setValue={setPayload}
                    nameKey='name'
                    value={payload.name}
                    preValue='Tên nhãn hiệu: '
                />
            </div>
            <div className='flex gap-4 w-[60%]'>
                <label htmlFor="file" className='bg-main flex gap-2 items-center rounded-md py-2 px-4 text-white font-semibold'>
                    <AiOutlineCloudUpload size={20} />
                    <span>Tải ảnh</span>
                </label>
                {previewImg ? <div className='flex flex-col'>
                    <span className='font-semibold'>Preview:</span>
                    <img src={previewImg} alt="preview-image" className='w-[240px] h-[60px] object-cover border shadow-md' />
                </div> : <span>Để ảnh không bị cắt xén, tốt nhất tỷ lệ kích thướt ảnh là 4:1 </span>}
                <input
                    type='file'
                    className='border px-2 py-1 w-full'
                    id='file'
                    value=''
                    hidden
                    onChange={handleChangeFile}
                />
            </div>
            <div className='py-4 mt-8 w-[60%]'>
                <button
                    type='button'
                    onClick={handleCreate}
                    className='py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2'
                >
                    <span>Tạo mới</span>
                </button>
            </div>
        </div>
    )
}

export default memo(CreateNewBrand)