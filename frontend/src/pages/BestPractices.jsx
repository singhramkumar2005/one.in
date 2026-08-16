import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTrendingUp, FiClock, FiBarChart2, FiTarget, FiBook, FiZap } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const BestPractices = () => {
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
          <span className="px-3.5 py-1 bg-[#DDF9E2] text-[#147034] dark:bg-[#1B3325] dark:text-[#A8E6BF] rounded-full text-xs font-bold">
            Tips & Best Practices
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            Maximize Your Learning
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA] text-lg max-w-2xl mx-auto">
            Expert tips and proven strategies to help you get the most out of your test preparation journey
          </p>
        </div>

        {/* Best Practices Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* Practice 1 */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white mb-2">Start with Easier Tests</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Build confidence by attempting easier difficulty levels first, then gradually progress to advanced tests as you improve.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Why This Works:</h4>
              <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span className="text-[#5D2D9C]">•</span>
                  <span>Builds momentum and prevents early discouragement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5D2D9C]">•</span>
                  <span>Helps identify knowledge gaps gradually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5D2D9C]">•</span>
                  <span>Creates a solid foundation before tackling complex topics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Practice 2 */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white mb-2">Practice Regularly</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Consistency is key. Set aside dedicated time daily or weekly for practice tests to maintain and improve your skills.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Recommended Schedule:</h4>
              <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span className="text-[#5D2D9C]">•</span>
                  <span>Daily: 30-60 minutes of focused practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5D2D9C]">•</span>
                  <span>Weekly: 2-3 full-length mock tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5D2D9C]">•</span>
                  <span>Monthly: Review progress and adjust strategy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Practice 3 */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white mb-2">Review Your Mistakes</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  After each test, thoroughly analyze incorrect answers and understand why you got them wrong to avoid repeating mistakes.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Review Process:</h4>
              <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span className="text-[#147034]">•</span>
                  <span>Identify patterns in incorrect answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#147034]">•</span>
                  <span>Research concepts you didn't understand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#147034]">•</span>
                  <span>Create notes on common mistake areas</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Practice 4 */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white mb-2">Master Time Management</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Practice with timer constraints to improve speed. Learn to allocate time wisely across different question types.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Time-Saving Strategies:</h4>
              <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span className="text-[#147034]">•</span>
                  <span>Skip difficult questions and return later</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#147034]">•</span>
                  <span>Set time limits per question type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#147034]">•</span>
                  <span>Use elimination method for faster answers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Practice 5 */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                5
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white mb-2">Track Your Analytics</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Use performance reports to identify weak areas and focus your study efforts where they're needed most.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Key Metrics to Monitor:</h4>
              <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5305]">•</span>
                  <span>Category-wise accuracy percentages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5305]">•</span>
                  <span>Time spent per question average</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5305]">•</span>
                  <span>Progress trends over multiple attempts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Practice 6 */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg">
                6
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#17171C] dark:text-white mb-2">Simulate Exam Conditions</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Find a quiet space, eliminate distractions, and take tests in full-screen mode to replicate real exam environment.
                </p>
              </div>
            </div>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-sm">Creating the Right Environment:</h4>
              <ul className="space-y-2 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5305]">•</span>
                  <span>Turn off phone notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5305]">•</span>
                  <span>Close unnecessary browser tabs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9B5305]">•</span>
                  <span>Use full-screen mode for immersion</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Advanced Strategies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-8">Advanced Learning Strategies</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E5EFFF] text-[#1B459B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBook size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Active Recall Technique</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Instead of passively reviewing materials, actively test yourself on concepts. This strengthens memory and improves retention significantly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E5EFFF] text-[#1B459B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiZap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Spaced Repetition</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Review material at increasing intervals. Take the same test multiple times over weeks to move knowledge from short-term to long-term memory.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E5EFFF] text-[#1B459B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiTarget size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Focus on Weak Areas</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Don't just practice what you're good at. Spend 70% of your time on weak topics and 30% maintaining strong areas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#141416] text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Apply These Strategies?</h3>
          <p className="text-[#A9A2BA] mb-6">
            Start practicing today and see measurable improvement in your performance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/tests" className="px-6 py-3 bg-white text-[#141416] rounded-full font-bold text-sm hover:bg-[#FAF7FD] transition-all">
              Browse Tests
            </Link>
            <Link to="/user-guide" className="px-6 py-3 bg-[#26272E] text-white rounded-full font-bold text-sm hover:bg-[#3A3B42] transition-all">
              User Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPractices;
