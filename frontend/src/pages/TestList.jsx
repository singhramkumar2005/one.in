import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiFileText, FiSearch, FiFilter, FiBookOpen, FiTrendingUp, FiUsers, FiAward, FiCheckSquare, FiMoreVertical, FiArrowRight, FiRotateCcw } from 'react-icons/fi';
import api from '../utils/api';
import Layout from '../components/Layout';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    examType: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [filters, tests]);

  const fetchTests = async () => {
    try {
      const response = await api.get('/tests');
      const activeTests = response.data.tests.filter(t => t.isActive);
      setTests(activeTests);
      setFilteredTests(activeTests);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
      setLoading(false);
    }
  };

  const filterTests = () => {
    let result = [...tests];

    if (filters.examType) {
      result = result.filter(t => t.examType === filters.examType);
    }
    if (filters.difficulty) {
      result = result.filter(t => t.difficulty === filters.difficulty);
    }
    if (filters.search) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTests(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
            <p className="text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA]">Loading mock tests...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title Section */}
        <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#D6A6FF]/30">
              <FiCheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white">Mock Test Catalog</h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Choose any practice exam series to test your real-time skills</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold">
            {tests.length} Active Tests
          </span>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA0B0]" size={16} />
              <input
                type="text"
                placeholder="Search tests by title, subject, or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
              />
            </div>
            
            {/* Exam Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              {['', 'SSC', 'Banking', 'Railway', 'Teaching', 'Defense'].map((exam) => (
                <button
                  key={exam}
                  onClick={() => handleFilterChange('examType', exam)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    filters.examType === exam
                      ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416]'
                      : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B] hover:bg-[#F3EEFB]'
                  }`}
                >
                  {exam === '' ? 'All Types' : exam}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-bold text-[#17171C] dark:text-white outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy Level</option>
              <option value="medium">Medium Level</option>
              <option value="hard">Hard Level</option>
            </select>
          </div>
        </div>

        {/* Tests Grid */}
        {filteredTests.length === 0 ? (
          <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-[#EFE7FC] text-[#8E4CF6] rounded-3xl flex items-center justify-center mx-auto text-2xl">
              📝
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17171C] dark:text-white">No Mock Tests Match Your Filter</h3>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-1">Try resetting your filter parameters to view other available exams.</p>
            </div>
            <button
              onClick={() => setFilters({ examType: '', difficulty: '', search: '' })}
              className="px-6 py-2.5 bg-[#141416] text-white rounded-full text-xs font-bold hover:bg-[#26272E] transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.map((test, index) => (
              <TaskStyleTestCard key={test._id} test={test} index={index} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const TaskStyleTestCard = ({ test, index }) => {
  const [attemptInfo, setAttemptInfo] = useState(null);

  useEffect(() => {
    fetchAttemptInfo();
  }, [test._id]);

  const fetchAttemptInfo = async () => {
    try {
      const response = await api.get(`/results/test/${test._id}/attempts`);
      setAttemptInfo(response.data);
    } catch (error) {
      setAttemptInfo({ totalAttempts: 0, canReattempt: true });
    }
  };

  const totalQuestions = test.sections?.reduce((sum, section) => 
    sum + (section.questions?.length || 0), 0
  ) || 0;

  const hasSectionalTiming = test.sections?.some(s => s.duration && s.duration > 0);
  const hasAttempts = attemptInfo && attemptInfo.totalAttempts > 0;

  // Let every 3rd card have a subtle pastel highlight flavor
  const isFeatured = index % 4 === 2;

  if (isFeatured) {
    return (
      <div className="bg-[#44D368] rounded-3xl p-5 text-[#141416] shadow-md flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-extrabold text-base text-[#141416] line-clamp-2 leading-tight">
              {test.title}
            </h3>
            <span className="bg-[#141416] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {test.examType || 'Mock'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 bg-[#141416] text-white text-[11px] font-bold rounded-full">
              {test.difficulty || 'Medium'}
            </span>
            <span className="px-2.5 py-0.5 bg-white/80 text-[#141416] text-[11px] font-bold rounded-full">
              ⭐ Featured
            </span>
          </div>

          <p className="text-xs text-[#141416]/80 font-medium line-clamp-2">
            {test.description || 'Comprehensive timed mock test designed for top ranks.'}
          </p>

          <div className="flex items-center justify-between text-xs text-[#141416] font-bold pt-1">
            <span className="flex items-center gap-1"><FiClock size={13} /> {test.duration} mins</span>
            <span>{totalQuestions} Questions • {test.totalMarks} Marks</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#141416]/10">
          {hasAttempts && (
            <Link
              to={`/test/${test._id}/attempts`}
              className="px-3.5 py-2 bg-white/60 text-[#141416] font-bold text-xs rounded-full hover:bg-white transition flex items-center gap-1"
            >
              <FiRotateCcw size={12} /> Attempts ({attemptInfo.totalAttempts})
            </Link>
          )}
          <Link
            to={`/test/${test._id}/instructions`}
            className="flex-1 py-2 bg-[#141416] hover:bg-[#26272E] text-white font-bold text-xs rounded-full transition text-center shadow-xs"
          >
            {hasAttempts ? 'Re-attempt Test →' : 'Start Exam Now →'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm text-[#17171C] dark:text-white line-clamp-2 leading-tight">
            {test.title}
          </h3>
          <span className="px-2.5 py-0.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA] text-[10px] font-bold rounded-full">
            {test.examType || 'Mock'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
            test.difficulty === 'easy' ? 'bg-[#DDF9E2] text-[#147034]' :
            test.difficulty === 'hard' ? 'bg-[#FFE8EE] text-[#A1183A]' :
            'bg-[#FFF0DD] text-[#9B5305]'
          }`}>
            {test.difficulty ? test.difficulty.toUpperCase() : 'MEDIUM'}
          </span>
          <span className="px-2.5 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] text-[11px] font-bold rounded-full">
            On Track
          </span>
        </div>

        <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] font-medium line-clamp-2">
          {test.description || 'Improve your pacing and accuracy with realistic test questions.'}
        </p>

        <div className="flex items-center justify-between text-xs text-[#6B7082] dark:text-[#A9A2BA] pt-1">
          <span className="flex items-center gap-1 font-semibold"><FiClock size={13} /> {test.duration} mins</span>
          <span className="font-semibold text-[#8E4CF6]">{totalQuestions} Qs • {test.totalMarks} Marks</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[#E8DFF2] dark:border-[#22222B]">
        {hasAttempts && (
          <Link
            to={`/test/${test._id}/attempts`}
            className="px-3.5 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA] font-bold text-xs rounded-full hover:bg-[#F3EEFB] transition"
          >
            History ({attemptInfo.totalAttempts})
          </Link>
        )}
        <Link
          to={`/test/${test._id}/instructions`}
          className="flex-1 py-2 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] font-bold text-xs rounded-full transition text-center shadow-xs"
        >
          {hasAttempts ? 'Retake Exam' : 'Start Exam'}
        </Link>
      </div>
    </div>
  );
};

export default TestList;
