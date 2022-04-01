import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiUploadCloud2Fill, RiDeleteBin2Fill } from "react-icons/ri";

import Spinner from "./Spinner";
import { client } from "../client";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      // setLoading(false);
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);

      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-4 lg:h-4/5">
      {fields && (
        <p className="text-red-600 mb-5 text-xl transition-all duration-150 ease-in">
          All fields are required.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center lg:p-2 p-2 lg:w-4/5 w-full">
        <div className="bg-zinc-100 p-2 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border border-dashed rounded border-zinc-800 p-2 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-red-600 text-center">
                File type must be: JPG, JPEG, SVG, PNG, GIF or TIFF less than
                20MB
              </p>
            )}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col text-zinc-800 justify-center items-center">
                    <p className="text-4xl cursor-pointer">
                      <RiUploadCloud2Fill />
                    </p>
                    <p className="text-lg">Upload an image</p>
                  </div>
                  {/* <p className=" text-gray-400 text-xs">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB
                  </p> */}
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
                  onClick={() => setImageAsset(null)}
                >
                  <RiDeleteBin2Fill />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 lg:pl-4 mt-4 w-full">
          {/* {user && (
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-md">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )} */}
          <p className="font-bold">Pin Details</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write a caption..."
            className="outline-none text-base p-2 bg-white rounded"
          />

          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Add a short description..."
            className="outline-none text-base py-2 px-4 bg-white rounded"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add location or a destination link..."
            className="outline-none text-base py-2 px-4 bg-white rounded"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 text-zinc-800">Choose a category</p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="outline-none w-full text-base bg-white rounded py-2 px-4 cursor-pointer"
              >
                <option value="other" className="sm:text-bg bg-white">
                  Select an option
                </option>
                {categories.map((category) => (
                  <option
                    className="text-base outline-none bg-white text-zinc-800"
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-4">
              <button
                type="button"
                onClick={savePin}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded-full"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
