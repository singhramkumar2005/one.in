import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiClock, FiActivity, FiCalendar } from 'react-icons/fi';

// Compact Seven-segment digit SVG representation
const SevenSegmentDigit = ({ digit }) => {
  const segmentMap = {
    '0': [true, true, true, true, true, true, false],
    '1': [false, true, true, false, false, false, false],
    '2': [true, true, false, true, true, false, true],
    '3': [true, true, true, true, false, false, true],
    '4': [false, true, true, false, false, true, true],
    '5': [true, false, true, true, false, true, true],
    '6': [true, false, true, true, true, true, true],
    '7': [true, true, true, false, false, false, false],
    '8': [true, true, true, true, true, true, true],
    '9': [true, true, true, true, false, true, true],
    '-': [false, false, false, false, false, false, true]
  };

  const active = segmentMap[digit] || segmentMap['0'];
  const onColor = '#FFFFFF';
  const offColor = '#18181A';

  return (
    <svg viewBox="0 0 54 84" className="w-5 sm:w-6 h-8 sm:h-9">
      {/* a: Top */}
      <polygon points="10,6 44,6 38,14 16,14" fill={active[0] ? onColor : offColor} />
      {/* b: Top Right */}
      <polygon points="46,8 46,38 38,34 38,16" fill={active[1] ? onColor : offColor} />
      {/* c: Bottom Right */}
      <polygon points="46,46 46,76 38,68 38,50" fill={active[2] ? onColor : offColor} />
      {/* d: Bottom */}
      <polygon points="10,78 44,78 38,70 16,70" fill={active[3] ? onColor : offColor} />
      {/* e: Bottom Left */}
      <polygon points="8,46 16,50 16,68 8,76" fill={active[4] ? onColor : offColor} />
      {/* f: Top Left */}
      <polygon points="8,8 16,16 16,34 8,38" fill={active[5] ? onColor : offColor} />
      {/* g: Middle */}
      <polygon points="12,42 18,36 36,36 42,42 36,48 18,48" fill={active[6] ? onColor : offColor} />
    </svg>
  );
};

// Compact Colon Separator
const ColonSeparator = () => (
  <div className="flex flex-col justify-center gap-1.5 sm:gap-2 px-0.5 sm:px-1 h-8 sm:h-9">
    <div className="w-1.5 h-1.5 bg-white rounded-xs" />
    <div className="w-1.5 h-1.5 bg-white rounded-xs" />
  </div>
);

const DigitalTimerWidget = () => {
  const [mode, setMode] = useState('clock'); // 'clock' or 'study_timer'
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Stopwatch / Study Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Study Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format Hours, Minutes, Seconds for Clock
  const clockHours = String(currentTime.getHours()).padStart(2, '0');
  const clockMinutes = String(currentTime.getMinutes()).padStart(2, '0');
  const clockSeconds = String(currentTime.getSeconds()).padStart(2, '0');

  // Format Hours, Minutes, Seconds for Stopwatch
  const stopWatchHrs = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
  const stopWatchMins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
  const stopWatchSecs = String(timerSeconds % 60).padStart(2, '0');

  const displayHours = mode === 'clock' ? clockHours : stopWatchHrs;
  const displayMinutes = mode === 'clock' ? clockMinutes : stopWatchMins;
  const displaySeconds = mode === 'clock' ? clockSeconds : stopWatchSecs;

  // Format Date & Day
  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateFormatted = currentTime.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="bg-[#000000] text-white rounded-2xl p-3 sm:p-3.5 border border-[#22222B] shadow-md flex flex-col items-center justify-between gap-2 max-w-[340px] w-full">
      
      {/* Top Meta Bar: Date & Mode Buttons */}
      <div className="w-full flex items-center justify-between gap-2 pb-1.5 border-b border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5 text-gray-300 font-bold">
          <span className="px-1.5 py-0.5 bg-[#8E4CF6]/20 text-[#C49CFF] rounded-md text-[9px] font-extrabold uppercase">
            {dayName}
          </span>
          <span className="text-gray-300 text-[10px] font-medium">
            {dateFormatted}
          </span>
        </div>

        {/* Small Mode Selector */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-[9px]">
          <button
            onClick={() => setMode('clock')}
            className={`px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 ${
              mode === 'clock'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiClock size={10} />
            <span>Clock</span>
          </button>
          <button
            onClick={() => setMode('study_timer')}
            className={`px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 ${
              mode === 'study_timer'
                ? 'bg-[#44D368] text-black shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiActivity size={10} />
            <span>Timer</span>
          </button>
        </div>
      </div>

      {/* Small 7-Segment Digits Display Center */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 py-1">
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5">
            <SevenSegmentDigit digit={displayHours[0]} />
            <SevenSegmentDigit digit={displayHours[1]} />
          </div>
          <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-400 tracking-wider mt-1 uppercase">
            HOURS
          </span>
        </div>

        <ColonSeparator />

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5">
            <SevenSegmentDigit digit={displayMinutes[0]} />
            <SevenSegmentDigit digit={displayMinutes[1]} />
          </div>
          <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-400 tracking-wider mt-1 uppercase">
            MINUTES
          </span>
        </div>

        <ColonSeparator />

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5">
            <SevenSegmentDigit digit={displaySeconds[0]} />
            <SevenSegmentDigit digit={displaySeconds[1]} />
          </div>
          <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-400 tracking-wider mt-1 uppercase">
            SECOND
          </span>
        </div>

      </div>

      {/* Mini Controls for Study Timer */}
      {mode === 'study_timer' && (
        <div className="w-full flex items-center justify-center gap-2 pt-1 border-t border-white/10">
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="px-3 py-1 bg-[#44D368] hover:bg-[#38b757] text-[#141416] font-extrabold text-[10px] rounded-full flex items-center gap-1 transition"
            >
              <FiPlay size={10} />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTimerRunning(false)}
              className="px-3 py-1 bg-[#FF708F] hover:bg-[#e45b7a] text-white font-extrabold text-[10px] rounded-full flex items-center gap-1 transition"
            >
              <FiPause size={10} />
              <span>Pause</span>
            </button>
          )}
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(0);
            }}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] rounded-full flex items-center gap-1 transition"
          >
            <FiRotateCcw size={10} />
            <span>Reset</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default DigitalTimerWidget;
