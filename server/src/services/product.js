import db from "../models";
require("dotenv").config();
import { Op } from "sequelize";
import { v4 as genId } from "uuid";
import { sequelize } from "../config/connect-database";
import uniqid from "uniqid";
import prisma from "../lib/prisma";
import moment from "moment";
import { getCode } from "../lib/code";

export const getProducts = ({
  page,
  limit,
  order,
  catalog,
  star,
  q,
  price,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { nest: true };
      const offsetStep = !page ? 1 : +page > 1 ? +page : 1;
      queries.limit = +process.env.LIMIT_PRODUCTS * +offsetStep;
      if (order) queries.order = [order];
      if (q) {
        query = {
          [Op.or]: [
            { name: { [Op.substring]: q.trim() } },
            { catalog: { [Op.substring]: q } },
            { detail: { [Op.substring]: q } },
            { overviews: { [Op.substring]: q } },
            { desc: { [Op.substring]: q } },
          ],
        };
      }
      if (catalog) query.catalogslug = { [Op.substring]: catalog };
      if (price && price !== "up" && price !== "down")
        queries.include = [
          {
            model: db.Varriant,
            as: "variants",
            where: { price: { [Op.between]: price } },
          },
        ];
      else
        queries.include = [
          {
            model: db.Varriant,
            as: "variants",
            where: { price: { [Op.gt]: 1000 } },
          },
        ];
      const data = {
        where: query,
        ...queries,
      };
      if (price === "up")
        // Order theo include
        data.order = [[{ model: db.Varriant, as: "variants" }, "price", "ASC"]];
      if (price === "down")
        data.order = [
          [{ model: db.Varriant, as: "variants" }, "price", "DESC"],
        ];
      const response = await db.Product.findAndCountAll(data);
      resolve({
        err: response ? 0 : 1,
        mes: response ? "Got" : "Something went wrong!",
        productDatas: response,
      });
    } catch (error) {
      reject(error);
    }
  });
export const getProductsAdmin = ({
  page,
  limit,
  order,
  name,
  catalog,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { nest: true };
      const offsetStep = !page ? 1 : +page > 1 ? +page : 1;
      // const limitProducts = limit ? +limit : +process.env.LIMIT_PRODUCTS
      // queries.offset = offsetStep * limitProducts
      queries.limit = +process.env.LIMIT_PRODUCTS * +offsetStep;
      if (order) {
        queries.order = [order];
      }
      if (catalog) query.catalog = { [Op.substring]: catalog };
      if (name) query.name = { [Op.substring]: name };
      const data = {
        where: query,
        ...queries,
        include: [
          { model: db.Varriant, as: "variants" },
          { model: db.Vote, as: "votes" },
          {
            model: db.Bipro,
            as: "boughtProducts",
            include: [{ model: db.Bill, as: "billdata" }],
          },
        ],
        attributes: {
          exclude: ["images"],
        },
        order: [["updatedAt", "DESC"]],
      };
      const response = await db.Product.findAndCountAll(data);
      resolve({
        err: response ? 0 : 1,
        mes: response ? "Got" : "Something went wrong!",
        productDatas: response,
      });
    } catch (error) {
      reject(error);
    }
  });
export const getProductById = (pid) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.findOne({
        where: { id: pid },
        include: [
          { model: db.Varriant, as: "variants" },
          {
            model: db.Comment,
            as: "comments",
            include: [
              { model: db.User, as: "commentator", attributes: ["name", "id"] },
            ],
          },
          {
            model: db.Vote,
            as: "votes",
            include: [
              { model: db.User, as: "userData", attributes: ["name", "id"] },
            ],
          },
        ],
        order: [[{ model: db.Comment, as: "comments" }, "createdAt", "ASC"]],
        attributes: { exclude: ["uid"] },
      });
      await response.increment("views", { by: 1 });
      resolve({
        err: response ? 0 : 1,
        mes: response ? "Got" : "Something went wrong!",
        productDatas: response,
      });
    } catch (error) {
      reject(error);
    }
  });
