import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Layout from '../components/Layout';
import { FiUser, FiMail, FiPhone, FiTarget, FiBook, FiCheckSquare, FiEdit2, FiCheck } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    targetExam: user?.targetExam || '',
    education: user?.education || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#111115] rounded-3xl p-6 sm:p-10 border border-[#E8DFF2] dark:border-[#22222B] shadow-xs space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFF2] dark:border-[#22222B]">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#DDF9E2] text-[#147034] border-2 border-[#44D368]/40 flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#17171C] dark:text-white">
                    {user?.name || 'Student Name'}
                  </h1>
                  <span className="px-3 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] rounded-full text-xs font-bold capitalize">
                    {user?.role || 'Student'}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA] mt-0.5">{user?.email}</p>
              </div>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2.5 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
              >
                <FiEdit2 size={14} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Body Form or View */}
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Target Exam
                </label>
                <input
                  name="targetExam"
                  value={formData.targetExam}
                  onChange={handleChange}
                  placeholder="e.g. SSC CGL, Banking, Railway"
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Education Background
                </label>
                <input
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. Graduate, Engineering, B.Sc"
                  className="w-full px-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] outline-none text-[#17171C] dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-[#E8DFF2] dark:border-[#22222B] bg-[#FAF7FD] dark:bg-[#18181F] rounded-full text-xs font-bold text-[#6B7082] dark:text-[#A9A2BA] hover:bg-[#F3EEFB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-bold transition shadow-xs flex items-center justify-center gap-2"
                >
                  <FiCheck size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">
                  Target Exam
                </span>
                <p className="text-sm font-bold text-[#17171C] dark:text-white">
                  {user?.targetExam || 'Not specified'}
                </p>
              </div>

              <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">
                  Contact Phone
                </span>
                <p className="text-sm font-bold text-[#17171C] dark:text-white">
                  {user?.phone || 'Not provided'}
                </p>
              </div>

              <div className="p-4 bg-[#FAF7FD] dark:bg-[#18181F] rounded-2xl border border-[#E8DFF2] dark:border-[#22222B] space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] block">
                  Education Level
                </span>
                <p className="text-sm font-bold text-[#17171C] dark:text-white">
                  {user?.education || 'Graduate Aspirant'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default Profile;
