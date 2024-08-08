import React from "react";
import "./ImageLoader.css";

// this loader is from https://uiverse.io/funkyjuice213/chilly-fireant-79

function ImageLoader() {
  return (
    <div className="w-full min-h-40 bg-background flex justify-center my-4">
      <div className="image-loader my-auto">
        <div className="loader-bar bar-1"></div>
        <div className="loader-bar bar-2"></div>
        <div className="loader-bar bar-3"></div>
        <div className="loader-bar bar-4"></div>
      </div>
    </div>
  );
}

export default ImageLoader;
