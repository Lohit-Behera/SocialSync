import { Play } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

function VideoPlayer({ videoSrc, thumbnailSrc, height = "", glow = "50" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const updateCanvas = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(updateCanvas);
    };

    if (video) {
      video.addEventListener("play", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        updateCanvas();
      });

      video.addEventListener("waiting", () => setIsBuffering(true));
      video.addEventListener("playing", () => setIsBuffering(false));
    }

    return () => {
      if (video) {
        video.removeEventListener("waiting", () => setIsBuffering(true));
        video.removeEventListener("playing", () => setIsBuffering(false));
      }
    };
  }, []);

  return (
    <div className="relative hover:cursor-pointer mb-10">
      <img
        onClick={handleVideoClick}
        src={thumbnailSrc}
        alt="thumbnail"
        className={`w-full object-cover absolute top-0 left-0 z-20 rounded-lg ${
          showThumbnail ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`w-full ${height} mx-auto rounded-lg relative ${
          isPlaying ? "opacity-100" : "opacity-50"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="absolute w-full h-full top-0 left-0 z-0"
          style={{
            filter: `blur(${glow}px)`,
            WebkitFilter: `blur(${glow}px)`,
          }}
        ></canvas>
        <video
          className="w-full rounded-lg relative z-10"
          ref={videoRef}
          src={videoSrc}
          loop
          onClick={handleVideoClick}
        />
        {!isPlaying && (
          <div className="absolute top-0 left-0 w-full h-full z-30 flex justify-center items-center pointer-events-none">
            <Play className="w-10 h-10" fill="#fff" color="#ffffff" />
          </div>
        )}
        {isPlaying && (
          <>
            {isBuffering && (
              <div className="absolute top-0 left-0 w-full h-full z-40 flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
