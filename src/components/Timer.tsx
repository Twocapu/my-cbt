import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, AlertCircle } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  onTimeUpdate?: (secondsLeft: number) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  onTimeUp,
  onTimeUpdate,
  isPaused = false,
  onTogglePause
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timeLeft);
    }
  }, [timeLeft, onTimeUpdate]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isPaused, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentLeft = Math.max(0, Math.min(100, (timeLeft / initialSeconds) * 100));

  // Determine urgency color
  const isDanger = timeLeft <= 60; // 1 minute left
  const isWarning = timeLeft <= 180 && !isDanger; // 3 minutes left

  return (
    <div className={`flex flex-col gap-1 p-3 rounded-xl border transition-colors ${
      isDanger
        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 animate-pulse'
        : isWarning
        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400'
        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isDanger ? (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-bounce" />
          ) : (
            <Clock className={`w-5 h-5 ${isWarning ? 'text-amber-500' : 'text-blue-500'}`} />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            남은 시간
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold tracking-tight">
            {formatTime(timeLeft)}
          </span>

          {onTogglePause && (
            <button
              onClick={onTogglePause}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={isPaused ? '타이머 재개' : '타이머 일시정지'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isDanger
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-blue-600'
          }`}
          style={{ width: `${percentLeft}%` }}
        />
      </div>
    </div>
  );
};
