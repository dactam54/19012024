import path from "./utils/path";
import { Route, Routes } from "react-router-dom";
import { Public, Login, Detail } from "./pages/public";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "./store/actions";
import actionTypes from "./store/actions/actionTypes";
import {
  System,
  ManageBrand,
  ManageProduct,
  Statistics,
  ManageExport,
  ManageImport,
  WarehouseCard,
  HistoryBill,
  Warehouse,
  PDF,
} from "./pages/private";

import { ToastContainer } from "react-toastify";
import ProductAll from "./pages/private/Warehouse";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(actions.getCatalogs())
    dispatch(actions.getBrands());
  }, []);

  return (
    <div className="relative h-screen">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.LOGIN} element={<Login />} />
          {/* <Route path={path.DETAIL} element={<Detail />} /> */}
        </Route>
        <Route path={path.SYSTEM} element={<System />}>
          <Route path={path.STATISTICS} element={<Statistics />} />
          <Route path={path.WAREHOUSE} element={<Warehouse />} />
          <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
          <Route path={path.MANAGE_PRODUCT} element={<ManageProduct />} />
          <Route path={path.MANAGE_IMPORT} element={<ManageImport />} />
          <Route path={path.MANAGE_EXPORT} element={<ManageExport />} />
          <Route path={path.WAREHOUSE_CARD} element={<WarehouseCard />} />
          <Route path={path.HISTORY_BILL} element={<HistoryBill />} />

          <Route path={"*"} element={<Statistics />} />
          {/* <Route path={path.PRODUCT_CARD_STORE} element={<ProductCardStore />} /> */}
          {/* <Route path={path.MANAGE_USER} element={<ManageUser />} /> */}
          {/* <Route path={path.MANAGE_Bill_EXPORT} element={<ManageExportBill />}/>
          <Route path={path.MANAGE_Bill_IMPORT} element={<ManageImportBill />}/> */}
        </Route>
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
