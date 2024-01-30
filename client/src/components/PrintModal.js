import React from "react";
import ReactToPrint from "react-to-print";
import { formatLocalTime } from "../utils/fn";

class PrintModal extends React.Component {
  handlePrint = () => {
    window.print();
  };
  render() {
    const { selectedItems, formData, closeModal, data ,text} = this.props;
console.log("data",data)

    const modalStyle = {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      backgroundColor: "white",
      width: "80%",
      maxWidth: "100%",
      margin: "0 auto",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: "9999",
    };

    const printStyle = {
      width: "100%", // Set the width to 100% for printing
    };

    const infoSectionStyle = {
      marginBottom: "20px",
    };

    const infoTextStyle = {
      margin: "5px 0",
    };

    const tableStyle = {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    };

    const tableCellStyle = {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    };

    const tableHeaderStyle = {
      backgroundColor: "#f2f2f2",
    };

    const buttonSectionStyle = {
      display: "flex",
      justifyContent: "space-between",
    };

    const buttonStyle = {
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
    };

    const printButtonStyle = {
      ...buttonStyle,
      backgroundColor: "#4caf50",
      color: "white",
    };

    const closeButtonStyle = {
      ...buttonStyle,
      backgroundColor: "#f44336",
      color: "white",
    };

    const dateString = formatLocalTime(formData.date)
    const [day, month, year] = dateString.split('/').map(Number);

    return (
      <div style={{...modalStyle,...printStyle }}>
        <h2 style={{textAlign:"center", justifyContent:"center" , fontWeight:"bold", fontSize:"25px"}}>{text}</h2>

        <div style={infoSectionStyle}>
          <p style={infoTextStyle}>
            <strong>Người giao:</strong> {formData.shipper}
          </p>
          <p style={infoTextStyle}>
            <strong>Người nhận:</strong> {formData.user}
          </p>
          <p style={infoTextStyle}>
          {/* formatLocalTime(formData.date) */}
            <strong>Ngày Nhập:</strong> {formatLocalTime(formData.date)}
          </p>
          <p style={infoTextStyle}>
            <strong>Diễn giải:</strong> {formData.note}
          </p>
        </div>

        {data?.rows && (
          <div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...tableCellStyle, ...tableHeaderStyle }}>ID</th>
                  {/* <th style={{ ...tableCellStyle, ...tableHeaderStyle }}>Ảnh</th> */}
                  <th style={{ ...tableCellStyle, ...tableHeaderStyle }}>Tên sản phẩm</th>
                  <th style={{ ...tableCellStyle, ...tableHeaderStyle }}>Số lượng</th>
                  <th style={{ ...tableCellStyle, ...tableHeaderStyle }}>Diễn giải</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => {
                  const product = data?.rows.find((product) => product.id === item.value);

                  return (
                    <tr key={index}>
                      <td style={tableCellStyle}>{item.value}</td>
                      {/* <td style={tableCellStyle}>
                        <img
                          src={product.thumb}
                          alt="ảnh sản phẩm"
                          style={{ height: "50px", objectFit: "contain" }}
                        />
                      </td> */}
                      <td style={tableCellStyle}>{product?.name}</td>
                      <td style={tableCellStyle}>{item.quantity}</td>
                      <td style={tableCellStyle}>{item.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        
        <div style={{ marginTop: "20px" }}>
      <p style={{ textAlign: "right", marginBottom: "10px",marginRight :"5%"}}>
      {` Ngày ${day} Tháng ${month} Năm ${year}`} 
      </p>
    
   
    <div style={{ textAlign: "right", marginRight :"5%" }}>
        Ký xác nhận của người giao hàng
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <div style={{ textAlign: "right", marginRight :"5%" }}>
        Ký xác nhận của người nhận hàng
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>

        <div style={buttonSectionStyle}>
          <button style={{ ...printButtonStyle }} onClick={this.handlePrint}>
            In Phiếu
          </button>
          <button style={{ ...closeButtonStyle }} onClick={closeModal}>
            Đóng
          </button>
        </div>
      </div>
    );
  }
}

export default PrintModal;
