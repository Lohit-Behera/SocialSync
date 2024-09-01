import React, { useRef, useState, useEffect } from "react";
import {
  CornerUpLeft,
  CornerUpRight,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCw,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import CustomImage from "./CustomImage";
import { baseUrl } from "@/features/Proxy";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function VideoPlayer({
  videoSrc,
  thumbnailSrc,
  height = "",
  glow = "50",
  hover = false,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState(0);
  const [end, setEnd] = useState(false);
  const [error, setError] = useState(false);

  const handleVideoClick = () => {
    setShowThumbnail(false);
    setEnd(false);
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

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else if (videoRef.current) {
      divRef.current.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const handleSetTime = (e) => {
    const time = e.target.value;
    setCurrentTimeSec(time);
    videoRef.current.currentTime = time;
  };

  const handleKeys = (e) => {
    e.preventDefault();
    if (e.key === " ") {
      handleVideoClick();
    } else if (e.key === "f") {
      handleToggleFullscreen();
    } else if (e.key === "ArrowRight") {
      handleSetTime({
        target: { value: currentTimeSec + 5 },
      });
    } else if (e.key === "ArrowLeft") {
      handleSetTime({
        target: { value: currentTimeSec - 5 },
      });
    }
  };

  const sec2Min = (sec) => {
    if (Number.isNaN(sec)) return { min: 0, sec: 0 };
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return {
      min: min,
      sec: secRemain,
    };
  };

  useEffect(() => {
    const { min, sec } = sec2Min(videoRef.current.duration);
    setDurationSec(videoRef.current.duration || 0);
    setDuration([min, sec]);

    const interval = setInterval(() => {
      const { min, sec } = sec2Min(videoRef.current.currentTime);
      setCurrentTimeSec(videoRef.current.currentTime);
      setCurrentTime([min, sec]);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

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
    <div
      ref={divRef}
      tabIndex="0"
      className={`w-full ${height} flex justify-center mx-auto rounded-lg relative mb-5 focus:outline-none`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={(e) => {
        handleKeys(e);
      }}
    >
      <CustomImage
        onClick={handleVideoClick}
        src={thumbnailSrc}
        alt="thumbnail"
        className={`w-full object-cover absolute inset-0 z-20 rounded-lg ${
          showThumbnail ? "opacity-100" : "opacity-0"
        }`}
        absolute
        hover={hover}
      />
      <video
        className="w-full rounded-lg relative z-10 "
        ref={videoRef}
        onClick={handleVideoClick}
        poster={baseUrl + thumbnailSrc}
        onEnded={() => {
          setEnd(true);
          setShowThumbnail(true);
        }}
        onError={() => setError(true)}
      >
        <source src={baseUrl + videoSrc} type="video/mp4" />
      </video>
      {!hover && !end && (
        <>
          {isHovering && !showThumbnail && (
            <>
              <div className="w-full h-[30%] absolute bottom-0 left-0 z-20 pointer-events-none bg-gradient-to-t from-black opacity-80 to-transparent rounded-lg"></div>
              <div className="absolute bottom-0.5 md:bottom-2 z-40 w-full flex justify-between">
                <div className="flex space-x-2 ml-1">
                  {isPlaying ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Pause
                            className="w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                            strokeWidth={1}
                            fill="#fff"
                            color="#ffffff"
                            onClick={handleVideoClick}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pause</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Play
                            className="w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                            fill="#fff"
                            color="#ffffff"
                            onClick={handleVideoClick}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Play</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <span className="ml-2 text-sm md:text-base my-auto">
                    {currentTime[0]}:{currentTime[1] < 10 && "0"}
                    {currentTime[1]} / {duration[0]}:{duration[1] < 10 && "0"}
                    {duration[1]}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CornerUpLeft
                          className="ml-2w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                          onClick={() =>
                            handleSetTime({
                              target: { value: currentTimeSec - 5 },
                            })
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>5 seconds backward</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CornerUpRight
                          className="ml-2w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                          onClick={() =>
                            handleSetTime({
                              target: { value: currentTimeSec + 5 },
                            })
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>5 seconds forward</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mr-2">
                  {isFullScreen ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Minimize
                            className="w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                            onClick={handleToggleFullscreen}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimize</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Maximize
                            className="w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                            onClick={handleToggleFullscreen}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximize</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={durationSec}
                default="0"
                value={currentTimeSec}
                className="absolute inset-x-0 bottom-7 md:bottom-11 z-30 transparent h-[4px] md:h-[8px] w-full cursor-pointer accent-primary border-transparent"
                onChange={(e) => handleSetTime(e)}
                onEnded={() => setEnd(false)}
              />
            </>
          )}
        </>
      )}

      {/* error */}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full z-30 flex flex-col justify-center items-center pointer-events-none bg-gray-400 text-base md:text-lg font-semibold rounded-lg">
          <TriangleAlert className="mb-1 w-[30%] md:w-[50%] h-[30%] md:h-[50%]  " />
          &nbsp;SomeThing went wrong
        </div>
      )}
      {/* replay */}
      {end && (
        <div className="absolute top-0 left-0 w-full h-full z-30 flex justify-center items-center pointer-events-none">
          <span className="bg-black/60 rounded-full p-1 md:p-4 ">
            <RotateCw className="w-10 h-10" />
          </span>
        </div>
      )}
      {/* play */}
      {!isPlaying && !error && (
        <div className="absolute top-0 left-0 w-full h-full z-30 flex justify-center items-center pointer-events-none">
          <span className="bg-black/60 rounded-full p-1 md:p-4 ">
            <Play className="w-10 h-10" fill="#fff" color="#ffffff" />
          </span>
          {isBuffering && <Loader2 className="w-10 h-10 animate-spin" />}
        </div>
      )}
      {/* buffer */}

      {isPlaying && (
        <>
          {isBuffering && (
            <div className="absolute top-0 left-0 w-full h-full z-40 flex justify-center items-center">
              <Loader2 className="w-14 h-14 animate-spin" strokeWidth={3} />
            </div>
          )}
        </>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0 z-0"
        style={{
          filter: `blur(${glow + isFullScreen && 200}px)`,
          WebkitFilter: `blur(${glow + isFullScreen && 200}px)`,
        }}
      ></canvas>
    </div>
  );
}

export default VideoPlayer;
