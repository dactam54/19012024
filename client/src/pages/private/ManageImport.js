import React, { useEffect, useState } from "react";
import { apiGetProductsAdmin, apiImportManyProducts } from "../../apis/product";
import { useDispatch } from "react-redux";
import actionTypes from "../../store/actions/actionTypes";
import { toast } from "react-toastify";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
} from "@mui/material";
import Loading from "../../components/Loading"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
const ManageImport = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [openInsert, setOpenInsert] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    if (response.err === 0) setProducts(response.productDatas);
  }, [ page]);

  const [formData, setFormData] = useState({
    shipper: "",
    user: "",
    date: "",
  });

  console.log("form", formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImport = async () => {
    const response = await apiImportManyProducts({
      hoaDons: selectedProducts?.map((p) => ({
        productId: p.productId,
        quantity: parseInt(p.quantity),
      })),
      // shipper: formData.shipper,
      // user: formData.user,
      // date: formData.date,
      ...formData,
      date: new Date(formData?.date),
    });

    if (response?.id) {
      toast.success("Nhập hàng thành công");
      setSelectedProducts([]);
      fetchProducts();
    }
  };
  console.log("selectedProducts", selectedProducts);
  React.useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const columns = React.useMemo(
    () => [
      { field: "id", headerName: "ID", width: 200 },
      {
        field: "thumb",
        headerName: "Ảnh sản phẩm",
        width: 150,
        editable: true,
        renderCell: (params) => (
          <img
            src={params.value}
            alt=""
            className="h-[60px]  w-full p-2 object-contain"
          />
        ),
      },
      {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 250,
      },
      {
        field: "brand",
        headerName: "Nhãn hiệu",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 160,
      },
      {
        field: "catalog",
        headerName: "Loại hàng",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 160,
      },
      {
        field: "quantity",
        headerName: "Số lượng tồn kho",
        description: "This column has a value getter and is not sortable.",
        sortable: true,
        width: 160,
      },
      {
        field: "createdAt",
        headerName: "Ngày tạo",
        description: "This column has a value getter and is not sortable.",
        sortable: true,
        width: 250,
      },
      {
        field: "action",
        headerName: "Thao tác",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 250,
        renderCell: (params) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedProducts.find(
                    (el) => el.productId === params.row.id
                  ) || false
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts([
                      ...selectedProducts,
                      {
                        productId: params.row.id,
                        name: params.row.name,
                        thumb: params.row.thumb,
                        quantity: 1,
                      },
                    ]);
                  } else {
                    setSelectedProducts(
                      selectedProducts.filter(
                        (el) => el.productId !== params.row.id
                      )
                    );
                  }
                }}
              />
            }
            label="Chọn sản phẩm"
          />
        ),
      },
    ],
    [selectedProducts]
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between border-b border-gray-200">
        <h3 className="font-bold text-[30px] pb-4 ">Quản lý nhập</h3>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedProducts?.length}
          onClick={async () => {
            setOpenInsert(true);
          }}
        >
          Phiếu nhập
        </Button>
      </div>
<div>
        {loading ? <Loading /> :   <div className="py-4">
        <div>
          {products?.rows?.length > 0 && (
            <DataGrid
              slots={{
                toolbar: GridToolbar,
              }}
              rows={products?.rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                    page: 0,
                  },
                },
              }}
              rowCount={products?.count}
              pageSizeOptions={[5, 10, 20]}
              onPaginationModelChange={(params) => {
                setPage(params.page + 1);
              }}
              // checkboxSelection
              disableRowSelectionOnClick
              getRowHeight={() => "auto"}
            />
          )}
        </div>
      </div>}
</div>
    

      <Modal
        open={openInsert}
        onClose={() => setOpenInsert(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h3 className="font-bold text-[30px] pb-4 ">Phiếu nhập</h3>
            <div>
              <label htmlFor="shipper">Người giao :</label>
              <input
                type="text"
                id="shipper"
                name="shipper"
                value={formData.shipper}
                onChange={handleInputChange}
              />

              <label htmlFor="user">Người nhận :</label>
              <input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
              />

              <label htmlFor="date">Ngày Nhập:</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <table className="table-auto w-full mt-4">
                <thead>
                  <tr className="border-b border-t">
                    <td className="p-2 font-bold border border-solid border-gray-300 text-center">
                      STT
                    </td>
                    <td className="p-2 font-bold border border-solid border-gray-300 text-center">
                      Ảnh sản phẩm
                    </td>
                    <td className="p-2 font-bold border border-solid border-gray-300 text-center">
                      Tên sản phẩm
                    </td>
                    <td className="p-2 font-bold border border-solid border-gray-300 text-center">
                      Chọn Số lượng
                    </td>
                  </tr>
                </thead>

                <tbody>
                  {selectedProducts?.map((item, index) => (
                    <tr
                      key={item.productId}
                      className="border border-solid border-gray-300"
                    >
                      <td
                        className={`p-2 border border-solid border-gray-300 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        } m-auto `}
                      >
                        {index + 1}
                      </td>
                      <td
                        className={`p-2 border border-solid border-gray-300 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        } m-auto `}
                      >
                        <img
                          src={item.thumb}
                          alt=""
                          className="h-[50px] object-contain"
                        />
                      </td>
                      <td
                        className={`p-2 border border-solid border-gray-300 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        } m-auto `}
                      >
                        {item.name}
                      </td>
                      <td
                        className={`p-2 border border-solid border-gray-300 ${
                          index % 2 === 0 ? "" : "bg-gray-100"
                        } m-auto `}
                      >
                        <TextField
                          type="number"
                          required
                          fullWidth
                          defaultValue={item.quantity}
                          inputProps={{ min: 0, max: item.quantity }}
                          onChange={(e) => {
                            const newSelectedProducts = [...selectedProducts];
                            newSelectedProducts[index].quantity =
                              e.target.value;
                            setSelectedProducts(newSelectedProducts);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center py-4">
                <Button
                  variant="contained"
                  color="success"
                  onClick={async () => {
                    await handleImport();
                    setOpenInsert(false);
                  }}
                >
                  Nhập hàng
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageImport;
