import { create } from 'zustand';

export const useTestStore = create((set, get) => ({
  currentTest: null,
  currentAttempt: null,
  currentSection: 0,
  currentQuestion: 0,
  answers: {},
  timeLeft: 0,
  isPaused: false,
  
  setCurrentTest: (test) => set({ currentTest: test }),
  
  setCurrentAttempt: (attempt) => set({ 
    currentAttempt: attempt,
    answers: attempt?.responses?.reduce((acc, resp) => {
      acc[resp.questionId] = {
        selectedAnswer: resp.selectedAnswer,
        isMarkedForReview: resp.isMarkedForReview,
        status: resp.status,
        timeSpent: resp.timeSpent
      };
      return acc;
    }, {}) || {}
  }),
  
  setCurrentSection: (sectionIndex) => set({ currentSection: sectionIndex }),
  
  setCurrentQuestion: (questionIndex) => set({ currentQuestion: questionIndex }),
  
  saveAnswer: (questionId, answer, isMarkedForReview = false) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          selectedAnswer: answer,
          isMarkedForReview,
          status: answer ? (isMarkedForReview ? 'marked-answered' : 'answered') : 'not-answered',
          timeSpent: state.answers[questionId]?.timeSpent || 0
        }
      }
    }));
  },
  
  markForReview: (questionId) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          isMarkedForReview: !state.answers[questionId]?.isMarkedForReview,
          status: state.answers[questionId]?.selectedAnswer 
            ? (!state.answers[questionId]?.isMarkedForReview ? 'marked-answered' : 'answered')
            : 'marked'
        }
      }
    }));
  },
  
  updateTimeSpent: (questionId, timeSpent) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          timeSpent
        }
      }
    }));
  },
  
  setTimeLeft: (time) => set({ timeLeft: time }),
  
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  
  resetTest: () => set({
    currentTest: null,
    currentAttempt: null,
    currentSection: 0,
    currentQuestion: 0,
    answers: {},
    timeLeft: 0,
    isPaused: false
  })
}));