export const ratings = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Vote.create(payload);
      resolve({
        err: response ? 0 : 1,
        mes: response ? "Ratings is successfully" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
export const getWishlists = (pids) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.findAll({
        where: { id: pids },
        attributes: ["name", "policy", "star", "thumb", "id", "discount"],
        include: [
          { model: db.Varriant, as: "variants" },
          { model: db.Vote, as: "votes" },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
export const getCarts = (pids) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.findAll({
        where: { id: pids },
        attributes: ["name", "policy", "star", "thumb", "id", "discount"],
        include: [
          { model: db.Varriant, as: "variants" },
          { model: db.Vote, as: "votes" },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const buyProducts = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const bid = genId();
      const bulkData = data.products.map((i) => ({ ...i, bid }));
      const response = await Promise.all([
        db.Bill.create({
          total: parseInt(data?.total),
          uid: data.uid,
          status: "Pending",
          type: data.type,
          id: bid,
          coupon: data.coupon + "",
          isChecked: false,
        }),
        db.Bipro.bulkCreate(bulkData),
      ]);
      data?.products?.forEach(async (el) => {
        const rs = await db.Product.findByPk(el.pid);
        if (rs) rs.decrement("quantity", { by: +el.quantity });
      });
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateProduct = (pid, payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.update(payload, { where: { id: pid } });
      resolve({
        err: response[0] ? 0 : 1,
        rs: response[0] ? "Updated" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const importProduct = (pid, payload, uid) =>
  new Promise(async (resolve, reject) => {
    try {
      const bid = genId();
      const bulkData = [
        {
          pid,
          bid,
          quantity: payload?.quantity || 0,
          preQuantity: payload?.preQuantity || 0,
          price: payload?.price || 0,
        },
      ];
      const response = await db.Product.update(
        { quantity: payload.quantity },
        { where: { id: pid } }
      );
      const res = await Promise.all([
        db.Billimport.create({
          pid,
          uid: uid,
          status: "Pending",
          id: bid,
          isChecked: false,
        }),
        db.Billdetail.bulkCreate(bulkData),
      ]);
      console.log(res);
      resolve({
        err: response[0] ? 0 : 1,
        rs: response[0] ? "Updated" : "Something went wrong!",
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });

export const createProduct = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.create({ ...payload, id: genId() });
      resolve({
        err: response ? 0 : 1,
        rs: response ? "Created" : "Something went wrong product services!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDashboard = ({ days, type, from, to }) =>
  new Promise(async (resolve, reject) => {
    try {
      const daysQuery = days || 220;
      const typeDate = type === "month" ? "%m-%y" : "%d-%m-%y";
      const start = from || Date.now() - daysQuery * 24 * 60 * 60 * 1000;
      const end = to || Date.now();
      const q = {};
      if (from && to) {
        if (from === to)
          q.createdAt = {
            [Op.and]: [
              { [Op.gte]: `${from} 00:00:00` },
              { [Op.lte]: `${from} 23:59:59` },
            ],
          };
        else
          q.createdAt = {
            [Op.and]: [
              { [Op.lte]: `${end} 23:59:59` },
              { [Op.gte]: `${start} 00:00:00` },
            ],
          };
      }
      const [soldChart, customer] = await Promise.all([
        db.Bipro.findAll({
          where: q,
          attributes: [
            [
              sequelize.fn("date_format", sequelize.col("createdAt"), typeDate),
              "shoppingDate",
            ],
            [sequelize.fn("SUM", sequelize.col("quantity")), "soldProducts"],
          ],
          group: "Bipro.createdAt",
          order: [["createdAt", "ASC"]],
        }),
        db.Bill.findAll({
          include: [{ model: db.User, attributes: ["name"], as: "customer" }],
          attributes: { exclude: ["uid", "updatedAt"] },
        }),
      ]);
      const [visited, statusChart, rs] = await Promise.all([
        db.Visited.findAll({
          attributes: [
            [sequelize.fn("sum", sequelize.col("times")), "visited"],
          ],
          raw: true,
        }),
        db.Bill.findAll({
          where: q,
          // Tính tổng và gộp nhóm theo trường
          attributes: [
            "status",
            [sequelize.fn("count", sequelize.col("status")), "statusBill"],
            [sequelize.fn("sum", sequelize.col("total")), "totalsBill"],
          ],
          group: "status",
        }),
        db.Bipro.findAll({
          where: q,
          // Format dữ liệu trả về theo tổng
          attributes: [
            [sequelize.fn("sum", sequelize.col("quantity")), "soldProducts"],
            [sequelize.fn("sum", sequelize.col("price")), "totals"],
          ],
          raw: true,
        }),
      ]);
      resolve({
        err: visited ? 0 : 1,
        rs: { ...visited[0], ...rs[0], soldChart, statusChart, customer },
      });
    } catch (error) {
      reject(error);
    }
  });

export const changeStatus = (data, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Bill.update(
        { ...data, isChecked: true },
        { where: { id } }
      );
      resolve({
        err: response ? 0 : 1,
        rs: response ? "updated" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
export const getBills = ({ limit, page, order, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = !page || +page <= 1 ? 0 : Number(page);
      const lt = Number(limit) || 20;
      const queries = {};
      if (order) queries.order = [order];
      const query = {};
      // Filter trong include
      if (name) query["$customer.name$"] = { [Op.substring]: name };
      const response = await db.Bill.findAndCountAll({
        where: query,
        limit: lt,
        offset: lt * offset,
        ...queries,
        attributes: { exclude: ["uid", "updatedAt"] },
        include: [
          { model: db.User, attributes: ["name"], as: "customer" },
          { model: db.Coupon, as: "selectedCoupon" },
          {
            model: db.Bipro,
            as: "billDetails",
            // Include lồng include
            include: [
              {
                model: db.Product,
                as: "products",
                attributes: ["name", "thumb", "discount", "id"],
              },
            ],
          },
          { model: db.Coupon, as: "selectedCoupon" },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getImportBill = ({ limit, page, order, name }) =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = !page || +page <= 1 ? 0 : Number(page);
      const lt = Number(limit) || 20;
      const queries = {};
      if (order) queries.order = [order];
      const query = {};
      // Filter trong include
      if (name) query["$customer.name$"] = { [Op.substring]: name };
      const response = await db.Billimport.findAndCountAll({
        where: query,
        limit: lt,
        offset: lt * offset,
        ...queries,
        attributes: { exclude: ["uid", "updatedAt"] },
        include: [
          { model: db.User, attributes: ["name"], as: "customer" },
          {
            model: db.Billdetail,
            as: "billDetail",
            // Include lồng include
            include: [
              {
                model: db.Product,
                as: "products",
                attributes: ["name", "thumb", "discount", "id"],
              },
            ],
          },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteProduct = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.destroy({ where: { id } });
      resolve({
        err: response ? 0 : 1,
        rs: response ? "Deleted" : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateVariants = (id, { thumb, name, images, price }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await Promise.all([
        db.Product.update({ thumb: thumb[0].path }, { where: { id } }),
        db.Varriant.create({
          name,
          sku: uniqid(),
          price,
          images: [images.map((el) => el.path), images.map((el) => el.path)],
          pid: id,
        }),
      ]);
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });
export const getCartAnon = (pids) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.findAll({
        where: { id: pids },
      });
      resolve({
        err: response ? 0 : 1,
        rs: response ? response : "Something went wrong!",
      });
    } catch (error) {
      reject(error);
    }
  });

// New
// nhap nhieu
// 1
export const importManyProducts = async (data, userId) => {
  try {
    const response = await prisma.hoaDonNhap.create({
      data: {
        maHoaDon: getCode(),
        status: "pending",
        hoaDons: {
          createMany: {
            data: data?.hoaDons?.map((i) => ({
              maHoaDon: getCode(),
              customerId: Number(userId),
              productId: i.productId,
              quantity: i.quantity,
              note: i?.note || "",
            })),
          },
        },
        shipper: data?.shipper,
        user: data?.user,
        date: data?.date,
        note: data?.note || "",
      },
      include: {
        hoaDons: {
          select: {
            id: true,
            productId: true,
          },
        },
      },
    });

    await Promise.all(
      data?.hoaDons?.map(async (i) => {
        await prisma.theKho.create({
          data: {
            date: data?.date,
            productId: i.productId,
            type: "nhap",
            hoaDonId: response?.hoaDons?.find(
              (j) => j?.productId === i?.productId
            )?.id,
          },
        });
      })
    );

    if (response?.id) {
      await Promise.all(
        data?.hoaDons?.map(async (i) => {
          await prisma.product.update({
            where: {
              id: i?.productId,
            },
            data: {
              quantity: {
                increment: i?.quantity,
              },
            },
          });
        })
      );
    }

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

//xuat nhieu
//2
export const exportManyProducts = async (data, userId) => {
  try {
    const response = await prisma.hoaDonXuat.create({
      data: {
        maHoaDon: getCode(),
        status: "pending",
        hoaDons: {
          createMany: {
            data: data?.hoaDons?.map((i) => ({
              maHoaDon: getCode(),
              // customer: {
              //     connect: {
              //         id: Number(userId)
              //     }
              // },
              customerId: Number(userId),
              // product: {
              //     connect: {
              //         id: i.productId
              //     }
              // },
              productId: i.productId,
              quantity: i.quantity,
              note: i?.note || "",
            })),
          },
        },
        shipper: data?.shipper,
        user: data?.user,
        date: data?.date,
        note: data?.note || "",
      },
      include: {
        hoaDons: {
          select: {
            id: true,
            productId: true,
          },
        },
      },
    });

    await Promise.all(
      data?.hoaDons?.map(async (i) => {
        await prisma.theKho.create({
          data: {
            date: data?.date,
            productId: i.productId,
            type: "xuat",
            hoaDonId: response?.hoaDons?.find(
              (j) => j?.productId === i?.productId
            )?.id,
          },
        });
      })
    );

    if (response?.id) {
      await Promise.all(
        data?.hoaDons?.map(async (i) => {
          await prisma.product.update({
            where: {
              id: i?.productId,
            },
            data: {
              quantity: {
                decrement: i?.quantity,
              },
            },
          });
        })
      );
    }

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

// get all phieu nhap
//3
export const getImportProductDetailsAll = async () => {
  try {
    const allProducts = await prisma.hoaDonNhap.findMany({
      include: {
        hoaDons: {
          include: {
            product: true,
            hoaDonNhap: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return allProducts;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

export const getExportProductDetailsAll = async () => {
  try {
    const allProducts = await prisma.hoaDonXuat.findMany({
      include: {
        hoaDons: {
          include: {
            product: true,
            hoaDonXuat: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    console.log(allProducts);
    return allProducts;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

//chi tiet phieu nhap
//4
export const getImportProductDetails = async (id) => {
  try {
    const data = await prisma.hoaDonNhap.findFirst({
      where: {
        OR: [
          {
            maHoaDon: id,
          },
          {
            id: Number(id),
          },
          {
            hoaDons: {
              some: {
                id: Number(id),
              },
            },
          },
        ],
      },
      include: {
        hoaDons: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "desc", // Sort theo createdAt giảm dần
          },
        },
      },
    });

    const output = {
      ...data,
      hoaDons: data?.hoaDons?.map((i) => ({
        ...i,
        oldQuantity: i?.product?.quantity - i?.quantity,
        newQuantity: i?.product?.quantity,
      })),
    };

    return output;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

// chi tiet phieu xuat
//5
export const getExportProductDetails = async (id) => {
  try {
    const data = await prisma.hoaDonXuat.findFirst({
      where: {
        OR: [
          {
            maHoaDon: id,
          },
          {
            id: Number(id),
          },
          {
            hoaDons: {
              some: {
                id: Number(id),
              },
            },
          },
        ],
      },
      include: {
        hoaDons: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "desc", // Sort theo createdAt giảm dần
          },
        },
      },
    });

    const output = {
      ...data,
      hoaDons: data?.hoaDons?.map((i) => ({
        ...i,
        oldQuantity: i?.product?.quantity + i?.quantity,
        newQuantity: i?.product?.quantity,
      })),
    };

    return output;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

// the kho nhap
//6
export const getImportProductsCard = async (id) => {
  try {
    const data = await prisma.hoaDonNhap.findMany({
      where: {
        OR: [
          {
            hoaDons: {
              every: {
                productId: id,
              },
            },
          },
          {
            maHoaDon: id,
          },
        ],
      },
      include: {
        hoaDons: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                desc: true,
                quantity: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Sort theo createdAt giảm dần
          },
        },
      },
    });

    const output = [
      ...data?.map((i) => ({
        ...i,
        hoaDons: i?.hoaDons?.map((i) => ({
          ...i,
          oldQuantity: i?.product?.quantity - i?.quantity,
          newQuantity: i?.product?.quantity,
        })),
      })),
    ];

    return output;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

// the kho xuat
//7
export const getExportProductsCard = async (id) => {
  try {
    const data = await prisma.hoaDonXuat.findMany({
      where: {
        OR: [
          {
            hoaDons: {
              every: {
                productId: id,
              },
            },
          },
          {
            maHoaDon: id,
          },
        ],
      },
      include: {
        hoaDons: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                desc: true,
                quantity: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Sort theo createdAt giảm dần
          },
        },
      },
    });

    const output = [
      ...data?.map((i) => ({
        ...i,
        hoaDons: i?.hoaDons?.map((i) => ({
          ...i,
          oldQuantity: i?.product?.quantity + i?.quantity,
          newQuantity: i?.product?.quantity,
        })),
      })),
    ];

    return output;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

//the kho all
//8
export const getAllTheKhos = async (query, mode = "desc") => {
  try {
    const { keyword, startDate, endDate } = query;

    // Xử lý giá trị mặc định cho startDate và endDate
    const _startDate = query?.startDate
      ? moment(query.startDate)
      : moment().startOf("day");
    const _endDate = query?.endDate
      ? moment(query.endDate)
      : moment().endOf("day");

    const sd = _startDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    const ed = _endDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    console.log(sd, ed, keyword);

    const data = await prisma.theKho.findMany({
      include: {
        hoaDon: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                quantity: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            hoaDonNhap: true,
            hoaDonXuat: true,
          },
        },
        product: true,
      },
      where: {
        OR: [
          {
            date: {
              gte: sd,
              lte: ed,
            },
          },
          {
            createdAt: {
              gte: sd,
              lte: ed,
            },
          },
        ],
        product: {
          OR: [
            {
              name: {
                contains: keyword || "",
              },
            },
            {
              brand: {
                contains: keyword || "",
              },
            },
          ],
        },
      },
      orderBy: {
        date: mode, // Sắp xếp theo date theo chiều giảm dần
      },
    });

    const output = [
      ...data?.map((i) => ({
        ...i,
        hoaDon: {
          ...i?.hoaDon,
          oldQuantity: i?.product?.quantity - i?.hoaDon?.quantity,
          newQuantity: i?.product?.quantity,
        },
      })),
    ];

    return output;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};
