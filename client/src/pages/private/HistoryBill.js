import React, { useEffect, useState } from "react";
import { apiGetAllPhieuXuat, apiGetAllPhieuNhap } from "../../apis";
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

const tableCellStyle1 = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "left",
  position: 'sticky',
  top: "-1px", 
  zIndex: 100,
  backgroundColor: "#ddd"
};

const columns = [
  { field: "id", name: "ID", width: 90 },
  { field: "id", name: "Mã phiếu", width: 90 },
  {
    field: "maHoaDon",
    name: "Loại phiếu",
    width: 150,
    editable: true,
  },
  {
    field: "quantityProduct",
    name: "Người giao",
    width: 150,
    editable: true,
  },
  {
    field: "quantityProduct",
    name: "Người nhận",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Ngày tạo",
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
const HistoryBill = () => {
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

  console.log("dateRange", dateRange);
  const [keySearch, setKeySearch] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleRender = (id) => {
    console.log("id", id);
    data.map((item) => {
      item.id === id && setDataModal(item.hoaDons);
    });
    data.map((item) => {
      item.id === id && setNoteParent(item.note);
    })
    console.log("modal123", dataModal);
    console.log("noteParent", noteParent);
    handleOpen();
  };

  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };

  const [noteParent, setNoteParent] = useState("");
  const fetchData = async () => {
    setLoading(true);
    const response1 = await apiGetAllPhieuXuat();
    const response2 = await apiGetAllPhieuNhap();
    setLoading(false);
    const data = [...response1, ...response2];

    if (dateRange.startDate || dateRange.endDate) {
      let end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();
      let start = dateRange.startDate
        ? new Date(dateRange.startDate)
        : new Date(end - 30 * 24 * 60 * 60 * 1000);

      console.log("newDate", start, end);
      const filterDate = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
      setData(filterDate);
    } else if (keySearch) {
      const filteredSearch = data.filter((item) => {
        if (
          item.hoaDons[0].hoaDonNhapId &&
          !isNaN(item.hoaDons[0].hoaDonNhapId)
        ) {
          if (parseInt(item.hoaDons[0].hoaDonNhapId) > 0) {
            return "Phiếu nhập".toLowerCase().includes(keySearch.toLowerCase());
          }
        } else if (
          item.hoaDons[0].hoaDonXuatId &&
          !isNaN(item.hoaDons[0].hoaDonXuatId)
        ) {
          if (parseInt(item.hoaDons[0].hoaDonXuatId) > 0) {
            return "Phiếu xuất".toLowerCase().includes(keySearch.toLowerCase());
          }
        } else {
          return (
            item.maHoaDon.toLowerCase().includes(keySearch.toLowerCase()) ||
            item.user.toLowerCase().includes(keySearch.toLowerCase()) ||
            item.shipper.toLowerCase().includes(keySearch.toLowerCase())
          );
        }
      });
      setData(filteredSearch);
      console.log("filteredSearch", filteredSearch);
    } else {
      setData(data);
      console.log("data", data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange.startDate, dateRange.endDate, keySearch]);

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

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center" }}>
      <h3 className="font-bold text-[30px] pb-2 ">Lịch sử phiếu nhập / xuất</h3>

      <input
        type="text"
        className="bg-white text-gray-700 rounded-md py-2 px-4 w-full"
        placeholder="Nhập thông tin cần tìm kiếm"
        onChange={(e) => setKeySearch(e.target.value)}
      />
      <div>
        <div>Lọc theo khoảng thời gian</div>
        <div>
          <label htmlFor="startDate">Chọn ngày bắt đầu: </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleStartDateChange}
          />

          <label htmlFor="endDate">Chọn ngày kết thúc: </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* <div>
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
      </div> */}

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
      </div> */}

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
                          <TableCell>{row.maHoaDon}</TableCell>
                          <TableCell>
                            {row.hoaDons[0].hoaDonNhapId
                              ? "Phiếu nhập"
                              : "Phiếu xuất"}
                          </TableCell>
                          <TableCell>
                            {row?.hoaDons[0].hoaDonNhapId
                              ? row?.shipper
                              : row?.user}
                          </TableCell>
                          <TableCell>
                            {row?.hoaDons[0].hoaDonNhapId
                              ? row?.user
                              : row?.shipper}
                          </TableCell>
                          <TableCell>{formatLocalTime(row.date)}</TableCell>
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
            count={data?.length}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Paper>
      )}

      {dataModal && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              Chi tiết phiếu
            </h1>
            <div>
              <div>
                Người giao :{" "}
                <span>
                  {dataModal[0]?.hoaDonNhap?.shipper ||
                    dataModal[0]?.hoaDonXuat?.shipper}
                </span>
              </div>
              <div>
                Người nhận :{" "}
                <span>
                  {dataModal[0]?.hoaDonNhap?.user ||
                    dataModal[0]?.hoaDonXuat?.user}
                </span>
              </div>
              <div>
                Diễn giải :
                <span>
                 {noteParent || "Chưa có thông tin diễn giải"}
                </span>
              </div>
            </div>

            {dataModal && (
              <>
                <div className="flex justify-between">
                  {/* <span>{dataModal.hoaDonNhap?.shipper ||dataModal?.hoaDonXuat?.shipper }</span> */}
                </div>
                <div >
                <Paper>
                  <TableContainer  style={{ overflowY: "auto", maxHeight: "400px", border:"1px solid black", marginTop:"20px"  }}>
                    <Table stickyHeader style={{ width: "100%",}}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{...tableCellStyle1}}>STT</TableCell>
                          <TableCell style={{...tableCellStyle1}}>Ảnh</TableCell>
                          {/* <TableCell>Người giao</TableCell> */}
                          <TableCell style={{...tableCellStyle1}}>Tên sản phẩm </TableCell>
                          <TableCell style={{ ...tableCellStyle1,width: "120px" }}>
                            Mã sản phẩm
                          </TableCell>
                          <TableCell style={{ ...tableCellStyle1,width: "120px" }}>Số lượng</TableCell>
                          <TableCell style={{ ...tableCellStyle1 ,width: "120px"}}>Diễn giải</TableCell>
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
                              <>
                                <TableRow key={row?.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    <img
                                      src={row.product.thumb}
                                      alt="ảnh sản phẩm"
                                      className="h-[50px] object-contain"
                                    />
                                  </TableCell>
                                  {/* <TableCell>
                                    {row?.hoaDonNhap?.shipper ||
                                      row?.hoaDonXuat?.shipper}
                                  </TableCell> */}
                                  <TableCell>{row?.product?.name}</TableCell>
                                  <TableCell>
                                    {row?.productId.slice(0, 8)}
                                  </TableCell>
                                  <TableCell>{row?.quantity}</TableCell>
                                  <TableCell>{row?.note}</TableCell>
                                </TableRow>
                              </>
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
                      count={dataModal.length}
                      component="div"
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleRowsPerPage}
                    ></TablePagination>
                  </div>
                </Paper>
                </div>
               
              </>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default HistoryBill;
