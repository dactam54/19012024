import icons from "./icons";
import path from "./path";

const {
  MdOutlineDashboard,
  FaProductHunt,
  MdOutlineBrandingWatermark,
  RiBillLine,
} = icons;

export const adminSidebar = [
  {
    name: "Tổng quan",
    icons: <MdOutlineDashboard size={22} />,
    path: path.SYSTEM + "/" + path.STATISTICS,
  },
  {
    name: "Quản lý kho",
    icons: <RiBillLine size={22} />,
    path: path.SYSTEM + "/" + path.WAREHOUSE,
  },
  {
    name: "Quản lý nhãn hiệu",
    icons: <MdOutlineBrandingWatermark size={22} />,
    path: path.SYSTEM + "/" + path.MANAGE_BRAND,
  },
  {
    name: "Quản lý hàng hóa",
    icons: <FaProductHunt size={22} />,
    path: path.SYSTEM + "/" + path.MANAGE_PRODUCT,
  },
  // {
  //   name: "Tạo phiếu nhập ",
  //   icons: <FaProductHunt size={22} />,
  //   path: path.SYSTEM + "/" + path.MANAGE_IMPORT,
  // },
  // {
  //   name: "Tạo phiếu xuất ",
  //   icons: <FaProductHunt size={22} />,
  //   path: path.SYSTEM + "/" + path.MANAGE_EXPORT,
  // },
  {
    name: "Tra cứu",
    icons: <RiBillLine size={22} />,
    path: path.SYSTEM + "/" + path.WAREHOUSE_CARD,
  },

  // {
  //   name: "Lịch sử Nhập/Xuất",
  //   icons: <RiBillLine size={22} />,
  //   path: path.SYSTEM + "/" + path.HISTORY_BILL,
  // },
  // {
  //   name: "Import",
  //   icons: <RiBillLine size={22} />,
  //   path: path.SYSTEM + "/" + path.IMPORT,
  // },
  // {
  //   name: "Export",
  //   icons: <RiBillLine size={22} />,
  //   path: path.SYSTEM + "/" + path.EXPORT,
  // },
  // {
  //   name: "Lịch sử nhập",
  //   icons: <RiBillLine size={22} />,
  //   path: path.SYSTEM + "/" + path.MANAGE_Bill_IMPORT,
  // },

  // {
  //   name: "Lịch sử xuất",
  //   icons: <RiBillLine size={22} />,
  //   path: path.SYSTEM + "/" + path.MANAGE_Bill_EXPORT,
  // },

  // {
  //   name: "Báo cáo",
  //   icons: <RiBillLine size={22} />,
  //   path: path.SYSTEM + "/" + path.PDF,
  // },
  // {
  //     name: 'Quản lý thành viên',
  //     icons: <FaUserFriends size={22} />,
  //     path: path.SYSTEM + '/' + path.MANAGE_USER
  // },
];
