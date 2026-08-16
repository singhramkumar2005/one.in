import React from 'react';
import { FiChevronLeft, FiChevronRight, FiFlag, FiCheck, FiCornerDownLeft, FiRotateCcw } from 'react-icons/fi';

const QuestionPanel = ({ 
  question, 
  questionNumber, 
  answer, 
  onAnswerSelect, 
  onMarkForReview, 
  onNext, 
  onPrevious,
  isFirst,
  isLast 
}) => {
  if (!question) return null;

  const handleOptionClick = (optionId) => {
    if (question.questionType === 'single') {
      onAnswerSelect(optionId);
    } else if (question.questionType === 'multiple') {
      const currentAnswers = Array.isArray(answer?.selectedAnswer) 
        ? answer.selectedAnswer 
        : [];
      
      if (currentAnswers.includes(optionId)) {
        onAnswerSelect(currentAnswers.filter(id => id !== optionId));
      } else {
        onAnswerSelect([...currentAnswers, optionId]);
      }
    }
  };

  const isSelected = (optionId) => {
    if (question.questionType === 'single') {
      return answer?.selectedAnswer === optionId;
    } else if (question.questionType === 'multiple') {
      return Array.isArray(answer?.selectedAnswer) && 
             answer.selectedAnswer.includes(optionId);
    }
    return false;
  };

  return (
    <div className="bg-white dark:bg-[#121216] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-[#E8DFF2] dark:border-[#282834] shadow-xs space-y-5 sm:space-y-6 max-w-full">
      {/* Question Header */}
      <div className="flex flex-wrap justify-between items-center gap-2.5 pb-3.5 border-b border-[#E8DFF2] dark:border-[#22222A]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#141416] text-white dark:bg-white dark:text-[#141416] rounded-full text-xs font-black shadow-xs">
            Question {questionNumber}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-[#DDF9E2] text-[#147034] dark:bg-[#0D331A] dark:text-[#4ADE80] rounded-full text-[11px] font-bold border border-[#44D368]/30">
              +{question.marks?.positive || 1} Marks
            </span>
            {question.marks?.negative > 0 && (
              <span className="px-2 py-0.5 bg-[#FFE8EE] text-[#A1183A] dark:bg-[#38121E] dark:text-[#FB7185] rounded-full text-[11px] font-bold border border-[#FF708F]/30">
                -{question.marks.negative} Negative
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onMarkForReview}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
            answer?.isMarkedForReview
              ? 'border-[#FB923C] bg-[#422006] text-[#FB923C]'
              : 'border-[#E8DFF2] dark:border-[#282834] bg-[#FAF7FD] dark:bg-[#1A1A22] text-[#6B7082] dark:text-[#8E8E9F] hover:border-[#FB923C]'
          }`}
        >
          <FiFlag size={13} className={answer?.isMarkedForReview ? 'fill-current' : ''} />
          <span className="text-[11px]">{answer?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
        </button>
      </div>

      {/* Question Text & Media */}
      <div className="space-y-3">
        <p className="text-sm sm:text-base md:text-lg text-[#17171C] dark:text-[#EDEDF2] font-semibold leading-relaxed break-words">
          {question.questionText}
        </p>
        {question.questionImage && (
          <div className="mt-3">
            <img 
              src={question.questionImage} 
              alt="Question Diagram" 
              className="max-w-full h-auto rounded-xl sm:rounded-2xl border border-[#E8DFF2] dark:border-[#282834] max-h-80 object-contain"
            />
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="text-xs font-bold text-[#8E8E9F] uppercase tracking-wider">
          Select Option ({question.questionType === 'multiple' ? 'Multiple Answers Allowed' : 'Single Choice'}):
        </div>
        {question.options?.map((option, index) => {
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D
          const selected = isSelected(option._id);

          return (
            <div
              key={option._id || index}
              onClick={() => handleOptionClick(option._id)}
              className={`flex items-start sm:items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer select-none gap-3 ${
                selected
                  ? 'border-[#4ADE80] bg-[#0D331A]/40 text-white shadow-xs ring-1 ring-[#4ADE80]/50'
                  : 'border-[#E8DFF2] dark:border-[#282834] bg-[#FAF7FD] dark:bg-[#16161D] hover:bg-white dark:hover:bg-[#1C1C24]'
              }`}
            >
              {/* Option Letter / Checkbox */}
              <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs transition mt-0.5 sm:mt-0 ${
                selected 
                  ? 'bg-[#4ADE80] text-[#0A2912]' 
                  : 'bg-white dark:bg-[#202028] border border-[#E8DFF2] dark:border-[#2E2E3C] text-[#6B7082] dark:text-[#8E8E9F]'
              }`}>
                {question.questionType === 'multiple' ? (
                  <input 
                    type="checkbox" 
                    checked={selected} 
                    onChange={() => {}} 
                    className="w-3.5 h-3.5 accent-[#4ADE80]"
                  />
                ) : (
                  selected ? <FiCheck size={14} className="stroke-[3]" /> : optionLabel
                )}
              </div>

              {/* Option Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-semibold break-words leading-snug ${selected ? 'text-[#4ADE80] dark:text-[#4ADE80]' : 'text-[#17171C] dark:text-white'}`}>
                  {option.optionText}
                </p>
                {option.optionImage && (
                  <img 
                    src={option.optionImage} 
                    alt={`Option ${optionLabel}`} 
                    className="mt-2 max-w-full sm:max-w-xs h-auto rounded-lg border border-[#E8DFF2] dark:border-[#282834] max-h-48 object-contain"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsive Navigation Actions */}
      <div className="pt-4 sm:pt-6 border-t border-[#E8DFF2] dark:border-[#22222A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl sm:rounded-full font-bold text-xs transition ${
            isFirst
              ? 'opacity-40 bg-transparent text-[#8E8E9F] border border-[#E8DFF2] dark:border-[#282834] cursor-not-allowed'
              : 'bg-[#FAF7FD] dark:bg-[#1A1A22] border border-[#E8DFF2] dark:border-[#282834] text-[#17171C] dark:text-white hover:bg-white dark:hover:bg-[#22222E]'
          }`}
        >
          <FiChevronLeft size={16} />
          <span>Previous Question</span>
        </button>

        {/* Right Actions: Clear Response & Next / Save */}
        <div className="flex items-center gap-2">
          {answer?.selectedAnswer && (
            <button
              type="button"
              onClick={() => onAnswerSelect(question.questionType === 'multiple' ? [] : null)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 text-xs font-bold rounded-xl sm:rounded-full text-[#FB7185] hover:bg-[#FB7185]/10 border border-[#FB7185]/30 transition text-center"
            >
              Clear Choice
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-6 py-2.5 bg-[#8E4CF6] hover:bg-[#7839D4] text-white rounded-xl sm:rounded-full font-black text-xs shadow-md transition"
          >
            <span>{isLast ? 'Review & Submit' : 'Save & Next'}</span>
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
