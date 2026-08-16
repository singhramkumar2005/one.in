import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiDownload, FiSearch, FiFilter, FiMoreVertical, FiEye, FiShare2, FiCheckCircle, FiXCircle, FiAlertCircle, FiCheckSquare, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTests: 0,
    publishedTests: 0,
    activeTests: 0,
    inactiveTests: 0,
    incompleteTests: 0
  });
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterTests();
  }, [searchTerm, statusFilter, typeFilter, tests]);

  const fetchDashboardData = async () => {
    try {
      const testsResponse = await api.get('/tests');
      const allTests = testsResponse.data.tests || [];
      
      setTests(allTests);
      setStats({
        totalTests: allTests.length,
        publishedTests: allTests.filter(t => t.isActive).length,
        activeTests: allTests.filter(t => t.isActive).length,
        inactiveTests: allTests.filter(t => !t.isActive).length,
        incompleteTests: 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = tests;

    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All statuses') {
      if (statusFilter === 'Active') {
        filtered = filtered.filter(t => t.isActive);
      } else if (statusFilter === 'Inactive') {
        filtered = filtered.filter(t => !t.isActive);
      }
    }

    if (typeFilter !== 'All types') {
      filtered = filtered.filter(t => t.examType === typeFilter);
    }

    setFilteredTests(filtered);
  };

  const toggleTestStatus = async (testId, currentStatus) => {
    try {
      await api.put(`/admin/tests/${testId}`, {
        isActive: !currentStatus
      });
      toast.success(currentStatus ? 'Test deactivated' : 'Test activated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update test status');
    }
  };

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#D6A6FF]/30">
              <FiCheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white">Admin Management Hub</h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Configure exams, manage mock tests, and track platform contents</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/create-mock-test"
              className="px-4 py-2.5 bg-[#44D368] hover:bg-[#38C35A] text-[#141416] rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <FiPlus size={15} />
              <span>New Mock Test</span>
            </Link>
            <Link
              to="/admin/create-test"
              className="px-4 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <FiPlus size={15} />
              <span>Standard Test</span>
            </Link>
          </div>
        </div>

        {/* 4 Pastel Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">Total Tests</p>
              <p className="text-2xl font-extrabold text-[#17171C] dark:text-white">{stats.totalTests}</p>
            </div>
            <div className="w-11 h-11 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center">
              <FiLayers size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#147034] mb-1">Active Tests</p>
              <p className="text-2xl font-extrabold text-[#147034]">{stats.publishedTests}</p>
            </div>
            <div className="w-11 h-11 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center">
              <FiCheckCircle size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#A1183A] mb-1">Draft / Inactive</p>
              <p className="text-2xl font-extrabold text-[#A1183A]">{stats.inactiveTests}</p>
            </div>
            <div className="w-11 h-11 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center">
              <FiXCircle size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-5 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B5305] mb-1">Exam Types</p>
              <p className="text-2xl font-extrabold text-[#9B5305]">Multiple</p>
            </div>
            <div className="w-11 h-11 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center">
              <FiAlertCircle size={20} />
            </div>
          </div>
        </div>

        {/* Tests Table Container */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-5 border-b border-[#E8DFF2] dark:border-[#22222B] flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA0B0]" size={16} />
              <input
                type="text"
                placeholder="Search test title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-bold text-[#17171C] dark:text-white outline-none"
              >
                <option>All statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-bold text-[#17171C] dark:text-white outline-none"
              >
                <option>All types</option>
                <option>MCQ</option>
                <option>English</option>
                <option>Mixed</option>
              </select>

              {(searchTerm || statusFilter !== 'All statuses' || typeFilter !== 'All types') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All statuses');
                    setTypeFilter('All types');
                  }}
                  className="px-3 py-2 text-xs font-bold text-[#FF708F] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#FAF7FD] dark:bg-[#18181F] border-b border-[#E8DFF2] dark:border-[#22222B] text-[#6B7082] dark:text-[#A9A2BA]">
                <tr>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">#</th>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Test Title</th>
                  <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3.5 text-center font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFF2]/60 dark:divide-[#22222B]/60">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#6B7082]">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8DFF2] border-t-[#8E4CF6]"></div>
                      <p className="mt-2 text-xs font-bold">Loading tests list...</p>
                    </td>
                  </tr>
                ) : paginatedTests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-xs font-medium text-[#6B7082]">
                      No tests match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTests.map((test, index) => (
                    <tr key={test._id} className="hover:bg-[#FAF7FD]/50 dark:hover:bg-[#18181F]/50 transition">
                      <td className="px-6 py-4 font-bold text-[#6B7082]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-sm text-[#17171C] dark:text-white block">
                          {test.title}
                        </span>
                        <span className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">
                          ID: {test._id?.substring(0, 10)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-[11px] font-bold">
                          {test.examType || 'Mock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-[#17171C] dark:text-white">
                        {test.duration || 60} mins
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          test.isActive ? 'bg-[#DDF9E2] text-[#147034]' : 'bg-[#FFE8EE] text-[#A1183A]'
                        }`}>
                          {test.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/test/${test._id}/instructions`}
                            className="px-3 py-1.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-full font-bold text-[11px] text-[#8E4CF6] hover:bg-[#F3EEFB] transition"
                          >
                            Preview
                          </Link>
                          <button
                            onClick={() => toggleTestStatus(test._id, test.isActive)}
                            className="px-3 py-1.5 bg-[#141416] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-[11px] transition shadow-xs"
                          >
                            {test.isActive ? 'Deactivate' : 'Publish'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredTests.length > 0 && (
            <div className="p-4 border-t border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
                Showing {Math.min(filteredTests.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredTests.length, currentPage * itemsPerPage)} of {filteredTests.length}
              </span>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition ${
                      currentPage === i + 1
                        ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416]'
                        : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] hover:bg-[#EFE7FC]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
