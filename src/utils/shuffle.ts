import type { Question } from '../types/exam';

/**
 * 1. 문제 목록 전체 순서를 피셔-예이츠(Fisher-Yates) 알고리즘으로 무작위 섞습니다.
 * 2. 각 문제의 4개 선택지(options) 순서를 무작위 섞고, 섞인 위치에 맞춰 복수 정답(answers) 및 단일 정답(answer)을 자동으로 동기화합니다.
 * 3. 화면에 표시되는 문제 번호(number)를 1부터 N까지 순차 재할당합니다.
 */
export function shuffleExamQuestions(questions: Question[]): Question[] {
  // 1. 문제 목록 순서 무작위 셔플
  const shuffledQuestions = [...questions];
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }

  // 2. 각 문제의 선택지 셔플 및 정답 위치/표시 번호 동기화
  return shuffledQuestions.map((q, index) => {
    const isAllCorrect = q.allCorrect || (q.answers && q.answers.length === q.options.length);
    const originalAnswers: number[] = q.answers || (q.answer !== undefined ? [q.answer] : []);
    const correctIndicesSet = new Set(originalAnswers.map((a) => a - 1));

    const optionObjects = q.options.map((optText, idx) => ({
      text: optText,
      isCorrect: isAllCorrect || correctIndicesSet.has(idx)
    }));

    // 선택지 무작위 셔플
    for (let i = optionObjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionObjects[i], optionObjects[j]] = [optionObjects[j], optionObjects[i]];
    }

    const shuffledOptions = optionObjects.map((item) => item.text);
    const newAnswers = optionObjects
      .map((item, idx) => (item.isCorrect ? idx + 1 : null))
      .filter((val): val is number => val !== null);

    const newSingleAnswer = newAnswers.length > 0 ? newAnswers[0] : 1;

    return {
      ...q,
      number: index + 1, // 화면 표시용 1 ~ N 번호 재할당
      options: shuffledOptions,
      answer: newSingleAnswer,
      answers: newAnswers,
      allCorrect: isAllCorrect || newAnswers.length === q.options.length
    };
  });
}

// 이전 함수 호환을 위한 에일리어스(Alias)
export const shuffleQuestionOptions = shuffleExamQuestions;
