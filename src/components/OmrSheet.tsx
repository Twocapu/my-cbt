import React from 'react';
import type { Question, UserAnswers, Bookmarks } from '../types/exam';
import { Star } from 'lucide-react';

interface OmrSheetProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: UserAnswers;
  bookmarks: Bookmarks;
  onSelectQuestion: (index: number) => void;
}

export const OmrSheet: React.FC<OmrSheetProps> = ({
  questions,
  currentIndex,
  userAnswers,
  bookmarks,
  onSelectQuestion
}) => {
  const answeredCount = Object.keys(userAnswers).filter(
    (id) => userAnswers[Number(id)] !== undefined
  ).length;
  const totalCount = questions.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>OMR 답안 현황</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {answeredCount} / {totalCount} 완료
          </span>
        </h3>
      </div>

      {/* Grid of Questions */}
      <div className="grid grid-cols-5 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const selectedChoice = userAnswers[q.id];
          const isAnswered = selectedChoice !== undefined;
          const isBookmarked = !!bookmarks[q.id];

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-sm font-semibold transition-all group ${
                isCurrent
                  ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold scale-105 z-10'
                  : isAnswered
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/70'
              }`}
            >
              {/* Question Number */}
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-0.5">
                Q.{idx + 1}
              </span>

              {/* Selected Choice badge or dash */}
              <span className="text-base font-bold">
                {isAnswered ? selectedChoice : '—'}
              </span>

              {/* Bookmark star overlay badge */}
              {isBookmarked && (
                <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-0.5 rounded-full shadow-xs">
                  <Star className="w-3 h-3 fill-amber-950 stroke-none" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend Status Bar */}
      <div className="flex items-center justify-around pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>표기 완료 ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>미답변 ({totalCount - answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>검토 필요</span>
        </div>
      </div>
    </div>
  );
};
