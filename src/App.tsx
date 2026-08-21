import { useState, useEffect } from 'react';
import type { Question, UserAnswers, ExamMode, ExamResultHistory, SubjectScoreResult } from './types/exam';
import { checkIsCorrect } from './types/exam';
import { getSubjectsForYear, getQuestionsForExam, SUBJECT_METADATA } from './data/examRegistry';
import { shuffleExamQuestions } from './utils/shuffle';
import { getExamHistory, saveExamResult, getTheme, setTheme } from './utils/storage';
import { SubjectSelect } from './components/SubjectSelect';
import { CbtExamView } from './components/CbtExamView';
import { ExamResultView } from './components/ExamResultView';
import { Header } from './components/Header';
import { HistoryModal } from './components/HistoryModal';

export default function App() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ethics');
  const [examMode, setExamMode] = useState<ExamMode>('mock');
  const [isFullExam, setIsFullExam] = useState<boolean>(false);
  const [fullExamSubjectIds, setFullExamSubjectIds] = useState<string[]>([]);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [view, setView] = useState<'select' | 'exam' | 'result'>('select');
  const [history, setHistory] = useState<ExamResultHistory[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Load initial theme and history
  useEffect(() => {
    setThemeState(getTheme());
    setHistory(getExamHistory());
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    setTheme(nextTheme);
  };

  const currentSubjects = getSubjectsForYear(selectedYear);

  // Start single subject exam session
  const handleStartExam = (subjectId: string, mode: ExamMode) => {
    const rawQuestions = getQuestionsForExam(selectedYear, subjectId);
    if (rawQuestions.length === 0) {
      alert('해당 과목의 준비된 기출문제가 없습니다.');
      return;
    }

    const targetMeta = SUBJECT_METADATA[subjectId];
    const shuffled = shuffleExamQuestions(rawQuestions).map((q) => ({
      ...q,
      subjectId,
      subjectName: targetMeta?.name || '기출과목'
    }));

    // 전 연도 섞기 모드 시 20문항 무작위 추출
    const finalQuestions = selectedYear === 'all' ? shuffled.slice(0, 20) : shuffled;

    setSelectedSubjectId(subjectId);
    setExamMode(mode);
    setIsFullExam(false);
    setQuestions(finalQuestions);
    setView('exam');
  };

  // Start 5-subject full exam session (100 questions, 100 mins = 6000s)
  const handleStartFullExam = (subjectIds: string[], mode: ExamMode) => {
    if (subjectIds.length !== 5) {
      alert('5개 과목을 모두 선택해야 실전 모의고사를 시작할 수 있습니다.');
      return;
    }

    const combinedQuestions: Question[] = [];

    subjectIds.forEach((subId) => {
      const targetMeta = SUBJECT_METADATA[subId];
      const raw = getQuestionsForExam(selectedYear, subId);
      const shuffled = shuffleExamQuestions(raw).slice(0, 20).map((q, idx) => ({
        ...q,
        subjectId: subId,
        subjectName: targetMeta?.name || subId,
        number: combinedQuestions.length + idx + 1
      }));
      combinedQuestions.push(...shuffled);
    });

    setFullExamSubjectIds(subjectIds);
    setExamMode(mode);
    setIsFullExam(true);
    setQuestions(combinedQuestions);
    setView('exam');
  };

  // Complete exam and grade (Single or 5-Subject Full Exam)
  const handleCompleteExam = (answers: UserAnswers, time: number) => {
    const totalCount = questions.length;
    let totalCorrectCount = 0;

    questions.forEach((q) => {
      if (checkIsCorrect(q, answers[q.id])) {
        totalCorrectCount += 1;
      }
    });

    const yearPrefix = selectedYear === 'all' ? '[전 연도 섞기]' : `[${selectedYear}년]`;

    if (isFullExam) {
      // Grade each of the 5 subjects individually
      const subjectResults: SubjectScoreResult[] = [];
      let hasFailedSubject = false;
      let sumScores = 0;
      const failedSubjectNames: string[] = [];

      fullExamSubjectIds.forEach((subId) => {
        const targetMeta = SUBJECT_METADATA[subId];
        const subQuestions = questions.filter((q) => q.subjectId === subId);
        let subCorrect = 0;

        subQuestions.forEach((q) => {
          if (checkIsCorrect(q, answers[q.id])) {
            subCorrect += 1;
          }
        });

        const subScore = Math.round((subCorrect / (subQuestions.length || 20)) * 100);
        const isFailed = subScore < 40; // 과락: 40점 미만

        if (isFailed) {
          hasFailedSubject = true;
          failedSubjectNames.push(targetMeta?.name || subId);
        }

        sumScores += subScore;
        subjectResults.push({
          subjectId: subId,
          subjectName: targetMeta?.name || subId,
          totalQuestions: subQuestions.length || 20,
          correctCount: subCorrect,
          score: subScore,
          isFailed
        });
      });

      const avgScore = Math.round(sumScores / (subjectResults.length || 5));
      const passed = avgScore >= 60 && !hasFailedSubject;

      let failedReason: string | undefined = undefined;
      if (hasFailedSubject) {
        failedReason = `과목 중 과락(40점 미만) 과목이 발생하였습니다: [${failedSubjectNames.join(', ')}]`;
      } else if (avgScore < 60) {
        failedReason = `5과목 평균 점수가 합격 기준(60점)에 미달하였습니다. (현재 평균 ${avgScore}점)`;
      }

      const resultRecord: ExamResultHistory = {
        id: Date.now().toString(),
        subjectId: 'full_5_exam',
        subjectName: `${yearPrefix} 🏆 5과목 종합 실전 모의고사`,
        mode: examMode,
        date: new Date().toISOString(),
        totalQuestions: totalCount,
        correctCount: totalCorrectCount,
        score: avgScore,
        passed,
        timeSpent: time,
        userAnswers: answers,
        questions,
        isFullExam: true,
        subjectResults,
        failedReason
      };

      saveExamResult(resultRecord);
      setHistory(getExamHistory());
      setView('result');
    } else {
      // Single Subject Mode
      const targetSubject = currentSubjects.find((s) => s.id === selectedSubjectId);
      const score = Math.round((totalCorrectCount / totalCount) * 100);
      const passed = score >= 60;

      const resultRecord: ExamResultHistory = {
        id: Date.now().toString(),
        subjectId: selectedSubjectId,
        subjectName: `${yearPrefix} ${targetSubject?.name || '스포츠윤리'}`,
        mode: examMode,
        date: new Date().toISOString(),
        totalQuestions: totalCount,
        correctCount: totalCorrectCount,
        score,
        passed,
        timeSpent: time,
        userAnswers: answers,
        questions,
        isFullExam: false
      };

      saveExamResult(resultRecord);
      setHistory(getExamHistory());
      setView('result');
    }
  };

  // Retry all questions with fresh shuffle
  const handleRetryAll = () => {
    if (isFullExam) {
      handleStartFullExam(fullExamSubjectIds, examMode);
    } else {
      handleStartExam(selectedSubjectId, examMode);
    }
  };

  // Retry only incorrect questions with fresh shuffle
  const handleRetryIncorrect = (incorrectQuestions: Question[]) => {
    setQuestions(shuffleExamQuestions(incorrectQuestions));
    setView('exam');
  };

  const activeResult = history[0];
  const activeSubject = currentSubjects.find((s) => s.id === selectedSubjectId);
  const yearPrefix = selectedYear === 'all' ? '[전 연도 섞기 20문제]' : `[${selectedYear}년]`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white">
      
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHistory={() => setShowHistoryModal(true)}
        onGoHome={() => setView('select')}
        currentSubjectName={isFullExam ? '🏆 5과목 종합 실전 모의고사' : activeSubject?.name}
        isExamInProgress={view === 'exam'}
      />

      <main className="flex-1">
        {view === 'select' && (
          <SubjectSelect
            subjects={currentSubjects}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            onStartExam={handleStartExam}
            onStartFullExam={handleStartFullExam}
            examHistory={history}
          />
        )}

        {view === 'exam' && (
          <CbtExamView
            subjectName={isFullExam ? `${yearPrefix} 🏆 5과목 종합 실전 모의고사` : `${yearPrefix} ${activeSubject?.name || '스포츠윤리'}`}
            questions={questions}
            mode={examMode}
            timeLimit={isFullExam ? 6000 : 900} // 5과목: 100분(6000초), 단일과목: 15분(900초)
            onCompleteExam={handleCompleteExam}
            onExitExam={() => setView('select')}
          />
        )}

        {view === 'result' && activeResult && (
          <ExamResultView
            subjectName={activeResult.subjectName}
            questions={activeResult.questions}
            userAnswers={activeResult.userAnswers}
            timeSpent={activeResult.timeSpent}
            mode={activeResult.mode}
            isFullExam={activeResult.isFullExam}
            subjectResults={activeResult.subjectResults}
            failedReason={activeResult.failedReason}
            onGoHome={() => setView('select')}
            onRetryAll={handleRetryAll}
            onRetryIncorrect={handleRetryIncorrect}
          />
        )}
      </main>

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onClearHistory={() => {
          localStorage.removeItem('sports_cbt_history_v1');
          setHistory([]);
        }}
      />

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 국민체육진흥공단(KSPO) 2급 생활스포츠지도사 필기시험 CBT 문제은행 시스템</p>
      </footer>

    </div>
  );
}
