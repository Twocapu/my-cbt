export interface Question {
  id: number;
  number: number;
  examYear?: number; // 출제 연도 (예: 2026, 2025, 2024)
  subjectId?: string; // 속한 과목 ID
  subjectName?: string; // 속한 과목 명칭
  question?: string;
  questionText?: string;
  passage?: string | string[];
  보기?: string | string[];
  options: string[];
  answer?: number; // 1-based index (단일 정답 하위 호환)
  answers?: number[]; // 1-based indices (복수 정답 목록 - 예: [1, 3] 또는 [1, 2, 3, 4])
  allCorrect?: boolean; // 전항 모두 정답 처리 여부
  explanation: string;
  category?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: string;
  questionCount: number;
  isAvailable: boolean;
  description: string;
}

export type ExamMode = 'mock' | 'practice';
export type ExamType = 'single' | 'full'; // single: 과목별 응시, full: 5과목 종합 100분 시험

export type UserAnswers = Record<number, number>; // questionId -> selected choice (1-4)
export type Bookmarks = Record<number, boolean>; // questionId -> boolean

export interface SubjectScoreResult {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correctCount: number;
  score: number; // 100점 만점 환산
  isFailed: boolean; // 과락 발생 여부 (40점 미만)
}

export interface ExamSession {
  subjectId: string;
  subjectName: string;
  mode: ExamMode;
  timeLimit: number; // seconds (단일: 900초, 5과목: 6000초=100분)
  questions: Question[];
  isFullExam?: boolean;
}

export interface ExamResultHistory {
  id: string;
  subjectId: string;
  subjectName: string;
  mode: ExamMode;
  date: string;
  totalQuestions: number;
  correctCount: number;
  score: number; // 100점 만점 환산 (5과목 종합시 평균 점수)
  passed: boolean; // 평균 60점 이상 및 과락(40점 미만) 없음
  timeSpent: number; // 초 단위
  userAnswers: UserAnswers;
  questions: Question[];
  isFullExam?: boolean; // 5과목 100분 실전 모의고사 여부
  subjectResults?: SubjectScoreResult[]; // 5과목 세부 성적표
  failedReason?: string; // 불합격 사유 (예: '과락 발생(40점 미만)', '평균 점수 미달')
}

/**
 * 제출된 답안이 정답인지 검증하는 헬퍼 함수
 */
export function checkIsCorrect(q: Question, userChoice: number | undefined): boolean {
  if (userChoice === undefined) return false;
  if (q.allCorrect) return true;
  const validAnswers = q.answers || (q.answer !== undefined ? [q.answer] : []);
  return validAnswers.includes(userChoice);
}
