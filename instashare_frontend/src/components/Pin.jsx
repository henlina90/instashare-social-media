import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { HiOutlineDownload } from "react-icons/hi";
import { AiTwotoneDelete } from "react-icons/ai";
import { RiDeleteBin2Fill } from "react-icons/ri";

import { client, urlFor } from "../client";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();
  const user =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded w-full "
          src={urlFor(image).width(250).url()}
          alt="user-post"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-2 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-zinc-100 py-2 px-4 rounded-full flex items-center justify-center text-zinc-900 opacity-75 hover:opacity-100 outline-none"
                >
                  <HiOutlineDownload />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-zinc-100 text-sm py-2 px-4 rounded-full hover:shadow-md outline-none"
                >
                  Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-zinc-100 text-sm py-2 px-4 rounded-full hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              {user && (
                <Link
                  to={`/user-profile/${postedBy?._id}`}
                  className="w-fill py-2 px-4 rounded-full bg-zinc-100 opacity-70 hover:opacity-100 hover:shadow-md flex mt-2 items-center"
                >
                  <img
                    className="w-6 h-6 p-1 rounded-full object-cover "
                    src={postedBy?.image}
                    alt="user-profile"
                  />
                  <p className="text-sm">{postedBy?.userName}</p>
                </Link>
              )}
              {postedBy?._id === user?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full opacity-75 hover:opacity-100 outline-none"
                >
                  <RiDeleteBin2Fill />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
