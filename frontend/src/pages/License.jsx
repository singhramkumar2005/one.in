import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiAward, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const License = () => {
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
          <div className="w-16 h-16 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiAward size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            License Agreement
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA]">
            Last Updated: August 17, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 lg:p-12 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-10">
          
          {/* Copyright Notice */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center flex-shrink-0">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white">Copyright Notice</h2>
              </div>
            </div>
            <div className="pl-13 space-y-3">
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                © 2026 ONE.in. All rights reserved.
              </p>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                All content, materials, features, and functionality on this platform, including but not limited to text, graphics, logos, icons, images, test questions, audio clips, video content, data compilations, software code, and the design, selection, and arrangement thereof, are the exclusive property of ONE.in and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </div>
          </section>

          {/* License Grant */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">License Grant</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-4">
              Subject to your compliance with these terms, ONE.in grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to:
            </p>
            <div className="space-y-3">
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-[#17171C] dark:text-white mb-1 text-sm">Personal Use</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Access and use the platform for your personal, non-commercial educational purposes only.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-[#17171C] dark:text-white mb-1 text-sm">View and Display</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      View and display content on your personal devices solely for your own learning and test preparation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-[#44D368] mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-[#17171C] dark:text-white mb-1 text-sm">Download for Offline Use</h4>
                    <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                      Download and store certain materials marked as downloadable for personal offline use only, subject to restrictions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Restrictions */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FFE8EE] text-[#A1183A] rounded-xl flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white">License Restrictions</h2>
              </div>
            </div>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-4 pl-13">
              You are expressly prohibited from:
            </p>
            <ul className="space-y-2.5 text-sm text-[#6B7082] dark:text-[#A9A2BA] pl-13">
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Modifying, copying, reproducing, or creating derivative works from any content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Distributing, publishing, transmitting, or selling any content to third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Using content for commercial purposes or public display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Removing copyright, trademark, or other proprietary notices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Reverse engineering, decompiling, or disassembling any software</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Using automated systems (bots, scrapers) to extract content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Sharing, sublicensing, or transferring your license to others</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A1183A] font-bold">×</span>
                <span>Creating competing products or services using our content</span>
              </li>
            </ul>
          </section>

          {/* Trademark Information */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Trademark Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                ONE.in, the ONE.in logo, and all related names, logos, product and service names, designs, and slogans are trademarks of ONE.in or its affiliates. You may not use such marks without our prior written permission.
              </p>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                All other names, logos, product and service names, designs, and slogans mentioned on this platform are the trademarks of their respective owners.
              </p>
            </div>
          </section>

          {/* DMCA Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">DMCA Copyright Policy</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-4">
              We respect the intellectual property rights of others. If you believe that any content on our platform infringes your copyright, please provide us with the following information:
            </p>
            <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B] space-y-2">
              <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                <li className="flex items-start gap-2">
                  <span>1.</span>
                  <span>A physical or electronic signature of the copyright owner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2.</span>
                  <span>Identification of the copyrighted work claimed to be infringed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3.</span>
                  <span>Location of the infringing material on our platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>4.</span>
                  <span>Your contact information (address, telephone, email)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>5.</span>
                  <span>A statement that you have a good faith belief that the use is unauthorized</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>6.</span>
                  <span>A statement of accuracy under penalty of perjury</span>
                </li>
              </ul>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] pt-3">
                <strong>Send DMCA notices to:</strong> legal@one.in
              </p>
            </div>
          </section>

          {/* Open Source */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Open Source Software</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              This platform may include or utilize certain open source software components. Such components are licensed under their respective open source licenses. A list of open source components and their licenses is available upon request.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Nothing in this agreement limits your rights under, or grants you rights that supersede, the terms of any applicable open source license.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">License Termination</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              This license is effective until terminated. Your rights under this license will terminate automatically without notice if you fail to comply with any of its terms.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Upon termination, you must cease all use of the platform and destroy all copies of materials obtained from it. Termination of the license does not limit any of our other rights or remedies at law.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Governing Law</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              This license agreement shall be governed by and construed in accordance with the laws of India, without giving effect to any principles of conflicts of law. Any legal action arising from this license shall be brought exclusively in the courts of India.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Licensing Inquiries</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              For questions about licensing, permissions, or to request special licensing arrangements:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li><strong>Email:</strong> legal@one.in</li>
              <li><strong>Subject Line:</strong> "License Inquiry"</li>
              <li><strong>Address:</strong> ONE.in, Legal Department, India</li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="bg-[#DDF9E2] dark:bg-[#1B3325] rounded-2xl p-6 border-2 border-[#147034]">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="text-[#147034] mt-1 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2">Acknowledgment</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  By using this platform, you acknowledge that you have read this license agreement and agree to be bound by its terms. If you do not agree to these terms, you must immediately cease using the platform.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default License;
