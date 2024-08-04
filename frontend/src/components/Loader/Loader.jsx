import React from "react";
import "./Loader.css";

// this loader is from here https://uiverse.io/Nawsome/tender-swan-29
function Loader({ hightfull = false }) {
  return (
    <div
      className={`${
        hightfull ? "min-h-[80vh]" : "min-h-96"
      } w-full flex justify-center items-center`}
    >
      <div className="container">
        <div className="loader"></div>
        <div className="loader"></div>
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loader;
