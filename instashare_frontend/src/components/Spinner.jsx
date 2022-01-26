import React from "react";
import { Grid } from "react-loader-spinner";

function Spinner({ message }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Grid
        type="Circles"
        color="#1c1917"
        height={50}
        width={200}
        className="m-20"
      />

      {/* <p className="text-sm text-center px-5">loading...</p> */}
    </div>
  );
}

export default Spinner;
