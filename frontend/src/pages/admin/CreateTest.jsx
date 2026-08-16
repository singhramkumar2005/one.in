import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiArrowLeft, FiCheckSquare, FiCheck } from 'react-icons/fi';
import api from '../../utils/api';
import Layout from '../../components/Layout';

const CreateTest = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    examType: 'SSC',
    difficulty: 'medium',
    duration: 60,
    totalMarks: 100,
    language: 'English',
    instructions: [''],
    isActive: false,
    sections: [{
      name: 'General Section',
      description: '',
      questions: [{
        questionText: '',
        questionType: 'single',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ],
        marks: { positive: 1, negative: 0.25 },
        difficulty: 'medium'
      }]
    }]
  });

  const [loading, setLoading] = useState(false);

  const examTypes = ['SSC', 'Banking', 'Railway', 'Teaching', 'Defense', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData({ ...testData, [name]: value });
  };

  const addSection = () => {
    setTestData({
      ...testData,
      sections: [
        ...testData.sections,
        {
          name: `Section ${testData.sections.length + 1}`,
          description: '',
          questions: []
        }
      ]
    });
  };

  const addQuestion = (sectionIndex) => {
    const updatedSections = [...testData.sections];
    updatedSections[sectionIndex].questions.push({
      questionNumber: updatedSections[sectionIndex].questions.length + 1,
      questionText: '',
      questionType: 'single',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ],
      marks: { positive: 1, negative: 0.25 },
      difficulty: 'medium'
    });
    setTestData({ ...testData, sections: updatedSections });
  };

  const updateQuestion = (sectionIndex, questionIndex, field, value) => {
    const updatedSections = [...testData.sections];
    updatedSections[sectionIndex].questions[questionIndex][field] = value;
    setTestData({ ...testData, sections: updatedSections });
  };

  const updateOption = (sectionIndex, questionIndex, optionIndex, field, value) => {
    const updatedSections = [...testData.sections];
    const question = updatedSections[sectionIndex].questions[questionIndex];
    
    if (field === 'isCorrect' && question.questionType === 'single' && value) {
      question.options.forEach((opt, idx) => {
        opt.isCorrect = idx === optionIndex;
      });
    } else {
      question.options[optionIndex][field] = value;
    }
    
    setTestData({ ...testData, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const processedData = { ...testData };
      let globalQuestionNumber = 1;
      processedData.sections.forEach(section => {
        section.questions.forEach(question => {
          question.questionNumber = globalQuestionNumber++;
        });
      });

      await api.post('/admin/tests', processedData);
      toast.success('Test created successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to create test');
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

        {/* Header Banner */}
        <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold">
              <FiCheckSquare size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#17171C] dark:text-white">Create Test Specification</h1>
              <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Configure questions, marking criteria, and section structure</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-5">
            <h2 className="text-base font-extrabold text-[#17171C] dark:text-white pb-3 border-b border-[#E8DFF2] dark:border-[#22222B]">
              Basic Test Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Test Title *
                </label>
                <input
                  name="title"
                  required
                  value={testData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                  placeholder="e.g., SSC CGL Tier 1 Mock Test 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Exam Type *
                </label>
                <select
                  name="examType"
                  value={testData.examType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                >
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Duration (minutes) *
                </label>
                <input
                  name="duration"
                  type="number"
                  required
                  value={testData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Total Marks *
                </label>
                <input
                  name="totalMarks"
                  type="number"
                  required
                  value={testData.totalMarks}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={testData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={testData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={testData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white resize-none"
                placeholder="Brief guidelines and coverage summary for students..."
              />
            </div>
          </div>

          {/* Sections & Questions */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <div>
                <h2 className="text-base font-extrabold text-[#17171C] dark:text-white">Exam Sections & Question Items</h2>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Configure questions inside specific test sections</p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-xs font-bold text-[#8E4CF6] hover:bg-[#F3EEFB] transition flex items-center gap-1.5"
              >
                <FiPlus size={15} />
                <span>Add Section</span>
              </button>
            </div>

            {testData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="p-5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <input
                    value={section.name}
                    onChange={(e) => {
                      const updatedSections = [...testData.sections];
                      updatedSections[sectionIndex].name = e.target.value;
                      setTestData({ ...testData, sections: updatedSections });
                    }}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-extrabold text-[#17171C] dark:text-white outline-none"
                    placeholder="Section Name"
                  />
                  <button
                    type="button"
                    onClick={() => addQuestion(sectionIndex)}
                    className="px-3.5 py-2 bg-[#141416] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-1"
                  >
                    <FiPlus size={13} /> Question
                  </button>
                </div>

                <div className="space-y-4">
                  {section.questions.map((question, questionIndex) => (
                    <QuestionForm
                      key={questionIndex}
                      question={question}
                      questionIndex={questionIndex}
                      onUpdateQuestion={(field, value) => 
                        updateQuestion(sectionIndex, questionIndex, field, value)
                      }
                      onUpdateOption={(optionIndex, field, value) =>
                        updateOption(sectionIndex, questionIndex, optionIndex, field, value)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#6B7082] dark:text-[#A9A2BA] rounded-full text-xs font-bold hover:bg-[#FAF7FD]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <FiCheck size={16} />
              <span>{loading ? 'Creating...' : 'Create Test Exam'}</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

const QuestionForm = ({ question, questionIndex, onUpdateQuestion, onUpdateOption }) => (
  <div className="p-4 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl shadow-xs space-y-3">
    <div className="flex items-center justify-between">
      <span className="px-2.5 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-[11px] font-bold">
        Question #{questionIndex + 1}
      </span>
      <span className="text-[11px] text-[#6B7082] dark:text-[#A9A2BA]">Single Choice Option</span>
    </div>
    
    <textarea
      value={question.questionText}
      onChange={(e) => onUpdateQuestion('questionText', e.target.value)}
      className="w-full px-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white resize-none"
      placeholder="Type the question content here..."
      rows="2"
    />

    <div className="space-y-2">
      {question.options.map((option, optionIndex) => (
        <div 
          key={optionIndex} 
          className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
            option.isCorrect 
              ? 'border-[#44D368] bg-[#DDF9E2]' 
              : 'border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F]'
          }`}
        >
          <input
            type="radio"
            name={`question-${questionIndex}`}
            checked={option.isCorrect}
            onChange={(e) => onUpdateOption(optionIndex, 'isCorrect', e.target.checked)}
            className="w-4 h-4 text-[#8E4CF6] cursor-pointer"
          />
          <span className="w-5 h-5 rounded-full bg-white dark:bg-[#111115] flex items-center justify-center text-[10px] font-bold text-[#17171C] dark:text-white">
            {String.fromCharCode(65 + optionIndex)}
          </span>
          <input
            value={option.optionText}
            onChange={(e) => onUpdateOption(optionIndex, 'optionText', e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-lg text-xs font-semibold outline-none text-[#17171C] dark:text-white"
            placeholder={`Option ${String.fromCharCode(65 + optionIndex)} text`}
          />
          {option.isCorrect && (
            <span className="text-[11px] font-bold text-[#147034] pr-2">✓ Correct</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default CreateTest;
