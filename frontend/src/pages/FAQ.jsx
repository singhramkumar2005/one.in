import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click the 'Register' button in the top navigation or on the homepage. Fill in your email, create a password, and complete the verification process. It takes less than 2 minutes!"
        },
        {
          q: "Is the platform free to use?",
          a: "Yes! Our basic platform features including test access, analytics, and task management are completely free. We may offer premium features in the future."
        },
        {
          q: "What subjects and tests are available?",
          a: "We offer 500+ mock tests across various subjects including Quantitative Aptitude, Logical Reasoning, English, General Knowledge, and specialized competitive exam preparation."
        }
      ]
    },
    {
      category: "Taking Tests",
      questions: [
        {
          q: "Can I pause a test once I start?",
          a: "No, once you start a test, the timer runs continuously and cannot be paused. This simulates real exam conditions. Make sure you have stable internet and enough time before starting."
        },
        {
          q: "What happens if I lose internet connection during a test?",
          a: "If you lose connection, try to reconnect immediately. Your progress is saved periodically. However, the timer continues running, so reconnect as quickly as possible."
        },
        {
          q: "Can I retake a test?",
          a: "Yes! You can retake tests unlimited times. Each attempt is tracked separately, allowing you to compare your performance and track improvement over time."
        },
        {
          q: "How is my score calculated?",
          a: "Scores are calculated based on correct answers. Some tests may have negative marking for incorrect answers - this will be clearly indicated in the test instructions."
        }
      ]
    },
    {
      category: "Features & Tools",
      questions: [
        {
          q: "What is the Study Library feature?",
          a: "The Study Library is a collection of organized study materials, notes, and resources to help you prepare for tests. You can browse by subject and save materials for quick access."
        },
        {
          q: "How does the Syllabus Tracker work?",
          a: "The Syllabus Tracker helps you monitor your curriculum coverage. Mark topics as completed and track your overall progress with visual progress indicators."
        },
        {
          q: "What is the Task Manager?",
          a: "The Task Manager helps you organize study goals and test schedules. Create tasks, set priorities, assign deadlines, and track completion status."
        },
        {
          q: "How can I view my performance analytics?",
          a: "After completing a test, you'll see detailed analytics including overall score, category-wise breakdown, time analysis, and comparison with previous attempts."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          q: "The test page is not loading. What should I do?",
          a: "Try refreshing your browser, clearing cache, or using an updated browser (Chrome, Firefox, Edge). If the issue persists, check your internet connection or contact support."
        },
        {
          q: "Can I use the platform on mobile devices?",
          a: "Yes, our platform is mobile-responsive. However, for the best test-taking experience, we recommend using a laptop or desktop with a larger screen."
        },
        {
          q: "Which browsers are supported?",
          a: "We support all modern browsers including Chrome (recommended), Firefox, Safari, and Edge. Make sure your browser is updated to the latest version."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page. Enter your registered email, and you'll receive a password reset link. Follow the instructions in the email."
        },
        {
          q: "Can I change my email address?",
          a: "Currently, email changes must be requested through support. Contact us with your current email and the new email you'd like to use."
        },
        {
          q: "Is my data secure?",
          a: "Yes, we take security seriously. All data is encrypted, and we follow industry best practices for data protection. We never share your personal information with third parties."
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can request account deletion by contacting support. Note that this action is permanent and all your data will be removed."
        }
      ]
    },
    {
      category: "Rules & Policies",
      questions: [
        {
          q: "What happens if I'm caught cheating?",
          a: "Cheating violations result in warnings, temporary suspension, or permanent account termination depending on severity. See our Platform Rules for detailed consequences."
        },
        {
          q: "Can I share test questions with others?",
          a: "No, sharing test content is prohibited and violates copyright. All test materials are proprietary and protected by intellectual property laws."
        },
        {
          q: "What is the anti-cheat system?",
          a: "Our anti-cheat system monitors for suspicious activities like tab switching, copy-paste actions, and irregular answer patterns. Full-screen mode violations are also tracked."
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        <div className="text-center mb-16 space-y-4">
          <div className="w-16 h-16 bg-[#EFE7FC] text-[#5D2D9C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiHelpCircle size={32} />
          </div>
          <span className="px-3.5 py-1 bg-[#EFE7FC] text-[#5D2D9C] dark:bg-[#221538] dark:text-[#C49CFF] rounded-full text-xs font-bold">
            Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17171C] dark:text-white">
            How Can We Help?
          </h1>
          <p className="text-[#6B7082] dark:text-[#A9A2BA] text-lg max-w-2xl mx-auto">
            Find answers to common questions about using our platform
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-bold text-[#17171C] dark:text-white mb-6">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq, faqIndex) => {
                  const globalIndex = `${sectionIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div
                      key={faqIndex}
                      className="bg-white dark:bg-[#111115] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-[#FAF7FD] dark:hover:bg-[#18181F] transition-colors"
                      >
                        <span className="font-bold text-[#17171C] dark:text-white pr-4">
                          {faq.q}
                        </span>
                        <div className="flex-shrink-0 w-8 h-8 bg-[#F3EEFB] dark:bg-[#18181F] rounded-lg flex items-center justify-center">
                          {isOpen ? (
                            <FiChevronUp className="text-[#8E4CF6]" size={18} />
                          ) : (
                            <FiChevronDown className="text-[#8E4CF6]" size={18} />
                          )}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-[#E8DFF2] dark:border-[#22222B]">
                            <p className="text-sm text-[#6B7082] dark:text-[#A9A2BA] leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-[#141416] text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-[#A9A2BA] mb-6">
            Can't find what you're looking for? Check out our other resources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/user-guide" className="px-6 py-3 bg-white text-[#141416] rounded-full font-bold text-sm hover:bg-[#FAF7FD] transition-all">
              User Guide
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

export default FAQ;
