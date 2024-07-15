import { Play } from "lucide-react";
import React, { useRef, useState } from "react";

function VideoPlayer({ videoSrc, hight = "" }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  return (
    <div className={`relative hover:cursor-pointer`}>
      <video
        className={`w-full ${hight} mx-auto ${
          isPlaying ? "opacity-100" : "opacity-50"
        }`}
        ref={videoRef}
        src={videoSrc}
        loop
        onClick={handleVideoClick}
      />
      {!isPlaying && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
          <Play className="w-10 h-10" fill="#fff" />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
