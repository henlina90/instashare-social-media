import React from "react";
import { NavLink, Link } from "react-router-dom";

import { categories } from "../utils/data";

const isNotActiveStyle =
  "flex items-center px-4 gap-2 text-stone-500 hover:text-stone-900 transition-all duration-200 ease-in-out capitalize";

const isActiveStyle =
  "flex items-center px-4 gap-2 border-r-2 border-stone-900 transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-neutral-100 h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="logo flex px-4 gap-2 mb-4 pt-4 w-190 items-center"
        >
          sharepin
        </Link>
        <div className="flex flex-col gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
          >
            {/* <HiHome className="text-2xl" /> */}
            Home
          </NavLink>
          <h3 className=" px-4 text-base 2xl:text-xl">Cateogries</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              {/* <img
                src={category.image}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="category"
              /> */}
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-4 mb-3 gap-2 p-2 items-center bg-white rounded-md shadow-lg mx-4"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="w-8 h-8 rounded-full"
            alt="user-profile"
          />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
