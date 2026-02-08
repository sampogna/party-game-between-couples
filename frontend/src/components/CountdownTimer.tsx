import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({ seconds, onComplete, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcula a porcentagem de tempo restante para animação
  const percentage = (timeLeft / seconds) * 100;
  
  // Cor baseada no tempo restante
  const getColor = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`text-5xl font-bold tabular-nums ${getColor()} transition-colors duration-300`}>
        {formatTime(timeLeft)}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">Iniciando em breve...</p>
    </div>
  );
}
