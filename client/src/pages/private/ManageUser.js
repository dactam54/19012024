import React, { useEffect, useState } from 'react'
import { apiGetUsers, apiUpdateUserByAdmin, apiDeleteUserByAdmin } from '../../apis/user'
import { toast } from 'react-toastify'

const cols = [
    'UserID',
    'Tên người dùng',
    'Email',
    'Chức vụ',
    'Thao tác'
]

const ManageUser = () => {
    const [users, setUsers] = useState(null)
    const [isEdit, setIsEdit] = useState('')
    const [payload, setPayload] = useState({
        name: '',
        email: '',
        role: '',
        
    })
    const [render, setRender] = useState(false)
    useEffect(() => {
        const fetchUsers = async () => {
            const rs = await apiGetUsers()
            if (rs.err === 0) setUsers(rs.rs)
        }
        !isEdit && fetchUsers()
    }, [isEdit, render])
    const handleEdit = (user) => {
        setPayload({
            name: user?.name || '',
            email: user?.email || '',
            role: user?.role || '',
        })
        setIsEdit(user.id)
    }
    const handleUpdate = async (id) => {
        const rs = await apiUpdateUserByAdmin(id, payload)
        if (rs.err === 0) {
            setIsEdit('')
            toast.success(rs.mes)
        }
        else toast.error(rs.mes)
    }
    const handleDelete = async (id) => {
        const rs = await apiDeleteUserByAdmin(id)
        if (rs.err === 0) {
            setRender(prev => !prev)
            toast.success(rs.mes)
        }
        else toast.error(rs.mes)
    }
    return (
        <div className='relative'>
            <div className='flex items-center justify-between border-b border-gray-800'>
                <h3 className='font-bold text-[30px] pb-4 '>Quản lý thành viên</h3>
            </div>
            <div className='py-4'>
                <div>
                    <span className='font-bold'>Sort by:</span>
                </div>

                <table className="table-auto w-full mt-4">
                    <thead>
                        <tr className='border-b border-t'>
                            {cols.map((el, index) => (
                                <td key={index} className='p-2 font-bold border border-solid border-gray-300 text-center'>{el}</td>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {users?.map((item, index) => (
                            <tr
                                key={item.id}
                            >
                                <td className={`p-2 ${index % 2 === 0 ? '' : 'bg-gray-100'} m-auto border border-solid border-gray-300`}>{index + 1}</td>
                                <td className={`p-2 ${index % 2 === 0 ? '' : 'bg-gray-100'} m-auto border border-solid border-gray-300`}>
                                    {isEdit !== item.id
                                        ? <span>{item.name}</span>
                                        : <input
                                            type='text'
                                            className='px-2 py-1 w-full border border-solid border-gray-300'
                                            value={payload.name}
                                            onChange={e => setPayload(prev => ({ ...prev, name: e.target.value }))}
                                        />}
                                </td>
                                <td className={`p-2 border border-solid border-gray-300 ${index % 2 === 0 ? '' : 'bg-gray-100'} m-auto `}>
                                    {isEdit !== item.id
                                        ? <span>{item.email}</span>
                                        : <input
                                            type='text'
                                            className='border px-2 py-1 w-full'
                                            value={payload.email}
                                            onChange={e => setPayload(prev => ({ ...prev, email: e.target.value }))}
                                        />}</td>
                                <td className={`p-2 border border-solid border-gray-300 ${index % 2 === 0 ? '' : 'bg-gray-100'} m-auto`}>
                                    {isEdit !== item.id
                                        ? <span>{item.role}</span>
                                        : <input
                                            type='text'
                                            className='border px-2 py-1 w-full '
                                            value={payload.role}
                                            onChange={e => setPayload(prev => ({ ...prev, role: e.target.value }))}
                                        />}</td>
                                
                                        
                                <td className='flex gap-2 pt-2 border border-solid border-gray-300'>
                                    {isEdit === item.id
                                        ? <span
                                            className='p-2 cursor-pointer text-main hover:underline'
                                            onClick={() => handleUpdate(item.id)}
                                        >Cập nhật</span>
                                        : <span
                                            className='p-2 cursor-pointer text-main hover:underline'
                                            onClick={() => handleEdit(item)}
                                        >Sửa</span>}
                                    <span
                                        className='p-2 cursor-pointer text-main hover:underline'
                                        onClick={() => handleDelete(item.id)}
                                    >Xóa</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageUser