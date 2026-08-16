import React, { useState } from 'react';
import Layout from '../components/Layout';
import TodoManagerSection from '../components/TodoManagerSection';
import { FiCheckSquare, FiCalendar, FiBook, FiAward, FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StudyTodos = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111115] p-6 rounded-3xl border border-[#E8DFF2] dark:border-[#22222B] shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#8E4CF6]/15 text-[#8E4CF6] dark:text-[#C49CFF] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs border border-[#8E4CF6]/25 flex-shrink-0">
              <FiCheckSquare size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17171C] dark:text-white tracking-tight">
                Study To-Do & Daily Records Hub 🎯
              </h1>
              <p className="text-xs font-medium text-[#6B7082] dark:text-[#A9A2BA]">
                Organize day-wise goals, record daily study hours, and browse past accomplishments.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/attendance"
              className="px-4 py-2 bg-[#8E4CF6]/15 hover:bg-[#8E4CF6]/25 text-[#8E4CF6] dark:text-[#C49CFF] font-bold text-xs rounded-full transition-all flex items-center gap-1.5 border border-[#8E4CF6]/30"
            >
              <FiCalendar size={14} />
              <span>Attendance Matrix</span>
            </Link>
            <Link
              to="/tests"
              className="px-4 py-2 bg-[#141416] hover:bg-[#26272E] text-white dark:bg-white dark:text-[#141416] font-bold text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <FiBook size={14} />
              <span>Mock Tests</span>
            </Link>
          </div>
        </div>

        {/* Main Day-Wise & History Archive Section */}
        <TodoManagerSection 
          onSelectTodo={(todo) => setSelectedTask(todo)}
          selectedTodoId={selectedTask?._id}
        />

      </div>
    </Layout>
  );
};

export default StudyTodos;
