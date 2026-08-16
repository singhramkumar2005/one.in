import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import {
  FiFolder, FiVideo, FiFileText, FiPlus, FiTrash2,
  FiSearch, FiHardDrive, FiCheckSquare, FiLayers,
  FiClock, FiTag, FiBookOpen, FiZap, FiActivity, FiX, FiCheck
} from 'react-icons/fi';
import { saveDirectoryHandle, deleteDirectoryHandle } from '../utils/indexedDBHelper';

const PRESET_COLORS = ['#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B', '#06B6D4'];

const StudentLibrary = () => {
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Master syllabus subjects list
  const [syllabusSubjects, setSyllabusSubjects] = useState([]);
  
  // Folder upload subject selection modal state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [pendingFolderData, setPendingFolderData] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState('other');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [customSubjectColor, setCustomSubjectColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    fetchLibrary();
    fetchStats();
    fetchSyllabusSubjects();
  }, []);

  const fetchLibrary = async () => {
    try {
      const response = await api.get('/library');
      if (response.data.success) {
        setLibrary(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch library:', error);
      toast.error('Failed to load study library');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/library/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchSyllabusSubjects = async () => {
    try {
      const response = await api.get('/attendance/master-syllabus');
      if (response.data.success && response.data.data) {
        setSyllabusSubjects(response.data.data);
      }
    } catch (error) {
      console.warn('Could not load syllabus subjects:', error);
    }
  };

  const handleFolderSelect = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const directoryHandle = await window.showDirectoryPicker();
        toast.info('Scanning study folder contents...');
        const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const folderData = await analyzeFolderContents(directoryHandle, folderId);
        
        try {
          await saveDirectoryHandle(folderId, directoryHandle, directoryHandle.name);
        } catch (dbError) {
          console.error('Failed to save to IndexedDB:', dbError);
        }

        // Set pending folder data and open Subject Linking Dialog
        setPendingFolderData({
          ...folderData,
          directoryName: directoryHandle.name
        });
        setSelectedSubjectId(syllabusSubjects[0]?.id || 'other');
        setIsSubjectModalOpen(true);
      } else {
        toast.error('Your browser does not support local folder integration.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Folder selection error:', error);
        toast.error('Failed to analyze folder');
      }
    }
  };

  const handleConfirmFolderSubject = async () => {
    if (!pendingFolderData) return;

    let targetSubjId = selectedSubjectId;
    let targetSubjName = '';
    let targetColor = '#8E4CF6';

    if (selectedSubjectId === 'create_new') {
      if (!customSubjectName.trim()) {
        toast.error('Please enter subject title');
        return;
      }
      targetSubjId = `subj_${Date.now()}`;
      targetSubjName = customSubjectName.trim();
      targetColor = customSubjectColor;
    } else if (selectedSubjectId !== 'other') {
      const found = syllabusSubjects.find(s => s.id === selectedSubjectId);
      if (found) {
        targetSubjName = found.name;
        targetColor = found.color || '#8E4CF6';
      }
    }

    const payload = {
      ...pendingFolderData,
      subjectId: targetSubjId === 'other' ? undefined : targetSubjId,
      subjectName: targetSubjId === 'other' ? undefined : targetSubjName,
      color: targetColor
    };

    try {
      const response = await api.post('/library/folder', payload);
      if (response.data.success) {
        toast.success(`Folder linked to ${targetSubjName || 'Library'}! Found ${pendingFolderData.totalVideos} videos & ${pendingFolderData.totalPDFs} PDFs.`);
        setLibrary(response.data.data);
        fetchStats();
        fetchSyllabusSubjects();
        setIsSubjectModalOpen(false);
        setPendingFolderData(null);
      }
    } catch (err) {
      console.error('Save folder error:', err);
      toast.error('Failed to save folder to library');
    }
  };

  const analyzeFolderContents = async (directoryHandle, folderId) => {
    const subfolders = [];
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
    const pdfExtensions = ['.pdf'];

    const getVideoDuration = (file) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(Math.round(video.duration));
        };
        video.onerror = () => resolve(0);
        video.src = URL.createObjectURL(file);
      });
    };

    const processEntries = async (dirHandle, currentPath = '') => {
      const files = [];
      for await (const entry of dirHandle.values()) {
        const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          const ext = '.' + file.name.split('.').pop().toLowerCase();
          let type = null;
          let duration = 0;
          if (videoExtensions.includes(ext)) {
            type = 'video';
            try { duration = await getVideoDuration(file); } catch (e) { duration = 0; }
          } else if (pdfExtensions.includes(ext)) {
            type = 'pdf';
          }
          if (type) {
            files.push({
              name: file.name,
              path: entryPath,
              type,
              size: file.size,
              duration,
              lastModified: file.lastModified
            });
          }
        } else if (entry.kind === 'directory') {
          const subFiles = await processEntries(entry, entryPath);
          if (subFiles.length > 0) {
            subfolders.push({ name: entry.name, path: entryPath, files: subFiles });
          }
        }
      }
      return files;
    };

    const allFiles = await processEntries(directoryHandle);
    return {
      folderId,
      name: directoryHandle.name,
      path: directoryHandle.name,
      files: allFiles,
      subfolders
    };
  };

  const handleDeleteFolder = async (folderId, e) => {
    e.stopPropagation();
    if (window.confirm('Remove this folder from your study library?')) {
      try {
        const response = await api.delete(`/library/folder/${folderId}`);
        if (response.data.success) {
          try {
            await deleteDirectoryHandle(folderId);
          } catch (dbError) {
            console.error('Failed to remove from IndexedDB:', dbError);
          }
          toast.success('Folder removed');
          setLibrary(response.data.data);
          fetchStats();
        }
      } catch (error) {
        console.error('Delete folder error:', error);
        toast.error('Failed to delete folder');
      }
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
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredFolders = library?.folders?.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (folder.subjectName && folder.subjectName.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterType === 'videos') return matchesSearch && folder.totalVideos > 0;
    if (filterType === 'pdfs') return matchesSearch && folder.totalPDFs > 0;
    return matchesSearch;
  }) || [];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Opening study library...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#D6A6FF]/30">
              <FiCheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white">Study Library</h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Attach lecture folders to your Syllabus Subjects, scan video counts & track revision PDFs</p>
            </div>
          </div>
          <button
            onClick={handleFolderSelect}
            className="px-5 py-2.5 bg-[#8E4CF6] hover:bg-[#7839D4] hover:opacity-95 text-white rounded-full font-bold text-xs transition shadow-md flex items-center gap-2 self-start sm:self-auto active:scale-95"
          >
            <FiPlus size={16} />
            <span>+ Connect Study Folder</span>
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Study Folders</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.totalFolders}</p>
              </div>
              <div className="w-11 h-11 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center">
                <FiFolder size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Lecture Videos</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.totalVideos}</p>
              </div>
              <div className="w-11 h-11 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center">
                <FiVideo size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Study PDFs</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.totalPDFs}</p>
              </div>
              <div className="w-11 h-11 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center">
                <FiFileText size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Total Size</p>
                <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{formatBytes(stats.totalSize)}</p>
              </div>
              <div className="w-11 h-11 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center">
                <FiHardDrive size={20} />
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#111115] p-4 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A9A2BA]" size={16} />
            <input
              type="text"
              placeholder="Search folders or linked subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold text-[#17171C] dark:text-white focus:outline-hidden focus:border-[#8E4CF6]"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {['all', 'videos', 'pdfs'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                  filterType === t 
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416]'
                    : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Folders Grid */}
        {filteredFolders.length === 0 ? (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-12 text-center border border-[#E8DFF2] dark:border-[#22222B] space-y-4">
            <div className="w-16 h-16 bg-[#FAF7FD] dark:bg-[#18181F] rounded-3xl flex items-center justify-center mx-auto text-[#8E4CF6]">
              <FiFolder size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17171C] dark:text-white">No Study Folders Connected</h3>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] max-w-sm mx-auto mt-1">
                Connect your local folders containing subject lecture videos and PDF notes to link them with your syllabus.
              </p>
            </div>
            <button
              onClick={handleFolderSelect}
              className="px-5 py-2.5 bg-[#8E4CF6] hover:bg-[#7B39EE] text-white rounded-2xl font-bold text-xs shadow-md transition"
            >
              + Connect Local Folder
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFolders.map((folder) => (
              <div
                key={folder.folderId}
                onClick={() => navigate(`/library/${folder.folderId}`)}
                className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] hover:border-[#8E4CF6] shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs"
                        style={{ backgroundColor: folder.color || '#8E4CF6' }}
                      >
                        <FiFolder size={20} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#17171C] dark:text-white group-hover:text-[#8E4CF6] transition truncate max-w-[170px]">
                          {folder.name}
                        </h3>
                        {folder.subjectName ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8E4CF6] dark:text-[#C49CFF] bg-[#8E4CF6]/10 px-2 py-0.5 rounded-md mt-0.5">
                            <FiBookOpen size={10} /> {folder.subjectName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#A9A2BA]">General Library Folder</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteFolder(folder.folderId, e)}
                      className="p-2 text-[#A9A2BA] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                      title="Remove folder"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8DFF2] dark:border-[#22222B] text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#FAF7FD] dark:bg-[#18181F]">
                    <div className="text-[10px] text-[#A9A2BA] uppercase font-bold">Videos</div>
                    <div className="font-extrabold text-[#17171C] dark:text-white mt-0.5">{folder.totalVideos}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF7FD] dark:bg-[#18181F]">
                    <div className="text-[10px] text-[#A9A2BA] uppercase font-bold">PDFs</div>
                    <div className="font-extrabold text-[#17171C] dark:text-white mt-0.5">{folder.totalPDFs}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF7FD] dark:bg-[#18181F]">
                    <div className="text-[10px] text-[#A9A2BA] uppercase font-bold">Duration</div>
                    <div className="font-extrabold text-[#10B981] mt-0.5">{formatDuration(folder.totalDuration)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ATTACH FOLDER TO SYLLABUS SUBJECT MODAL */}
      {isSubjectModalOpen && pendingFolderData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111115] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-2xl">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E4CF6] dark:text-[#C49CFF]">
                  Syllabus Integration
                </span>
                <h3 className="text-lg font-extrabold text-[#17171C] dark:text-white">
                  Assign Folder to Subject
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsSubjectModalOpen(false);
                  setPendingFolderData(null);
                }}
                className="p-1 text-[#6B7082]"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-3 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] text-xs space-y-1">
              <div className="font-bold text-[#17171C] dark:text-white flex items-center gap-2">
                <FiFolder className="text-[#8E4CF6]" /> {pendingFolderData.name}
              </div>
              <div className="text-[#6B7082] dark:text-[#A9A2BA]">
                Scanned: <span className="font-bold text-[#10B981]">{pendingFolderData.files.filter(f => f.type === 'video').length} Videos</span>, <span className="font-bold text-[#3B82F6]">{pendingFolderData.files.filter(f => f.type === 'pdf').length} PDFs</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-[#17171C] dark:text-white block">
                Select Which Subject This Folder Belongs To:
              </label>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {syllabusSubjects.map(sub => (
                  <label
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      selectedSubjectId === sub.id
                        ? 'border-[#8E4CF6] bg-[#8E4CF6]/10 text-[#8E4CF6]'
                        : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: sub.color || '#8E4CF6' }} />
                      <div>
                        <div className="font-bold">{sub.name}</div>
                        <div className="text-[10px] opacity-75">{sub.totalLectures || 0} Lectures in Syllabus</div>
                      </div>
                    </div>
                    {selectedSubjectId === sub.id && <FiCheck className="text-[#8E4CF6] stroke-[3]" size={16} />}
                  </label>
                ))}

                {/* Create New Subject Option */}
                <label
                  onClick={() => setSelectedSubjectId('create_new')}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    selectedSubjectId === 'create_new'
                      ? 'border-[#8E4CF6] bg-[#8E4CF6]/10 text-[#8E4CF6]'
                      : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <FiPlus size={16} className="text-[#8E4CF6]" />
                    <span className="font-bold">+ Create New Subject in Syllabus</span>
                  </div>
                  {selectedSubjectId === 'create_new' && <FiCheck className="text-[#8E4CF6] stroke-[3]" size={16} />}
                </label>

                {/* Other / Not a Course Subject */}
                <label
                  onClick={() => setSelectedSubjectId('other')}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    selectedSubjectId === 'other'
                      ? 'border-[#8E4CF6] bg-[#8E4CF6]/10 text-[#8E4CF6]'
                      : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] text-[#17171C] dark:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <FiFolder size={16} className="text-[#A9A2BA]" />
                    <span className="font-semibold text-[#6B7082] dark:text-[#A9A2BA]">Other / General Study Material</span>
                  </div>
                  {selectedSubjectId === 'other' && <FiCheck className="text-[#8E4CF6] stroke-[3]" size={16} />}
                </label>
              </div>

              {/* Form if create_new selected */}
              {selectedSubjectId === 'create_new' && (
                <div className="p-3.5 rounded-2xl bg-[#FAF7FD] dark:bg-[#18181F] border border-[#8E4CF6]/40 space-y-2.5 pt-3">
                  <label className="font-bold text-[#17171C] dark:text-white block">New Subject Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics, Organic Chemistry..."
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] font-bold text-xs text-[#17171C] dark:text-white"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCustomSubjectColor(c)}
                        className={`w-6 h-6 rounded-full ${customSubjectColor === c ? 'ring-2 ring-[#8E4CF6] scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFF2] dark:border-[#22222B]">
              <button
                onClick={() => {
                  setIsSubjectModalOpen(false);
                  setPendingFolderData(null);
                }}
                className="px-4 py-2 rounded-xl text-[#6B7082] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFolderSubject}
                className="px-5 py-2.5 bg-[#8E4CF6] hover:bg-[#7839D4] text-white rounded-xl font-extrabold text-xs shadow-md active:scale-95"
              >
                Confirm & Sync with Syllabus
              </button>
            </div>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default StudentLibrary;
