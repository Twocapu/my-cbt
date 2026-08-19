import React, { useState } from 'react';
import type { Question, UserAnswers, Bookmarks, ExamMode } from '../types/exam';
import { checkIsCorrect } from '../types/exam';
import { Timer } from './Timer';
import { OmrSheet } from './OmrSheet';
import { ExplanationFormatter } from './ExplanationFormatter';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface CbtExamViewProps {
  subjectName: string;
  questions: Question[];
  mode: ExamMode;
  timeLimit: number; // in seconds
  onCompleteExam: (userAnswers: UserAnswers, timeSpent: number) => void;
  onExitExam: () => void;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({
  subjectName,
  questions,
  mode,
  timeLimit,
  onCompleteExam,
  onExitExam
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [bookmarks, setBookmarks] = useState<Bookmarks>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).filter(
    (id) => userAnswers[Number(id)] !== undefined
  ).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Handle choice selection
  const handleSelectOption = (choiceIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceIndex
    }));
  };

  // Handle bookmark toggle
  const handleToggleBookmark = () => {
    setBookmarks((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Submit test
  const handleFinalSubmit = () => {
    setShowConfirmModal(false);
    onCompleteExam(userAnswers, timeSpent);
  };

  const handleTimeUp = () => {
    alert('시험 시간이 종료되었습니다! 즉시 답안이 자동 제출됩니다.');
    onCompleteExam(userAnswers, timeLimit);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitExam}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>나가기</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{subjectName}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                mode === 'mock'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {mode === 'mock' ? '실전 시험 모드' : '연습 학습 모드'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              문제 {currentIndex + 1} / {totalQuestions}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>시험 제출하기</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Question Left, OMR Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Question Paper */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-sm relative">
            
            {/* Question Header & Category */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center">
                  {currentQuestion.number}
                </span>
                {currentQuestion.subjectName && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {currentQuestion.subjectName}
                  </span>
                )}
                {currentQuestion.examYear && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {currentQuestion.examYear}년 기출
                  </span>
                )}
                {currentQuestion.category && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {currentQuestion.category}
                  </span>
                )}
              </div>

              {/* Bookmark Toggle */}
              <button
                onClick={handleToggleBookmark}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  bookmarks[currentQuestion.id]
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Star className={`w-4 h-4 ${bookmarks[currentQuestion.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{bookmarks[currentQuestion.id] ? '검토 표시됨' : '검토 표시'}</span>
              </button>
            </div>

            {/* Question Title Text */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
              {currentQuestion.questionText || currentQuestion.question}
            </h3>

            {/* Passage Box (<보기> 박스) */}
            {(() => {
              const passageContent = currentQuestion.passage || currentQuestion.보기;
              if (!passageContent) return null;
              return (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>[ 보 기 ]</span>
                  </div>
                  {Array.isArray(passageContent) ? passageContent.join('\n') : passageContent}
                </div>
              );
            })()}

            {/* Choice Options (1 ~ 4) */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const choiceNum = idx + 1;
                const isSelected = userAnswers[currentQuestion.id] === choiceNum;
                const isPracticeMode = mode === 'practice';
                const isCorrectChoice = checkIsCorrect(currentQuestion, choiceNum);

                let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

                if (isSelected) {
                  optionStyle = 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold ring-2 ring-blue-600/30';
                }

                // If practice mode and option selected, reveal answer status
                if (isPracticeMode && userAnswers[currentQuestion.id] !== undefined) {
                  if (isCorrectChoice) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(choiceNum)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {choiceNum}
                    </span>
                    <span className="text-sm sm:text-base leading-snug pt-0.5">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Practice Mode Immediate Explanation */}
            {mode === 'practice' && userAnswers[currentQuestion.id] !== undefined && (
              <div className={`p-5 rounded-2xl border text-sm leading-relaxed ${
                checkIsCorrect(currentQuestion, userAnswers[currentQuestion.id])
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  {checkIsCorrect(currentQuestion, userAnswers[currentQuestion.id]) ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-900 dark:text-emerald-200">정답입니다!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span className="text-rose-900 dark:text-rose-200">오답입니다.</span>
                    </>
                  )}
                </div>
                <ExplanationFormatter text={currentQuestion.explanation} />
              </div>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전 문제</span>
              </button>

              <span className="text-xs font-semibold text-slate-400">
                {currentIndex + 1} / {totalQuestions}
              </span>

              <button
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>다음 문제</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Timer & OMR Sheet */}
        <div className="flex flex-col gap-6">
          <Timer
            initialSeconds={timeLimit}
            onTimeUp={handleTimeUp}
            onTimeUpdate={(secondsLeft) => setTimeSpent(timeLimit - secondsLeft)}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
          />

          <OmrSheet
            questions={questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            bookmarks={bookmarks}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </div>

      </div>

      {/* Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                답안을 제출하시겠습니까?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                제출 후에는 채점 결과와 상세 오답노트를 바로 확인할 수 있습니다.
              </p>
            </div>

            {/* Unanswered alert */}
            {unansweredCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>주의: 아직 답안을 선택하지 않은 문제가 {unansweredCount}개 있습니다.</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                취소 (돌아가기)
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
              >
                제출 및 채점
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
