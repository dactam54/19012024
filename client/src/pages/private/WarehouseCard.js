import React, { useEffect, useState, useRef } from "react";
import { apiGetAllTheKhos, apiPhieuKhoNhap, apiPhieuKhoXuat } from "../../apis";
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
import { Loading } from "../../components";
import { formatLocalTime } from "../../utils/fn";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
// import XLSX from 'xlsx/xlsx.mjs';
import Xlsx from "../../utils/Xlsx";
import * as XLSX from "xlsx/xlsx.mjs";

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
const columns = [
  { field: "id", name: "ID", width: 90 },

  {
    field: "maHoaDon",
    name: "Mã chứng từ",
    width: 150,
    editable: true,
  },
  {
    field: "image",
    name: "Ảnh sản phẩm",
    width: 150,
    editable: true,
  },
  { field: "id", name: "Tên sản phẩm", width: 90 },

  {
    field: "quantityProduct",
    name: "Số lượng",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Loại",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Ngày",
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

const WarehouseCard = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // const handleRender = async (id) => {
  //   try {
  //     console.log("idmodal", id);

  //     const [responsePhieuKhoNhap, responsePhieuKhoXuat] = await Promise.all([
  //       apiPhieuKhoNhap(id),
  //       apiPhieuKhoXuat(id),
  //     ]);
  //     const dataTitle = responsePhieuKhoNhap.hoaDons.map(
  //       (item) => typeof item.hoaDonNhapId !== Number
  //     )
  //       ? responsePhieuKhoXuat
  //       : responsePhieuKhoNhap;
  //     console.log("dataModal:", dataTitle);
  //     setDataModal(dataTitle);
  //     handleOpen();
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const paperRef = useRef();

  const handleRender = async (id) => {
    try {
      console.log("idmodal", id);

      const [responsePhieuKhoNhap, responsePhieuKhoXuat] = await Promise.all([
        apiPhieuKhoNhap(id),
        apiPhieuKhoXuat(id),
      ]);
      const dataTitle = responsePhieuKhoNhap.hoaDons.map(
        (item) => typeof item.hoaDonNhapId !== Number
      )
        ? responsePhieuKhoNhap
        : responsePhieuKhoXuat;
      console.log("DataModal:", dataTitle);
      setDataModal(dataTitle);
      handleOpen();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };
  const [keySearch, setKeySearch] = useState("");
  // console.log("keySearch", keySearch);
  const fetchData = async () => {
    setLoading(true);
    if (!dateRange.startDate || !dateRange.endDate) {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().slice(0, 16);
      const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);
      setDateRange({
        startDate,
        endDate,
      });
    }
    console.log("dateRange", dateRange);
    const response = await apiGetAllTheKhos({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      keyword: keySearch,
    });

    if (response.length > 0) setData(response);
    setLoading(false);
  };

  let handleExcel = async () => {
    let response1 = await apiGetAllTheKhos({
      type: "SUBJECT",
      limit: "",
      offset: "",
      keyword: "",
    });
    if (response1 && response1.err === 0) {
      await Xlsx.exportExcel(response1, "Thẻ kho", "Thẻ kho");
    }
  };
  const handleStartDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: e.target.value,
    }));
  };

  const handleEndDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
  };

  const handlePrint = useReactToPrint({
    onBeforeGetContent: () => setLoading(true),
    content: () => paperRef.current,
    onAfterPrint: () => setLoading(false),
    onPrintError: (err) => {
      toast.error("Có lỗi xảy ra khi in phiếu");
      console.log(err);
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().slice(0, 16);
      const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);
      setDateRange({
        startDate,
        endDate,
      });
    }

    fetchData();
  }, [dateRange.startDate, dateRange.endDate, keySearch]);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 className="font-bold text-[30px] pb-2 ">Tra cứu </h3>
      <input
        type="text"
        className="bg-white text-gray-700 rounded-md py-2 px-4 w-full"
        placeholder="Nhập thông tin cần tìm kiếm"
        onChange={(e) => setKeySearch(e.target.value)}
      />
      <span>Lọc theo khoảng thời gian</span>
      <div>
        <label htmlFor="startDate">Chọn ngày bắt đầu:</label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleStartDateChange}
        />

        <label htmlFor="endDate">Chọn ngày kết thúc:</label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleEndDateChange}
        />
      </div>

      {/* <div style={{display: 'flex', flexDirection:'row', marginRight:'20px'}}>

      <button
              type="button"
              onClick={() => navigate("/he-thong/quan-ly-nhap")}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2">
              <span>Tạo phiếu nhập</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/he-thong/quan-ly-xuat")}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2">
              <span>Tạo phiếu xuất</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/he-thong/quan-ly-xuat")}
              className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2">
              <span>Quản lý hàng hóa</span>
            </button>
      </div>
       */}

      {loading ? (
        <Loading />
      ) : (
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 850 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "black", color: "white" }}
                      key={column.field}
                    >
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data
                    ?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.hoaDon.maHoaDon}</TableCell>
                          <TableCell>
                            <img
                              src={row.product.thumb}
                              alt="ảnh sản phẩm"
                              className="h-[50px] object-contain"
                            />
                          </TableCell>
                          <TableCell>{row.product.name}</TableCell>
                          <TableCell>{row.hoaDon.quantity}</TableCell>
                          <TableCell>
                            {" "}
                            {row.type === "nhap" ? "Nhập hàng" : "Xuất hàng"}
                          </TableCell>
                          <TableCell>{formatLocalTime(row.date)}</TableCell>
                          <button
                            onClick={() =>
                              handleRender(
                                row.type === "nhap"
                                  ? row.hoaDon.hoaDonNhapId
                                  : row.hoaDon.hoaDonXuatId
                              )
                            }
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
            count={data?.length}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
          <button
            type="button"
            className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            onClick={() => handleExcel}
          >
            <span>Xuất file </span>
          </button>
        </Paper>
      )}

      {dataModal && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="page"
        >
          <Box sx={style} ref={paperRef}>
            <div>
              <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                Chi tiết phiếu
              </h1>
              <div>
                Người giao : <span>{dataModal.shipper}</span>
              </div>
              <div>
                Người nhận : <span>{dataModal.user}</span>
              </div>
              <div>
                Ngày : <span> {formatLocalTime(dataModal.date)}</span>
              </div>
              <div>
                Mã phiếu : <span> {dataModal.maHoaDon}</span>
              </div>
            </div>

            {/* <div>Loại phiếu :({dataModal.hoaDons[0].hoaDonNhapId})</div> */}

            {dataModal.hoaDons && (
              <>
                <Paper>
                  <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Mã sản phẩm</TableCell>
                          <TableCell>Mã thẻ</TableCell>
                          <TableCell>SL trước nhập</TableCell>
                          <TableCell>SL nhập</TableCell>
                          <TableCell>SL sau nhập</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataModal.hoaDons
                          ?.slice(
                            page * rowPerPage,
                            page * rowPerPage + rowPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow key={row?.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row?.productId} </TableCell>
                                <TableCell>{row?.id}</TableCell>
                                <TableCell>{row?.oldQuantity}</TableCell>
                                <TableCell>{row?.quantity}</TableCell>
                                <TableCell>{row?.newQuantity}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div>
                    <TablePagination
                      rowsPerPageOptions={[10, 15, 20]}
                      rowsPerPage={rowPerPage}
                      page={page}
                      count={dataModal.hoaDons.length}
                      component="div"
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleRowsPerPage}
                    ></TablePagination>
                    <button
                      onClick={handlePrint}
                      className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                    >
                      Xuất PDF
                    </button>
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

export default WarehouseCard;
