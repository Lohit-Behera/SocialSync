import React, { useRef, useState, useEffect, useCallback } from "react";
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
  VolumeX,
  Volume2,
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
  const [showForwardAnimation, setShowForwardAnimation] = useState(false);
  const [backwardAnimation, setBackwardAnimation] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const [muteAnimation, setMuteAnimation] = useState(false);
  const [unmuteAnimation, setUnmuteAnimation] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Toggles play/pause state of the video on click.
  const handleVideoClick = useCallback(() => {
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
      setPlayAnimation(true);
      setTimeout(() => setPlayAnimation(false), 1000);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setPauseAnimation(true);
      setTimeout(() => setPauseAnimation(false), 1000);
    }
  }, []);

  // Toggles fullscreen on click.
  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else if (divRef.current) {
      divRef.current.requestFullscreen();
      setIsFullScreen(true);
    }
  }, []);

  // Sets the video time on change.
  const handleSetTime = useCallback((e) => {
    const time = e.target.value;
    setCurrentTimeSec(time);
    videoRef.current.currentTime = time;
  }, []);

  // Handles key presses.
  const handleKeys = useCallback(
    (e) => {
      e.preventDefault();
      if (e.key === " ") {
        handleVideoClick();
      } else if (e.key === "f") {
        handleToggleFullscreen();
      } else if (e.key === "ArrowRight") {
        handleSetTime({ target: { value: currentTimeSec + 5 } });
        setShowForwardAnimation(true);
        setTimeout(() => setShowForwardAnimation(false), 500);
      } else if (e.key === "ArrowLeft") {
        handleSetTime({ target: { value: currentTimeSec - 5 } });
        setBackwardAnimation(true);
        setTimeout(() => setBackwardAnimation(false), 500);
      } else if (e.key === "m") {
        handleToggleMute();
      }
    },
    [currentTimeSec, handleVideoClick, handleSetTime, handleToggleFullscreen]
  );

  // Handles volume change
  const handleVolumeChange = useCallback((e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === "0");
  }, []);

  // Handles volume toggle (mute/unmute)
  const handleToggleMute = useCallback(() => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
      setMuteAnimation(true);
      setTimeout(() => setMuteAnimation(false), 1000);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
      setUnmuteAnimation(true);
      setTimeout(() => setUnmuteAnimation(false), 1000);
    }
  }, [isMuted, volume]);

  // Converts seconds to minutes and seconds.
  const sec2Min = (sec) => {
    if (Number.isNaN(sec)) return { min: 0, sec: 0 };
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return { min, sec: secRemain };
  };

  // Exits fullscreen on escape.
  useEffect(() => {
    if (document.fullscreenElement && end) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, [end]);

  // Sets the video duration.
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

  // Draws the video on the canvas.
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
      onKeyDown={handleKeys}
      onDoubleClick={handleToggleFullscreen}
    >
      {/* Thumbnail */}
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

      {/* Video */}
      <video
        className="w-full rounded-lg relative z-10"
        ref={videoRef}
        onClick={handleVideoClick}
        poster={baseUrl + thumbnailSrc}
        onEnded={() => {
          setEnd(true);
          setShowThumbnail(true);
        }}
        onError={() => setError(true)}
        onDoubleClick={handleToggleFullscreen}
      >
        <source src={baseUrl + videoSrc} type="video/mp4" />
      </video>

      {/* Controls */}
      {!hover && !end && isHovering && !showThumbnail && (
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
                      className="ml-2 w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                      onClick={() => {
                        handleSetTime({
                          target: { value: currentTimeSec - 5 },
                        });
                        setBackwardAnimation(true);
                        setTimeout(() => setBackwardAnimation(false), 500);
                      }}
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
                      className="ml-2 w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                      onClick={() => {
                        handleSetTime({
                          target: { value: currentTimeSec + 5 },
                        });
                        setShowForwardAnimation(true);
                        setTimeout(() => setShowForwardAnimation(false), 500);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>5 seconds forward</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="mr-2 flex items-center relative group">
                {isMuted ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <VolumeX
                          className="w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                          onClick={handleToggleMute}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Unmute</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Volume2
                          className="w-4 md:w-6 h-4 md:h-6 hover:cursor-pointer"
                          onClick={handleToggleMute}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mute</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  className="accent-primary absolute opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out ml-7 h-1 cursor-pointer focus:outline-none"
                  onChange={handleVolumeChange}
                />
              </div>
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
            max={durationSec || 0}
            value={currentTimeSec}
            className="absolute inset-x-0 bottom-7 md:bottom-11 z-30 transparent h-[4px] md:h-[8px] w-full cursor-pointer accent-primary border-transparent"
            onChange={handleSetTime}
          />
        </>
      )}

      {/* forward animation */}
      {showForwardAnimation && (
        <div className="absolute inset-0 z-50 w-full h-full flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="w-[50px] h-[50px] flex justify-center items-center animate-zoom-in-fade-out overflow-hidden">
            <span className="bg-black/70 text-white p-2 rounded-full overflow-hidden">
              <span>+5s</span>
            </span>
          </div>
        </div>
      )}

      {/* backward animation */}
      {backwardAnimation && (
        <div className="absolute inset-0 z-50 w-full h-full flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="w-[50px] h-[50px] flex justify-center items-center animate-zoom-in-fade-out overflow-hidden">
            <span className="bg-black/70 text-white p-2 rounded-full overflow-hidden">
              <span>-5s</span>
            </span>
          </div>
        </div>
      )}

      {/* play animation */}
      {playAnimation && (
        <div className="absolute inset-0 z-50 w-full h-full flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="w-[50px] h-[50px] flex justify-center items-center animate-zoom-in-fade-out overflow-hidden">
            <span className="bg-black/70 text-white p-2 rounded-full overflow-hidden">
              <span>
                <Play fill="#fff" color="#ffffff" />
              </span>
            </span>
          </div>
        </div>
      )}

      {/* pause animation */}
      {pauseAnimation && (
        <div className="absolute inset-0 z-50 w-full h-full flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="w-[50px] h-[50px] flex justify-center items-center animate-zoom-in-fade-out overflow-hidden">
            <span className="bg-black/70 text-white p-2 rounded-full overflow-hidden">
              <span>
                <Pause strokeWidth={1} fill="#fff" color="#ffffff" />
              </span>
            </span>
          </div>
        </div>
      )}

      {/*unmute animation */}
      {muteAnimation && (
        <div className="absolute inset-0 z-50 w-full h-full flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="w-[50px] h-[50px] flex justify-center items-center animate-zoom-in-fade-out overflow-hidden">
            <span className="bg-black/70 text-white p-2 rounded-full overflow-hidden">
              <span>
                <Volume2 color="#ffffff" />
              </span>
            </span>
          </div>
        </div>
      )}

      {/* mute animation */}
      {unmuteAnimation && (
        <div className="absolute inset-0 z-50 w-full h-full flex justify-center items-center pointer-events-none overflow-hidden">
          <div className="w-[50px] h-[50px] flex justify-center items-center animate-zoom-in-fade-out overflow-hidden">
            <span className="bg-black/70 text-white p-2 rounded-full overflow-hidden">
              <span>
                <VolumeX color="#ffffff" />
              </span>
            </span>
          </div>
        </div>
      )}

      {/* error overlay */}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full z-30 flex flex-col justify-center items-center pointer-events-none bg-gray-400 text-base md:text-lg font-semibold rounded-lg">
          <TriangleAlert className="mb-1 w-[30%] md:w-[50%] h-[30%] md:h-[50%]" />
          &nbsp;Something went wrong
        </div>
      )}

      {/* replay  */}
      {end && (
        <div className="absolute top-0 left-0 w-full h-full z-30 flex justify-center items-center pointer-events-none">
          <span className="bg-black/60 rounded-full p-1 md:p-4">
            <RotateCw className="w-10 h-10" />
          </span>
        </div>
      )}

      {/* loading animation */}
      {isPlaying && isBuffering && (
        <div className="absolute top-0 left-0 w-full h-full z-40 flex justify-center items-center">
          <Loader2 className="w-14 h-14 animate-spin" strokeWidth={3} />
        </div>
      )}

      {/* video player canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0 z-0"
        style={{
          filter: `blur(${glow + (isFullScreen ? 200 : 0)}px)`,
          WebkitFilter: `blur(${glow + (isFullScreen ? 200 : 0)}px)`,
        }}
      ></canvas>
    </div>
  );
}

export default VideoPlayer;
