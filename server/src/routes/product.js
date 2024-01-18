import express from "express";
import * as controllers from "../controllers";
import { verifyToken, isAdmin } from "../middlewares/auth";
import uploader from "../config/cloudinary.config";
import db from "../models";
import prisma from "../lib/prisma";

const router = express.Router();

router.get("/", controllers.getProducts);
router.get("/getone", controllers.getProductById);
router.get("/cartanon", controllers.getCartAnon);
router.post("/ratings", verifyToken, controllers.ratings);
router.get("/wishlist", verifyToken, controllers.getWishlists);
router.get("/cart", verifyToken, controllers.getCarts);
router.post("/buy", verifyToken, controllers.buyProducts);
router.get("/admin", [verifyToken, isAdmin], controllers.getProductsAdmin);
router.post("/admin", [verifyToken, isAdmin], controllers.createProduct);
router.get(
  "/admin/dashboard",
  [verifyToken, isAdmin],
  controllers.getDashboard
);
router.get("/admin/bills", [verifyToken, isAdmin], controllers.getBills);

router.get(
  "/admin/billimports",
  [verifyToken, isAdmin],
  controllers.getBillImports
);
router.put(
  "/admin/changestatus/:pid",
  [verifyToken, isAdmin],
  controllers.changeStatus
);
router.put(
  "/variants/:pid",
  [verifyToken, isAdmin],
  uploader.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  controllers.updateVariants
);

router.put("/admin/:pid", [verifyToken, isAdmin], controllers.updateProduct);
router.post(
  "/admin/import/:pid",
  [verifyToken, isAdmin],
  controllers.importProduct
);
router.delete("/admin/:pid", [verifyToken, isAdmin], controllers.deleteProduct);

router.post(
  "/admin/imports-many",
  [verifyToken, isAdmin],
  controllers.importManyProducts
);

router.post(
  "/admin/exports-many",
  [verifyToken, isAdmin],
  controllers.exportManyProducts
);

//get all phieu nhap routes
router.get(
  "/admin/imports-detail-all",
  [verifyToken, isAdmin],
  controllers.getImportProductDetailsAll
);

router.get(
  "/admin/exports-detail-all",
  [verifyToken, isAdmin],
  controllers.getExportProductDetailsAll
);

router.get(
  "/admin/imports-detail/:id",
  [verifyToken, isAdmin],
  controllers.getImportProductDetails
);

router.get(
  "/admin/exports-detail/:id",
  [verifyToken, isAdmin],
  controllers.getExportProductDetails
);

router.get(
  "/admin/imports-card-detail/:id",
  [verifyToken, isAdmin],
  controllers.getImportProductsCard
);
router.get(
  "/admin/exports-card-detail/:id",
  [verifyToken, isAdmin],
  controllers.getExportProductsCard
);
router.post(
  "/admin/get-all-the-kho",
  [verifyToken, isAdmin],
  controllers.getAllTheKhos
);

export default router;
