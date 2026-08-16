import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiAlertCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#F3EEFB] text-[#17171C] dark:bg-[#09090B] dark:text-[#F7F5FC]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E4CF6] dark:text-[#C49CFF] hover:gap-3 transition-all mb-8">
          <FiArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-[#E5EFFF] text-[#1B459B] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiFileText size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            Terms of Service
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA]">
            Last Updated: August 17, 2026
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 bg-[#FFF0DD] dark:bg-[#2D2415] border-l-4 border-[#9B5305] p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="text-[#9B5305] mt-1">
              <FiAlertCircle size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-[#17171C] dark:text-white text-base">Important</h4>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                Please read these Terms of Service carefully before using our platform. By accessing or using ONE.in, you agree to be bound by these terms. If you disagree with any part of these terms, you may not use our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 lg:p-12 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-10">
          
          {/* Agreement to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              By creating an account and using ONE.in, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. These terms constitute a legally binding agreement between you and ONE.in.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform after changes indicates acceptance of the modified terms.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">2. User Accounts</h2>
            <div className="space-y-3">
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                <strong className="text-[#17171C] dark:text-white">Account Creation:</strong> You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                <strong className="text-[#17171C] dark:text-white">Account Security:</strong> You are solely responsible for all activities that occur under your account. Notify us immediately of any unauthorized access or security breach.
              </p>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                <strong className="text-[#17171C] dark:text-white">Account Termination:</strong> We reserve the right to suspend or terminate your account at any time for violations of these terms, fraudulent activity, or at our discretion.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">3. Acceptable Use Policy</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              You agree NOT to:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use the platform for any illegal or unauthorized purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Attempt to gain unauthorized access to any portion of the platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Copy, reproduce, or distribute test content without permission</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use automated systems (bots, scrapers) to access the platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Interfere with or disrupt the platform's functionality</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Harass, abuse, or harm other users</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Share your account with others</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Engage in cheating or academic dishonesty during tests</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">4. Intellectual Property Rights</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              All content on ONE.in, including but not limited to text, graphics, logos, test questions, software, and design, is the exclusive property of ONE.in and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              <strong className="text-[#17171C] dark:text-white">Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the platform for personal, non-commercial purposes only.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              <strong className="text-[#17171C] dark:text-white">Prohibited Uses:</strong> You may not modify, copy, distribute, transmit, display, reproduce, publish, license, create derivative works from, or sell any content without our express written permission.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">5. User-Generated Content</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              By submitting content (such as comments, feedback, or study materials) to our platform, you grant ONE.in a worldwide, perpetual, irrevocable, royalty-free license to use, reproduce, modify, and display such content.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              You represent and warrant that you own or have the necessary rights to submit such content and that it does not violate any third-party rights or applicable laws.
            </p>
          </section>

          {/* Test Integrity */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">6. Test Integrity and Academic Honesty</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              You agree to maintain academic integrity when taking tests. Use of external resources, sharing test content, or any form of cheating is strictly prohibited and will result in account termination.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Our anti-cheat systems monitor for suspicious behavior. By using the platform, you consent to such monitoring for the purpose of maintaining test integrity.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              We make no warranties regarding the accuracy, reliability, or completeness of test content or study materials. Your use of the platform is at your own risk.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ONE.IN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR LOSS OF OPPORTUNITY.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Our total liability shall not exceed the amount you paid to us in the past 12 months, or $100, whichever is less.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">9. Indemnification</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              You agree to indemnify, defend, and hold harmless ONE.in from any claims, damages, losses, liabilities, and expenses arising from your use of the platform, violation of these terms, or infringement of any third-party rights.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">10. Governing Law and Dispute Resolution</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration in accordance with Indian arbitration laws, or in the courts of India.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">11. Severability</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">12. Entire Agreement</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              These Terms of Service, together with our Privacy Policy and other policies referenced herein, constitute the entire agreement between you and ONE.in regarding your use of the platform.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Contact Information</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li><strong>Email:</strong> legal@one.in</li>
              <li><strong>Address:</strong> ONE.in, Legal Department, India</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
