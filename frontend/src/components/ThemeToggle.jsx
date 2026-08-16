import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  const applyTheme = (mode) => {
    document.documentElement.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-[#FAF7FD] dark:bg-[#18181F] hover:bg-[#F3EEFB] dark:hover:bg-[#2F293E] border border-[#E8DFF2] dark:border-[#22222B] rounded-full transition-all text-[#6B7082] dark:text-[#C49CFF] flex items-center justify-center shadow-xs"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
    >
      {theme === 'light' ? (
        <FiMoon size={18} className="text-[#8E4CF6]" />
      ) : (
        <FiSun size={18} className="text-[#FF9F38]" />
      )}
    </button>
  );
};

export default ThemeToggle;
