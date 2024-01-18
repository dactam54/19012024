import React, { useEffect, useState } from 'react'
import { apiGetBills,apiGetImportBills, apiGetProductsAdmin,apiGetDashBoard} from '../../apis'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.png';

const PDF = () => {

    const [bimport, setBimport] = useState(null)
    const [bexport, setBexport] = useState(null)
    const [totalExport, setTotalExport] = useState(0)
    const [totalImport, setTotalImport] = useState(0)
    const  [totalProduct, setTotalProduct] = useState(null)
    const [data, setData] = useState(null)
    
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [totalPreQuantity, setTotalPreQuantity] = useState(0)

    const fetchData = async () => {
        const response = await apiGetBills()
        if (response.err === 0) setBexport(response.rs.rows)
        setTotalExport(response.rs.rows.length)

        const response2 = await apiGetImportBills()
        if( response2.err === 0) setBimport(response2.rs.rows)
        setTotalImport(response2.rs.rows.length)
        setTotalQuantity(response2.rs.rows.reduce((total,el)=>total +el.billDetail[0].quantity,0))
         setTotalPreQuantity(response2.rs.rows.reduce((total,el)=>total +el.billDetail[0].preQuantity,0))
    // console.log('total123',response2.rs.rows.reduce((total,el)=>total +el.billDetail[0].quantity,0))
    // console.log('total123',response2.rs.rows.reduce((total,el)=>total +el.billDetail[0].preQuantity,0))

    // console.log('total12345',bimport.rs.rows.reduce((total,el)=>total +el.billDetail[0].quantity,0))

        const response3 = await apiGetProductsAdmin({ page: 1 })
        if (response.err === 0) setTotalProduct(response3.productDatas)
        
        const response4 = await apiGetDashBoard()
        if (response4.err === 0) setData(response4.rs)
        console.log(response4.rs)
    
    }


    useEffect(() => {
         fetchData()
    }, [])
    
    const [loader, setLoader] = useState(false);
let currentDate =new Date() 
let options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const downloadPDF = () =>{
      const capture = document.querySelector('.actual-receipt');
      setLoader(true);
      html2canvas(capture).then((canvas)=>{
        const imgData = canvas.toDataURL('img/png');
        const doc = new jsPDF('p', 'mm', 'a4');
        const componentWidth = doc.internal.pageSize.getWidth();
        const componentHeight = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
        setLoader(false);
        doc.save('baocao.pdf');
      })
    }
    return (
      <div className="wrapper">

      <div className="receipt-box">

          <div className="actual-receipt">

           
            <div className="receipt-organization-logo">
              <img alt="logo" src={logo} />
            </div>

          
            <h1>Báo cáo </h1>
            <div className="colored-row first">
              <span>Người tạo</span>
              <span>Admin</span>
            </div>
            <div className="colored-row first">
              <span>Ngày tạo</span>
              <span>{currentDate.toLocaleDateString('vn-VN', options)}</span>
            </div>

            <div className="data-row">
              <span className="font-weight">Số đơn nhập</span>
              <span>{totalImport}</span>
            </div>

            <div className="colored-row">
              <span>Số đơn xuất</span>
              <span>{totalExport}</span>
            </div>

            <div className="data-row">
              <span className="font-weight">Số lượng ban đầu</span>
              <span>{totalProduct?.rows.reduce((total,el)=>total +el.quantity,0) || 0}</span>
            </div>

            <div className="colored-row">
            <span>Số lượng nhập</span>
              <span>
              {totalQuantity -totalPreQuantity }
              </span>
             
            </div>

            <div className="data-row">
            <span className="font-weight">Số lượng xuất</span>
            <span>{data?.soldProducts || 0}</span>
            </div>

            <div className="colored-row">
            <span>Số lượng còn lại</span>
              <span>{(totalProduct?.rows.reduce((total,el)=>total +el.quantity,0) || 0)-(data?.soldProducts || 0)}  </span>
            </div>


          </div>
          <div className="receipt-actions-div">
            <div className="actions-right">
              <button
                className="receipt-modal-download-button"
                onClick={downloadPDF}
                disabled={!(loader===false)}
              >
                {loader?(
                  <span>Đang tải</span>
                ):(
                  <span>Tải xuống</span>
                )}

              </button> 
            </div>
          </div>
      </div>
    </div>
    )
}

export default PDF