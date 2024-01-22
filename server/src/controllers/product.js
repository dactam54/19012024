import * as services from "../services";

export const getProducts = async (req, res) => {
  try {
    const response = await services.getProducts(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getProductsAdmin = async (req, res) => {
  try {
    const response = await services.getProductsAdmin(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!req.query || !req.query.pid) {
      return res.status(400).json({
        err: 1,
        mes: "Missing product ID",
      });
    }
    const response = await services.getProductById(req.query.pid);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const ratings = async (req, res) => {
  const { id } = req.user;
  const { pid, score } = req.body;
  try {
    if (!id || !pid || !score) {
      return res.status(400).json({
        err: 1,
        mes: "Missing product ID",
      });
    }
    const response = await services.ratings({ ...req.body, uid: id });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getWishlists = async (req, res) => {
  const { pids } = req.query;
  try {
    if (!pids) {
      return res.status(400).json({
        err: 1,
        mes: "Missing product ID",
      });
    }
    const response = await services.getWishlists(pids);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getCarts = async (req, res) => {
  const { pids } = req.query;
  try {
    if (!pids) {
      return res.status(400).json({
        err: 1,
        mes: "Missing product ID",
      });
    }
    const response = await services.getCarts(pids);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

export const buyProducts = async (req, res) => {
  const { total, products, coupon } = req.body;
  const { id } = req.user;
  try {
    if (!products || !total) {
      return res.status(400).json({
        err: 1,
        mes: "Missing product ID",
      });
    }
    const response = await services.buyProducts({
      total,
      products,
      uid: id,
      coupon: coupon || 0,
      type: "Export",
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const response = await services.updateProduct(pid, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

export const importProduct = async (req, res) => {
  const { pid } = req.params;
  debugger;
  try {
    const response = await services.importProduct(pid, req.body, req.user.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const response = await services.createProduct(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getDashboard = async (req, res) => {
  try {
    const response = await services.getDashboard(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const changeStatus = async (req, res) => {
  try {
    const { pid } = req.params;
    const response = await services.changeStatus(req.body, pid);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getBills = async (req, res) => {
  try {
    const response = await services.getBills(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getBillImports = async (req, res) => {
  try {
    const response = await services.getImportBill(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const response = await services.deleteProduct(pid);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};
export const getCartAnon = async (req, res) => {
  try {
    const { pids } = req.query;
    const response = await services.getCartAnon(pids);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

//can sua
export const updateVariants = async (req, res) => {
  try {
    const { pid } = req.params;
    const { name, price } = req.body;
    const { images, thumb } = req.files;
    // if (!name || !price || !thumb || !images) return res.status(400).json({
    if (!thumb || !images)
      return res.status(400).json({
        err: 1,
        mes: "Missing inputs",
      });
    // const response = await services.updateVariants(pid, { name, price, images, thumb })
    const response = await services.updateVariants(pid, { images, thumb });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      mes: "Lỗi server " + error,
    });
  }
};

export const importManyProducts = async (req, res) => {
  try {
    const data = req.body;
    console.log("data", data);
    const response = await services.importManyProducts(data, req.user.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getImportProductDetails = async (req, res) => {
  try {
    const response = await services.getImportProductDetails(req.params.id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const exportManyProducts = async (req, res) => {
  try {
    const data = req.body;
    const response = await services.exportManyProducts(data, req.user.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// get all phieu nhap - controller
export const getImportProductDetailsAll = async (req, res) => {
  try {
    const response = await services.getImportProductDetailsAll();

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getExportProductDetailsAll = async (req, res) => {
  try {
    const response = await services.getExportProductDetailsAll();

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getExportProductDetails = async (req, res) => {
  try {
    const response = await services.getExportProductDetails(req.params.id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getImportProductsCard = async (req, res) => {
  try {
    const response = await services.getImportProductsCard(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getExportProductsCard = async (req, res) => {
  try {
    const response = await services.getExportProductsCard(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllTheKhos = async (req, res) => {
  try {
    const response = await services.getAllTheKhos(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
