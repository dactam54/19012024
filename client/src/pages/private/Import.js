// Import.jsx

import React, { useEffect, useRef, useState } from "react";
import { apiGetProductsAdmin, apiImportManyProducts } from "../../apis";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { GrLinkPrevious } from "react-icons/gr";
import { MdOutlineClear } from "react-icons/md";
import Xlsx from "../../utils/Xlsx";
const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const tableCellStyle1 = {
  padding: "8px",
  textAlign: "left",
  position: 'sticky',
  top: "-1px", 
  zIndex: 100,
  backgroundColor: "#ddd"
};

const labelStyle = {
  display: "block",
  margin: "10px 0",
  fontWeight: "bold",
};

const inputStyle = {
  width: "300px",
  padding: "8px",
  margin: "20px 20px 10px 20px",
  boxSizing: "border-box",
  border: "1px solid #999",
  borderRadius: "10px",
};

const flexContainerStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const Import = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    shipper: "",
    user: "",
    date: "",
    note: "",
  });
 
  console.log("selectedItems",selectedItems)
  const quantityInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    if (response.err === 0) setData(response.productDatas);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data?.rows?.filter(
        (item) => item?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // const handleDropdownChange = (event) => {
  //   const value = event.target.value;
  //   setSelectedValue(value);
  // };

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    const selectedItem = data?.rows.find((item) => item.id === value);
    if (selectedItem) {
      const { id, name } = selectedItem;
      console.log("Selected ID:", id);
      console.log("Selected Name:", name);
      setSelectedValue(value);
    }
  };
  

  useEffect(() => {
    if (selectedValue) {
      const existingItemIndex = selectedItems.findIndex(
        (item) => item.value === selectedValue
      );
      if (existingItemIndex !== -1) {
        setSelectedValue("");
        quantityInputRef.current.focus();
      } else {
        setSelectedItems((prevItems) => [
          ...prevItems,
          {
            value: selectedValue,
            quantity: 1,
            note: "",
          },
        ]);
        setSelectedValue("");
      }
    }
  }, [selectedValue, selectedItems]);

  const handleQuantityChange = (value, index) => {
    setSelectedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = value;
      return updatedItems;
    });
  };
  const handleClearSearch = () => {
    setSearchTerm("");
  }

  const handleDeleteItem = (index) => {
    setSelectedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    const response = await apiImportManyProducts({
      hoaDons: selectedItems?.map((item) => ({
        productId: item.value,
        quantity: parseInt(item.quantity),
        note: item.note,
      })),
      ...formData,
      date: new Date(formData?.date),
    });

    if (response?.id) {
      toast.success("Nhập hàng thành công");
      setFormData({
        shipper: "",
        user: "",
        date: "",
        note: "",
      });

      setSelectedItems([]);
      fetchProducts();
      handleExcel();
      navigate("/he-thong/thong-tin-kho");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNoteChange = (value, index) => {
    setSelectedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].note = value;
      return updatedItems;
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = data?.rows?.filter(
      (item) => item?.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const isImportButtonDisabled =
    !(formData.shipper.trim() && 
      formData.user.trim() && 
      formData.date.trim() && 
      selectedItems.length > 0 && 
      selectedItems.every(item => item.value.trim() && item.quantity > 0)
    );

  const buttonClass = `py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2 ${
    isImportButtonDisabled
      ? "bg-gray-400 text-gray-600"
      : "bg-green-600 text-white"
  }`;

  const buttonClass1= `py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2 ${ "bg-green-600 text-white"}`;

  const handleAddProduct = (selectedProduct) => {
    setSelectedItems((prevItems) => [
      ...prevItems,
      {
        value: selectedProduct.id,
        quantity: 1,
        note: "",
      },
    ]);
    setSelectedValue("");
  };


  const handleExcel = async () => {
    // try {
    //   if (selectedItems && selectedItems.length > 0) {
    //     const exportData = selectedItems.map((item, index) => {
    //       const product = data?.rows.find((product) => product.id === item.value);

    //       return {
    //         "Người giao": formData.shipper,
    //         "Người nhận": formData.user,
    //         "Ngày Nhập": formData.date,
    //         "Diễn giải": item.note,
    //         STT: index + 1,
    //         ID: item.value,
    //         "Ảnh sản phẩm": product?.thumb,
    //         "Tên sản phẩm": product?.name,
    //         "Số lượng": item.quantity,
    //         "Diễn giải": item.note,
    //       };
    //     });

    //     await Xlsx.exportExcel([...exportData,], "Phiếu nhập", "Phiếu nhập");
    //   }
    // } catch (error) {
    //   console.error("Error exporting to Excel:", error);
    // }

    try {
      if (selectedItems && selectedItems.length > 0) {
        const exportData = [];
        exportData.push({ "Thông tin": "Người giao", "Dữ liệu": formData.shipper });
        exportData.push({ "Thông tin": "Người nhận", "Dữ liệu": formData.user });
        exportData.push({ "Thông tin": "Ngày Nhập", "Dữ liệu": formData.date });
        exportData.push({ "Thông tin": "Diễn giải", "Dữ liệu": formData.note });
        selectedItems.forEach((item, index) => {
          const product = data?.rows.find((product) => product.id === item.value);
          exportData.push({
            STT: index + 1,
            ID: item.value,
            "Ảnh sản phẩm": product?.thumb,
            "Tên sản phẩm": product?.name,
            "Số lượng": item.quantity,
          });
        });

        await Xlsx.exportExcel([...exportData,], "Phiếu xuất", "Phiếu xuất");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  
  return (
    <div>
      <div onClick={() => navigate("/he-thong/thong-tin-kho")} style={{ cursor: "pointer" }}>
        <GrLinkPrevious size={25} />
      </div>
      <h3 style={{ textAlign: "center" }} className="font-bold text-[30px] pb-2">
        Phiếu nhập
      </h3>

      <div style={flexContainerStyle}>
        <label htmlFor="shipper" style={labelStyle}>
          Người giao :
        </label>
        <input
          type="text"
          id="shipper"
          name="shipper"
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      <div style={flexContainerStyle}>
        <label htmlFor="user" style={labelStyle}>
          Người nhận :
        </label>
        <input
          type="text"
          id="user"
          name="user"
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      <div style={flexContainerStyle}>
        <label htmlFor="date" style={labelStyle}>
          Ngày Nhập:
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      <div style={flexContainerStyle}>
        <label htmlFor="note" style={labelStyle}>
          Diễn giải :
        </label>
        <textarea
          type="text"
          id="note"
          name="note"
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      {/* <div style={flexContainerStyle}>
        <label htmlFor="note" style={labelStyle}>
          Tìm kiếm :
        </label>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={inputStyle}
        />
        <MdOutlineClear />
      
      </div> */}

      <div style={flexContainerStyle}>
  <label htmlFor="note" style={labelStyle}>
    Tìm kiếm :
  </label>
  <div style={{ position: 'relative', width: '300px' }}>
    <input
      type="text"
      placeholder="Tìm kiếm sản phẩm"
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      style={{ ...inputStyle, paddingRight: '30px' }}  
    />
    <MdOutlineClear
      style={{
        position: 'absolute',
        top: '40%',
        right: '-20px',
        fontSize: '20px',
        transform: 'translate(-50%)',
        cursor: 'pointer',
        // border:'1px solid black'
      }}
      onClick={() => handleClearSearch()} 
    />
  </div>
</div>


      {searchTerm && (
        <div className="search-results" style={{ overflowY: "auto", maxHeight: "150px", minWidth:"150px", maxWidth: "600px", border:"1px solid black", marginTop:"10px" , marginBottom :"10px" }}>
          <table>
            <tbody >
              {filteredData?.map((item, index) => (
                <tr key={item.id} onClick={() => handleAddProduct(item)} style={{border :"1px solid black" , cursor :"pointer" , }}>
                <td style={{  backgroundColor: "white" , borderRight :"1px solid black" , padding:"5px"}} onMouseOver={(e) => e.target.style.backgroundColor = "#e6e6e6"} onMouseOut={(e) => e.target.style.backgroundColor = "white"}>
                <img
                                src={item.thumb}
                                alt="ảnh sản phẩm"
                                className="h-[30px] object-contain"
                              />
                </td>
                <td style={{  backgroundColor: "white" }} onMouseOver={(e) => e.target.style.backgroundColor = "#e6e6e6"} onMouseOut={(e) => e.target.style.backgroundColor = "white"}>
                {item.name}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <select
        onChange={handleDropdownChange}
        value={selectedValue}
        style={{ border: "1px solid black", borderRadius: "10px" }}
      >
        <option value="">Chọn hàng hóa</option>
        {searchTerm
          ? filteredData?.map((item) => (
              <option key={item.id} value={item.id}>
                {item?.name}
              </option>
            ))
          : data?.rows?.map((item) => (
              <option key={item.id} value={item.id}>
                {item?.name}
              </option>
            ))}
      </select>
      {selectedValue && <p>Selected Value: {selectedValue}</p>}

      {/* {selectedItems.length > 0 && (
        <div style={{ overflowY: "auto", maxHeight: "300px", border:"1px solid black", marginTop:"20px"  }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={tableCellStyle1}>ID</th>
                <th style={{ ...tableCellStyle1, width:"100px"}}>Số lượng</th>
                <th style={tableCellStyle1}>Diễn giải</th>
                <th style={{ ...tableCellStyle1, width:"100px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{item.value}</td>
                  <td style={tableCellStyle}>
                    <input
                      ref={
                        index === selectedItems.length - 1
                          ? quantityInputRef
                          : null
                      }
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value), index)
                      }
                      min={1}
                      style={{ width: "70px", padding: "2px"}}
                    />
                  </td>
                  <td style={tableCellStyle}>
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) => handleNoteChange(e.target.value, index)}
                      style={{ width: "100%", padding: "2px"}}
                    />
                  </td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <button onClick={() => handleDeleteItem(index)}>
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
      
      {selectedItems.length > 0 && (
  <div style={{ overflowY: "auto", maxHeight: "300px", border: "1px solid black", marginTop: "20px" }}>
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={tableCellStyle1}>ID</th>
          <th style={tableCellStyle1}>Ảnh</th>
          <th style={tableCellStyle1}>Tên sản phẩm</th>
          <th style={{ ...tableCellStyle1, width: "100px" }}>Số lượng</th>
          <th style={tableCellStyle1}>Diễn giải</th>
          
          <th style={{ ...tableCellStyle1, width: "100px" }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {selectedItems.map((item, index) => {
          const product = data?.rows.find((product) => product.id === item.value);

          return (
            <tr key={index}>
              <td style={tableCellStyle}>{item.value}</td>
              <td style={tableCellStyle}>
                              <img
                                src={product.thumb}
                                alt="ảnh sản phẩm"
                                className="h-[50px] object-contain"
                              />
                           
              </td>
              <td style={tableCellStyle}>{product?.name}</td>
              <td style={tableCellStyle}>
                <input
                  ref={index === selectedItems.length - 1 ? quantityInputRef : null}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value), index)}
                  min={1}
                  style={{ width: "70px", padding: "2px" }}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="text"
                  value={item.note}
                  onChange={(e) => handleNoteChange(e.target.value, index)}
                  style={{ width: "100%", padding: "2px" }}
                />
              </td>
              {/* <td style={tableCellStyle}>{item.value}</td> */}
              <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                <button onClick={() => handleDeleteItem(index)}>
                  <MdDelete size={18} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}



      <div className="flex justify-center py-4">
        <Button
          onClick={handleImport}
          disabled={isImportButtonDisabled}
          className={buttonClass}
          style={{ marginTop: "20px" }}
          variant="contained"
          color="success"
        >
          <span>Nhập hàng</span>
        </Button>

        <Button
          onClick={() => {
            navigate("/he-thong/thong-tin-kho");
          }}
          className={buttonClass1}
          style={{ marginTop: "20px", marginLeft: "20px" }}
          variant="contained"
          color="success"
        >
          <span>Hủy phiếu</span>
        </Button>

        <Button
          onClick={handleExcel}
          className={buttonClass1}
          disabled={isImportButtonDisabled}
          style={{ marginTop: "20px", marginLeft: "20px" }}
          variant="contained"
          color="success"
        >
          <span>Xuất Excel</span>
        </Button>

        
        
      </div>
    </div>
  );
};

export default Import;
