import React, { useState, useEffect } from 'react'
import { apiLogin, apiRegister } from '../../apis/user'
import { useDispatch, useSelector } from 'react-redux'
import actionTypes from '../../store/actions/actionTypes'
import { useNavigate, useLocation } from 'react-router-dom'
import path from '../../utils/path'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        name: ''
    })
    const [isLogin, setIsLogin] = useState(() => location.state?.register ? false : true)
    const { isLoggedIn } = useSelector(state => state.auth)
    const { anonmyousCart } = useSelector(state => state.app)

    useEffect(() => {
        if (isLoggedIn)
            navigate('/he-thong/thong-ke')
    }, [isLoggedIn])

    const handleSubmit = async () => {
        if (isLogin) {
            dispatch({ type: actionTypes.LOADING, flag: true })
            const response = await apiLogin({ email: payload.email, password: payload.password, carts: anonmyousCart })
            dispatch({ type: actionTypes.LOADING, flag: false })
            if (response.err === 0) {
                dispatch({ type: actionTypes.LOGIN, accessToken: response.accessToken, isLoggedIn: true })
                setPayload({
                    email: '',
                    password: '',
                    name: ''
                })
            } else {
                dispatch({
                    type: actionTypes.ALERT, alert: response.rs, callback: () => {
                        dispatch({ type: actionTypes.ALERT, alert: '' })
                    }
                })
            }
        } else {
            dispatch({ type: actionTypes.LOADING, flag: true })
            const response = await apiRegister(payload)

            dispatch({ type: actionTypes.LOADING, flag: false })

            if (response.err === 0) {
                dispatch({
                    type: actionTypes.ALERT,
                    alert: response.mes,
                    callback: () => {
                        dispatch({ type: actionTypes.ALERT, alert: '' })
                        navigate('/')
                    }
                })
                setPayload({
                    email: '',
                    password: '',
                    name: ''
                })
            }
        }
    }
    return (
        <div className='w-full h-[90vh] flex justify-center bg-white'>
            <div className='w-main flex'>
                <div className='w-1/3 flex-auto flex justify-center items-center'>
                </div>
                <div className='flex-auto flex flex-col justify-center gap-4 w-1/3'>
                    <h3 className='font-bold text-[24px] text-center'>Đăng nhập</h3>    
                    <input
                        type="text"
                        className='p-2 bg-gray-100 border rounded-md placeholder:italic placeholder:text-gray-700'
                        placeholder='Nhập email'
                        value={payload.email}
                        onChange={e => setPayload(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <input
                        type="password"
                        className='p-2 bg-gray-100 border rounded-md placeholder:italic placeholder:text-gray-700'
                        placeholder='Nhập mật khẩu'
                        value={payload.password}
                        onChange={e => setPayload(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                        type='button'
                        className='px-4 py-2 mx-auto bg-blue-500 text-white rounded-md font-semibold w-fit  '
                        onClick={handleSubmit}
                    >
                        Đăng nhập
                    </button>
                </div>
                <div className='w-1/3 flex-auto flex justify-center items-center'>
                </div>
            </div>
        </div>
    )
}

export default Login