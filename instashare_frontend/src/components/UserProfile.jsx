import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

import { userCreatedPinsQuery } from "../utils/data";
import { userQuery } from "../utils/data";
import { userSavedPinsQuery } from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-neutral-800 text-white py-2 px-4 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-neutral-900 py-2 px-4 rounded-full w-20 outline-none";

// const randomImage =
//   "https://source.unsplash.com/1600x900/?nature,photography,technology";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      console.log(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-4">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            {/* <img
              src={randomImage}
              alt="random-pic"
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            /> */}
            <img
              src={user.image}
              alt="user-pic"
              className="mt-10 rounded-full w-20 h-20 object-cover"
            />
            <h1 className="font-bold text-xl text-center mt-4 mb-4">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded-full"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Logout
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mb-8">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No pins found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
