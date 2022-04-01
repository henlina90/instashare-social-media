import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiPlus, HiSearch } from "react-icons/hi";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-4 w-full mt-4 pb-8 bg-neutral-100">
      <div className="flex justify-start items-center w-full px-4 bg-white rounded-full border-none outline-none">
        <HiSearch fontSize={21} />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="w-full bg-white outline-none ml-2"
        />
      </div>
      <div className="flex gap-2">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user?.image}
            alt="user-pic"
            className="w-14 h-12 rounded-full "
          />
        </Link>
        <Link
          to="/create-pin"
          className="bg-neutral-800 hover:bg-neutral-700 text-white rounded w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
        >
          <HiPlus className="text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
