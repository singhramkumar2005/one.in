import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { FiUser, FiMail, FiLock, FiPhone, FiTarget, FiArrowRight, FiCheckSquare, FiArrowLeft } from 'react-icons/fi';
import api from '../utils/api';
import BrandLogo from '../components/BrandLogo';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    targetExam: ''
  });
  const [loading, setLoading] = useState(false);

  const examTypes = ['SSC CGL', 'Banking / IBPS', 'Railway RRB', 'Civil Services', 'Defense', 'Other Exams'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === '') {
      toast.error('Name is required');
      return;
    }

    if (!formData.email || formData.email.trim() === '') {
      toast.error('Email is required');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        targetExam: formData.targetExam
      });

      const { token, user } = response.data;
      
      if (!user || !user.role) {
        toast.error('Invalid user data received from server');
        return;
      }
      
      login(user, token);
      toast.success('Registration successful! Welcome to MockTask.');
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F3EEFB] dark:bg-[#09090B] text-[#17171C] dark:text-[#F7F5FC]">
      {/* Left Side Branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative bg-white/60 dark:bg-[#111115]/60 border-r border-[#E8DFF2] dark:border-[#22222B]">
        <div>
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E4CF6] dark:text-[#C49CFF] hover:gap-3 transition-all">
              <FiArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
          <BrandLogo size="lg" />

          <div className="mt-16 max-w-md space-y-4">
            <span className="px-3.5 py-1 bg-[#DDF9E2] text-[#147034] rounded-full text-xs font-bold">
              Join 10,000+ Aspirants
            </span>
            <h1 className="text-4xl font-extrabold text-[#17171C] dark:text-white leading-tight">
              Start your organized mock test journey today.
            </h1>
            <p className="text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA]">
              Sign up for unlimited practice tests, performance analytics, and structured study plans.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-md space-y-3 max-w-md">
          <div className="text-xs font-bold text-[#17171C] dark:text-white">Included in your free account</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#6B7082] dark:text-[#A9A2BA]">
            <div className="p-2.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-xl border border-[#E8DFF2] dark:border-[#22222B]">
              ✓ Realistic Exam UI
            </div>
            <div className="p-2.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-xl border border-[#E8DFF2] dark:border-[#22222B]">
              ✓ Unlimited Attempts
            </div>
            <div className="p-2.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-xl border border-[#E8DFF2] dark:border-[#22222B]">
              ✓ Time Analytics
            </div>
            <div className="p-2.5 bg-[#FAF7FD] dark:bg-[#18181F] rounded-xl border border-[#E8DFF2] dark:border-[#22222B]">
              ✓ PDF Solutions
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#9CA0B0]">
          © 2026 MockTask Workspace • Secure Exam Suite
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-md w-full py-6">
          {/* Back button for mobile */}
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E4CF6] dark:text-[#C49CFF] hover:gap-3 transition-all">
              <FiArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#17171C] dark:text-white mb-2">Create Account</h2>
            <p className="text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA]">Get started with your free mock test workspace</p>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-md p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA0B0]">
                    <FiUser size={18} />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="Alex Morgan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA0B0]">
                    <FiMail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3.5 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="9876543210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1.5">
                    Target Exam
                  </label>
                  <select
                    name="targetExam"
                    value={formData.targetExam}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                  >
                    <option value="">Select Exam</option>
                    {examTypes.map(exam => (
                      <option key={exam} value={exam}>{exam}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA0B0]">
                    <FiLock size={18} />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA0B0]">
                    <FiLock size={18} />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-2.5 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] font-bold rounded-full transition shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#E8DFF2] dark:border-[#22222B] text-center">
              <span className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Already have an account? </span>
              <Link
                to="/login"
                className="text-xs font-bold text-[#8E4CF6] hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
