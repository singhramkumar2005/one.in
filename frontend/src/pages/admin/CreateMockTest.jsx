import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiTrash2, 
  FiClock, 
  FiBookOpen, 
  FiCheck,
  FiAlertCircle,
  FiUpload,
  FiEdit2,
  FiArrowLeft,
  FiCheckSquare
} from 'react-icons/fi';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const CreateMockTest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [testInfo, setTestInfo] = useState({
    title: '',
    description: '',
    examType: 'Other',
    totalDuration: 60,
    hasIndividualSectionTime: false,
    allowedAttempts: 1,
    instructions: '',
    isPublished: false
  });

  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    name: '',
    description: '',
    duration: 15,
    questionsText: '',
    answerKey: '',
    positiveMarks: 4,
    negativeMarks: 1
  });

  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const handleTestInfoChange = (field, value) => {
    setTestInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (field, value) => {
    setCurrentSection(prev => ({ ...prev, [field]: value }));
  };

  const parseQuestionsFromText = (text, answerKey, positiveMarks = 4, negativeMarks = 1) => {
    const questions = [];
    const questionBlocks = text.split(/Q\d+\./i).filter(block => block.trim());
    const answers = answerKey.toUpperCase().replace(/[^A-D]/g, '').split('');

    questionBlocks.forEach((block, index) => {
      const lines = block.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      const questionText = lines[0].trim();
      const options = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const optionMatch = line.match(/^([A-D])[).]\s*(.+)$/i);
        if (optionMatch) {
          const optionLabel = optionMatch[1].toUpperCase();
          const optionText = optionMatch[2].trim();
          const isCorrect = answers[index] === optionLabel;

          options.push({
            optionText,
            isCorrect
          });
        }
      }

      if (options.length >= 2) {
        questions.push({
          questionText,
          questionType: 'single',
          options,
          marks: {
            positive: parseFloat(positiveMarks) || 4,
            negative: parseFloat(negativeMarks) || 1
          },
          difficulty: 'medium',
          explanation: ''
        });
      }
    });

    return questions;
  };

  const handleAddSection = () => {
    if (!currentSection.name.trim()) {
      toast.error('Please provide a section name');
      return;
    }

    if (!currentSection.questionsText.trim()) {
      toast.error('Please paste questions in the text area');
      return;
    }

    if (!currentSection.answerKey.trim()) {
      toast.error('Please provide an answer key string');
      return;
    }

    const parsedQuestions = parseQuestionsFromText(
      currentSection.questionsText,
      currentSection.answerKey,
      currentSection.positiveMarks,
      currentSection.negativeMarks
    );

    if (parsedQuestions.length === 0) {
      toast.error('No valid questions could be parsed from text');
      return;
    }

    const sectionData = {
      name: currentSection.name,
      description: currentSection.description,
      duration: testInfo.hasIndividualSectionTime ? currentSection.duration : null,
      questions: parsedQuestions
    };

    if (editingSectionIndex !== null) {
      const updated = [...sections];
      updated[editingSectionIndex] = sectionData;
      setSections(updated);
      setEditingSectionIndex(null);
      toast.success('Section updated successfully');
    } else {
      setSections([...sections, sectionData]);
      toast.success(`Section added with ${parsedQuestions.length} questions`);
    }

    setCurrentSection({
      name: '',
      description: '',
      duration: 15,
      questionsText: '',
      answerKey: '',
      positiveMarks: 4,
      negativeMarks: 1
    });
    setShowSectionForm(false);
  };

  const handleDeleteSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
    toast.info('Section deleted');
  };

  const getTotalQuestions = () => {
    return sections.reduce((sum, s) => sum + s.questions.length, 0);
  };

  const getTotalMarks = () => {
    return sections.reduce((sum, section) => {
      const sectionMarks = section.questions.reduce((qSum, q) => qSum + q.marks.positive, 0);
      return sum + sectionMarks;
    }, 0);
  };

  const handleCreateTest = async () => {
    if (sections.length === 0) {
      toast.error('Please add at least one section with questions');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: testInfo.title,
        description: testInfo.description,
        examType: testInfo.examType,
        totalDuration: testInfo.hasIndividualSectionTime 
          ? sections.reduce((sum, s) => sum + (s.duration || 0), 0)
          : testInfo.totalDuration,
        hasIndividualSectionTime: testInfo.hasIndividualSectionTime,
        allowedAttempts: testInfo.allowedAttempts,
        instructions: testInfo.instructions.split('\n').filter(i => i.trim()),
        isActive: testInfo.isPublished,
        sections: sections.map(sec => ({
          name: sec.name,
          description: sec.description,
          duration: sec.duration,
          questions: sec.questions
        }))
      };

      await api.post('/admin/tests', payload);
      toast.success('Mock test created successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create mock test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={16} />
            <span>Return to Admin Hub</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold text-lg border border-[#D6A6FF]/30">
              <FiCheckSquare size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white">Create Multi-Section Mock Exam</h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Bulk import questions per section and configure timings</p>
            </div>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition ${
                  currentStep === step
                    ? 'bg-[#141416] text-white dark:bg-white dark:text-[#141416] shadow-xs'
                    : currentStep > step
                    ? 'bg-[#DDF9E2] text-[#147034]'
                    : 'bg-[#FAF7FD] dark:bg-[#18181F] text-[#6B7082] dark:text-[#A9A2BA] border border-[#E8DFF2] dark:border-[#22222B]'
                }`}
              >
                {currentStep > step ? '✓' : step}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
              Step 1: Test Metadata & Timing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Test Title *
                </label>
                <input
                  type="text"
                  value={testInfo.title}
                  onChange={(e) => handleTestInfoChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                  placeholder="e.g. JEE Main / SSC CGL Full Length Mock Test #1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                    Exam Category *
                  </label>
                  <select
                    value={testInfo.examType}
                    onChange={(e) => handleTestInfoChange('examType', e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-bold text-[#17171C] dark:text-white outline-none"
                  >
                    <option value="SSC">SSC</option>
                    <option value="Banking">Banking</option>
                    <option value="Railway">Railway</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Defense">Defense</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={testInfo.totalDuration}
                    onChange={(e) => handleTestInfoChange('totalDuration', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Exam Guidelines & Instructions
                </label>
                <textarea
                  rows="3"
                  value={testInfo.instructions}
                  onChange={(e) => handleTestInfoChange('instructions', e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white resize-none"
                  placeholder="One instruction per line..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!testInfo.title.trim()) {
                    toast.error('Please enter test title');
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="px-8 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs"
              >
                Proceed to Add Sections →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Sections */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <div>
                <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Step 2: Section Breakdown</h2>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">{sections.length} Sections created so far</p>
              </div>
              {!showSectionForm && (
                <button
                  onClick={() => setShowSectionForm(true)}
                  className="px-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-xs font-bold text-[#8E4CF6] hover:bg-[#F3EEFB] transition flex items-center gap-1.5"
                >
                  <FiPlus size={15} />
                  <span>Add Section</span>
                </button>
              )}
            </div>

            {/* List of Added Sections */}
            {sections.length > 0 && !showSectionForm && (
              <div className="space-y-3">
                {sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <span className="font-extrabold text-xs text-[#17171C] dark:text-white block">
                        {idx + 1}. {sec.name}
                      </span>
                      <span className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">
                        {sec.questions.length} questions parsed
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSection(idx)}
                      className="p-2 text-[#FF708F] hover:bg-[#FFE8EE] rounded-full"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Section Creation Form */}
            {showSectionForm && (
              <div className="p-5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
                  New Section Form
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17171C] dark:text-white mb-1">Section Name *</label>
                    <input
                      type="text"
                      value={currentSection.name}
                      onChange={(e) => handleSectionChange('name', e.target.value)}
                      placeholder="e.g. Quantitative Aptitude"
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none text-[#17171C] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17171C] dark:text-white mb-1">Answer Key (e.g. ABCD) *</label>
                    <input
                      type="text"
                      value={currentSection.answerKey}
                      onChange={(e) => handleSectionChange('answerKey', e.target.value)}
                      placeholder="e.g. ABCDABBA"
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none text-[#17171C] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17171C] dark:text-white mb-1">
                    Paste Questions Text (Q1. ... A) ... B) ...) *
                  </label>
                  <textarea
                    rows="6"
                    value={currentSection.questionsText}
                    onChange={(e) => handleSectionChange('questionsText', e.target.value)}
                    placeholder="Q1. What is...\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4"
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-mono outline-none text-[#17171C] dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSectionForm(false)}
                    className="px-4 py-2 text-xs font-bold text-[#6B7082] hover:bg-[#FFE8EE] rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-6 py-2 bg-[#141416] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold shadow-xs"
                  >
                    Parse & Save Section
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-xs font-bold text-[#6B7082]"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  if (sections.length === 0) {
                    toast.error('Add at least one section');
                    return;
                  }
                  setCurrentStep(3);
                }}
                className="px-8 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs"
              >
                Review Mock Test →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
              Step 3: Review and Finalize
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] block">Sections</span>
                <span className="text-xl font-extrabold text-[#17171C] dark:text-white">{sections.length}</span>
              </div>
              <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#147034] block">Total Questions</span>
                <span className="text-xl font-extrabold text-[#147034]">{getTotalQuestions()}</span>
              </div>
              <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E4CF6] block">Total Marks</span>
                <span className="text-xl font-extrabold text-[#8E4CF6]">{getTotalMarks()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-xs font-bold text-[#6B7082]"
              >
                ← Back
              </button>
              <button
                onClick={handleCreateTest}
                disabled={loading}
                className="px-8 py-3 bg-[#44D368] hover:bg-[#38C35A] text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2"
              >
                <FiCheck size={16} />
                <span>{loading ? 'Publishing...' : 'Publish Mock Test Now'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default CreateMockTest;
