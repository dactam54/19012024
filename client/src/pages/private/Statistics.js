import React, { useEffect, useState } from 'react'
import icons from '../../utils/icons'
import { apiGetDashBoard , apiGetProductsAdmin, apiGetImportBills, apiGetAllPhieuNhap, apiGetAllPhieuXuat} from '../../apis/product'
import { ProductChart } from '../../components'
import { Doughnut } from 'react-chartjs-2';
import { apiGetBrands } from '../../apis';
import { set } from 'date-fns';
const { HiUserGroup, BsCartFill, GrMoney } = icons

const Statistics = () => {
    const [data, setData] = useState(null)
    const [total, setTotal] = useState(null)
    const [brand, setBrands] = useState(null);
    const [importBill, setImportBill] = useState(null);
    const [exportBill, setExportBill] = useState(null);

    


    console.log('datachart',data?.statusChart)
    const [isMonth, setIsMonth] = useState(false)
    const [customTime, setCustomTime] = useState({
        from: '',
        to: ''
    })
   
    const fetchDashboard = async (params) => {
        const response = await apiGetDashBoard(params)
        if (response.err === 0) setData(response.rs)
    }
    const fetchBrands = async () => {
        const rs = await apiGetBrands();
        if (rs.err === 0) setBrands(rs.brandDatas?.length);
      };

    const fetchImportBills = async () => {
        const response1 = await apiGetAllPhieuNhap();
        setImportBill(response1);
        const response2 = await apiGetAllPhieuXuat();
        setExportBill(response2);

    }

   useEffect(() => {
    fetchBrands()
    fetchImportBills()
},[])

    const fetchProducts = async () => {
    const response = await apiGetProductsAdmin({ page: 1 })
    if (response.err === 0) setTotal(response.productDatas)
    }

    useEffect(() => {
        const type = isMonth ? 'month' : 'day'
        const params = { type }
        if (customTime.from) params.from = customTime.from
        if (customTime.to) params.to = customTime.to
        fetchDashboard(params)
        fetchProducts()
    }, [isMonth, customTime])
    
    const handleCustomTime = () => {
        setCustomTime({ from: '', to: '' })
    }

    console.log('customTime',customTime )

    return (
        <div className='relative'>
            <div className='flex items-center justify-between border-b border-gray-800'>
                <h3 className='font-bold text-[30px] pb-4 '>Tổng quan</h3>
            </div>
            <div className='pt-8'>
                <div className='flex gap-4 items-center'>

                  <div className='flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between'>
                        <span className='flex flex-col'>
                            <span className='text-[24px] text-main'>{total?.count || 0}</span>
                            <span className='text-sm text-gray-500'>Số lượng sản phẩm</span>
                        </span>
                        <BsCartFill size={30} />
                    </div>
                    
                    <div className='flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between'>
                        <span className='flex flex-col'>
                            <span className='text-[24px] text-main'>{brand}</span>
                            <span className='text-sm text-gray-500'>Số lượng nhãn hiệu</span>
                        </span>
                        <BsCartFill size={30} />
                    </div>

                    <div className='flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between'>
                        <span className='flex flex-col'>
                            <span className='text-[24px] text-main'>{importBill?.length}</span>
                            <span className='text-sm text-gray-500'>Số phiếu nhập</span>
                        </span>
                        <BsCartFill size={30} />
                    </div>
                    <div className='flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between'>
                        <span className='flex flex-col'>
                            <span className='text-[24px] text-main'>{exportBill?.length}</span>
                            <span className='text-sm text-gray-500'>Số lượng xuất</span>
                        </span>
                        <BsCartFill size={30} />
                    </div>
                    
                </div>

                <div className='flex gap-4 mt-8 bg-white'>
                    <div className='w-[70%] border shadow-md flex flex-col gap-4 relative rounded-md flex-auto p-4'>
                        <div className='flex items-center justify-between'>
                            <span className='font-bold flex items-center gap-8'>
                                <span>{`Số sản phẩm đã xuất theo ${isMonth ? 'tháng' : 'ngày'}`}</span>
                                <div className='flex items-center font-thin gap-8'>
                                    <span className='flex items-center gap-2'>
                                        <label htmlFor="from">Từ</label>
                                        <input type="date" value={customTime.from} onChange={e => setCustomTime(prev => ({ ...prev, from: e.target.value }))} id="from" />
                                    </span>
                                    <span className='flex items-center gap-2'>
                                        <label htmlFor="from">Đến</label>
                                        <input type="date" value={customTime.to} onChange={e => setCustomTime(prev => ({ ...prev, to: e.target.value }))} id="to" />
                                    </span>
                                    <button
                                        type='button'
                                        className={`px-4 py-2 rounded-md bg-blue-500 text-white`}
                                        onClick={handleCustomTime}
                                    >
                                        Xem mặc định
                                    </button>
                                </div>
                            </span>
                            <span className='flex items-center gap-4'>
                                <button
                                    type='button'
                                    className={`px-4 py-2 rounded-md border hover:border-red-600 ${isMonth ? '' : 'text-white font-semibold bg-main'}`}
                                    onClick={() => setIsMonth(false)}
                                >
                                    Ngày
                                </button>
                                <button
                                    type='button'
                                    className={`px-4 py-2 rounded-md border hover:border-red-600 ${isMonth ? 'text-white font-semibold bg-main' : ''}`}
                                    onClick={() => setIsMonth(true)}
                                >
                                    Tháng
                                </button>
                            </span>
                        </div>
                        {data?.soldProducts && <ProductChart customTime={customTime} isMonth={isMonth} data={data?.soldChart} />}
                    </div>

                    <div className='w-[30%] bg-white flex-auto border shadow-md flex flex-col gap-4 relative rounded-md p-4'>
                        <span className='font-bold'>Tỉ lệ</span>
                        <span className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                            <span className='flex flex-col text-sm gap-1 items-center justify-center font-bold'>
                                <span>Tổng đơn hàng</span>
                                <span>{importBill?.length + +exportBill?.length}</span>
                            </span>
                        </span>


                        <Doughnut
                            options={{
                                plugins: {
                                    legend: { position: 'bottom' }
                                }
                            }}
                            data={{
                                labels: [importBill?.length + ' Đã nhập', exportBill?.length + ' Đã xuất'],
                                datasets: [
                                    {
                                        data: [importBill?.length, exportBill?.length],
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.2)',
                                            'rgba(255, 189, 60, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(255, 159, 64, 1)',
                                            'rgba(75, 192, 192, 1)',
                                        ],
                                        borderWidth: 1,
                                    }
                                ]
                            }}
                        />
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Statistics