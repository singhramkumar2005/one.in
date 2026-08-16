import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Layout from '../../components/Layout';
import { FiUpload, FiCheck, FiAlertCircle, FiArrowLeft, FiCheckSquare, FiFileText } from 'react-icons/fi';

const ImportTest = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [matchedQuestions, setMatchedQuestions] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  
  const [testDetails, setTestDetails] = useState({
    title: '',
    description: '',
    examType: 'SSC',
    duration: 60
  });

  const handleQuestionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('questionSheet', file);

    setLoading(true);
    try {
      const response = await api.post('/ocr/upload-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setQuestions(response.data.questions);
        setExtractedText(response.data.extractedText);
        toast.success(`Extracted ${response.data.totalQuestions} questions!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process question sheet');
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('solutionSheet', file);

    setLoading(true);
    try {
      const response = await api.post('/ocr/upload-solutions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSolutions(response.data.solutions);
        toast.success(`Extracted ${response.data.totalSolutions} solutions!`);
        if (questions.length > 0) {
          matchQuestionsWithSolutions(questions, response.data.solutions);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process solution sheet');
    } finally {
      setLoading(false);
    }
  };

  const matchQuestionsWithSolutions = (qList, sList) => {
    const matched = qList.map((q, index) => {
      const sol = sList.find(s => s.questionNumber === q.questionNumber || s.questionNumber === index + 1);
      return {
        ...q,
        options: q.options?.map(opt => ({
          ...opt,
          isCorrect: sol ? opt.optionLabel === sol.correctAnswer : opt.isCorrect
        })),
        explanation: sol?.explanation || ''
      };
    });
    setMatchedQuestions(matched);
    setStep(3);
  };

  const handleCreateTest = async () => {
    if (!testDetails.title.trim()) {
      toast.error('Please enter a test title');
      return;
    }

    const questionsToSave = matchedQuestions.length > 0 ? matchedQuestions : questions;
    if (questionsToSave.length === 0) {
      toast.error('No questions available to save');
      return;
    }

    setLoading(true);
    try {
      const testData = {
        title: testDetails.title,
        description: testDetails.description || 'Imported test',
        examType: testDetails.examType,
        duration: testDetails.duration,
        totalMarks: questionsToSave.length,
        language: 'English',
        isActive: false,
        sections: [
          {
            name: 'General Section',
            description: 'Imported questions',
            questions: questionsToSave
          }
        ]
      };

      await api.post('/admin/tests', testData);
      toast.success('Test created successfully from OCR import!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create test');
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
        <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold">
              <FiCheckSquare size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#17171C] dark:text-white">OCR Question Sheet Import</h1>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Upload PDF/Image test papers to auto-extract questions and answer keys</p>
            </div>
          </div>
        </div>

        {/* Upload Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4 text-center">
            <div className="w-12 h-12 bg-[#EFE7FC] text-[#8E4CF6] rounded-2xl flex items-center justify-center mx-auto">
              <FiUpload size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#17171C] dark:text-white">1. Question Sheet</h3>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">Upload image or PDF of question paper</p>
            </div>
            <label className="inline-block px-5 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold cursor-pointer transition shadow-xs">
              <span>Select Question Sheet</span>
              <input type="file" onChange={handleQuestionUpload} accept=".pdf,image/*" className="hidden" />
            </label>
            {questions.length > 0 && (
              <span className="block text-xs font-bold text-[#147034]">✓ {questions.length} questions parsed</span>
            )}
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4 text-center">
            <div className="w-12 h-12 bg-[#DDF9E2] text-[#147034] rounded-2xl flex items-center justify-center mx-auto">
              <FiFileText size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#17171C] dark:text-white">2. Solution Key (Optional)</h3>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">Upload official answer key / explanations</p>
            </div>
            <label className="inline-block px-5 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] text-[#17171C] dark:text-white rounded-full text-xs font-bold cursor-pointer hover:bg-[#F3EEFB] transition">
              <span>Select Solution Sheet</span>
              <input type="file" onChange={handleSolutionUpload} accept=".pdf,image/*" className="hidden" />
            </label>
            {solutions.length > 0 && (
              <span className="block text-xs font-bold text-[#147034]">✓ {solutions.length} solutions matched</span>
            )}
          </div>
        </div>

        {/* Metadata & Save */}
        {(questions.length > 0 || matchedQuestions.length > 0) && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Save Imported Test</h2>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] mb-1">Test Title *</label>
                <input
                  type="text"
                  value={testDetails.title}
                  onChange={(e) => setTestDetails({ ...testDetails, title: e.target.value })}
                  placeholder="e.g. SSC CGL 2024 Tier 1 Official Shift 1"
                  className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] mb-1">Exam Type</label>
                <select
                  value={testDetails.examType}
                  onChange={(e) => setTestDetails({ ...testDetails, examType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-bold outline-none"
                >
                  <option value="SSC">SSC</option>
                  <option value="Banking">Banking</option>
                  <option value="Railway">Railway</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCreateTest}
                disabled={loading}
                className="px-8 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                <FiCheck size={16} />
                <span>Save & Create Test</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ImportTest;
