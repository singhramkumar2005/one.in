import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiClock, FiStar, FiUsers, FiTarget, FiAlertTriangle, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const PlatformRules = () => {
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
          <span className="px-3.5 py-1 bg-[#FFE8EE] text-[#A1183A] dark:bg-[#3D1520] dark:text-[#FFB3C7] rounded-full text-xs font-bold">
            Platform Rules & Guidelines
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            Rules You Must Follow
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA] text-lg max-w-2xl mx-auto">
            Please read and adhere to these important guidelines for fair and respectful usage of our platform
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-12 bg-[#FFF0DD] dark:bg-[#2D2415] border-l-4 border-[#9B5305] p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="text-[#9B5305] mt-1">
              <FiAlertTriangle size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-lg">Important Notice</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                By using this platform, you agree to comply with all the rules and guidelines outlined below. Violations may result in account suspension or permanent termination. We take platform integrity seriously to ensure a fair learning environment for all users.
              </p>
            </div>
          </div>
        </div>

        {/* Main Rules Sections */}
        <div className="space-y-8 mb-16">
          
          {/* Academic Integrity */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#FFE8EE] dark:border-[#3D1520] shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#FFE8EE] text-[#A1183A] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiCheckCircle size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-2">Academic Integrity</h2>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  Maintaining honesty and integrity in all test-taking activities
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-[#A1183A] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">No External Resources During Tests</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Do not use textbooks, notes, internet searches, or any external resources while taking timed tests. Tests are designed to assess your current knowledge.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#A1183A] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">No Screen Capture or Content Sharing</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Taking screenshots, recording screens, or sharing test questions with others is strictly prohibited. All test content is copyrighted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#A1183A] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Anti-Cheat Detection Active</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Our system monitors for suspicious behavior including tab switching, copy-paste actions, and irregular answer patterns. Violations are automatically flagged.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#A1183A] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Honest Self-Assessment</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Cheating defeats the purpose of practice tests. Be honest with yourself to identify genuine areas for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Taking Rules */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#E5EFFF] dark:border-[#1B2B45] shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#E5EFFF] text-[#1B459B] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiClock size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-2">Test Taking Rules</h2>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  Guidelines for taking tests and managing your test sessions
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-[#1B459B] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Timer Cannot Be Paused</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Once you start a test, the timer begins and cannot be paused. Plan your time accordingly and ensure you have a stable internet connection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#1B459B] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Full-Screen Mode Required</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Exiting full-screen mode during a test triggers security warnings. Multiple violations may result in automatic test submission.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#1B459B] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Auto-Submit on Time Expiry</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    When the timer reaches zero, your test will be automatically submitted with all answered questions. Manage your time wisely.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#1B459B] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Review Before Submission</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Always review your answers before final submission. Once submitted, you cannot modify your responses.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#1B459B] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">One Attempt Per Session</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Each test session is independent. You can retake tests, but each attempt must be completed in one sitting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#EFE7FC] dark:border-[#221538] shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiShield size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-2">Account Security</h2>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  Protecting your account and personal information
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-[#5D2D9C] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Keep Credentials Confidential</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Never share your password or login credentials with anyone. You are responsible for all activity on your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#5D2D9C] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">No Account Sharing</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Each account is for individual use only. Sharing accounts violates our terms and compromises data integrity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#5D2D9C] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Use Strong Passwords</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Create unique, strong passwords with a mix of letters, numbers, and symbols. Avoid reusing passwords from other sites.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#5D2D9C] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Report Suspicious Activity</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    If you notice unauthorized access or suspicious activity on your account, contact support immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Respectful Conduct */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 border-2 border-[#DDF9E2] dark:border-[#1B3325] shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiUsers size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-2">Respectful Conduct</h2>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  Creating a positive and supportive learning community
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-[#147034] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Treat Others with Respect</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Treat all users, administrators, and support staff with dignity and respect. Harassment of any kind is not tolerated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#147034] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">No Harassment or Abuse</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Harassment, bullying, hate speech, discriminatory remarks, or abusive behavior will result in immediate account termination.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#147034] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Report Violations</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    If you witness rule violations or inappropriate behavior, report it to platform administrators through proper channels.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#147034] font-bold text-lg mt-0.5">•</span>
                <div>
                  <h4 className="font-bold text-[#17171C] dark:text-white mb-1">Foster Positive Environment</h4>
                  <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                    Contribute to a supportive learning atmosphere. Help others when appropriate and celebrate collective success.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Consequences Section */}
        <div className="mb-16 bg-[#FFE8EE] dark:bg-[#3D1520] border-2 border-[#A1183A] p-8 rounded-3xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-[#A1183A] text-white rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiTarget size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-2">Violation Consequences</h2>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                Understanding the penalties for rule violations
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-4">
            <div className="bg-white dark:bg-[#111115] rounded-2xl p-5">
              <h4 className="font-bold text-[#17171C] dark:text-white mb-2">First Violation</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                Warning issued via email with details of the violation. Temporary restrictions may be applied.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-5">
              <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Second Violation</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                7-day account suspension. All test attempts during this period will be void.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-5">
              <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Third Violation</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                30-day account suspension. Repeat offenders may face permanent termination.
              </p>
            </div>

            <div className="bg-white dark:bg-[#111115] rounded-2xl p-5">
              <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Severe Violations</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                Immediate permanent ban without warning for severe violations including content theft, harassment, or attempts to compromise platform security. No refunds will be issued.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-[#141416] text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Our Rules?</h3>
          <p className="text-[#A9A2BA] mb-6 max-w-2xl mx-auto">
            If you need clarification on any rules or want to report a violation, please contact our support team
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/user-guide" className="px-6 py-3 bg-white text-[#141416] rounded-full font-bold text-sm hover:bg-[#FAF7FD] transition-all">
              User Guide
            </Link>
            <Link to="/faq" className="px-6 py-3 bg-[#26272E] text-white rounded-full font-bold text-sm hover:bg-[#3A3B42] transition-all">
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformRules;
