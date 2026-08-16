import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiClock, FiMaximize, FiPause, FiGrid, FiX } from 'react-icons/fi';
import { useTestStore } from '../store/testStore';
import api from '../utils/api';
import QuestionPanel from '../components/QuestionPanel';
import QuestionNavigator from '../components/QuestionNavigator';
import SubmitModal from '../components/SubmitModal';

const TestExam = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { 
    currentTest, 
    currentAttempt, 
    currentSection, 
    currentQuestion,
    answers,
    setCurrentTest,
    setCurrentAttempt,
    setCurrentSection,
    setCurrentQuestion,
    saveAnswer,
    markForReview,
    resetTest
  } = useTestStore();

  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);
  const [hasSectionalTiming, setHasSectionalTiming] = useState(false);
  const [sectionStartTime, setSectionStartTime] = useState(null);
  const [questionTime, setQuestionTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [securityWarningMessage, setSecurityWarningMessage] = useState('');
  const [showMobileNavigator, setShowMobileNavigator] = useState(false);
  const timerRef = useRef(null);
  const sectionTimerRef = useRef(null);
  const questionTimerRef = useRef(null);
  const violationCountRef = useRef(0);

  useEffect(() => {
    loadTest();
    enterFullScreen();
    
    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullScreen(isInFullscreen);
      
      // If user exits fullscreen, show warning and re-enter
      if (!isInFullscreen) {
        toast.warning('Please stay in fullscreen mode during the test!');
        setTimeout(() => {
          enterFullScreen();
        }, 1000);
      }
    };
    
    // Handle page close/refresh - auto-save test
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      handleAutoSaveOnClose();
      e.returnValue = 'Your test progress will be saved. Are you sure you want to leave?';
      return 'Your test progress will be saved. Are you sure you want to leave?';
    };

    // Handle browser back button
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      toast.warning('Back button is disabled during test!');
    };

    // Prevent tab switching and detect focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error('⚠️ Warning: Tab switching detected! This may be recorded.');
        // Log the violation
        logViolation('tab_switch');
      }
    };

    // Prevent keyboard shortcuts - AGGRESSIVE MODE
    const handleKeyDown = (e) => {
      // Block Windows/Meta key completely
      if (e.key === 'Meta' || e.key === 'OS' || e.keyCode === 91 || e.keyCode === 92) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error('⚠️ Windows key is disabled! Stay focused on the test!');
        logViolation('windows_key_press');
        return false;
      }

      // Prevent Alt key (for Alt+Tab, Alt+F4)
      if (e.altKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning('Alt shortcuts are disabled during the test!');
        logViolation('alt_key_press');
        return false;
      }

      // Prevent common cheating shortcuts
      if (
        // Prevent Ctrl+W, Ctrl+T, Ctrl+N (close/new tab)
        ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 't' || e.key === 'n' || e.key === 'W' || e.key === 'T' || e.key === 'N')) ||
        // Prevent Alt+F4 (close window)
        (e.altKey && e.key === 'F4') ||
        // Prevent F11 (fullscreen toggle)
        e.key === 'F11' ||
        // Prevent Ctrl+Shift+N (incognito)
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'n' || e.key === 'N')) ||
        // Prevent Tab with modifiers
        ((e.altKey || e.ctrlKey) && e.key === 'Tab') ||
        // Prevent F1-F12 keys (except allowed)
        (e.key.startsWith('F') && e.key !== 'F5') ||
        // Prevent Ctrl+Q (quit browser)
        ((e.ctrlKey || e.metaKey) && (e.key === 'q' || e.key === 'Q'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.warning('This keyboard shortcut is disabled during the test!');
        logViolation('blocked_shortcut');
        return false;
      }

      // Prevent developer tools
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) // View source
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Developer tools are disabled during the test!');
        logViolation('developer_tools_attempt');
        return false;
      }
    };

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toast.warning('Right-click is disabled during the test!');
      logViolation('right_click_attempt');
      return false;
    };

    // Disable copy-paste
    const handleCopy = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toast.warning('Copy is disabled during the test!');
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCut = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Prevent mouse button 4 and 5 (back/forward)
    const handleMouseDown = (e) => {
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning('Mouse navigation buttons are disabled!');
        return false;
      }
    };

    // Detect focus loss - more aggressive
    const handleBlur = () => {
      toast.error('⚠️ WARNING: Test window lost focus! This is recorded.');
      logViolation('window_focus_lost');
      
      // Try to regain focus
      setTimeout(() => {
        window.focus();
      }, 100);
    };

    // Monitor mouse leaving the window
    const handleMouseLeave = () => {
      // Only log if mouse goes to top (towards browser controls)
      logViolation('mouse_left_window');
    };

    // Push initial state to prevent back button
    window.history.pushState(null, '', window.location.href);
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyDown, true); // Also capture keyup
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Prevent dragging
    document.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Additional security - disable text selection via JS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('dragstart', (e) => e.preventDefault());
    };
  }, []);

  useEffect(() => {
    // Start timers
    if (currentTest && currentAttempt) {
      // Check if test has sectional timing
      const hasIndividualSectionTime = currentTest.sections.some(s => s.duration && s.duration > 0);
      setHasSectionalTiming(hasIndividualSectionTime);

      if (hasIndividualSectionTime) {
        // Start section timer
        startSectionTimer();
      } else {
        // Start total timer
        startTimer();
      }

      startQuestionTimer();
      
      // Auto-save every 30 seconds
      const autoSaveInterval = setInterval(() => {
        saveQuestionTime();
      }, 30000); // Auto-save every 30 seconds

      return () => {
        clearInterval(autoSaveInterval);
      };
    }
  }, [currentTest, currentAttempt]);

  // Watch for section changes and restart section timer
  useEffect(() => {
    if (hasSectionalTiming && currentTest && currentSection !== undefined) {
      const section = currentTest.sections[currentSection];
      if (section && section.duration) {
        setSectionStartTime(Date.now());
        setSectionTimeLeft(section.duration * 60); // Convert to seconds
        startSectionTimer();
      }
    }
  }, [currentSection]);

  useEffect(() => {
    // Save question time when changing questions
    return () => {
      if (currentAttempt && currentSection !== undefined) {
        saveQuestionTime();
      }
    };
  }, [currentSection, currentQuestion]);

  const loadTest = async () => {
    try {
      const [testRes, attemptRes] = await Promise.all([
        api.get(`/tests/${testId}`),
        api.post(`/attempts/start/${testId}`)
      ]);

      setCurrentTest(testRes.data.test);
      setCurrentAttempt(attemptRes.data.attempt);
      
      // Check if test has sectional timing
      const hasIndividualSectionTime = testRes.data.test.sections.some(s => s.duration && s.duration > 0);
      
      if (hasIndividualSectionTime) {
        // Set section timer for first section
        const firstSection = testRes.data.test.sections[0];
        if (firstSection && firstSection.duration) {
          setSectionStartTime(Date.now());
          setSectionTimeLeft(firstSection.duration * 60); // Convert to seconds
        }
      } else {
        // Calculate total time left
        const startTime = new Date(attemptRes.data.attempt.startTime);
        const duration = testRes.data.test.duration * 60; // Convert to seconds
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeLeft(Math.max(duration - elapsed, 0));
      }

      setLoading(false);
    } catch (error) {
      toast.error('Failed to load test');
      navigate('/tests');
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSectionTimer = () => {
    if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
    sectionTimerRef.current = setInterval(() => {
      setSectionTimeLeft(prev => {
        if (prev <= 1) {
          // Section time expired - move to next section
          handleSectionTimeExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSectionTimeExpiry = () => {
    if (!currentTest?.sections) return;
    
    toast.warning('Section time expired! Moving to next section...');
    
    // Save current question before moving
    saveQuestionTime();
    
    // Check if there's a next section
    if (currentSection < currentTest.sections.length - 1) {
      // Move to next section
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setQuestionTime(0);
      
      // Section timer will restart automatically via useEffect
    } else {
      // Last section completed - auto submit
      toast.info('All sections completed! Submitting test...');
      handleAutoSubmit();
    }
  };

  const startQuestionTimer = () => {
    questionTimerRef.current = setInterval(() => {
      setQuestionTime(prev => prev + 1);
    }, 1000);
  };

  const saveQuestionTime = async () => {
    if (!currentTest || !currentAttempt) return;

    const question = getCurrentQuestion();
    if (!question) return;

    try {
      await api.put(`/attempts/${currentAttempt._id}/answer`, {
        questionId: question._id,
        selectedAnswer: answers[question._id]?.selectedAnswer,
        timeSpent: questionTime,
        isMarkedForReview: answers[question._id]?.isMarkedForReview,
        status: answers[question._id]?.status || 'not-answered'
      });
    } catch (error) {
      console.error('Failed to save question time');
    }
  };

  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch(err => console.log('Fullscreen request failed:', err));
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch(err => console.log('Exit fullscreen failed:', err));
    } else {
      setIsFullScreen(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!currentTest) return null;
    return currentTest.sections[currentSection]?.questions[currentQuestion];
  };

  const handleAnswerSelect = (answer) => {
    const question = getCurrentQuestion();
    if (question) {
      saveAnswer(question._id, answer);
    }
  };

  const handleMarkForReview = () => {
    const question = getCurrentQuestion();
    if (question) {
      markForReview(question._id);
    }
  };

  const handleNext = () => {
    if (!currentTest?.sections) return;
    
    const section = currentTest.sections[currentSection];
    if (!section) return;
    
    if (currentQuestion < section.questions.length - 1) {
      saveQuestionTime();
      setQuestionTime(0);
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < currentTest.sections.length - 1) {
      saveQuestionTime();
      setQuestionTime(0);
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrevious = () => {
    if (!currentTest?.sections) return;
    
    if (currentQuestion > 0) {
      saveQuestionTime();
      setQuestionTime(0);
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      saveQuestionTime();
      setQuestionTime(0);
      setCurrentSection(currentSection - 1);
      const prevSection = currentTest.sections[currentSection - 1];
      if (prevSection) {
        setCurrentQuestion(prevSection.questions.length - 1);
      }
    }
  };

  const handleQuestionClick = (sectionIndex, questionIndex) => {
    saveQuestionTime();
    setQuestionTime(0);
    setCurrentSection(sectionIndex);
    setCurrentQuestion(questionIndex);
  };

  const handleSubmit = async () => {
    if (!currentAttempt?._id) {
      toast.error('No active attempt found');
      return;
    }
    
    try {
      await saveQuestionTime();
      const response = await api.post(`/attempts/${currentAttempt._id}/submit`);
      toast.success('Test submitted successfully!');
      resetTest();
      exitFullScreen();
      navigate(`/results/${currentAttempt._id}`);
    } catch (error) {
      toast.error('Failed to submit test');
    }
  };

  const handleAutoSubmit = async () => {
    toast.warning('Time is up! Submitting test...');
    await handleSubmit();
  };

  const handleAutoSubmitOnClose = async () => {
    if (!currentAttempt?._id) return;
    
    try {
      await saveQuestionTime();
      await api.post(`/attempts/${currentAttempt._id}/submit`);
      resetTest();
    } catch (error) {
      console.error('Failed to auto-submit test on close');
    }
  };

  const handleAutoSaveOnClose = async () => {
    if (!currentAttempt?._id) return;
    
    try {
      await saveQuestionTime();
      // Save current progress without submitting
      toast.info('Test progress saved!');
    } catch (error) {
      console.error('Failed to auto-save test on close');
    }
  };

  const logViolation = async (violationType) => {
    if (!currentAttempt?._id) return;
    
    try {
      // Increment violation count
      violationCountRef.current += 1;

      await api.post(`/attempts/${currentAttempt._id}/log-violation`, {
        violationType,
        timestamp: new Date()
      });

      // Show severe warning after multiple violations
      if (violationCountRef.current >= 3) {
        setSecurityWarningMessage('⚠️ MULTIPLE VIOLATIONS DETECTED! Your test may be flagged for review.');
        setShowSecurityWarning(true);
        setTimeout(() => setShowSecurityWarning(false), 5000);
      }
    } catch (error) {
      console.error('Failed to log violation');
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading test...</div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Test not found</div>
      </div>
    );
  }

  const question = getCurrentQuestion();

  // Helpers for mobile question count
  const totalQuestionsInSection = currentTest?.sections?.[currentSection]?.questions?.length || 0;
  const totalQuestionsAll = currentTest?.sections?.reduce((sum, s) => sum + (s.questions?.length || 0), 0) || 0;
  const answeredCount = Object.values(answers).filter(a => a?.selectedAnswer).length;

  return (
    <div 
      className="h-screen flex flex-col bg-gray-50 dark:bg-[#09090B] no-select overflow-hidden fullscreen-exam-container" 
      style={{ 
        userSelect: 'none', 
        WebkitUserSelect: 'none', 
        MozUserSelect: 'none', 
        msUserSelect: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* Security Overlay - Prevents clicking browser controls */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          zIndex: 999998,
          pointerEvents: 'none',
          background: 'transparent'
        }}
      />

      {/* ─── HEADER ─── */}
      <div className="bg-white dark:bg-[#111115] shadow-xs border-b border-[#E8DFF2] dark:border-[#22222B] flex-shrink-0" style={{ userSelect: 'none', position: 'relative', zIndex: 999997 }}>
        <div className="w-full px-3 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center gap-2">
          {/* Left: Title (truncated on mobile) */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xs sm:text-base font-extrabold text-[#17171C] dark:text-white truncate">
              {currentTest?.title}
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold text-[#8E4CF6] dark:text-[#C49CFF] truncate">
              {currentTest?.sections[currentSection]?.name}
            </p>
          </div>

          {/* Right: Timer + Submit */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Timer - Pill Style */}
            {hasSectionalTiming ? (
              <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-sm shadow-xs ${
                sectionTimeLeft < 300 
                  ? 'bg-[#FFE8EE] text-[#A1183A] animate-pulse border border-[#FF708F]' 
                  : 'bg-[#141416] text-white dark:bg-white dark:text-[#141416]'
              }`}>
                <FiClock size={14} className="shrink-0" />
                <span className="font-mono font-extrabold">
                  {formatTime(sectionTimeLeft)}
                </span>
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-sm shadow-xs ${
                timeLeft < 300 
                  ? 'bg-[#FFE8EE] text-[#A1183A] animate-pulse border border-[#FF708F]' 
                  : 'bg-[#141416] text-white dark:bg-white dark:text-[#141416]'
              }`}>
                <FiClock size={14} className="shrink-0" />
                <span className="font-mono font-extrabold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-[#44D368] hover:bg-[#38C35A] text-[#141416] rounded-full font-bold text-[10px] sm:text-xs shadow-xs transition whitespace-nowrap"
            >
              <span className="hidden sm:inline">Submit Exam</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>

        {/* Section Tabs - Horizontally scrollable */}
        <div className="px-3 sm:px-6 py-1.5 sm:py-2 flex gap-1.5 sm:gap-2 overflow-x-auto border-t border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {currentTest?.sections?.map((section, index) => (
            <button
              key={index}
              onClick={() => {
                if (hasSectionalTiming && index < currentSection) {
                  toast.warning('Cannot go back to previous section in timed mode!');
                  return;
                }
                if (hasSectionalTiming && index > currentSection) {
                  toast.warning('Complete current section first!');
                  return;
                }
                if (!hasSectionalTiming) {
                  saveQuestionTime();
                  setQuestionTime(0);
                  setCurrentSection(index);
                  setCurrentQuestion(0);
                }
              }}
              disabled={hasSectionalTiming && index !== currentSection}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap transition ${
                currentSection === index
                  ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                  : hasSectionalTiming && index < currentSection
                  ? 'text-[#9CA0B0] cursor-not-allowed bg-transparent'
                  : 'text-[#6B7082] dark:text-[#A9A2BA] hover:bg-white dark:hover:bg-[#111115]'
              }`}
            >
              {section.name}
              {hasSectionalTiming && section.duration && (
                <span className="ml-1 text-[9px] opacity-80">({section.duration}m)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex overflow-hidden bg-[#F3EEFB] dark:bg-[#09090B]">
        {/* Question Area - takes full width on mobile */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 md:p-6 pb-20 md:pb-6">
          <QuestionPanel
            question={question}
            questionNumber={currentQuestion + 1}
            answer={answers[question?._id]}
            onAnswerSelect={handleAnswerSelect}
            onMarkForReview={handleMarkForReview}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentSection === 0 && currentQuestion === 0}
            isLast={
              currentTest?.sections && 
              currentSection === currentTest.sections.length - 1 &&
              currentQuestion === (currentTest.sections[currentSection]?.questions?.length || 0) - 1
            }
          />
        </div>

        {/* Question Navigator - DESKTOP ONLY (hidden on mobile) */}
        <div className="hidden md:block w-72 lg:w-80 bg-white dark:bg-[#111115] border-l border-[#E8DFF2] dark:border-[#22222B] overflow-y-auto flex-shrink-0">
          <QuestionNavigator
            sections={currentTest?.sections}
            answers={answers}
            currentSection={currentSection}
            currentQuestion={currentQuestion}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>

      {/* ─── MOBILE BOTTOM BAR ─── (visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111115] border-t border-[#E8DFF2] dark:border-[#22222B] px-3 py-2 flex items-center justify-between gap-2 z-[999996]" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {/* Question Progress */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-[#8E8E9F] uppercase tracking-wide">Progress</div>
          <div className="text-xs font-black text-[#17171C] dark:text-white">
            Q{currentQuestion + 1}/{totalQuestionsInSection}
            <span className="text-[#8E8E9F] font-semibold ml-1.5">· {answeredCount}/{totalQuestionsAll} done</span>
          </div>
        </div>

        {/* Open Question Navigator Drawer */}
        <button
          type="button"
          onClick={() => setShowMobileNavigator(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8E4CF6] hover:bg-[#7839D4] text-white rounded-xl font-bold text-[11px] shadow-md transition"
        >
          <FiGrid size={14} />
          <span>All Questions</span>
        </button>
      </div>

      {/* ─── MOBILE NAVIGATOR DRAWER ─── */}
      {showMobileNavigator && (
        <div className="md:hidden fixed inset-0 z-[1000000] flex flex-col">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowMobileNavigator(false)}
          />
          
          {/* Drawer - slides up from bottom */}
          <div className="relative mt-auto bg-white dark:bg-[#111115] rounded-t-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border-t border-[#E8DFF2] dark:border-[#22222B]" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            {/* Drawer handle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DFF2] dark:border-[#22222B] flex-shrink-0">
              <h3 className="text-sm font-black text-[#17171C] dark:text-white">Question Navigator</h3>
              <button
                type="button"
                onClick={() => setShowMobileNavigator(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#FAF7FD] dark:bg-[#1A1A22] text-[#6B7082] dark:text-[#8E8E9F] hover:bg-[#F3EEFB]"
              >
                <FiX size={16} />
              </button>
            </div>
            
            {/* Navigator Content */}
            <div className="flex-1 overflow-y-auto">
              <QuestionNavigator
                sections={currentTest?.sections}
                answers={answers}
                currentSection={currentSection}
                currentQuestion={currentQuestion}
                onQuestionClick={(sectionIdx, questionIdx) => {
                  handleQuestionClick(sectionIdx, questionIdx);
                  setShowMobileNavigator(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
          answers={answers}
          totalQuestions={totalQuestionsAll}
        />
      )}

      {/* Security Warning Modal */}
      {showSecurityWarning && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-red-600 text-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-pulse">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">SECURITY VIOLATION!</h2>
              <p className="text-sm sm:text-lg mb-2">{securityWarningMessage}</p>
              <p className="text-xs sm:text-sm opacity-90">
                All violations are being recorded and will be reviewed by the administrator.
              </p>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => setShowSecurityWarning(false)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  I Understand - Continue Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestExam;
