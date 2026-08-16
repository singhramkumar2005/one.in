import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { FiMail, FiLock, FiArrowRight, FiCheckSquare, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../utils/api';
import BrandLogo from '../components/BrandLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      if (!user || !user.role) {
        toast.error('Invalid user data received from server');
        return;
      }
      
      login(user, token);
      toast.success('Login successful!');
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F3EEFB] dark:bg-[#09090B] text-[#17171C] dark:text-[#F7F5FC]">
      {/* Left Side - Task Style Showcase */}
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
            <span className="px-3.5 py-1 bg-[#EFE7FC] text-[#5D2D9C] dark:bg-[#221538] dark:text-[#C49CFF] rounded-full text-xs font-bold">
              Your Exam Preparation Hub
            </span>
            <h1 className="text-4xl font-extrabold text-[#17171C] dark:text-white leading-tight">
              Manage test goals, track attempts, and succeed.
            </h1>
            <p className="text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA]">
              Log in to access your assigned mock tests, personalized timing analysis, and detailed test reviews.
            </p>
          </div>
        </div>

        {/* Task Cards Preview Mini */}
        <div className="bg-white dark:bg-[#111115] p-5 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-md space-y-3 max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17171C] dark:text-white">Recent Test Progress</span>
            <span className="px-2.5 py-0.5 bg-[#DDF9E2] text-[#147034] rounded-full text-[10px] font-bold">On Track</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-[#FFE8EE] text-[#A1183A] text-[11px] font-bold rounded-full">High</span>
            <span className="px-2.5 py-0.5 bg-[#EFE7FC] text-[#5D2D9C] text-[11px] font-bold rounded-full">Reasoning</span>
            <span className="px-2.5 py-0.5 bg-[#FFF0DD] text-[#9B5305] text-[11px] font-bold rounded-full">Section 2</span>
          </div>
          <div className="h-1.5 w-full bg-[#FAF7FD] dark:bg-[#18181F] rounded-full overflow-hidden">
            <div className="h-full bg-[#44D368] w-3/4 rounded-full"></div>
          </div>
        </div>

        <div className="text-xs font-semibold text-[#9CA0B0]">
          © 2026 MockTask Workspace • Secure Exam Suite
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full">
          {/* Back button for mobile */}
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E4CF6] dark:text-[#C49CFF] hover:gap-3 transition-all">
              <FiArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-[#D6A6FF]/25 text-[#8E4CF6] rounded-xl flex items-center justify-center">
                <FiCheckSquare size={18} />
              </div>
              <span className="text-2xl font-bold">MockTask</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#17171C] dark:text-white mb-2">Welcome Back</h2>
            <p className="text-sm font-medium text-[#6B7082] dark:text-[#A9A2BA]">Sign in to access your assigned tests</p>
          </div>

          <div className="bg-white dark:bg-[#111115] rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-md p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA0B0]">
                    <FiMail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7082] dark:text-[#A9A2BA]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA0B0]">
                    <FiLock size={18} />
                  </div>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-[#FAF7FD] dark:bg-[#18181F] border border-[#E8DFF2] dark:border-[#22222B] rounded-2xl focus:ring-2 focus:ring-[#8E4CF6]/20 focus:border-[#8E4CF6] text-sm text-[#17171C] dark:text-white transition outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] font-bold rounded-full transition shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#E8DFF2] dark:border-[#22222B] text-center">
              <span className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">Don't have an account? </span>
              <Link
                to="/register"
                className="text-xs font-bold text-[#8E4CF6] hover:underline"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
