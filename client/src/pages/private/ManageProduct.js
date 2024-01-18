import React, { useEffect, useState } from "react";
import { apiGetProductsAdmin, apiDeleteProduct } from "../../apis/product";
import { InsertProduct, EditImagesProduct, Loading } from "../../components";
import { toast } from "react-toastify";
import { CiEdit, CiImport } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditImage, setIsEditImage] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  

  const fetchProducts = async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    if (response.err === 0) setProducts(response.productDatas);
    console.log("response1", response.productDatas.rows);
  };

  useEffect(() => {
    !isEdit && fetchProducts();
  }, [isEdit, page, update]);

  const handleUpdate = (product) => {
    setIsEdit(true);
    setEditingProduct(product);
  };

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
        headerName: "Số lượng",
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
          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => setIsEditImage(params.row)}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
            <CiImageOn />
              {/* <span>Thay đổi ảnh</span> */}
            </button>
            <button
              type="button"
              onClick={() => handleUpdate(params.row)}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
              <CiEdit size={18} />
              
            </button>
            <button
              type="button"
              onClick={() => handleDeleteClick(params.row.id)}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
              <MdDelete size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );


  const handleDeleteClick = (id) => {
    const shouldDelete = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (shouldDelete) {
      handleDeleteProduct(id);
    }
  };

  const handleDeleteProduct = async (id) => {
    const response = await apiDeleteProduct(id);
    if (response.err === 0) {
      setUpdate((prev) => !prev);
      toast.success("Xóa thành công");
    } else toast.error(response.mes);
  };



  return (
    <div className="relative">
      {isEdit && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white">
          <InsertProduct product={editingProduct} setIsEdit={setIsEdit} />
        </div>
      )}

      {isCreate && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white">
          <InsertProduct product={editingProduct} setIsCreate={setIsCreate} />
        </div>
      )}

      {isEditImage && (
        <EditImagesProduct
          isEditImage={isEditImage}
          setIsEditImage={setIsEditImage}
        />
      )}

      {!isEdit && !isCreate && !isEditImage && (
        <div>
          <div className="flex items-center justify-between border-b border-gray-200">
            <h3 className="font-bold text-[30px] pb-4 ">Quản lý hàng hóa</h3>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsCreate(true);
              }}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
              <CiImport size={18} />
              <span>Thêm mới</span>
            </button>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="py-4">
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
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ManageProduct;
