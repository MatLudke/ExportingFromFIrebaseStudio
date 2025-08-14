'use client';

import * as React from 'react';
import { Play, Pause, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { mockActivities } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const POMODOROS_BEFORE_LONG_BREAK = 4;

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export function StudyTimer() {
  const [timeLeft, setTimeLeft] = React.useState(POMODORO_TIME);
  const [isActive, setIsActive] = React.useState(false);
  const [mode, setMode] = React.useState<TimerMode>('pomodoro');
  const [pomodoros, setPomodoros] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerEnd = () => {
    setIsActive(false);
    toast({
        title: "Sessão concluída!",
        description: mode === 'pomodoro' ? "Hora de uma pausa!" : "Pausa terminada. Pronto para focar?",
    });

    if (mode === 'pomodoro') {
      const newPomodoros = pomodoros + 1;
      setPomodoros(newPomodoros);
      if (newPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK_TIME);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK_TIME);
      }
    } else {
      setMode('pomodoro');
      setTimeLeft(POMODORO_TIME);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('pomodoro');
    setTimeLeft(POMODORO_TIME);
    setPomodoros(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'pomodoro': return 'Foco';
      case 'shortBreak': return 'Pausa Curta';
      case 'longBreak': return 'Pausa Longa';
    }
  }

  const getTotalTime = () => {
    switch (mode) {
      case 'pomodoro': return POMODORO_TIME;
      case 'shortBreak': return SHORT_BREAK_TIME;
      case 'longBreak': return LONG_BREAK_TIME;
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sessão de Estudo</CardTitle>
            <CardDescription>{getModeLabel()}</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações do timer</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 gap-6">
        <div className="relative h-48 w-48">
            <Progress value={(timeLeft / getTotalTime()) * 100} className="absolute h-full w-full rounded-full"/>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold font-mono text-primary">{formatTime(timeLeft)}</span>
            </div>
        </div>
        
        <div className="w-full space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma atividade para focar" />
            </SelectTrigger>
            <SelectContent>
              {mockActivities
                .filter((a) => a.status !== 'done')
                .map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={toggleTimer} className="w-32">
              {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isActive ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
            {[...Array(POMODOROS_BEFORE_LONG_BREAK)].map((_, i) => (
                <div key={i} className={`h-3 w-3 rounded-full ${i < pomodoros ? 'bg-primary' : 'bg-muted'}`} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
