import React, { useEffect, useRef, useState } from "react";
import { apiGetProductsAdmin, apiImportManyProducts } from "../../apis";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };
const Import = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState('');
//   const [selectedProductIds, setSelectedProductIds] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(1)
  const quantityInputRef = useRef(null);
console.log('selectedItems',selectedItems)
console.log('selectedValue',selectedValue)

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    if (response.err === 0) setData(response.productDatas);
    // const maxQuantityFromApi = response?.rows?.reduce((max, item) => (item.quantity > max ? item.quantity : max), 1);
    // setMaxQuantity(maxQuantityFromApi);

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
      const existingItemIndex = selectedItems.findIndex(item => item.value === selectedValue);
      if (existingItemIndex !== -1) {
        setSelectedValue('');
        quantityInputRef.current.focus();
      } else {
        setSelectedItems(prevItems => [
          ...prevItems,
          {
            value: selectedValue,
            quantity: 1,
            productId: selectedValue
          }
        ]);
        setSelectedValue('');
      }
    }
  }, [selectedValue, selectedItems]);

  const handleQuantityChange = (value, index) => {
    setSelectedItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = value;
      return updatedItems;
    });
  };

//  const handleQuantityChange = (value, index) => {
    
//     value = Math.min(Math.max(value, 1), maxQuantity);
//     setSelectedItems(prevItems => {
//       const updatedItems = [...prevItems];
//       updatedItems[index].quantity = value;
//       return updatedItems;
//     });
//   };
  const handleDeleteItem = (index) => {
    setSelectedItems(prevItems => prevItems.filter((_, i) => i !== index));
  };
  const handleImport = async () => {
    const response = await apiImportManyProducts({
      hoaDons: selectedItems?.map((item) => ({
        productId: item.name, 
        quantity: parseInt(item.quantity)
      })),
     
    });

    if (response?.id) {
      toast.success("Nhập hàng thành công");
      setSelectedItems([]);
      fetchProducts();
    }
  };
  return (
    <div>
      <select onChange={handleDropdownChange} value={selectedValue}>
        <option value="">Select an option</option>
        {data?.rows?.map(item => (
          <option key={item.id} value={item.name}>
            {item?.name}
          </option>
        ))}
      </select>
      {selectedValue && <p>Selected Value: {selectedValue}</p>}

      {/* <button onClick={handleAddItem}>Add Item</button> */}

      {/* {selectedItems.map((item, index) => (
        <div key={index}>
          <p>{item.value}</p>
          <input
            ref={index === selectedItems.length - 1 ? quantityInputRef : null}
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value), index)}
          />
        </div>
      ))} */}


      {selectedItems.length > 0 && (
        
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
            <th style={tableCellStyle}>Item</th>
              <th style={tableCellStyle}>Quantity</th>
              <th style={tableCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{item.value}</td>
                <td style={tableCellStyle}>
                  <input
                    ref={index === selectedItems.length - 1 ? quantityInputRef : null}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value), index)}
                    // max={maxQuantity}
                    min={1}
                    style={{ width: '50px' }}
                  />
                </td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleDeleteItem(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleImport}>Import</button>
    </div>
  );
};

export default Import;
