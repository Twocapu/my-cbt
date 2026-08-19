import React from 'react';
import type { ExamResultHistory } from '../types/exam';
import { X, History, Trash2, Award, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ExamResultHistory[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory
}) => {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return isoString;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                응시 기록 및 성적 이력
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                총 {history.length}회 응시 기록
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <Award className="w-12 h-12 mx-auto stroke-1 opacity-50" />
              <p className="font-semibold text-sm">아직 저장된 응시 기록이 없습니다.</p>
              <p className="text-xs">과목을 선택하고 시험을 응시해 보세요!</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {item.subjectName}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.mode === 'mock'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {item.mode === 'mock' ? '실전 모드' : '연습 모드'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.date)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTime(item.timeSpent)}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {item.score}점
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {item.correctCount} / {item.totalQuestions} 문제 맞힘
                    </div>
                  </div>

                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    item.passed
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}>
                    {item.passed ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>합격</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>불합격</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>기록 전체 삭제</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
            >
              닫기
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
