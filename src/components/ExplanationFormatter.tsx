import React from 'react';
import { Sparkles } from 'lucide-react';

interface ExplanationFormatterProps {
  text: string;
}

export const ExplanationFormatter: React.FC<ExplanationFormatterProps> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed font-sans">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Header badge (e.g. 【공식 확정정답: ①, ②, ③, ④ 번 모두 정답】 or 【정답: 2번】)
        if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
          const isAllCorrect = trimmed.includes('모두 정답') || trimmed.includes('전항 정답');
          const isMultiple = trimmed.includes('복수 정답');

          return (
            <div
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-xs border my-1 ${
                isAllCorrect
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800'
                  : isMultiple
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{trimmed}</span>
            </div>
          );
        }

        // Section Title (e.g. ■ 출제 개념 및 핵심 요약: or ■ 선지별 상세 해설:)
        if (trimmed.startsWith('■')) {
          return (
            <div
              key={i}
              className="font-extrabold text-sm text-slate-900 dark:text-white mt-4 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>{trimmed.replace('■', '').trim()}</span>
            </div>
          );
        }

        // Option Cards (①, ②, ③, ④)
        if (
          trimmed.startsWith('①') ||
          trimmed.startsWith('②') ||
          trimmed.startsWith('③') ||
          trimmed.startsWith('④') ||
          trimmed.startsWith('(1)') ||
          trimmed.startsWith('(2)') ||
          trimmed.startsWith('(3)') ||
          trimmed.startsWith('(4)')
        ) {
          const isCorrect = trimmed.includes('(O)');

          return (
            <div
              key={i}
              className={`p-3 rounded-xl border text-xs sm:text-sm my-1.5 flex items-start gap-2.5 transition-all ${
                isCorrect
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 font-semibold shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="leading-relaxed whitespace-pre-wrap">{trimmed}</span>
            </div>
          );
        }

        // Regular paragraph text
        return (
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};
