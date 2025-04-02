import { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface TimerProps {
  workDuration: number;
  restDuration: number;
  rounds: number;
  onComplete: () => void;
}

export default function Timer({ workDuration, restDuration, rounds, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWorkTime) {
        // Switch to rest time
        setTimeLeft(restDuration * 60);
        setIsWorkTime(false);
      } else {
        // Switch to work time or complete
        if (currentRound < rounds) {
          setTimeLeft(workDuration * 60);
          setIsWorkTime(true);
          setCurrentRound((prev) => prev + 1);
        } else {
          setIsRunning(false);
          onComplete();
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkTime, workDuration, restDuration, rounds, currentRound, onComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTimeLeft(workDuration * 60);
    setIsRunning(false);
    setIsWorkTime(true);
    setCurrentRound(1);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-primary-100">
      <div className="relative">
        <div className="text-7xl font-bold text-primary-900 tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-1000"
            style={{ width: `${(timeLeft / (isWorkTime ? workDuration * 60 : restDuration * 60)) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-xl text-primary-600 font-medium">
        {isWorkTime ? 'Work Time' : 'Rest Time'} - Round {currentRound}/{rounds}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="p-4 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isRunning ? (
            <PauseIcon className="w-8 h-8" />
          ) : (
            <PlayIcon className="w-8 h-8" />
          )}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white text-primary-500 hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-primary-200"
        >
          <ArrowPathIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
} 