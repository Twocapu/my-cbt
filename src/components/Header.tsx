import React from 'react';
import { Moon, Sun, History, Award, BookOpen } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onGoHome: () => void;
  currentSubjectName?: string;
  isExamInProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenHistory,
  onGoHome,
  currentSubjectName,
  isExamInProgress
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Title */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                생체 2급 CBT
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                자격시험
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              생활스포츠지도사 2급 기출 문제은행
            </p>
          </div>
        </button>

        {/* Current State / Subject Badge */}
        {currentSubjectName && isExamInProgress && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>{currentSubjectName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="응시 기록 보기"
          >
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">응시 기록</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
