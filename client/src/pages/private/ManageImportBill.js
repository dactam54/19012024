import React, { useEffect, useState } from "react";
import { apiGetAllPhieuNhap } from "../../apis";
import { Box, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import actionTypes from "../../store/actions/actionTypes";

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
import * as XLSX from "xlsx";
import { styled } from "@mui/material/styles";

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
//   { field: "stt", name: "STT", width: 90 },
  { field: "id", name: "ID", width: 90 },
  { field: "id", name: "ID phiếu", width: 90 },
  {
    field: "maHoaDon",
    name: "Mã phiếu",
    width: 150,
    editable: true,
  },
  {
    field: "quantityProduct",
    name: "Số lượng loại sản phẩm",
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
const ManageImportBill = () => {
    const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    dispatch({ type: actionTypes.LOADING, flag: true });
    const response = await apiGetAllPhieuNhap();
    dispatch({ type: actionTypes.LOADING, flag: false });
    if (response.length > 0) setData(response);

    console.log('DataModalImport', response);
    console.log('fetchDataImport', response);
  };

  const handleRender = (id) => {
    data.map((item) => {item.id === id && item.hoaDons.length > 0 && setDataModal(item.hoaDons)})
    console.log(dataModal)
    handleOpen();
  };
  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataModal);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "exportedData.xlsx");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
    <h3 className="font-bold text-[30px] pb-2 ">Thông tin phiếu nhập</h3>
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
              data?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                .map((row, index) => {
                  return (
                      <TableRow hover key={row.maHoaDon}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.maHoaDon.slice(0, 8)}</TableCell>
                        <TableCell>{row?.hoaDons?.length}</TableCell>
                        <TableCell>{`${row?.createdAt.slice(11,19)} ${row?.createdAt.slice(0,10)}`}</TableCell>
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

              {dataModal && (
                <Paper>
                  <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Ảnh sản phẩm</TableCell>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Mã sản phẩm</TableCell>
                          <TableCell>Số lượng </TableCell>
                         
                          <TableCell>Thời gian</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataModal?.slice(page * rowPerPage,page * rowPerPage + rowPerPage).map((row,index) => {
                          return (
                            <TableRow key={row?.id}>
                                  <TableCell>{index + 1 }</TableCell>
                                  <TableCell>
                                  <img src={row?.product?.thumb} alt=""className="h-[50px] object-contain" />
                                  </TableCell>
                                  <TableCell>{row?.product?.name}</TableCell>
                                  <TableCell>{row?.productId}</TableCell>
                                  <TableCell>{row?.quantity}</TableCell>
                                
                                  <TableCell>{`${row?.createdAt.slice(
                                    11,
                                    19
                                  )} ${row?.createdAt.slice(
                                    0,
                                    10
                                  )}`}</TableCell>
                                </TableRow>
                          ) 
                            })
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div>
                    <button
                      type="button"
                      className="py-2 px-4 bg-green-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
                    onClick={exportToExcel}
                    >
                      <span>Xuất file </span>
                    </button>
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
              ) }
            </Box>
          </Modal>)
   } 

  </div>
  )
  
};

export default ManageImportBill;
