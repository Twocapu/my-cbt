import type { Subject, Question } from '../types/exam';
import sportsEthicsData from './sportsEthicsData.json';

const rawQuestions = sportsEthicsData.questions as Question[];

export const SUBJECTS: Subject[] = [
  {
    id: 'ethics',
    name: '스포츠윤리',
    code: 'SE-2025',
    iconName: 'ShieldCheck',
    questionCount: rawQuestions.length,
    isAvailable: true,
    description: '2025년 2급 생활스포츠지도사 기출문제 (총 20문항)'
  },
  {
    id: 'psychology',
    name: '스포츠심리학',
    code: 'SP-2025',
    iconName: 'Brain',
    questionCount: 0,
    isAvailable: false,
    description: '동기부여, 동반작용, 성격, 동반불안, 루틴 등 심리적 제요인 (준비 중)'
  },
  {
    id: 'history',
    name: '한국체육사',
    code: 'KH-2025',
    iconName: 'Landmark',
    questionCount: 0,
    isAvailable: false,
    description: '선사/부족국가~근현대 한국 체육 및 올림픽 역사 (준비 중)'
  },
  {
    id: 'sociology',
    name: '스포츠사회학',
    code: 'SS-2025',
    iconName: 'Users',
    questionCount: 0,
    isAvailable: false,
    description: '스포츠와 정치, 경제, 미디어, 계층, 사회화 현상 (준비 중)'
  },
  {
    id: 'physiology',
    name: '운동생리학',
    code: 'EP-2025',
    iconName: 'Activity',
    questionCount: 0,
    isAvailable: false,
    description: '에너지 대사, 트레이닝 적응, 근육계 및 순환계 생리 (준비 중)'
  },
  {
    id: 'prescription',
    name: '운동처방학',
    code: 'EX-2025',
    iconName: 'HeartPulse',
    questionCount: 0,
    isAvailable: false,
    description: '체력 평가, FITT 원칙, 질환별 운동 처방 프로그램 (준비 중)'
  },
  {
    id: 'biomechanics',
    name: '스포츠생체역학',
    code: 'SB-2025',
    iconName: 'Zap',
    questionCount: 0,
    isAvailable: false,
    description: '인체 운동의 역학적 원리, 토크, 운동학 및 운동역학 분석 (준비 중)'
  }
];

export const QUESTIONS_BY_SUBJECT: Record<string, Question[]> = {
  ethics: rawQuestions
};

