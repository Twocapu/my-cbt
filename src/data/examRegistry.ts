import type { Subject, Question } from '../types/exam';

import sociology2026 from './questions/2026/sociology.json';
import education2026 from './questions/2026/education.json';
import psychology2026 from './questions/2026/psychology.json';
import history2026 from './questions/2026/history.json';
import physiology2026 from './questions/2026/physiology.json';
import biomechanics2026 from './questions/2026/biomechanics.json';
import ethics2026 from './questions/2026/ethics.json';

import sociology2025 from './questions/2025/sociology.json';
import education2025 from './questions/2025/education.json';
import psychology2025 from './questions/2025/psychology.json';
import history2025 from './questions/2025/history.json';
import physiology2025 from './questions/2025/physiology.json';
import biomechanics2025 from './questions/2025/biomechanics.json';
import ethics2025 from './questions/2025/ethics.json';

import sociology2024 from './questions/2024/sociology.json';
import education2024 from './questions/2024/education.json';
import psychology2024 from './questions/2024/psychology.json';
import history2024 from './questions/2024/history.json';
import physiology2024 from './questions/2024/physiology.json';
import biomechanics2024 from './questions/2024/biomechanics.json';
import ethics2024 from './questions/2024/ethics.json';

// 사용 가능한 시험 연도 목록 (최신 2026 포함)
export const AVAILABLE_YEARS: number[] = [2026, 2025, 2024];

export const SUBJECT_METADATA: Record<string, { name: string; code: string; iconName: string; description: string }> = {
  sociology: {
    name: '스포츠사회학',
    code: '11',
    iconName: 'Users',
    description: '스포츠와 정치, 경제, 미디어, 계층, 사회화 현상'
  },
  education: {
    name: '스포츠교육학',
    code: '22',
    iconName: 'BookOpen',
    description: '스포츠 교육 프로그램, 지도 모형, 교수 방법 및 평가'
  },
  psychology: {
    name: '스포츠심리학',
    code: '33',
    iconName: 'Brain',
    description: '동기부여, 성격, 불안, 루틴, 목표설정, 심리기술훈련'
  },
  history: {
    name: '한국체육사',
    code: '44',
    iconName: 'Landmark',
    description: '선사/삼국시대~근현대 한국 체육 및 올림픽 역사의 이해'
  },
  physiology: {
    name: '운동생리학',
    code: '55',
    iconName: 'Activity',
    description: '에너지 대사, 트레이닝 적응, 근육, 순환 및 신경 생리'
  },
  biomechanics: {
    name: '운동역학',
    code: '66',
    iconName: 'Zap',
    description: '인체 운동의 역학적 원리, 토크, 관성, 운동학 분석'
  },
  ethics: {
    name: '스포츠윤리',
    code: '77',
    iconName: 'ShieldCheck',
    description: '스포츠 현장 윤리이론, 지도자 윤리, 도핑, 인권 및 공정성'
  }
};

// 연도별/과목별 기출 문제 매핑 레지스트리
const EXAM_DATABASE: Record<number, Record<string, Question[]>> = {
  2026: {
    sociology: sociology2026.questions as Question[],
    education: education2026.questions as Question[],
    psychology: psychology2026.questions as Question[],
    history: history2026.questions as Question[],
    physiology: physiology2026.questions as Question[],
    biomechanics: biomechanics2026.questions as Question[],
    ethics: ethics2026.questions as Question[]
  },
  2025: {
    sociology: sociology2025.questions as Question[],
    education: education2025.questions as Question[],
    psychology: psychology2025.questions as Question[],
    history: history2025.questions as Question[],
    physiology: physiology2025.questions as Question[],
    biomechanics: biomechanics2025.questions as Question[],
    ethics: ethics2025.questions as Question[]
  },
  2024: {
    sociology: sociology2024.questions as Question[],
    education: education2024.questions as Question[],
    psychology: psychology2024.questions as Question[],
    history: history2024.questions as Question[],
    physiology: physiology2024.questions as Question[],
    biomechanics: biomechanics2024.questions as Question[],
    ethics: ethics2024.questions as Question[]
  }
};

/**
 * 특정 연도 또는전 연도('all')에 해당하는 과목 목록 반환
 */
export function getSubjectsForYear(year: number | 'all'): Subject[] {
  return Object.keys(SUBJECT_METADATA).map((subId) => {
    const meta = SUBJECT_METADATA[subId];
    const questions = getQuestionsForExam(year, subId);
    const hasQuestions = questions.length > 0;
    const count = year === 'all' ? Math.min(20, questions.length) : questions.length;

    return {
      id: subId,
      name: meta.name,
      code: meta.code,
      iconName: meta.iconName,
      questionCount: count,
      isAvailable: hasQuestions,
      description: meta.description
    };
  });
}

/**
 * 특정 연도 또는 전 연도('all')의 과목별 문제 목록 반환
 */
export function getQuestionsForExam(year: number | 'all', subjectId: string): Question[] {
  if (year === 'all') {
    // 전 연도 기출문제를 하나로 합치고 출제연도(examYear)를 태그
    const combined: Question[] = [];
    AVAILABLE_YEARS.forEach((yr) => {
      const yearQuestions = EXAM_DATABASE[yr]?.[subjectId] || [];
      yearQuestions.forEach((q) => {
        combined.push({
          ...q,
          examYear: yr
        });
      });
    });
    return combined;
  }

  const list = EXAM_DATABASE[year]?.[subjectId] || [];
  return list.map((q) => ({
    ...q,
    examYear: year
  }));
}
