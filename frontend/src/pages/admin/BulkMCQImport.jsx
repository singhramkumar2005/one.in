import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUpload, FiCheck, FiAlertCircle, FiLayers, FiArrowLeft, FiCheckSquare } from 'react-icons/fi';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const BulkMCQImport = () => {
  const navigate = useNavigate();
  const [bulkText, setBulkText] = useState('');
  const [answerSheet, setAnswerSheet] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testMetadata, setTestMetadata] = useState({
    title: '',
    description: '',
    duration: 60,
    difficulty: 'medium',
    language: 'Hindi',
    subject: 'History',
    isActive: false
  });

  const exampleHindiText = `Q1. मौर्य साम्राज्य की स्थापना किसने की थी? A) अशोक B) चंद्रगुप्त मौर्य C) बिंदुसार D) बिंबिसार
Q2. प्राचीन नालंदा विश्वविद्यालय वर्तमान में किस राज्य में स्थित था? A) उत्तर प्रदेश B) बिहार C) मध्य प्रदेश D) ओडिशा
Q3. बंगाल में स्थायी बंदोबस्त किसने लागू किया था? A) लॉर्ड वेलेजली B) लॉर्ड डलहौजी C) लॉर्ड कॉर्नवालिस D) लॉर्ड कर्जन
Q4. प्लासी का युद्ध किस वर्ष लड़ा गया था? A) 1757 B) 1761 C) 1764 D) 1772
Q5. आर्य समाज की स्थापना किसने की थी? A) राजा राममोहन राय B) स्वामी विवेकानंद C) स्वामी दयानंद सरस्वती D) ईश्वर चंद्र विद्यासागर`;

  const exampleAnswerSheet = `BBCAC`;

  const handleParse = async () => {
    if (!bulkText.trim()) {
      toast.error('Please enter questions');
      return;
    }

    if (!answerSheet.trim()) {
      toast.error('Please enter answer sheet');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/bulk-mcq/parse-bulk-mcq', {
        bulkText,
        answerSheet,
        language: testMetadata.language
      });

      if (response.data.success) {
        setParsedQuestions(response.data.questions);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to parse questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    if (!testMetadata.title.trim()) {
      toast.error('Please enter test title');
      return;
    }

    if (parsedQuestions.length === 0) {
      toast.error('Please parse questions first');
      return;
    }

    setLoading(true);
    try {
      const testData = {
        title: testMetadata.title,
        description: testMetadata.description || `${testMetadata.subject} test with ${parsedQuestions.length} questions`,
        examType: 'SSC',
        difficulty: testMetadata.difficulty,
        duration: testMetadata.duration,
        totalMarks: parsedQuestions.length,
        language: testMetadata.language,
        isActive: testMetadata.isActive,
        sections: [
          {
            name: testMetadata.subject,
            description: `${testMetadata.language} - ${testMetadata.subject}`,
            questions: parsedQuestions
          }
        ]
      };

      await api.post('/admin/tests', testData);
      toast.success('Test created successfully!');
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
              <h1 className="text-xl font-extrabold text-[#17171C] dark:text-white">Bulk Hindi/English MCQ Parser</h1>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Quickly paste full raw MCQ sheets along with answer strings (e.g. ABCD)</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={testMetadata.subject}
                onChange={(e) => setTestMetadata({ ...testMetadata, subject: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none text-[#17171C] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1">
                Answer Key String (e.g. BBCAC)
              </label>
              <input
                type="text"
                value={answerSheet}
                onChange={(e) => setAnswerSheet(e.target.value)}
                placeholder="e.g. BBCAC"
                className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none text-[#17171C] dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
                MCQ Text (Q1. ... A) ... B) ...)
              </label>
              <button
                onClick={() => {
                  setBulkText(exampleHindiText);
                  setAnswerSheet(exampleAnswerSheet);
                  toast.info('Example loaded!');
                }}
                className="text-xs font-bold text-[#8E4CF6] hover:underline"
              >
                Load Example
              </button>
            </div>
            <textarea
              rows="8"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-mono outline-none text-[#17171C] dark:text-white"
              placeholder="Paste raw MCQs here..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleParse}
              disabled={loading}
              className="px-6 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Parsing...' : 'Parse Questions & Options'}
            </button>
          </div>
        </div>

        {/* Publish */}
        {parsedQuestions.length > 0 && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Save Test Specification</h2>
              <span className="px-3 py-0.5 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
                {parsedQuestions.length} Questions Ready
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] mb-1">Test Title *</label>
              <input
                type="text"
                value={testMetadata.title}
                onChange={(e) => setTestMetadata({ ...testMetadata, title: e.target.value })}
                placeholder="e.g. Modern Indian History Practice Set #1"
                className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={handleCreateTest}
                disabled={loading}
                className="px-8 py-3 bg-[#44D368] hover:bg-[#38C35A] text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2"
              >
                <FiCheck size={16} />
                <span>Publish MCQ Test</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default BulkMCQImport;
