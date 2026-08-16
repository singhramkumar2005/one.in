import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import VideoPlayer from '../components/VideoPlayer';
import PDFReader from '../components/PDFReader';
import { getDirectoryHandleWithPermission, saveDirectoryHandle, deleteDirectoryHandle } from '../utils/indexedDBHelper';
import {
  FiArrowLeft, FiVideo, FiFileText, FiCheckCircle, FiCircle,
  FiClock, FiTrash2, FiSearch, FiEye, FiFolder
} from 'react-icons/fi';

const LibraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [viewingPDF, setViewingPDF] = useState(null);
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const lastProgressSaved = useRef({});

  useEffect(() => {
    fetchFolder();
  }, [id]);

  useEffect(() => {
    const loadDirectoryHandle = async () => {
      if (folder && folder.folderId) {
        const handle = await getDirectoryHandleWithPermission(folder.folderId);
        if (handle) {
          setDirectoryHandle(handle);
        }
      }
    };

    loadDirectoryHandle();
  }, [folder]);

  const requestDirectoryAccess = async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        toast.error('Your browser does not support folder access. Please use Chrome or Edge.');
        return null;
      }

      toast.info('Please select the study folder');
      const handle = await window.showDirectoryPicker({
        mode: 'read',
        startIn: 'downloads'
      });
      
      if (folder && folder.folderId) {
        await saveDirectoryHandle(folder.folderId, handle, folder.name);
      }
      
      setDirectoryHandle(handle);
      toast.success('Folder access granted!');
      return handle;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Directory access error:', error);
        toast.error('Failed to access folder');
      }
      return null;
    }
  };

  const getFileFromDirectory = async (filePath) => {
    let handle = directoryHandle;
    
    if (!handle && folder && folder.folderId) {
      handle = await getDirectoryHandleWithPermission(folder.folderId);
      if (handle) {
        setDirectoryHandle(handle);
      }
    }
    
    if (!handle) {
      handle = await requestDirectoryAccess();
      if (!handle) {
        return null;
      }
    }

    try {
      let pathParts = filePath.split(/[/\\]/).filter(p => p);
      
      // If first segment matches root handle name, remove it
      if (pathParts.length > 1 && pathParts[0].toLowerCase() === handle.name.toLowerCase()) {
        pathParts = pathParts.slice(1);
      }
      
      let currentHandle = handle;
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentHandle = await currentHandle.getDirectoryHandle(pathParts[i]);
      }
      
      const fileName = pathParts[pathParts.length - 1];
      const fileHandle = await currentHandle.getFileHandle(fileName);
      return await fileHandle.getFile();
    } catch (error) {
      console.error('Failed to get file from directory:', error);
      toast.error(`Cannot find file "${filePath}" in connected folder. Please re-grant folder access.`);
      return null;
    }
  };

  const fetchFolder = async () => {
    try {
      const response = await api.get(`/library/folder/${id}`);
      if (response.data.success) {
        setFolder(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load folder details');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const updateFileProgress = async (fileId, data) => {
    try {
      const response = await api.put(`/library/folder/${id}/file/${fileId}/progress`, data);
      if (response.data.success) {
        setFolder(response.data.data);
        if (data.isCompleted) {
          toast.success('Material marked complete!');
        }
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const toggleFileCompletion = (file) => {
    const isCompleted = !file.isCompleted;
    const progress = isCompleted ? 100 : 0;
    updateFileProgress(file._id, { isCompleted, progress });
  };

  const handlePlayVideo = async (file) => {
    try {
      toast.info('Loading video...');
      const fileBlob = await getFileFromDirectory(file.path);
      if (fileBlob) {
        setPlayingVideo({
          ...file,
          fileBlob,
          src: URL.createObjectURL(fileBlob)
        });
      }
    } catch (error) {
      toast.error('Failed to play video');
    }
  };

  const handleViewPDF = async (file) => {
    try {
      toast.info('Loading PDF...');
      const fileBlob = await getFileFromDirectory(file.path);
      if (fileBlob) {
        setViewingPDF({
          ...file,
          fileBlob,
          src: URL.createObjectURL(fileBlob)
        });
      }
    } catch (error) {
      toast.error('Failed to open PDF');
    }
  };

  const handleVideoProgressUpdate = (fileId, progress, currentTime) => {
    const lastSaved = lastProgressSaved.current[fileId] || 0;
    if (Math.abs(progress - lastSaved) >= 5) {
      lastProgressSaved.current[fileId] = progress;
      updateFileProgress(fileId, {
        progress,
        lastPosition: currentTime,
        isCompleted: progress >= 95
      });
    }
  };

  const handleVideoComplete = (fileId) => {
    updateFileProgress(fileId, {
      progress: 100,
      isCompleted: true
    });
  };

  const handlePDFProgressUpdate = (fileId, currentPage, totalPages) => {
    const progress = Math.round((currentPage / totalPages) * 100);
    const lastSaved = lastProgressSaved.current[fileId] || 0;
    if (Math.abs(progress - lastSaved) >= 10 || progress === 100) {
      lastProgressSaved.current[fileId] = progress;
      updateFileProgress(fileId, {
        progress,
        lastPosition: currentPage,
        isCompleted: progress === 100
      });
    }
  };

  const handlePDFComplete = (fileId) => {
    updateFileProgress(fileId, {
      progress: 100,
      isCompleted: true
    });
  };

  const deleteFolder = async () => {
    if (!window.confirm(`Delete folder "${folder?.name}" from library?`)) return;
    try {
      if (folder && folder.folderId) {
        await deleteDirectoryHandle(folder.folderId);
      }
      await api.delete(`/library/folder/${id}`);
      toast.success('Folder removed from library');
      navigate('/library');
    } catch (error) {
      toast.error('Failed to delete folder');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading study files...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!folder) return null;

  const filteredFiles = folder.files?.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'videos' && file.type === 'video') ||
      (filterType === 'pdfs' && file.type === 'pdf') ||
      (filterType === 'completed' && file.isCompleted) ||
      (filterType === 'pending' && !file.isCompleted);
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 overflow-x-hidden">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/library"
            className="inline-flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Return to All Study Folders</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 overflow-hidden">
          <div className="space-y-2 flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center flex-wrap gap-2">
              <span className="px-2.5 sm:px-3 py-1 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                Study Directory
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {folder.files?.length || 0} Files Total
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#17171C] dark:text-white break-words overflow-hidden">
              {folder.name}
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA] break-all overflow-hidden">
              {folder.path || 'Study notes and lecture materials'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={deleteFolder}
              className="p-2.5 text-[#FF708F] hover:bg-[#FFE8EE] rounded-full transition"
              title="Delete Folder"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
          <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1 truncate">Videos</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#8E4CF6]">{folder.totalVideos || 0}</span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1 truncate">PDF Notes</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FF708F]">{folder.totalPDFs || 0}</span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1 truncate">Total Size</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#17171C] dark:text-white truncate block">{formatBytes(folder.totalSize || 0)}</span>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs min-w-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block mb-1 truncate">Duration</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#9B5305] truncate block">{formatDuration(folder.totalDuration || 0)}</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row gap-3 w-full overflow-hidden">
          <div className="flex-1 relative min-w-0">
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#9CA0B0] flex-shrink-0" size={14} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold text-[#17171C] dark:text-white outline-none flex-shrink-0"
          >
            <option value="all">All Files</option>
            <option value="videos">Videos Only</option>
            <option value="pdfs">PDFs Only</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Files List with Subfolder Support */}
        <div className="space-y-4 sm:space-y-6 w-full">
          {folder.files && folder.files.length > 0 && (
            <div className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs overflow-hidden w-full">
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
                <h3 className="text-[#17171C] dark:text-white font-extrabold text-xs sm:text-sm flex items-center gap-2">
                  <FiFileText size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Files in Root Folder</span>
                </h3>
              </div>
              <div className="w-full overflow-x-auto">
                <FilesTable 
                  files={filteredFiles} 
                  onToggleComplete={toggleFileCompletion}
                  onPlay={handlePlayVideo}
                  onView={handleViewPDF}
                  formatBytes={formatBytes}
                  formatDuration={formatDuration}
                />
              </div>
            </div>
          )}

          {folder.subfolders && folder.subfolders.length > 0 && folder.subfolders.map((subfolder, index) => {
            const subfolderFiles = subfolder.files.filter(file => {
              const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesFilter =
                filterType === 'all' ||
                (filterType === 'videos' && file.type === 'video') ||
                (filterType === 'pdfs' && file.type === 'pdf') ||
                (filterType === 'completed' && file.isCompleted) ||
                (filterType === 'pending' && !file.isCompleted);
              return matchesSearch && matchesFilter;
            });

            if (subfolderFiles.length === 0) return null;

            return (
              <div key={index} className="bg-white dark:bg-[#111115] rounded-2xl sm:rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs overflow-hidden w-full">
                <div className="bg-[#FAF7FD] dark:bg-[#18181F] px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
                  <div className="flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <FiFolder className="text-[#8E4CF6] flex-shrink-0" size={16} />
                      <h3 className="text-[#17171C] dark:text-white font-extrabold text-xs sm:text-sm truncate">{subfolder.name}</h3>
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <FilesTable 
                    files={subfolderFiles} 
                    onToggleComplete={toggleFileCompletion}
                    onPlay={handlePlayVideo}
                    onView={handleViewPDF}
                    formatBytes={formatBytes}
                    formatDuration={formatDuration}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Player Overlay Modal */}
        {playingVideo && (
          <VideoPlayer
            file={playingVideo}
            onClose={() => setPlayingVideo(null)}
            onProgressUpdate={handleVideoProgressUpdate}
            onComplete={handleVideoComplete}
          />
        )}

        {/* PDF Reader Overlay Modal */}
        {viewingPDF && (
          <PDFReader
            file={viewingPDF}
            onClose={() => setViewingPDF(null)}
            onProgressUpdate={handlePDFProgressUpdate}
            onComplete={handlePDFComplete}
          />
        )}
      </div>
    </Layout>
  );
};

// Reusable FilesTable Component with task styling and mobile responsive design
const FilesTable = ({ files, onToggleComplete, onPlay, onView, formatBytes, formatDuration }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">No study files found matching filter</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View - Hidden on Mobile */}
      <table className="hidden lg:table w-full text-xs">
        <thead className="bg-[#FAF7FD] dark:bg-[#18181F] border-b border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA]">
          <tr>
            <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider w-16">Status</th>
            <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">File Name</th>
            <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Type</th>
            <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Size</th>
            <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Progress</th>
            <th className="px-6 py-3.5 text-right font-bold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8DFF2]/60 dark:divide-[#22222B]/60 font-semibold">
          {files.map((file) => (
            <tr
              key={file._id}
              className="hover:bg-[#FAF7FD]/50 dark:hover:bg-[#18181F]/50 transition"
            >
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleComplete(file)}
                  className="transition transform active:scale-95"
                >
                  {file.isCompleted ? (
                    <FiCheckCircle className="text-[#44D368]" size={20} />
                  ) : (
                    <FiCircle className="text-[#E8DFF2] hover:text-[#8E4CF6]" size={20} />
                  )}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    file.type === 'video' ? 'bg-[#EFE7FC] text-[#8E4CF6]' : 'bg-[#FFE8EE] text-[#FF708F]'
                  }`}>
                    {file.type === 'video' ? <FiVideo size={16} /> : <FiFileText size={16} />}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#17171C] dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA] line-clamp-1">
                      {file.path}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  file.type === 'video'
                    ? 'bg-[#EFE7FC] text-[#5D2D9C]'
                    : 'bg-[#FFE8EE] text-[#A1183A]'
                }`}>
                  {file.type === 'video' ? 'Video' : 'PDF'}
                </span>
              </td>
              <td className="px-6 py-4 text-[#17171C] dark:text-white">
                {file.type === 'video' && file.duration ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <FiClock size={13} className="text-[#8E4CF6]" />
                    {formatDuration(file.duration)}
                  </span>
                ) : (
                  <span className="text-[#6B7082]">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-[#6B7082] dark:text-[#A9A2BA]">
                {formatBytes(file.size || 0)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-20 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#44D368] h-full rounded-full transition-all duration-300"
                      style={{ width: `${file.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-bold text-[#17171C] dark:text-white">
                    {file.progress || 0}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      if (file.type === 'video') {
                        onPlay(file);
                      } else {
                        onView(file);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-[11px] transition shadow-xs flex items-center gap-1"
                  >
                    <FiEye size={13} />
                    <span>Open</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View - Visible Only on Mobile */}
      <div className="lg:hidden divide-y divide-[#E8DFF2]/60 dark:divide-[#22222B]/60">
        {files.map((file) => (
          <div key={file._id} className="p-4 hover:bg-[#FAF7FD]/50 dark:hover:bg-[#18181F]/50 transition">
            {/* Header with Status and Type */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleComplete(file)}
                  className="transition transform active:scale-95 flex-shrink-0"
                >
                  {file.isCompleted ? (
                    <FiCheckCircle className="text-[#44D368]" size={20} />
                  ) : (
                    <FiCircle className="text-[#E8DFF2] hover:text-[#8E4CF6]" size={20} />
                  )}
                </button>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                  file.type === 'video' ? 'bg-[#EFE7FC] text-[#8E4CF6]' : 'bg-[#FFE8EE] text-[#FF708F]'
                }`}>
                  {file.type === 'video' ? <FiVideo size={18} /> : <FiFileText size={18} />}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${
                  file.type === 'video'
                    ? 'bg-[#EFE7FC] text-[#5D2D9C]'
                    : 'bg-[#FFE8EE] text-[#A1183A]'
                }`}>
                  {file.type === 'video' ? 'Video' : 'PDF'}
                </span>
              </div>
            </div>

            {/* File Name */}
            <div className="mb-3">
              <div className="font-extrabold text-sm text-[#17171C] dark:text-white mb-1 break-words">
                {file.name}
              </div>
              <div className="text-[10px] text-[#6B7082] dark:text-[#A9A2BA] break-all">
                {file.path}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {file.type === 'video' && file.duration && (
                <div className="flex items-center gap-1.5">
                  <FiClock size={12} className="text-[#8E4CF6] flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-[#17171C] dark:text-white">
                    {formatDuration(file.duration)}
                  </span>
                </div>
              )}
              <div className="text-[11px] font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
                {formatBytes(file.size || 0)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
                  Progress
                </span>
                <span className="text-[11px] font-bold text-[#17171C] dark:text-white">
                  {file.progress || 0}%
                </span>
              </div>
              <div className="w-full bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#44D368] h-full rounded-full transition-all duration-300"
                  style={{ width: `${file.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (file.type === 'video') {
                  onPlay(file);
                } else {
                  onView(file);
                }
              }}
              className="w-full px-4 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
            >
              <FiEye size={14} />
              <span>Open {file.type === 'video' ? 'Video' : 'PDF'}</span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default LibraryDetail;
