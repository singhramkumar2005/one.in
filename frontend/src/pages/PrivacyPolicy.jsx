import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiLock, FiEye, FiDatabase } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
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
          <div className="w-16 h-16 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShield size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA]">
            Last Updated: August 17, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 lg:p-12 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-10">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#FF4D00' }}>Introduction</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              Welcome to ONE.in ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              By using our platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E5EFFF] text-[#1B459B] rounded-xl flex items-center justify-center flex-shrink-0">
                <FiDatabase size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white">Information We Collect</h2>
              </div>
            </div>
            
            <div className="space-y-4 pl-13">
              <div>
                <h3 className="text-lg font-bold text-[#17171C] dark:text-white mb-2">Personal Information</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  We collect personal information that you voluntarily provide when registering:
                </p>
                <ul className="space-y-1.5 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Name and email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Username and password (encrypted)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Profile information (optional)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#17171C] dark:text-white mb-2">Automatically Collected Information</h3>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  We automatically collect certain information when you use our platform:
                </p>
                <ul className="space-y-1.5 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Device information (browser type, operating system)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Usage data (test attempts, completion rates, scores)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>IP address and location data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Cookies and similar tracking technologies</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center flex-shrink-0">
                <FiEye size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white">How We Use Your Information</h2>
              </div>
            </div>
            
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3 pl-13">
              We use the collected information for various purposes:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA] pl-13">
              <li className="flex items-start gap-2">
                <span className="text-[#147034] font-bold">•</span>
                <span>To provide and maintain our service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#147034] font-bold">•</span>
                <span>To process and track your test attempts and performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#147034] font-bold">•</span>
                <span>To send administrative information and updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#147034] font-bold">•</span>
                <span>To improve our platform and develop new features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#147034] font-bold">•</span>
                <span>To detect and prevent fraudulent or suspicious activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#147034] font-bold">•</span>
                <span>To comply with legal obligations</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FFE8EE] text-[#A1183A] rounded-xl flex items-center justify-center flex-shrink-0">
                <FiLock size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#17171C] dark:text-white">Data Security</h2>
              </div>
            </div>
            
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed pl-13">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Information Sharing and Disclosure</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>With your consent:</strong> When you explicitly agree to share information</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Service providers:</strong> With trusted third-party services that help us operate (e.g., hosting, analytics)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Legal compliance:</strong> When required by law or to protect our rights</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets</span>
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Your Privacy Rights</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Access:</strong> Request a copy of the personal information we hold about you</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Correction:</strong> Request correction of inaccurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Deletion:</strong> Request deletion of your personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Opt-out:</strong> Opt out of marketing communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Data portability:</strong> Request transfer of your data to another service</span>
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Cookies and Tracking</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. For more details, see our <Link to="/cookie-policy" className="text-[#8E4CF6] hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Children's Privacy</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of the platform after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Contact Us</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li><strong>Email:</strong> privacy@one.in</li>
              <li><strong>Address:</strong> ONE.in, Privacy Department, India</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
