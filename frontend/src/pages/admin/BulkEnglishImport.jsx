import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUpload, FiCheck, FiAlertCircle, FiBookOpen, FiArrowLeft, FiCheckSquare } from 'react-icons/fi';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const BulkEnglishImport = () => {
  const navigate = useNavigate();
  const [bulkText, setBulkText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testMetadata, setTestMetadata] = useState({
    title: '',
    description: '',
    duration: 30,
    difficulty: 'medium',
    isActive: false
  });

  const exampleText = `Q1. An inscription on a tombstone in memory of a person who has died. Ans. Epitaph — समाधि-लेख / स्मृति-लेख
Q2. A person who loves mankind and donates money and time to help others. Ans. Philanthropist — मानव प्रेमी / परोपकारी
Q3. Something no longer in use. Ans. Obsolete — अप्रचलित
Q4. A person who endures pain or hardship without showing feelings or complaining. Ans. Stoic — सुख-दुःख में समान रहने वाला
Q5. One who does not believe in the existence of God. Ans. Atheist — नास्तिक`;

  const handleParse = async () => {
    if (!bulkText.trim()) {
      toast.error('Please enter some questions');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/bulk/parse-bulk-english', { bulkText });
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
        description: testMetadata.description || `English Vocabulary Test with ${parsedQuestions.length} questions`,
        examType: 'SSC',
        difficulty: testMetadata.difficulty,
        duration: testMetadata.duration,
        totalMarks: parsedQuestions.length,
        language: 'English',
        isActive: testMetadata.isActive,
        sections: [
          {
            name: 'English Vocabulary',
            description: 'One Word Substitution',
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

  const loadExample = () => {
    setBulkText(exampleText);
    toast.info('Example loaded! Click "Parse Questions"');
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
              <h1 className="text-xl font-extrabold text-[#17171C] dark:text-white">Bulk English Vocabulary Generator</h1>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Paste one-word substitution or vocab lists to auto-generate MCQ options</p>
            </div>
          </div>
        </div>

        {/* Text Input Card */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
              Question List (Q1. Definition... Ans. Term — Meaning)
            </label>
            <button
              onClick={loadExample}
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
            placeholder="Q1. Definition... Ans. Word — Meaning"
          />

          <div className="flex justify-end">
            <button
              onClick={handleParse}
              disabled={loading}
              className="px-6 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Parse & Generate Options'}
            </button>
          </div>
        </div>

        {/* Test Settings & Save */}
        {parsedQuestions.length > 0 && (
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Generated Test Info</h2>
              <span className="px-3 py-0.5 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
                {parsedQuestions.length} Questions Ready
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] mb-1">Test Title *</label>
                <input
                  type="text"
                  value={testMetadata.title}
                  onChange={(e) => setTestMetadata({ ...testMetadata, title: e.target.value })}
                  placeholder="e.g. SSC One Word Substitution 50 Rules"
                  className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={testMetadata.duration}
                  onChange={(e) => setTestMetadata({ ...testMetadata, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={handleCreateTest}
                disabled={loading}
                className="px-8 py-3 bg-[#44D368] hover:bg-[#38C35A] text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2"
              >
                <FiCheck size={16} />
                <span>Publish Vocabulary Test</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default BulkEnglishImport;
