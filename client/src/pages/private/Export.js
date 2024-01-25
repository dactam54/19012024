import React, { useEffect, useRef, useState } from "react";
import { apiGetProductsAdmin, apiExportManyProducts } from "../../apis";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
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

const Export = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
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
    const response = await apiExportManyProducts({
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
        note :""
      });
      setSelectedItems([]);
      fetchProducts();
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


  const buttonClass = `py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2 ${
    selectedItems.length === 0 ? "bg-gray-400 text-gray-600" : "bg-green-600 text-white"
  }`;
  return (
    <div>
      <div style={flexContainerStyle}>
        <label htmlFor="shipper" style={labelStyle}>Người giao :</label>
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
        <label htmlFor="user" style={labelStyle}>Người nhận :</label>
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
        <label htmlFor="date" style={labelStyle}>Ngày Nhập:</label>
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
        <label htmlFor="note" style={labelStyle}>Diễn giải :</label>
        <textarea
          type="text"
          id="note"
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>

      <select onChange={handleDropdownChange} value={selectedValue} style={{border:'1px solid black', borderRadius:'10px'}}>
        <option value="">Chọn hàng hóa</option>
        {data?.rows?.map((item) => (
          <option key={item.id} value={item.id}>
            {item?.name}
          </option>
        ))}
      </select>
      {selectedValue && <p>Selected Value: {selectedValue}</p>}

     

      {selectedItems.length > 0 && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={tableCellStyle}>Item</th>
              <th style={tableCellStyle}>Quantity</th>
              <th style={tableCellStyle}>Note</th>
              <th style={tableCellStyle}>Actions</th>
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
                    style={{ width: "50px" }}
                  />
                </td>
                <td style={tableCellStyle}>
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleNoteChange(e.target.value, index)}
                    style={{ width: "100%" }}
                  />
                </td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleDeleteItem(index)}>
                  <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
              type="button"
              onClick={handleImport}
              disabled={selectedItems.length === 0}
             className={buttonClass}

              // className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
              // style={{opacity: selectedItems.length === 0 ? 0.5 : 1, }}
              // disabled={selectedItems.length === 0}
            >
              <span>Export</span>
            </button>
    </div>
  );
};

export default Export;
