import React from "react";
import ReactToPrint from "react-to-print";

class PrintCard extends React.Component {
  handlePrint = () => {
    window.print();
  };
  render() {
    const { closeModal,text} = this.props;

  
    const modalStyle = {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      backgroundColor: "white",
      width: "80%",
      maxWidth: "80%",
      margin: "0 auto",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: "9999",
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

    return (
      <div style={modalStyle}>
        <h2 style={{textAlign:"center", justifyContent:"center" , fontWeight:"bold", fontSize:"25px"}}>{text}</h2>

       
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

export default PrintCard;
