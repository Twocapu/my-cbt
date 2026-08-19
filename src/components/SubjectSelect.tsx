import React, { useState } from 'react';
import type { Subject, ExamMode, ExamResultHistory, ExamType } from '../types/exam';
import { AVAILABLE_YEARS } from '../data/examRegistry';
import {
  ShieldCheck,
  Brain,
  Landmark,
  Users,
  Activity,
  HeartPulse,
  Zap,
  Play,
  CheckCircle,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  Check,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

interface SubjectSelectProps {
  subjects: Subject[];
  selectedYear: number | 'all';
  onSelectYear: (year: number | 'all') => void;
  onStartExam: (subjectId: string, mode: ExamMode) => void;
  onStartFullExam: (selectedSubjectIds: string[], mode: ExamMode) => void;
  examHistory: ExamResultHistory[];
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  subjects,
  selectedYear,
  onSelectYear,
  onStartExam,
  onStartFullExam,
  examHistory
}) => {
  const [examType, setExamType] = useState<ExamType>('single');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ethics');
  const [selectedFullSubjectIds, setSelectedFullSubjectIds] = useState<string[]>([
    'sociology',
    'education',
    'psychology',
    'history',
    'ethics'
  ]);
  const [selectedMode, setSelectedMode] = useState<ExamMode>('mock');

  // Map icon component
  const renderIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'Brain': return <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-pink-600 dark:text-pink-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
      default: return <BookOpen className="w-6 h-6 text-blue-600" />;
    }
  };

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Compute stats
  const totalAttempts = examHistory.length;
  const passedAttempts = examHistory.filter((h) => h.passed).length;
  const avgScore = totalAttempts > 0
    ? Math.round(examHistory.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts)
    : 0;

  // Toggle 5-subject selection
  const handleToggleFullSubject = (id: string) => {
    if (selectedFullSubjectIds.includes(id)) {
      if (selectedFullSubjectIds.length <= 1) {
        alert('최소 1개 이상의 과목을 선택해야 합니다.');
        return;
      }
      setSelectedFullSubjectIds(selectedFullSubjectIds.filter((subId) => subId !== id));
    } else {
      if (selectedFullSubjectIds.length >= 5) {
        alert('실전 모의고사는 최대 5개 과목까지 선택 가능합니다.');
        return;
      }
      setSelectedFullSubjectIds([...selectedFullSubjectIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>2024~2026년 최신 기출문제 반영 & 100분 5과목 종합 실전 테스트 지원</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            생활스포츠지도사 2급 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-200">
              CBT 기출 문제은행
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            과목별 단일 응시(15분) 및 실제 자격시험과 동일한 <strong>5과목 종합 실전 모의고사 (100문항 / 100분)</strong>를 지원합니다.
          </p>
        </div>

        {/* Decorative Grid Circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Stats Summary Widget (If user has history) */}
      {totalAttempts > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">누적 응시 횟수</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalAttempts}회</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">평균 정답 점수</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{avgScore}점</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">합격 횟수</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{passedAttempts}회</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Main Exam Format Switcher (Single Subject vs 5-Subject Full Exam) */}
      <div className="bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl grid grid-cols-2 gap-2 max-w-2xl mx-auto shadow-inner">
        <button
          onClick={() => setExamType('single')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold transition-all ${
            examType === 'single'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-900/5'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>과목별 개별 응시 (20문항)</span>
        </button>

        <button
          onClick={() => setExamType('full')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold transition-all ${
            examType === 'full'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>🏆 5과목 종합 실전 모의고사 (100분)</span>
        </button>
      </div>

      {/* Exam Year Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Calendar className="w-5 h-5 text-blue-500" />
          <span>시험 출제 범위 선택:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* All Years Mixed Option */}
          <button
            onClick={() => onSelectYear('all')}
            className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-1.5 transition-all ${
              selectedYear === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400'
                : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ 전 연도 무작위 섞기 모드</span>
          </button>

          {AVAILABLE_YEARS.map((yr) => (
            <button
              key={yr}
              onClick={() => onSelectYear(yr)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedYear === yr
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {yr}년 기출
            </button>
          ))}
        </div>
      </div>

      {/* Mode A: Single Subject Mode */}
      {examType === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
          
          {/* Left Column: Subjects Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>1. 응시 과목 선택</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedYear === 'all' ? '전 연도 통합 문제은행' : `${selectedYear}년도`} 전 과목 (과목당 {selectedSubject?.questionCount || 20}문항)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const isSelected = sub.id === selectedSubjectId;

                return (
                  <button
                    key={sub.id}
                    disabled={!sub.isAvailable}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 text-left transition-all group ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-600/20'
                        : sub.isAvailable
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs'
                        : 'border-slate-200 dark:border-slate-800/50 bg-slate-100/50 dark:bg-slate-900/40 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Top Icon & Available Badge */}
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`p-2.5 rounded-xl ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {renderIcon(sub.iconName)}
                      </div>

                      {sub.isAvailable ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>응시 가능 ({sub.questionCount}문제)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          준비 중
                        </span>
                      )}
                    </div>

                    {/* Subject Name & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Mode Selection & Start Button */}
          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>2. 응시 모드 선택</span>
            </h2>

            <div className="space-y-3">
              {/* Mock Mode */}
              <button
                onClick={() => setSelectedMode('mock')}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedMode === 'mock'
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100 font-semibold ring-2 ring-purple-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-base flex items-center gap-2">
                    <span>🎯 실전 타이머 모드</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold">
                    권장
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  실제 CBT 시험과 동일하게 제한 시간(15분) 카운트다운과 OMR 답안 표기, 최종 제출 후 채점이 진행됩니다.
                </p>
              </button>

              {/* Practice Mode */}
              <button
                onClick={() => setSelectedMode('practice')}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedMode === 'practice'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-base flex items-center gap-2">
                    <span>📖 연습 학습 모드</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  문제마다 답안을 선택하면 즉시 정답 및 상세 해설을 확인하며 부담 없이 학습할 수 있습니다.
                </p>
              </button>
            </div>

            {/* Selected Subject Preview Box */}
            {selectedSubject && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>[{selectedYear === 'all' ? '전 연도 섞기' : `${selectedYear}년`}] {selectedSubject.name} 응시 정보</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>총 문항 수:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSubject.questionCount}문제</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>권장 제한시간:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">15분</span>
                </div>
              </div>
            )}

            {/* Big Start Exam Button */}
            <button
              disabled={!selectedSubject?.isAvailable}
              onClick={() => selectedSubject && onStartExam(selectedSubject.id, selectedMode)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{selectedSubject?.name} 시험 시작하기</span>
            </button>

          </div>

        </div>
      )}

      {/* Mode B: 5-Subject Full Exam Mode */}
      {examType === 'full' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs mb-2">
                <FileCheck className="w-4 h-4" />
                <span>실제 국가자격시험 동일 규격</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏆 5과목 종합 실전 모의고사 (100분)</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                7개 과목 중 실제 응시할 5개 과목을 선택하세요. 5과목 총 100문항, 제한시간 100분(6,000초)이 제공되며 과락(40점 미만) 및 평균 60점 합격 기준이 적용됩니다.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">선택된 과목 수</div>
                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {selectedFullSubjectIds.length} / 5개
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const isChecked = selectedFullSubjectIds.includes(sub.id);

              return (
                <button
                  key={sub.id}
                  onClick={() => handleToggleFullSubject(sub.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isChecked
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {renderIcon(sub.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        20문항 / 과목코드: {sub.code}
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}>
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Alert Status */}
          {selectedFullSubjectIds.length !== 5 ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <span>실제 시험 규격에 맞추어 exatamente <strong>5개 과목</strong>을 선택해 주셔야 모의고사를 시작할 수 있습니다. (현재 {selectedFullSubjectIds.length}개 선택됨)</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>5개 과목 선택이 완료되었습니다! <strong>[총 100문항 / 100분 실전 모의고사 준비 완료]</strong></span>
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold hidden sm:inline">과락(40점 미만) 및 평균 60점 합격 판단</span>
            </div>
          )}

          {/* Big Start Full Exam Button */}
          <button
            disabled={selectedFullSubjectIds.length !== 5}
            onClick={() => onStartFullExam(selectedFullSubjectIds, selectedMode)}
            className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>🏆 5과목 종합 100분 실전 모의고사 시작하기 (100문항)</span>
          </button>

        </div>
      )}

    </div>
  );
};
