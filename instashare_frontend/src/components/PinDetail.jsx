import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { HiOutlineDownload } from "react-icons/hi";

import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner />;

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-stone-50 p-4"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-xs"
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
            />
          </div>
          <div className="w-full p-4 flex-1 xl:min-w-620">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                className="flex items-center justify-center bg-stone-100 p-4 rounded-full"
              >
                <HiOutlineDownload className="mr-2" />
                <p className="text-sm">Download</p>
              </a>
            </div>
            <div>
              <h1 className="text-xl font-bold break-words mt-4">
                {pinDetail.title}
              </h1>
              <Link
                to={`/user-profile/${pinDetail?.postedBy._id}`}
                className="flex gap-2 mt-4 items-center"
              >
                <img
                  src={pinDetail?.postedBy.image}
                  className="w-4 h-4 rounded-full"
                  alt="user-profile"
                />
                <p className="font-semibold">{pinDetail?.postedBy.userName}</p>
              </Link>
              <p className="mt-4">{pinDetail.about}</p>
              <div className="mt-4">
                <a
                  href={pinDetail.destination}
                  target="_blank"
                  rel="noreferrer"
                  className="w-4 h-4"
                >
                  {pinDetail.destination}
                </a>
              </div>
            </div>
            <div>
              <p className="mt-12 text-lg">Comments</p>
              <div className="max-h-370 overflow-y-auto">
                {pinDetail?.comments?.map((item) => (
                  <div
                    className="flex gap-2 mt-4 items-center p-4 bg-white rounded-lg"
                    key={item.comment}
                  >
                    <img
                      src={item.postedBy?.image}
                      className="w-8 h-8 rounded-full cursor-pointer"
                      alt="user-profile"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">{item.postedBy?.userName}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap mt-8 gap-2">
                <Link to={`/user-profile/${user._id}`}>
                  <img
                    src={user.image}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>
                <input
                  className="flex-1 outline-none border-1 bg-stone-100 p-2 rounded-full focus:border-stone-900"
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-stone-900 text-white rounded-full px-8 text-base outline-none"
                  onClick={addComment}
                >
                  {addingComment ? "Doing..." : "Done"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        {pins?.length > 0 && <p className="text-lg mb-2">Related Pins</p>}
        {pins ? <MasonryLayout pins={pins} /> : <Spinner />}
      </div>
    </>
  );
};

export default PinDetail;
