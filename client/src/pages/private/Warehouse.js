import React, { useEffect, useState } from "react";
import {
  apiGetAllPhieuXuat,
  apiGetAllPhieuNhap,
  apiGetProductsAdmin,
  apiGetAllTheKhos,
} from "../../apis";
import { Box, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import actionTypes from "../../store/actions/actionTypes";
import { format, set, subDays } from "date-fns";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { Loading } from "../../components";
import { formatLocalTime } from "../../utils/fn";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useRef } from "react";
import Xlsx from "../../utils/Xlsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
const columns = [
  { field: "id", name: "ID", width: 90 },

  {
    field: "maHoaDon",
    name: "Ảnh sản phẩm",
    width: 150,
    editable: true,
  },
  {
    field: "name",
    name: "Tên sản phẩm",
    width: 150,
    editable: true,
  },
  {
    field: "brand",
    name: "Nhãn hiệu",
    width: 150,
    editable: true,
  },
  {
    field: "type",
    name: "Loại hàng",
    width: 150,
    editable: true,
  },
  {
    field: "quantity",
    name: "Số lượng",
    width: 150,
    editable: true,
  },
  {
    field: "action",
    name: "Thao tác",
    width: 110,
    editable: true,
  },
];
const Warehouse = () => {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [keySearch, setKeySearch] = useState("");

  const [modalRaw, setModalRaw] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const fetchDataModal = async () => {
    try {
      setLoading(true);
      const response = await apiGetAllTheKhos({
        startDate: "2023-01-08",
        endDate: "2025-01-20",
      });
      setLoading(false);
      if (response.length > 0) {
        setModalRaw(response);
      }
      console.log("modalRaw", modalRaw);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataModal();
  }, []);
  const paperRef = useRef();
  const navigate = useNavigate();

  const handleRender = (id) => {
    const filteredData = modalRaw.filter((item) => item.productId === id);
    console.log("filteredData", filteredData);
    if (filteredData.length > 0) {
      setDataModal(filteredData);
      console.log("dataModal", dataModal);
      handleOpen();
    } else {
      console.log("No items found with id:", id);
    }
    handleOpen();
  };
  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    const resData = response.productDatas;
    if (keySearch !== "") {
      setLoading(true);
      const filteredSearch = resData.rows.filter((item) => {
        return (
          item.name.toLowerCase().includes(keySearch.toLowerCase()) ||
          item.brand.toLowerCase().includes(keySearch.toLowerCase()) ||
          item.catalog.toLowerCase().includes(keySearch.toLowerCase())
        );
      });
      console.log("filteredSearch", filteredSearch);
      setLoading(false);
      setData1(filteredSearch);
    } else {
      setData(resData);
    }
    console.log("response123", data);
  };

  useEffect(() => {
    fetchData();
  }, [page, keySearch]);

  const handlePrint = useReactToPrint({
    onBeforeGetContent: () => setLoading(true),
    content: () => paperRef.current,
    onAfterPrint: () => setLoading(false),
    onPrintError: (err) => {
      toast.error("Có lỗi xảy ra khi in phiếu");
      console.log(err);
    },
  });
 
  const handleExcel = async () => {
    try {
      const response = await apiGetProductsAdmin({ page: page }); // Fetch the initial data
      if (response.productDatas.rows.length > 0) {
        const exportData = response.productDatas.rows.map((row, index) => ({
          STT: index + 1,
          "Ảnh sản phẩm": row.thumb,
          "Tên sản phẩm": row.name,
          "Nhãn hiệu": row.brand,
          "Loại hàng": row.catalog,
          "Số lượng": row.quantity,
        }));
        
        await Xlsx.exportExcel([...exportData], "Danh sách sản phẩm", "Sản phẩm");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  


  return (
    <div style={{ textAlign: "center" }}>
      <h3 className="font-bold text-[30px] pb-2 ">Thông tin kho</h3>
      <div>
        <input
          type="text"
          // className="bg-white text-gray-700 rounded-md py-2 px-4 w-full"
          className="bg-white text-gray-700 rounded-md py-2 px-4 w-full border-2 border-gray-300 focus:outline-none focus:border-green-600"
          placeholder="Tìm kiếm nhãn hiệu"
          onChange={(e) => setKeySearch(e.target.value)}
        />
      </div>
      <div style={{ display: "flex" }}>
        <button
          type="button"
          className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2 mr-3"
          onClick={() => navigate("/he-thong/quan-ly-nhap-hang")}
        >
          <span>Tạo phiếu nhập </span>
        </button>
        <button
          type="button"
          className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2 mr-3"
          onClick={() => navigate("/he-thong/quan-ly-xuat-hang")}
        >
          <span>Tạo phiếu xuất </span>
        </button>

        <button
          type="button"
          className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2 mr-3"
          onClick={() => navigate("/he-thong/quan-ly-lich-su-phieu")}
        >
          <span>Lịch sử phiếu </span>
        </button>

        <button
          type="button"
          className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2 mr-3"
          onClick={() => navigate("/he-thong/quan-ly-the-kho")}
        >
          <span>Tra cứu</span>
        </button>
       
      </div>
      <div></div>
      {loading ? (
        <Loading />
      ) : (
        <Paper sx={{ width: "100%" }} >
          <TableContainer sx={{ maxHeight: 850 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "#ddd", color: "black" }}
                      key={column.field}
                    >
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data1
                  ? data1
                      ?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <img
                                src={row.thumb}
                                alt="ảnh sản phẩm"
                                className="h-[50px] object-contain"
                              />
                            </TableCell>
                            <TableCell>{row?.name}</TableCell>
                            <TableCell>{row?.brand}</TableCell>
                            <TableCell>{row?.catalog}</TableCell>
                            <TableCell>{row?.quantity}</TableCell>
                            <button
                              onClick={() => handleRender(row.id)}
                              className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                            >
                              Xem chi tiết
                            </button>
                          </TableRow>
                        );
                      })
                  : data &&
                    data?.rows
                      ?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover key={row.id} >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <img
                                src={row.thumb}
                                alt="ảnh sản phẩm"
                                className="h-[50px] object-contain"
                              />
                            </TableCell>
                            <TableCell>{row?.name}</TableCell>
                            <TableCell>{row?.brand}</TableCell>
                            <TableCell>{row?.catalog}</TableCell>
                            <TableCell>{row?.quantity}</TableCell>
                            <button
                              onClick={() => handleRender(row.id)}
                              className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                            >
                              Xem chi tiết
                            </button>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            rowsPerPage={rowPerPage}
            page={page}
            count={data1 ? data1?.length : data?.count}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>

                   <div style={{ display: "flex", flexDirection: "rows" }}>
                    <button
                      onClick={handleExcel}
                     className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                    >
                     Xuất File Excel
                    </button>
                  </div> 

                 
        </Paper>
      )}

      {dataModal && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} ref={paperRef}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              Thông tin hàng hóa
            </h1>
            {/* <div>Người lập thẻ :</div> */}
            <div>
              Tên sản phẩm :<span>{dataModal[0]?.product?.name}</span>
            </div>
            <div>
            Mã sản phẩm :
            <span>{dataModal[0]?.product?.id}</span>
            </div>
            <div>
              Ngày :<span>{formatLocalTime(new Date().toISOString())}</span>
            </div>
          

            {dataModal && (
              <>
                <Paper>
                  <TableContainer sx={{ maxHeight: 600 }} >
                  {/* style={{ overflowY: "auto", maxHeight: "300px", border:"1px solid black", marginTop:"20px"  }} */}
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            rowSpan={2}
                            style={{ border: "1px solid #ddd", width: "50px" }}
                          >
                            STT
                          </TableCell>
                          <TableCell
                            rowSpan={2}
                            style={{ border: "1px solid #ddd", width: "150px" }}
                          >
                            Ngày
                          </TableCell>
                          <TableCell
                            rowSpan={2}
                            style={{ border: "1px solid #ddd", width: "150px" }}
                          >
                            Mã chứng từ
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            style={{ border: "1px solid #ddd", width: "50px" }}
                          >
                            Loại chứng từ
                          </TableCell>
                          <TableCell
                            colSpan={4}
                            style={{ border: "1px solid #ddd"  ,textAlign:"center"}}
                          >
                            Số lượng
                          </TableCell>
                          <TableCell
                            rowSpan={2}
                            style={{ border: "1px solid #ddd" }}
                          >
                            Diễn giải
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ border: "1px solid #ddd", width: "5%" }}
                          >
                            Nhập
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid #ddd", width: "5%" }}
                          >
                            Xuất
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd" }}>
                           Tồn ĐK
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd" }}>
                            Nhập TK
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd" }}>
                            Xuất TK
                          </TableCell>
                          <TableCell style={{ border: "1px solid #ddd" }}>
                            Tồn CK
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataModal
                          .slice(
                            page * rowPerPage,
                            page * rowPerPage + rowPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow key={row?.id}>
                                <TableCell style={{ border: "1px solid #ddd" }}>
                                  {index + 1}
                                </TableCell>
                                <TableCell style={{ border: "1px solid #ddd" }}>
                                  {formatLocalTime(row.date)}
                                </TableCell>
                                {/* <TableCell style={{ border: "1px solid #ddd" }}>
                                  {row?.hoaDon?.maHoaDon}
                                </TableCell> */}

                                <TableCell style={{ border: "1px solid #ddd" , color :"red" }}>
                                  <Link to={"/he-thong/quan-ly-the-kho?hoaDonId=" + row?.hoaDonId} >
                                    CT-{row?.hoaDonId}
                                  </Link>
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  {row?.hoaDon?.hoaDonNhapId ? "X" : ""}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  {row?.hoaDon?.hoaDonXuatId ? "X" : ""}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  {row?.hoaDon?.hoaDonNhapId
                                    ? row?.hoaDon?.oldQuantity
                                    : row?.hoaDon?.newQuantity}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  {row?.hoaDon?.hoaDonNhapId
                                    ? row?.hoaDon?.quantity
                                    : ""}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                  }}
                                >
                                  {row?.hoaDon?.hoaDonXuatId
                                    ? row?.hoaDon?.quantity
                                    : ""}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                              
                                  }}
                                >
                                  {row?.hoaDon?.hoaDonNhapId
                                    ? row?.hoaDon?.quantity +
                                      row?.hoaDon?.oldQuantity
                                    : row?.hoaDon?.newQuantity -
                                      row?.hoaDon?.quantity}
                                </TableCell>

                                <TableCell>
                                  {row?.hoaDon?.note}
                                </TableCell>
                               
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell align="right" style={{borderRight:"1px solid black"}}>
                            Tổng số tồn đầu kì:
                          </TableCell>
                          <TableCell>
                          {dataModal[0]?.hoaDon.oldQuantity}
                          {/* {data?.reduce((acc, cur) => acc + cur.hoaDon.newQuantity, 0)} */}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell align="right" style={{borderRight:"1px solid black"}}>
                            Tổng số nhập trong kì:
                          </TableCell>
                          <TableCell>
                          {/* {data?.reduce((acc, cur) => acc + cur.hoaDon.quantity, 0)} */}
                          {dataModal?.reduce((acc, cur) => {
                              if (cur.hoaDon && cur.hoaDon.hoaDonNhapId) {
                               return acc + cur.hoaDon.quantity;
                           }
                              return acc;
                          }, 0)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell align="right" style={{borderRight:"1px solid black"}}>
                            Tổng số nhập trong kì:
                          </TableCell>
                          <TableCell>
                          {/* {data?.reduce((acc, cur) => acc + cur.hoaDon.quantity, 0)} */}
                          {dataModal?.reduce((acc, cur) => {
                              if (cur.hoaDon && cur.hoaDon.hoaDonXuatId) {
                               return acc + cur.hoaDon.quantity;
                           }
                              return acc;
                          }, 0)}
                          </TableCell>
                        </TableRow>
                        

                        <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell align="right" style={{borderRight:"1px solid black"}}>
                            Tổng số tồn cuối kì:
                          </TableCell>
                          <TableCell>
                          {dataModal[dataModal.length - 1 ]?.hoaDon.newQuantity}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  
                  <div>
                    <TablePagination
                      rowsPerPageOptions={[10, 15, 20]}
                      rowsPerPage={rowPerPage}
                      page={page}
                      count={dataModal.length}
                      component="div"
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleRowsPerPage}
                    ></TablePagination>

                  </div>
                  
                </Paper>
              </>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Warehouse;
