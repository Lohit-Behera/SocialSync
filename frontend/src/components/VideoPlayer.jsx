import { Play } from "lucide-react";
import React, { useRef, useState } from "react";

function VideoPlayer({ videoSrc, thumbnailSrc, height = "" }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const handleVideoClick = () => {
    setShowThumbnail(false);
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video !== videoRef.current && !video.paused) {
        setIsPlaying(false);
        video.pause();
      }
    });

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative hover:cursor-pointer">
      <img
        onClick={handleVideoClick}
        src={thumbnailSrc}
        alt="thumbnail"
        className={`w-full object-cover absolute top-0 left-0 z-10 rounded-lg ${
          showThumbnail ? "opacity-100" : "opacity-0"
        }`}
      />
      <video
        className={`w-full ${height} mx-auto rounded-lg ${
          isPlaying ? "opacity-100" : "opacity-50"
        }`}
        ref={videoRef}
        src={videoSrc}
        loop
        onClick={handleVideoClick}
      />
      {!isPlaying && (
        <div className="absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center pointer-events-none  ">
          <Play className="w-10 h-10 " fill="#fff" color="#ffffff" />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
