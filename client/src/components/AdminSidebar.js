import React, { memo } from "react";
import { adminSidebar } from "../utils/constant";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { apiGetCurrent } from "../apis/user";
import icons from "../utils/icons";


const activedStyles =
  "flex gap-2 py-[13px] pr-[31px] pl-4 items-center bg-gray-200  rounded-md";
const notActivedStyles = "flex gap-2 py-[13px] pr-[31px] pl-4 items-center";

const AdminSidebar = () => {
  const { updateCurrent } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(null);

  const getCurrent = async () => {
    const response = await apiGetCurrent();
    if (response.err === 0) {
      setName(response.rs.name);
    }
  };

  useEffect(() => {
    if (isLoggedIn)
      setTimeout(() => {
        getCurrent();
      }, 500);
  }, [isLoggedIn, updateCurrent]);

  return (
    <div className="w-full flex flex-col">
    
      {adminSidebar.map((item) => (
        <NavLink
          key={item.path}
          to={`/${item.path}`}
          className={({ isActive }) =>
            isActive ? activedStyles : notActivedStyles
          }
        >
          <span>{item.icons}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}


    </div>
  );
};

export default memo(AdminSidebar);
