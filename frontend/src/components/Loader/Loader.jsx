import React from "react";
import "./Loader.css";

// this loader is from here https://uiverse.io/Nawsome/ugly-skunk-66
function Loader({ hightfull = false }) {
  return (
    <div
      className={`${
        hightfull ? "min-h-[80vh]" : "min-h-96"
      } w-full flex justify-center items-center`}
    >
      <div className="container">
        <div className="global-Loader"></div>
        <div className="global-Loader"></div>
        <div className="global-Loader"></div>
      </div>
    </div>
  );
}

export default Loader;
