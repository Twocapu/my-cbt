import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Question, UserAnswers, ExamMode, SubjectScoreResult } from '../types/exam';
import { checkIsCorrect } from '../types/exam';
import { ExplanationFormatter } from './ExplanationFormatter';
import {
  Trophy,
  XCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  BookOpen,
  FileText,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface ExamResultViewProps {
  subjectName: string;
  questions: Question[];
  userAnswers: UserAnswers;
  timeSpent: number; // in seconds
  mode: ExamMode;
  isFullExam?: boolean;
  subjectResults?: SubjectScoreResult[];
  failedReason?: string;
  onRetryAll: () => void;
  onRetryIncorrect: (incorrectQuestions: Question[]) => void;
  onGoHome: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  subjectName,
  questions,
  userAnswers,
  timeSpent,
  mode,
  isFullExam,
  subjectResults,
  failedReason,
  onRetryAll,
  onRetryIncorrect,
  onGoHome
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  const totalCount = questions.length;
  let correctCount = 0;

  questions.forEach((q) => {
    if (checkIsCorrect(q, userAnswers[q.id])) {
      correctCount += 1;
    }
  });

  const score = Math.round((correctCount / totalCount) * 100);
  const hasFailedSubject = subjectResults ? subjectResults.some((s) => s.isFailed) : false;
  const passed = isFullExam ? (score >= 60 && !hasFailedSubject) : (score >= 60);

  // Trigger celebration confetti on pass
  useEffect(() => {
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [passed]);

  const incorrectQuestions = questions.filter(
    (q) => !checkIsCorrect(q, userAnswers[q.id])
  );
  const correctQuestions = questions.filter((q) =>
    checkIsCorrect(q, userAnswers[q.id])
  );

  const displayedQuestions =
    filter === 'incorrect'
      ? incorrectQuestions
      : filter === 'correct'
      ? correctQuestions
      : questions;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner & Pass/Fail Status */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 border shadow-lg transition-all ${
        passed
          ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-emerald-500/10'
          : 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-500 shadow-rose-500/10'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>{subjectName} • {mode === 'mock' ? '실전 시험 모드' : '연습 학습 모드'} 채점 완료</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {passed ? '축하합니다! 최종 합격 기준 달성 🎉' : '아쉽습니다. 불합격 처리되었습니다. 💡'}
            </h1>

            <p className="text-sm sm:text-base opacity-90 font-medium">
              {passed
                ? '생활스포츠지도사 2급 자격시험 기준(과락 40점 이상, 총 평균 60점 이상)을 완벽히 달성했습니다.'
                : failedReason
                ? failedReason
                : '합격 기준인 60점 미만입니다. 오답노트를 확인하고 다시 도전해 보세요.'}
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 shadow-inner p-2 text-center">
            <span className="text-3xl sm:text-4xl font-black">{score}점</span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80 mt-1">
              {correctCount} / {totalCount} 맞힘
            </span>
          </div>

        </div>
      </div>

      {/* 5-Subject Breakdown Section (If Full Exam) */}
      {subjectResults && subjectResults.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-indigo-500" />
              <span>5과목 세부 성적표</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              과목당 20문항 (100점 만점 기준 / 과락 기준 40점)
            </span>
          </div>

          {failedReason && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span><strong>불합격 판정 사유:</strong> {failedReason}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {subjectResults.map((subRes) => (
              <div
                key={subRes.subjectId}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                  subRes.isFailed
                    ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                    : subRes.score >= 60
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {subRes.subjectName}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {subRes.score}점
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {subRes.correctCount} / {subRes.totalQuestions} 문제
                  </div>
                </div>

                <div>
                  {subRes.isFailed ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[11px]">
                      🚨 과락 (40점 미만)
                    </span>
                  ) : subRes.score >= 60 ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[11px]">
                      ✅ 통과 (60점 이상)
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[11px]">
                      ⚠️ 미달 (40~59점)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isFullExam ? '5과목 평균 점수' : '최종 점수'}
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{score} / 100 점</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">총 정답 수 / 정답률</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {correctCount}개 ({score}%)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">총 소요 시간</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(timeSpent)}</div>
          </div>
        </div>

      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>과목 선택으로 돌아가기</span>
        </button>

        <div className="flex items-center gap-3">
          {incorrectQuestions.length > 0 && (
            <button
              onClick={() => onRetryIncorrect(incorrectQuestions)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>틀린 문제만 다시 풀기 ({incorrectQuestions.length}개)</span>
            </button>
          )}

          <button
            onClick={onRetryAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>전체 시험 다시 풀기</span>
          </button>
        </div>
      </div>

      {/* Detailed Review & Incorrect Answer Note Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>상세 해설 및 오답노트</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              문제별 정답과 작성 답안, 출제 개념 해설을 확인하세요.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              전체 ({questions.length})
            </button>

            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'incorrect'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              오답만 보기 ({incorrectQuestions.length})
            </button>

            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              정답만 보기 ({correctQuestions.length})
            </button>
          </div>
        </div>

        {/* Question Review Cards List */}
        <div className="space-y-4">
          {displayedQuestions.map((q, idx) => {
            const userChoice = userAnswers[q.id];
            const isCorrect = checkIsCorrect(q, userChoice);

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                }`}
              >
                {/* Header Badge & Correctness */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {q.subjectName && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {q.subjectName}
                      </span>
                    )}
                    {q.examYear && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {q.examYear}년 기출
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>정답</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" />
                        <span>오답 (선택: {userChoice ? `${userChoice}번` : '미선택'})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-3">
                  {q.questionText || q.question}
                </h4>

                {/* Passage Box (<보기>) */}
                {(() => {
                  const passageContent = q.passage || q.보기;
                  if (!passageContent) return null;
                  return (
                    <div className="mb-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-1">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>[ 보 기 ]</span>
                      </div>
                      {Array.isArray(passageContent) ? passageContent.join('\n') : passageContent}
                    </div>
                  );
                })()}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const choiceNum = optIdx + 1;
                    const isUserChoice = userChoice === choiceNum;
                    const isRightChoice = checkIsCorrect(q, choiceNum);

                    let style = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300';

                    if (isRightChoice) {
                      style = 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isUserChoice) {
                      style = 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 font-semibold';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2 ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {choiceNum}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-3">
                  <ExplanationFormatter text={q.explanation} />
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
