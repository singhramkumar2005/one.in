import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiUsers, FiFileText, FiTrendingUp, FiClock, FiTarget, FiAward, FiBook, FiList, FiBarChart2 } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const UserGuide = () => {
  return (
    <div className="min-h-screen bg-[#F3EEFB] text-[#17171C] dark:bg-[#09090B] dark:text-[#F7F5FC]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E4CF6] dark:text-[#C49CFF] hover:gap-3 transition-all mb-8">
          <FiArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="px-3.5 py-1 bg-[#E5EFFF] text-[#1B459B] dark:bg-[#1B2B45] dark:text-[#A3BFFA] rounded-full text-xs font-bold">
            Complete User Guide
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            Getting Started with ONE.in
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA] text-lg max-w-2xl mx-auto">
            Your comprehensive guide to mastering the platform and maximizing your learning potential
          </p>
        </div>

        {/* Quick Start Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-8">Quick Start in 3 Steps</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
              <div className="absolute -left-4 top-8 w-12 h-12 bg-[#8E4CF6] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md">
                1
              </div>
              <div className="ml-12 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center">
                    <FiUsers size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#17171C] dark:text-white">Create Your Account</h3>
                </div>
                <p className="text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Sign up with your email and create a secure password. Complete your profile with basic information to get started.
                </p>
                <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Registration Checklist:</h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Use a valid email address for verification</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Create a strong password (minimum 6 characters)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Verify your email by clicking the confirmation link</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Complete your profile for personalized recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
              <div className="absolute -left-4 top-8 w-12 h-12 bg-[#8E4CF6] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md">
                2
              </div>
              <div className="ml-12 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center">
                    <FiFileText size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#17171C] dark:text-white">Browse & Select Tests</h3>
                </div>
                <p className="text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Explore our extensive library of mock tests across various subjects and difficulty levels.
                </p>
                <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-[#17171C] dark:text-white text-sm">How to Find the Right Test:</h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Use filters to narrow down by subject, difficulty, and duration</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Read test descriptions to understand content coverage</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Check question count, time limits, and difficulty level</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Start with easier tests to build confidence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
              <div className="absolute -left-4 top-8 w-12 h-12 bg-[#8E4CF6] text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md">
                3
              </div>
              <div className="ml-12 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center">
                    <FiTrendingUp size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#17171C] dark:text-white">Take Tests & Track Progress</h3>
                </div>
                <p className="text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Attempt tests in a secure environment, review detailed analytics, and track your improvement.
                </p>
                <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-[#17171C] dark:text-white text-sm">During the Test:</h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Enter full-screen mode for an authentic exam experience</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Keep track of time with the on-screen timer</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>Review all answers before final submission</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                      <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={16} />
                      <span>View instant results and detailed performance breakdown</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Guide */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-8">Platform Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBook size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Study Library</h3>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Access comprehensive study materials, notes, and reference documents organized by subject and topic.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiList size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Syllabus Tracker</h3>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Monitor your curriculum progress with detailed syllabus tracking and completion percentages.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FFF0DD] text-[#9B5305] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiTarget size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Task Manager</h3>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Organize your study goals with a powerful task management system featuring priorities and deadlines.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FFE8EE] text-[#A1183A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBarChart2 size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Performance Analytics</h3>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Get detailed insights with category-wise breakdowns, time analysis, and improvement recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Success */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-8">Tips for Success</h2>
          
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#44D368] text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </span>
              <div>
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Set Clear Goals</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Define what you want to achieve and create a study schedule. Use the task manager to break down large goals into manageable steps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#44D368] text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </span>
              <div>
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Practice Consistently</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Regular practice is more effective than cramming. Dedicate time each day or week to take tests and review materials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#44D368] text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </span>
              <div>
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Learn from Mistakes</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  After each test, carefully review incorrect answers. Understanding why you got something wrong is crucial for improvement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#44D368] text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </span>
              <div>
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Track Your Progress</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Use analytics to identify weak areas and monitor improvement over time. Celebrate small wins to stay motivated.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#44D368] text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                5
              </span>
              <div>
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Simulate Real Exam Conditions</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Take tests in a quiet environment without distractions. Use full-screen mode to replicate actual exam pressure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Need More Help */}
        <div className="bg-[#141416] text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
          <p className="text-[#A9A2BA] mb-6">
            If you have questions or need assistance, check out our other resources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/faq" className="px-6 py-3 bg-white text-[#141416] rounded-full font-bold text-sm hover:bg-[#FAF7FD] transition-all">
              View FAQ
            </Link>
            <Link to="/platform-rules" className="px-6 py-3 bg-[#26272E] text-white rounded-full font-bold text-sm hover:bg-[#3A3B42] transition-all">
              Platform Rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
