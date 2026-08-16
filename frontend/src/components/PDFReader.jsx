import React, { useState, useEffect, useRef } from 'react';
import {
  FiX, FiZoomIn, FiZoomOut, FiChevronLeft, FiChevronRight,
  FiDownload, FiMaximize, FiCheckCircle, FiExternalLink
} from 'react-icons/fi';

const PDFReader = ({ file, onClose, onProgressUpdate, onComplete }) => {
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(file.progress || 0);

  const pdfSource = file.src || file.fileUrl || file.path;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfSource;
    link.download = file.name || 'document.pdf';
    link.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    if (onProgressUpdate) {
      onProgressUpdate(file._id, newProgress, 100);
    }
  };

  const handleComplete = () => {
    setProgress(100);
    if (onComplete) {
      onComplete(file._id);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('pdf-container');
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const openInNewWindow = () => {
    window.open(pdfSource, '_blank');
  };

  return (
    <div
      id="pdf-container"
      className="fixed inset-0 bg-[#141416]/95 z-[9999] flex flex-col backdrop-blur-sm"
    >
      {/* Header */}
      <div className="bg-[#111115] border-b border-[#22222B] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#22222B] rounded-full transition text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
          <div>
            <h3 className="text-white font-bold text-sm truncate max-w-md">{file.name}</h3>
            <p className="text-[#A9A2BA] text-xs">PDF Document</p>
          </div>
        </div>

        {/* Progress Control */}
        <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
          <span className="text-white text-xs font-semibold">Progress:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="flex-1 accent-[#8E4CF6]"
          />
          <span className="text-[#8E4CF6] text-xs font-bold min-w-[35px]">
            {progress}%
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onComplete && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-[#44D368] hover:bg-[#38C35A] rounded-full transition flex items-center gap-1.5 text-[#141416] text-xs font-bold"
            >
              <FiCheckCircle size={14} />
              <span>Mark Complete</span>
            </button>
          )}
          <button
            onClick={openInNewWindow}
            className="p-2 hover:bg-[#22222B] rounded-full transition text-white"
            title="Open in New Tab"
          >
            <FiExternalLink size={16} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-[#22222B] rounded-full transition text-white"
            title="Download PDF"
          >
            <FiDownload size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-[#22222B] rounded-full transition text-white"
            title="Fullscreen"
          >
            <FiMaximize size={16} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-[#09090B] overflow-hidden flex items-center justify-center">
        {pdfSource ? (
          <iframe
            ref={iframeRef}
            src={pdfSource}
            className="w-full h-full border-0"
            title={file.name}
          />
        ) : (
          <div className="text-center text-[#A9A2BA] space-y-2">
            <p className="text-sm font-semibold">Unable to load PDF source</p>
            <p className="text-xs">Please verify local folder access permission.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFReader;
