import React, { useEffect, useRef, useState } from "react";
import { apiGetProductsAdmin, apiImportManyProducts } from "../../apis";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};


const tableCellStyle1 = {
  border: "1px solid black",
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

  const quantityInputRef = useRef(null);
  console.log("selectedItems", selectedItems);
  console.log("selectedValue", selectedValue);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    if (response.err === 0) setData(response.productDatas);
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  const navigate = useNavigate();
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
      note: formData.note,
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
      navigate("/he-thong/lich-su-phieu");
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

  const [formData, setFormData] = useState({
    shipper: "",
    user: "",
    date: "",
    note: "",
  });
  // const isImportButtonDisabled =
  //   formData.shipper.trim() === "" ||
  //   formData.user.trim() === "" ||
  //   formData.date.trim() === "" ||
  //   selectedItems.length === 0;

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
  return (
    <div >
      <h3
        style={{ textAlign: "center" }}
        className="font-bold text-[30px] pb-2"
      >
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
          value={formData.shipper}
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
          value={formData.user}
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
          value={formData.date}
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
          value={formData.note}
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      <select
        onChange={handleDropdownChange}
        value={selectedValue}
        style={{ border: "1px solid black", borderRadius: "10px" }}
      >
        <option value="">Chọn hàng hóa</option>
        {data?.rows?.map((item) => (
          <option key={item.id} value={item.id}>
            {item?.name}
          </option>
        ))}
      </select>
      {selectedValue && <p>Selected Value: {selectedValue}</p>}

      {selectedItems.length > 0 && (
        <div style={{ overflowY: "auto", maxHeight: "300px", border:"1px solid black", marginTop:"20px"  }}>
        <table style={{ borderCollapse: "collapse", width: "100%",}}>
          <thead>
            <tr>
              <th style={tableCellStyle1 }>ID</th>
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
      </div>
    </div>
  );
};

export default Import;

