import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize,
  FiSkipBack, FiSkipForward, FiSettings, FiX, FiCheckCircle
} from 'react-icons/fi';

const VideoPlayer = ({ file, onClose, onProgressUpdate, onComplete }) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [customSpeed, setCustomSpeed] = useState('');
  const [showCustomSpeedInput, setShowCustomSpeedInput] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const controlsTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (isMountedRef.current) setCurrentTime(video.currentTime);
    };
    
    const updateDuration = () => {
      if (isMountedRef.current) setDuration(video.duration);
    };
    
    const updateBuffered = () => {
      if (video.buffered.length > 0 && isMountedRef.current) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('progress', updateBuffered);
    video.addEventListener('ended', handleVideoEnd);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      isMountedRef.current = false;
      // Pause video before cleanup to prevent play() promise errors
      if (video && !video.paused) {
        video.pause();
      }
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('progress', updateBuffered);
      video.removeEventListener('ended', handleVideoEnd);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls after 2 seconds of inactivity
  useEffect(() => {
    // Clear any existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Only auto-hide when playing and controls are visible
    if (isPlaying && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000); // Hide after 2 seconds
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!videoRef.current) return;

      switch (e.key.toLowerCase()) {
        case 'escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            onClose();
          }
          break;
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => {
            const newVol = Math.min(prev + 0.1, 1);
            videoRef.current.volume = newVol;
            setIsMuted(false);
            return newVol;
          });
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => {
            const newVol = Math.max(prev - 0.1, 0);
            videoRef.current.volume = newVol;
            setIsMuted(newVol === 0);
            return newVol;
          });
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume, onClose]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !isMountedRef.current) return;
    
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isMountedRef.current) {
              setIsPlaying(true);
            }
          })
          .catch((error) => {
            if (error.name !== 'AbortError') {
              console.log('Play interrupted:', error);
            }
            if (isMountedRef.current) {
              setIsPlaying(false);
            }
          });
      }
    } else {
      video.pause();
      if (isMountedRef.current) {
        setIsPlaying(false);
      }
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement?.parentElement;
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime += seconds;
  };

  const changePlaybackRate = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    
    setPlaybackRate(rate);
    video.playbackRate = rate;
    setShowSettings(false);
    setShowCustomSpeedInput(false);
  };

  const handleCustomSpeedSubmit = () => {
    const speed = parseFloat(customSpeed);
    
    // Validate speed between 0.1 and 3.0
    if (isNaN(speed) || speed < 0.1 || speed > 3.0) {
      alert('Please enter a speed between 0.1 and 3.0');
      return;
    }
    
    changePlaybackRate(speed);
    setCustomSpeed('');
  };

  const handleCustomSpeedKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomSpeedSubmit();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = useCallback(() => {
    // Show controls immediately
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // Set new timeout to hide controls after 2 seconds (only when playing)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying]);

  // Track progress for saving
  useEffect(() => {
    if (duration > 0 && currentTime > 0) {
      const progress = Math.round((currentTime / duration) * 100);
      if (onProgressUpdate && progress % 5 === 0) {
        onProgressUpdate(progress);
      }
    }
  }, [currentTime, duration, onProgressUpdate]);

  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      <div
        className="relative w-full h-full flex flex-col"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
              setShowControls(false);
            }, 500);
          }
        }}
      >
        {/* Close Button - Always visible on hover */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-[60] p-3 bg-black bg-opacity-75 hover:bg-opacity-100 rounded-full text-white transition-all ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
          title="Close (Esc)"
        >
          <FiX className="h-6 w-6" />
        </button>

        {/* Video Element */}
        <div className="flex-1 flex items-center justify-center bg-black w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            preload="metadata"
            src={file.src || file.fileUrl}
          >
            {(file.src || file.fileUrl) && (
              <source src={file.src || file.fileUrl} type="video/mp4" />
            )}
            {file.path && !file.src && (
              <source src={file.path} type="video/mp4" />
            )}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 px-6 transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <div
              ref={progressBarRef}
              className="relative h-2 bg-gray-600 rounded-full cursor-pointer hover:h-3 transition-all group"
              onClick={handleProgressClick}
            >
              {/* Buffered */}
              <div
                className="absolute h-full bg-gray-500 rounded-full"
                style={{ width: `${buffered}%` }}
              />
              {/* Progress */}
              <div
                className="absolute h-full bg-indigo-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
              {/* Handle */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
              />
            </div>
            <div className="flex justify-between text-white text-sm mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <FiPause className="h-6 w-6 text-white" />
                ) : (
                  <FiPlay className="h-6 w-6 text-white" />
                )}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skipTime(-10)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors text-white"
              >
                <FiSkipBack className="h-5 w-5" />
                <span className="text-xs">10s</span>
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors text-white"
              >
                <FiSkipForward className="h-5 w-5" />
                <span className="text-xs">10s</span>
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <FiVolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <FiVolume2 className="h-5 w-5 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover:w-24 transition-all"
                />
              </div>

              {/* File Info */}
              <div className="text-white text-sm ml-4">
                <p className="font-medium">{file.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors flex items-center gap-2 text-white"
                >
                  <FiSettings className="h-5 w-5" />
                  <span className="text-sm">{playbackRate}x</span>
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl p-2 min-w-[200px] max-h-[400px] overflow-y-auto">
                    <p className="text-white text-xs font-semibold mb-2 px-2">Playback Speed</p>
                    
                    {/* Preset Speeds */}
                    <div className="mb-2">
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            playbackRate === rate
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {rate === 1 ? 'Normal' : `${rate}x`}
                        </button>
                      ))}
                    </div>

                    {/* Custom Speed Input */}
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      {showCustomSpeedInput ? (
                        <div className="px-2">
                          <p className="text-white text-xs mb-2">Custom Speed (0.1 - 3.0)</p>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0.1"
                              max="3.0"
                              step="0.1"
                              value={customSpeed}
                              onChange={(e) => setCustomSpeed(e.target.value)}
                              onKeyPress={handleCustomSpeedKeyPress}
                              placeholder="e.g. 2.1"
                              className="flex-1 px-2 py-1 bg-gray-800 text-white text-sm rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={handleCustomSpeedSubmit}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors"
                            >
                              Set
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setShowCustomSpeedInput(false);
                              setCustomSpeed('');
                            }}
                            className="w-full mt-2 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomSpeedInput(true)}
                          className="w-full text-left px-3 py-2 rounded text-sm text-indigo-400 hover:bg-gray-800 transition-colors"
                        >
                          Custom Speed...
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mark Complete */}
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 text-white text-sm font-medium"
                >
                  <FiCheckCircle className="h-4 w-4" />
                  Mark Complete
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isFullscreen ? (
                  <FiMinimize className="h-5 w-5 text-white" />
                ) : (
                  <FiMaximize className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
