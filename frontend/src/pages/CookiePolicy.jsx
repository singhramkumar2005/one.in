import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCircle, FiToggleLeft, FiSettings } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const CookiePolicy = () => {
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
          <div className="w-16 h-16 bg-[#FFF0DD] text-[#9B5305] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCircle size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA]">
            Last Updated: August 17, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-8 lg:p-12 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-10">
          
          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">What Are Cookies?</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              Cookies are small text files that are placed on your device when you visit our platform. They help us provide you with a better experience by remembering your preferences, understanding how you use our platform, and improving our services.
            </p>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              Similar technologies like web beacons, pixels, and local storage may also be used for similar purposes.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#DDF9E2] text-[#147034] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiToggleLeft size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#17171C] dark:text-white mb-1">1. Essential Cookies (Required)</h3>
                    <span className="px-2.5 py-0.5 bg-[#DDF9E2] text-[#147034] text-xs font-bold rounded-full">
                      Always Active
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  These cookies are necessary for the platform to function properly and cannot be disabled.
                </p>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Authentication and account security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Session management during tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Security and fraud prevention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Load balancing and performance</span>
                  </li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E5EFFF] text-[#1B459B] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiSettings size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#17171C] dark:text-white mb-1">2. Functional Cookies</h3>
                  </div>
                </div>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  These cookies enhance functionality and personalization.
                </p>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Remember your preferences (theme, language)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Save your progress in tests and tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Customize content based on your activity</span>
                  </li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#EFE7FC] text-[#5D2D9C] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#17171C] dark:text-white mb-1">3. Analytics Cookies</h3>
                  </div>
                </div>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  These cookies help us understand how users interact with our platform.
                </p>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Track page visits and user behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Measure test completion rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Identify popular features and content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Improve platform performance</span>
                  </li>
                </ul>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-2">
                  <strong>Third-party services:</strong> We may use Google Analytics or similar services.
                </p>
              </div>

              {/* Performance Cookies */}
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FFF0DD] text-[#9B5305] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiToggleLeft size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#17171C] dark:text-white mb-1">4. Performance Cookies</h3>
                  </div>
                </div>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  These cookies help us optimize platform speed and reliability.
                </p>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mb-2"><strong>Purpose:</strong></p>
                <ul className="space-y-1 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Monitor server response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Detect and fix technical issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Optimize content delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Cookie Duration</h2>
            <div className="space-y-3">
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                <strong className="text-[#17171C] dark:text-white">Session Cookies:</strong> Temporary cookies that are deleted when you close your browser. Used for essential functions during your visit.
              </p>
              <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                <strong className="text-[#17171C] dark:text-white">Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 2 years). Used to remember your preferences and recognize returning users.
              </p>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-4">
              You have control over which cookies you accept:
            </p>
            
            <div className="space-y-4">
              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 border border-[#E8DFF2] dark:border-[#22222B]">
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2 text-sm">Browser Settings</h4>
                <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-2">
                  Most browsers allow you to:
                </p>
                <ul className="space-y-1.5 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>View and delete existing cookies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Block third-party cookies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Block all cookies (may affect functionality)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Delete cookies when closing your browser</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-5 border border-[#E8DFF2] dark:border-[#22222B]">
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2 text-sm">Browser-Specific Instructions</h4>
                <ul className="space-y-1.5 text-xs text-[#6B7082] dark:text-[#A9A2BA]">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                </ul>
              </div>

              <div className="bg-[#FFF0DD] dark:bg-[#2D2415] rounded-2xl p-5 border border-[#9B5305]">
                <h4 className="font-bold text-[#17171C] dark:text-white mb-2 text-sm flex items-center gap-2">
                  <FiCircle className="text-[#9B5305]" />
                  Important Note
                </h4>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                  Blocking or deleting cookies may impact your experience on our platform. Some features may not work properly, and you may need to log in each time you visit.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Third-Party Cookies</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              We may use third-party services that set their own cookies. These services help us provide better functionality and analytics:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Analytics providers:</strong> Google Analytics (for usage statistics)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Content delivery networks:</strong> For faster content loading</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Security services:</strong> For fraud detection and prevention</span>
              </li>
            </ul>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mt-3">
              These third parties have their own privacy policies. We recommend reviewing them to understand how they use cookies.
            </p>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Updates to This Policy</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of significant changes by posting a notice on our platform or updating the "Last Updated" date.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl p-6 border border-[#E8DFF2] dark:border-[#22222B]">
            <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-4">Questions About Cookies?</h2>
            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed mb-3">
              If you have questions about how we use cookies, please contact us:
            </p>
            <ul className="space-y-2 text-sm text-[#6B7082] dark:text-[#A9A2BA]">
              <li><strong>Email:</strong> privacy@one.in</li>
              <li><strong>See also:</strong> <Link to="/privacy-policy" className="text-[#8E4CF6] hover:underline">Privacy Policy</Link></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
