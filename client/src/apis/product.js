import axios from "../axios";

export const apiGetProducts = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/products",
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
  
export const apiGetProductById = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/products/getone",
        params: { pid },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetDetailCart = (pids) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/products/cart",
        params: { pids },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiBuy = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/products/buy",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetProductsAdmin = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/products/admin",
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiImportManyProducts = async (data) => {
  try {
    const response = await axios.post(
      "/api/v1/products/admin/imports-many",
      data
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const apiExportManyProducts = async (data) => {
  try {
    const response = await axios.post(
      "/api/v1/products/admin/exports-many",
      data
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
export const apiUpdateProduct = (pid, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/v1/products/admin/${pid}`,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiImportProduct = (pid, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/v1/products/admin/import/${pid}`,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreateProduct = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "post",
        url: `/api/v1/products/admin`,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetDashBoard = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/dashboard`,
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetBills = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/bills`,
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetImportBills = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/billimports`,
        params,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiChangeStatusBill = (data, pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/v1/products/admin/changestatus/` + pid,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiDeleteProduct = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "delete",
        url: `/api/v1/products/admin/` + pid,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdateVariants = (pid, payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "put",
        url: `/api/v1/products/variants/` + pid,
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

//api phieu
export const apiTheKhoNhap = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/imports-card-detail/${pid}`,
        // params: { pid }
      });
      resolve(response);
      console.log("apiTheKhoNhap", response);
    } catch (error) {
      reject(error);
    }
  });

export const apiTheKhoXuat = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/exports-card-detail/${pid}`,
        // params: { pid }
      });
      resolve(response);
      console.log("apiTheKhoXuat", response);
    } catch (error) {
      reject(error);
    }
  });

// all phieu xuat nhap
export const apiGetAllPhieuNhap = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/imports-detail-all/`,
      });
      resolve(response);
      console.log("apiGetAllPhieuNhap", response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAllPhieuXuat = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/exports-detail-all/`,
      });
      resolve(response);
      // console.log("apiGetAllPhieuXuat", response);
    } catch (error) {
      reject(error);
    }
  });

// phieu nhap xuat
export const apiPhieuKhoNhap = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/imports-detail/${pid}`,
        // params: { pid }
      });
      resolve(response);
      console.log("apiPhieuKhoNhap", response);
    } catch (error) {
      reject(error);
    }
  });

export const apiPhieuKhoXuat = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/products/admin/exports-detail/${pid}`,
        // params: { pid }
      });
      resolve(response);
      console.log("apiPhieuKhoNhap", response);
    } catch (error) {
      reject(error);
    }
  });

// xuat nhap nhieu
export const apiImportManyProduct = (data, uid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/products/admin/imports-many",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiExportManyProduct = (data, uid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/products/admin/exports-many",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

// get all the kho

export const apiGetAllTheKhos = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        "/api/v1/products/admin/get-all-the-kho",
        params
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
