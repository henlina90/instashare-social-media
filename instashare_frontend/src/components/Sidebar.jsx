import React from "react";
import { NavLink, Link } from "react-router-dom";
import { categories } from "../utils/data";

const isNotActiveStyle =
  "flex items-center px-4 gap-2 text-zinc-900 hover:text-zinc-700 transition-all duration-200 ease-in-out capitalize";

const isActiveStyle =
  "flex items-center px-4 gap-2 border-r-4   border-zinc-800 transition-all duration-200 ease-in-out font-bold";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div
      className="flex flex-col justify-between
    h-full overflow-y-scroll min-w-210 hide-scrollbar p-2 bg-white"
    >
      <div className="flex flex-col">
        <Link
          to="/"
          className="logo text-red-700 flex px-4 gap-2 mb-4 pt-4 w-190 items-center"
        >
          <img src="/logo.png" alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
          >
            {/* <HiHome className="text-2xl" /> */}
            <p className="text-zinc-900">Home</p>
          </NavLink>
          <h3 className="px-4 text-zinc-900 2xl:text-xl">Categories</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="align-center flex my-4 mb-3 gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2 px-4 rounded-full"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="align-center justify-center w-6 h-6 rounded-full"
            alt="user-profile"
          />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
