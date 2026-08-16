import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiUsers, FiStar, FiTarget, FiBarChart2, FiArrowRight, FiCheckSquare, FiCalendar, FiFileText } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import BrandLogo from '../components/BrandLogo';
import heroImage from '../assets/Vector student exam preparation flat illustration _ Premium AI-generated vector.jpeg';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F3EEFB] dark:bg-[#09090B]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden py-4 lg:py-6 bg-[#F3EEFB] dark:bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Text & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white dark:bg-[#111115] px-4 py-2 rounded-full border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <span className="w-2.5 h-2.5 bg-[#44D368] rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-[#8E4CF6] dark:text-[#C49CFF]">Next-Gen Mock Test & Task Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17171C] dark:text-white leading-[1.15]">
                Master Every Test with <br className="hidden sm:block" />
                <span className="text-[#8E4CF6] dark:text-[#C49CFF]">Smart Task Management</span>
              </h1>
              
              <p className="text-lg text-[#6B7082] dark:text-[#A9A2BA] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Organize your study goals, complete timed mock exams, analyze real-time scores, and track your progress with an intuitive task-based learning system.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="px-7 py-3.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full font-bold text-sm shadow-md transition-all inline-flex items-center space-x-2 group"
                >
                  <span>Start Free Workspace</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/tests"
                  className="px-7 py-3.5 bg-white dark:bg-[#111115] hover:bg-[#FAF7FD] text-[#17171C] dark:text-white rounded-full font-bold text-sm border border-[#E8DFF2] dark:border-[#22222B] transition-all shadow-xs"
                >
                  Explore Mock Tests
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4 text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-[#44D368]" size={16} /> 500+ Verified Tests
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-[#44D368]" size={16} /> Instant Analytics
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-[#44D368]" size={16} /> Anti-Cheat Mode
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative max-w-md mx-auto">
                <img 
                  src={heroImage} 
                  alt="Student Exam Preparation Illustration" 
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="py-12 bg-white/60 dark:bg-[#111115]/60 border-y border-[#E8DFF2] dark:border-[#22222B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-[#111115] p-5 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="w-10 h-10 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center mb-3">
                <FiUsers size={20} />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-[#17171C] dark:text-white">10,000+</div>
              <div className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">Active Learners</div>
            </div>

            <div className="bg-white dark:bg-[#111115] p-5 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="w-10 h-10 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center mb-3">
                <FiTarget size={20} />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-[#17171C] dark:text-white">500+</div>
              <div className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">Mock Test Series</div>
            </div>

            <div className="bg-white dark:bg-[#111115] p-5 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="w-10 h-10 bg-[#FFF0DD] text-[#9B5305] rounded-xl flex items-center justify-center mb-3">
                <FiAward size={20} />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-[#17171C] dark:text-white">96.8%</div>
              <div className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">Success Rate</div>
            </div>

            <div className="bg-white dark:bg-[#111115] p-5 rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="w-10 h-10 bg-[#E5EFFF] text-[#1B459B] rounded-xl flex items-center justify-center mb-3">
                <FiBarChart2 size={20} />
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-[#17171C] dark:text-white">1.2M+</div>
              <div className="text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">Questions Solved</div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 bg-[#EFE7FC] text-[#5D2D9C] dark:bg-[#221538] dark:text-[#C49CFF] rounded-full text-xs font-bold">
            Features & Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17171C] dark:text-white">
            Designed for Flawless Test Performance
          </h2>
          <p className="text-[#6B7082] dark:text-[#A9A2BA] font-medium text-sm sm:text-base">
            Everything structured neatly into task cards, timed attempts, and rich analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center">
              <FiCheckCircle size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Real Exam Engine</h3>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Full-screen lockdown, anti-cheat detection, sectional timers, and authentic test environment.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center">
              <FiClock size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Precision Time Tracking</h3>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Granular time per question, pacing speed metrics, and historical time analysis.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center">
              <FiBarChart2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Deep Performance Reports</h3>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Category breakdowns, percentile benchmarking, and customized improvement paths.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center">
              <FiAward size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Unlimited Re-attempts</h3>
            <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Compare your successive test attempts with side-by-side progression charts.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works - User Guide */}
      <div className="py-20 bg-white/60 dark:bg-[#111115]/60 border-y border-[#E8DFF2] dark:border-[#22222B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 bg-[#E5EFFF] text-[#1B459B] dark:bg-[#1B2B45] dark:text-[#A3BFFA] rounded-full text-xs font-bold">
              Getting Started Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17171C] dark:text-white">
              How to Use the Platform
            </h2>
            <p className="text-[#6B7082] dark:text-[#A9A2BA] font-medium text-sm sm:text-base">
              Follow these simple steps to start your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
              <div className="absolute -top-4 left-8 w-10 h-10 bg-[#8E4CF6] text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">
                1
              </div>
              <div className="pt-6 space-y-4">
                <div className="w-14 h-14 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center">
                  <FiUsers size={26} />
                </div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white">Create Your Account</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Sign up with your email and create a secure password. Complete your profile with basic information to get started.
                </p>
                <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Use a valid email address for verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Create a strong password (min 6 characters)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Complete profile setup for personalized experience</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
              <div className="absolute -top-4 left-8 w-10 h-10 bg-[#8E4CF6] text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">
                2
              </div>
              <div className="pt-6 space-y-4">
                <div className="w-14 h-14 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center">
                  <FiFileText size={26} />
                </div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white">Browse & Select Tests</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Explore our extensive library of mock tests across various subjects and difficulty levels. Choose tests that match your goals.
                </p>
                <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Filter by subject, difficulty, and duration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Review test details before starting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Check question count and time limits</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs relative">
              <div className="absolute -top-4 left-8 w-10 h-10 bg-[#8E4CF6] text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">
                3
              </div>
              <div className="pt-6 space-y-4">
                <div className="w-14 h-14 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center">
                  <FiTrendingUp size={26} />
                </div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white">Take Tests & Track Progress</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Attempt tests in a secure, full-screen environment. Review detailed analytics and track your improvement over time.
                </p>
                <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Real exam-like interface with timer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Instant score and detailed performance reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={14} />
                    <span>Compare attempts and monitor growth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Rules & Guidelines */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 bg-[#FFE8EE] text-[#A1183A] dark:bg-[#3D1520] dark:text-[#FFB3C7] rounded-full text-xs font-bold">
            Platform Rules & Guidelines
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17171C] dark:text-white">
            Rules You Must Follow
          </h2>
          <p className="text-[#6B7082] dark:text-[#A9A2BA] font-medium text-sm sm:text-base">
            Please read and adhere to these important guidelines for fair usage
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Academic Integrity */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#FFE8EE] dark:border-[#3D1520] shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiCheckCircle size={22} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Academic Integrity</h3>
                <ul className="space-y-2.5 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#A1183A] font-bold mt-0.5">•</span>
                    <span>Do not use external resources during timed tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#A1183A] font-bold mt-0.5">•</span>
                    <span>No screen capture, copying, or sharing test content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#A1183A] font-bold mt-0.5">•</span>
                    <span>Maintain honesty - cheating defeats your learning purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#A1183A] font-bold mt-0.5">•</span>
                    <span>Anti-cheat detection is active during all tests</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Taking Rules */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#E5EFFF] dark:border-[#1B2B45] shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#E5EFFF] text-[#1B459B] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiClock size={22} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Test Taking Rules</h3>
                <ul className="space-y-2.5 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B459B] font-bold mt-0.5">•</span>
                    <span>Once started, timer cannot be paused</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B459B] font-bold mt-0.5">•</span>
                    <span>Exiting full-screen mode triggers security warnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B459B] font-bold mt-0.5">•</span>
                    <span>Auto-submit occurs when time expires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B459B] font-bold mt-0.5">•</span>
                    <span>Review answers before final submission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#EFE7FC] dark:border-[#221538] shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiStar size={22} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Account Security</h3>
                <ul className="space-y-2.5 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D2D9C] font-bold mt-0.5">•</span>
                    <span>Keep your login credentials confidential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D2D9C] font-bold mt-0.5">•</span>
                    <span>Do not share your account with others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D2D9C] font-bold mt-0.5">•</span>
                    <span>Use strong, unique passwords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5D2D9C] font-bold mt-0.5">•</span>
                    <span>Report suspicious activity immediately</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Respectful Conduct */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#DDF9E2] dark:border-[#1B3325] shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiUsers size={22} />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#17171C] dark:text-white">Respectful Conduct</h3>
                <ul className="space-y-2.5 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#147034] font-bold mt-0.5">•</span>
                    <span>Treat all users with respect and dignity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#147034] font-bold mt-0.5">•</span>
                    <span>No harassment, abuse, or offensive behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#147034] font-bold mt-0.5">•</span>
                    <span>Report violations to platform administrators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#147034] font-bold mt-0.5">•</span>
                    <span>Foster a positive learning environment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-[#FFF0DD] dark:bg-[#2D2415] border-l-4 border-[#9B5305] p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="text-[#9B5305] mt-1">
              <FiTarget size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-base">Violation Consequences</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                Violations of platform rules may result in account suspension or permanent ban. We use automated monitoring and manual review to ensure fair usage. Multiple violations will result in immediate account termination without refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions & Best Practices */}
      <div className="py-20 bg-white/60 dark:bg-[#111115]/60 border-y border-[#E8DFF2] dark:border-[#22222B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 bg-[#DDF9E2] text-[#147034] dark:bg-[#1B3325] dark:text-[#A8E6BF] rounded-full text-xs font-bold">
              Tips & Best Practices
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17171C] dark:text-white">
              Maximize Your Learning
            </h2>
            <p className="text-[#6B7082] dark:text-[#A9A2BA] font-medium text-sm sm:text-base">
              Expert tips to help you get the most out of your test preparation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#17171C] dark:text-white">Start with Easier Tests</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Build confidence by attempting easier difficulty levels first, then gradually progress to advanced tests as you improve.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#17171C] dark:text-white">Practice Regularly</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Consistency is key. Set aside dedicated time daily or weekly for practice tests to maintain and improve your skills.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#17171C] dark:text-white">Review Your Mistakes</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      After each test, thoroughly analyze incorrect answers and understand why you got them wrong to avoid repeating mistakes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#17171C] dark:text-white">Time Management</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Practice with timer constraints to improve speed. Learn to allocate time wisely across different question types.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                    5
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#17171C] dark:text-white">Track Your Analytics</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Use performance reports to identify weak areas and focus your study efforts where they're needed most.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center flex-shrink-0 font-bold">
                    6
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#17171C] dark:text-white">Simulate Exam Conditions</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Find a quiet space, eliminate distractions, and take tests in full-screen mode to replicate real exam environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#141416] dark:bg-[#141416] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="px-3.5 py-1 bg-[#44D368] text-[#141416] dark:text-[#141416] rounded-full text-xs font-bold">
              Ready to begin?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Start Practicing with Real Mock Tests Today
            </h2>
            <p className="text-[#A9A2BA] dark:text-[#A9A2BA] text-sm sm:text-base font-medium">
              Create your account in seconds and unlock our comprehensive library of question banks.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-[#141416] hover:bg-[#FAF7FD] rounded-full font-bold text-sm shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Create Free Account</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#111115] border-t border-[#E8DFF2] dark:border-[#22222B] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-1">
              <BrandLogo size="sm" />
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                Your trusted platform for comprehensive test preparation and task management.
              </p>
              <div className="flex items-center space-x-3">
                <a href="#" className="w-8 h-8 bg-[#F3EEFB] dark:bg-[#18181F] rounded-lg flex items-center justify-center text-[#8E4CF6] hover:bg-[#8E4CF6] hover:text-white transition-all">
                  <FiStar size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-[#F3EEFB] dark:bg-[#18181F] rounded-lg flex items-center justify-center text-[#8E4CF6] hover:bg-[#8E4CF6] hover:text-white transition-all">
                  <FiUsers size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-[#F3EEFB] dark:bg-[#18181F] rounded-lg flex items-center justify-center text-[#8E4CF6] hover:bg-[#8E4CF6] hover:text-white transition-all">
                  <FiTarget size={16} />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Platform</h4>
              <ul className="space-y-2.5">
                <li><Link to="/tests" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Browse Tests</Link></li>
                <li><Link to="/library" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Study Library</Link></li>
                <li><Link to="/syllabus" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Syllabus Tracker</Link></li>
                <li><Link to="/todos" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Task Manager</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link to="/user-guide" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">User Guide</Link></li>
                <li><Link to="/platform-rules" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Platform Rules</Link></li>
                <li><Link to="/best-practices" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Best Practices</Link></li>
                <li><Link to="/faq" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link to="/privacy-policy" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">Cookie Policy</Link></li>
                <li><Link to="/license" className="text-xs text-[#6B7082] dark:text-[#A9A2BA] hover:text-[#8E4CF6] dark:hover:text-[#C49CFF] transition-colors">License</Link></li>
              </ul>
            </div>

          </div>

          {/* Copyright & Legal Notice */}
          <div className="pt-8 border-t border-[#E8DFF2] dark:border-[#22222B] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#6B7082] dark:text-[#A9A2BA] font-semibold">
                © 2026 ONE.in • All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-[#44D368]" size={14} />
                  Secure Platform
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-[#44D368]" size={14} />
                  Verified Tests
                </span>
              </div>
            </div>

            {/* Comprehensive Copyright Notice */}
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#EFE7FC] text-[#5D2D9C] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle size={16} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-[#17171C] dark:text-white text-sm">Copyright & Intellectual Property</h5>
                    <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      All content, including but not limited to test questions, study materials, software code, user interface design, graphics, logos, and text, is the exclusive property of ONE.in and is protected by international copyright laws. Unauthorized reproduction, distribution, modification, or commercial use of any materials from this platform is strictly prohibited and may result in legal action.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFE8EE] text-[#A1183A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiTarget size={16} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-[#17171C] dark:text-white text-sm">Trademark Notice</h5>
                    <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      ONE.in, the ONE.in logo, and all associated trademarks are registered trademarks or trademarks of ONE.in in India and other countries. All other trademarks, service marks, and trade names referenced on this platform are the property of their respective owners.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#DDF9E2] text-[#147034] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiAward size={16} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-[#17171C] dark:text-white text-sm">User-Generated Content</h5>
                    <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      By submitting content to this platform, you grant ONE.in a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content for the purpose of providing and improving our services. You retain all ownership rights to your content but agree not to submit any copyrighted materials without proper authorization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FFF0DD] text-[#9B5305] rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiBarChart2 size={16} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-[#17171C] dark:text-white text-sm">Digital Millennium Copyright Act (DMCA)</h5>
                    <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      If you believe that your copyrighted work has been infringed upon on our platform, please contact our copyright agent with detailed information about the alleged infringement. We take copyright violations seriously and will respond to valid DMCA notices in accordance with applicable law.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8DFF2] dark:border-[#22222B]">
                  <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed font-medium">
                    <span className="font-bold text-[#17171C] dark:text-white">Disclaimer:</span> The information provided on this platform is for educational purposes only. While we strive to ensure accuracy, ONE.in makes no warranties or representations regarding the completeness or accuracy of the content. Your use of this platform constitutes acceptance of our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-[#6B7082] dark:text-[#A9A2BA] pt-4">
              Made with dedication for learners worldwide • Version 2.0.0 • Last Updated: August 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

