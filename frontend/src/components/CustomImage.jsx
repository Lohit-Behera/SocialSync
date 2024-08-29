import React from "react";
import { useState } from "react";
import ImageLoader from "./Loader/ImageLoader/ImageLoader";
import ErrorImage from "../assets/image not found.svg";
import { baseUrl } from "@/features/Proxy";

function CustomImage({
  className,
  src,
  alt,
  onClick,
  absolute = false,
  noUrl = false,
  hover = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imagesStyle = {
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
  };

  const imageLoaded = () => {
    setLoaded(true);
  };

  return (
    <div
      className={`${className} ${
        absolute ? "absolute" : "relative"
      } flex justify-center mx-auto rounded-lg ${
        hover &&
        "duration-200 hover:drop-shadow-[0_0px_12px_rgba(225,29,72,0.7)] ease-in-out"
      }`}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 w-full h-full min-h-40 flex items-center justify-center bg-background"
        style={{
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <ImageLoader />
      </div>
      <img
        className="w-full h-full object-cover rounded-lg"
        src={error ? ErrorImage : noUrl ? src : `${baseUrl}${src}`}
        alt={alt}
        style={imagesStyle}
        onLoad={imageLoaded}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}

export default CustomImage;
