import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import {
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiCheckSquare,
  FiBook,
  FiCalendar,
  FiCheck
} from 'react-icons/fi';

const PRESET_COLORS = [
  '#8E4CF6', // Purple
  '#44D368', // Green
  '#FF9F38', // Orange
  '#FF708F', // Pink
  '#5B8DEF', // Blue
  '#D6A6FF', // Lilac
];

const CreateSyllabus = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDays: '30',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [subjects, setSubjects] = useState([
    {
      id: Date.now(),
      name: '',
      totalLectures: '',
      color: PRESET_COLORS[0],
      subTopics: []
    }
  ]);

  const addSubject = () => {
    const colorIndex = subjects.length % PRESET_COLORS.length;
    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: '',
        totalLectures: '',
        color: PRESET_COLORS[colorIndex],
        subTopics: []
      }
    ]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } else {
      toast.error('At least one subject is required');
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
  };

  const addSubTopic = (subjectId) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              subTopics: [
                ...subject.subTopics,
                {
                  id: Date.now(),
                  name: '',
                  totalLectures: ''
                }
              ]
            }
          : subject
      )
    );
  };

  const removeSubTopic = (subjectId, subTopicId) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              subTopics: subject.subTopics.filter((st) => st.id !== subTopicId)
            }
          : subject
      )
    );
  };

  const updateSubTopic = (subjectId, subTopicId, field, value) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              subTopics: subject.subTopics.map((st) =>
                st.id === subTopicId ? { ...st, [field]: value } : st
              )
            }
          : subject
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a syllabus title');
      return;
    }

    const validSubjects = subjects.filter((s) => s.name.trim());
    if (validSubjects.length === 0) {
      toast.error('Please enter at least one subject with a name');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetDays: parseInt(formData.targetDays) || 30,
        startDate: formData.startDate,
        subjects: validSubjects.map((s) => ({
          name: s.name.trim(),
          totalLectures: parseInt(s.totalLectures) || 0,
          color: s.color,
          subTopics: s.subTopics
            .filter((st) => st.name.trim())
            .map((st) => ({
              name: st.name.trim(),
              totalLectures: parseInt(st.totalLectures) || 0
            }))
        }))
      };

      const response = await api.post('/syllabus', payload);

      if (response.data.success) {
        toast.success('Syllabus plan created successfully!');
        navigate('/syllabus');
      }
    } catch (error) {
      console.error('Create syllabus error:', error);
      toast.error(error.response?.data?.message || 'Failed to create syllabus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/syllabus"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#8E4CF6] hover:underline"
          >
            <FiArrowLeft size={16} />
            <span>Return to Syllabus Plans</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Plan Basics Card */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <div className="w-10 h-10 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-2xl flex items-center justify-center font-bold">
                <FiCheckSquare size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#17171C] dark:text-white">Create New Syllabus Plan</h1>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Set up subjects, target timeline, and lecture targets</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Plan Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SSC CGL 90-Day Complete Preparation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the study milestones and strategies for this exam..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                    Target Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetDays}
                    onChange={(e) => setFormData({ ...formData, targetDays: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Card */}
          <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-8 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8DFF2] dark:border-[#22222B]">
              <div>
                <h2 className="text-lg font-extrabold text-[#17171C] dark:text-white">Subjects & Topic Structure</h2>
                <p className="text-xs text-[#6B7082] dark:text-[#A9A2BA]">Add individual subjects and their breakdown lectures</p>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-full text-xs font-bold text-[#8E4CF6] hover:bg-[#F3EEFB] transition flex items-center gap-1.5"
              >
                <FiPlus size={15} />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="p-5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#141416] text-white flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span className="text-xs font-extrabold text-[#17171C] dark:text-white">Subject #{index + 1}</span>
                    </div>

                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(subject.id)}
                        className="text-[#FF708F] hover:bg-[#FFE8EE] p-1.5 rounded-full transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Subject Name (e.g. Quantitative Aptitude)"
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Lectures Count"
                        value={subject.totalLectures}
                        onChange={(e) => updateSubject(subject.id, 'totalLectures', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Subtopics */}
                  {subject.subTopics.length > 0 && (
                    <div className="pl-4 space-y-2 border-l-2 border-[#E8DFF2] dark:border-[#22222B] pt-1">
                      {subject.subTopics.map((subTopic) => (
                        <div key={subTopic.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Sub-topic (e.g., Percentages & Profit/Loss)"
                            value={subTopic.name}
                            onChange={(e) => updateSubTopic(subject.id, subTopic.id, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="Count"
                            value={subTopic.totalLectures}
                            onChange={(e) => updateSubTopic(subject.id, subTopic.id, 'totalLectures', e.target.value)}
                            className="w-20 px-3 py-2 bg-white dark:bg-[#111115] border border-[#E8DFF2] dark:border-[#22222B] rounded-xl text-xs font-semibold outline-none text-center"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubTopic(subject.id, subTopic.id)}
                            className="text-[#FF708F] p-1.5 hover:bg-[#FFE8EE] rounded-full"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => addSubTopic(subject.id)}
                    className="text-[11px] font-bold text-[#8E4CF6] hover:underline flex items-center gap-1"
                  >
                    <FiPlus size={13} /> Add Sub-Topic
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/syllabus"
              className="px-6 py-3 border border-[#E8DFF2] dark:border-[#22222B] bg-white dark:bg-[#111115] text-[#6B7082] dark:text-[#A9A2BA] rounded-full text-xs font-bold hover:bg-[#FAF7FD]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <FiCheck size={16} />
              <span>{loading ? 'Saving Plan...' : 'Create Syllabus Plan'}</span>
            </button>
          </div>

        </form>

      </div>
    </Layout>
  );
};

export default CreateSyllabus;
