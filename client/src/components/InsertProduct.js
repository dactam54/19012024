import React, { memo, useRef, useState } from "react";
import { InputField } from "./";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import {
  apiUpdateProduct,
  apiCreateProduct,
  apiImportProduct,
} from "../apis/product";

const InsertProduct = ({
  product,
  setIsEdit,
  setIsCreate,
  isImport = false,
}) => {
  const { brands } = useSelector((state) => state.app);

  const editorRef = useRef(null);

  const [payload, setPayload] = useState({
    name: product?.name || "",
    catalog: product?.catalog || "",
    brand: product?.brand || "",
    quantity: product?.quantity || "",
    thumb: product?.thumb || "",
    desc: product?.desc || "",
    detail: product?.detail || [],
    policy: product?.policy
      ? typeof product?.policy !== "object"
        ? product.policy
        : product?.policy?.join(". ")
      : "",

    overviews: product?.overviews || [],
    // price :product?.price || 0,
    plus: 0,
  });
  const [overview, setOverview] = useState({
    key: "",
    values: "",
  });
  const [detail, setDetail] = useState({
    groupName: "",
    groupList: [],
  });
  const [detailOne, setDetailOne] = useState({
    key: "",
    values: "",
  });

  const handleUpdateProduct = async () => {
    if (isImport) {
  
    } else if (setIsEdit) {
      const response = await apiUpdateProduct(product.id, {
        ...payload,
        quantity: Number(payload.quantity) + Number(payload.plus),
      });

      if (response.err === 0) {
        toast.success("Cập nhật thành công!!!");
        setIsEdit(false);
      }
    }

    if (setIsCreate) {
      const response = await apiCreateProduct({
        ...payload,
        // desc: editorRef.current?.getContent(),
      });
      if (response.err === 0) {
        toast.success("Tạo mới thành công");
        setIsCreate(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center pb-[100px]">
      <div className="flex w-full items-center justify-between border-b border-gray-200">
        <h3 className="font-bold text-[30px] pb-4 ">
          {setIsCreate ? "Tạo mới sản phẩm" : "Chỉnh sửa sản phẩm"}
        </h3>
        <button
          type="button"
          onClick={() => {
            setIsCreate && setIsCreate(false);
            setIsEdit && setIsEdit(false);
          }}
          className="py-2 px-4 bg-orange-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
        >
          <span>Hủy bỏ</span>
        </button>
      </div>

      <div className="py-8 flex flex-col gap-2 w-[70%]">
        {!setIsCreate && (
          <InputField preValue={"Product ID: "} onlyRead value={product.id} />
        )}

        <div className="flex ">
          <InputField
            preValue={"Tên sản phẩm: "}
            value={payload.name}
            nameKey="name"
            setValue={setPayload}
          />
        </div>

        <div className="flex gap-4">
          <InputField
            preValue={"Loại hàng: "}
            value={payload.catalog}
            nameKey="catalog"
            setValue={setPayload}
          />
          <InputField
            preValue={"Số lượng: "}
            value={isImport ? payload.plus : payload.quantity}
            nameKey={isImport ? "plus" : "quantity"}
            setValue={setPayload}
          />
        </div>

        {!isImport && (
          <div className="flex gap-4 py-4">
            <h1 className="font-bold ">Nhãn hiệu:</h1>

            <select
              value={payload.brand}
              className="bg-gray-100 w-full rounded-l-full rounded-r-full py-2 px-4"
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, brand: e.target.value }))
              }
            >
              <option value="">--Choose brand--</option>
              {brands?.map((item) => (
                <option value={item.name} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isImport && (
          <div className="flex flex-col gap-2 border-t py-4">
            <span className="font-bold">Tổng quan thông số kỹ thuật:</span>

            <div className="flex gap-4 rounded-md py-4 px-8">
              <input
                type="text"
                placeholder="Đặc tính"
                className="py-2 px-4 border rounded-md"
                value={overview.key}
                onChange={(e) =>
                  setOverview((prev) => ({ ...prev, key: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Mô tả đặc tính"
                className="py-2 px-4 border rounded-md"
                value={overview.values}
                onChange={(e) =>
                  setOverview((prev) => ({ ...prev, values: e.target.value }))
                }
              />
              <button
                type="button"
                className="px-4 py-2 text-white font-semibold bg-main rounded-md"
                onClick={() =>
                  setPayload((prev) => ({
                    ...prev,
                    overviews: [...prev.overviews, overview],
                  }))
                }
              >
                Thêm
              </button>
            </div>

            <div>
              <span className="font-medium text-main">Preview:</span>
              {payload?.overviews?.map((el) => (
                <div key={el.key}>
                  <span className="font-medium">{el.key + ": "}</span>
                  <span>
                    {typeof el.values === "string"
                      ? el.values
                      : el?.values?.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isImport && (
          <div className="flex flex-col gap-2 border-t py-4">
            <span className="font-bold">Thông số kỹ thuật:</span>
            <div className="flex gap-4 rounded-md py-4 px-8">
              <input
                type="text"
                placeholder="Thêm đặc tính sản phẩm"
                className="py-2 px-4 border rounded-md"
                value={detail.groupName}
                onChange={(e) =>
                  setDetail((prev) => ({ ...prev, groupName: e.target.value }))
                }
              />
              <button
                type="button"
                className="px-4 py-2 text-white font-semibold bg-main rounded-md"
                onClick={() => {
                  setPayload((prev) => ({
                    ...prev,
                    detail: [...prev.detail, detail],
                  }));
                  setDetail({
                    groupList: [],
                    groupName: "",
                  });
                  toast.info("ADDED");
                }}
              >
                Push
              </button>
            </div>
            <div className="flex gap-4 rounded-md px-8">
              <input
                type="text"
                placeholder="Đặc tính"
                className="py-2 px-4 border rounded-md"
                value={detailOne.key}
                onChange={(e) =>
                  setDetailOne((prev) => ({ ...prev, key: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Mô tả đặc tính"
                className="py-2 px-4 border rounded-md"
                value={detailOne.values}
                onChange={(e) =>
                  setDetailOne((prev) => ({ ...prev, values: e.target.value }))
                }
              />
              <button
                type="button"
                className="px-4 py-2 text-white font-semibold bg-main rounded-md"
                onClick={() => {
                  setDetail((prev) => ({
                    ...prev,
                    groupList: [...prev.groupList, detailOne],
                  }));
                  setDetailOne({
                    key: "",
                    values: "",
                  });
                  toast.info("ADDED");
                }}
              >
                Thêm
              </button>
            </div>
            <div>
              <span className="font-medium text-main">Preview:</span>
              {payload?.detail?.map((el) => (
                <div key={el.groupName}>
                  <span className="font-medium">{el.groupName}</span>
                  {el.groupList.map((item) => (
                    <div key={item.key}>
                      <span className="">{item.key + ": "}</span>
                      <span className="italic">
                        {typeof item.values === "string"
                          ? item.values
                          : item?.values?.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isImport && (
          <div className="flex flex-col gap-2 border-t py-4">
            <span className="font-bold">Chính sách:</span>
            <textarea
              cols="30"
              rows="5"
              value={payload?.policy}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, policy: e.target.value }))
              }
              className="flex border rounded-md p-2"
              placeholder="Các chính sách, khuyến mãi áp dụng cho sản phẩm"
            ></textarea>
          </div>
        )}

        {!isImport && (
          <div className="flex flex-col gap-2 border-t py-4">
            <span className="font-bold">Mô tả sản phẩm:</span>
            <Editor
              apiKey="wmtf9tg6tu59bcfn55m6ytf62l61ckkerdn8per849gatpt4"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={payload.desc}
              init={{
                height: 700,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        className="py-2 px-4 bg-blue-600 rounded-md text-white font-semibold flex items-center justify-center gap-2"
        onClick={handleUpdateProduct}
      >
        <span>{setIsCreate ? "Tạo mới" : "Cập nhật"}</span>
      </button>
    </div>
  );
};

export default memo(InsertProduct);
