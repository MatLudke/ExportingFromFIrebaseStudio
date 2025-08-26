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
import { useToast } from '@/hooks/use-toast';
import type { Activity } from '@/lib/types';
import { getActivities, addStudySession } from '@/lib/firestore';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

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
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userActivities = await getActivities(currentUser.uid);
        setActivities(userActivities);
      } else {
        setActivities([]);
      }
    });
    return () => unsubscribe();
  }, []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  const handleTimerEnd = async () => {
    setIsActive(false);
    toast({
        title: "Session complete!",
        description: mode === 'pomodoro' ? "Time for a break!" : "Break's over. Ready to focus?",
    });

    if (mode === 'pomodoro') {
      if (user && selectedActivityId) {
        const activity = activities.find(a => a.id === selectedActivityId);
        if (activity) {
          try {
            await addStudySession(user.uid, {
              activityId: selectedActivityId,
              startTime: new Date(Date.now() - POMODORO_TIME * 1000),
              endTime: new Date(),
              duration: POMODORO_TIME / 60,
              subject: activity.subject,
            });
            toast({ title: "Study session saved!" });
          } catch (error) {
            toast({ variant: "destructive", title: "Error saving session" });
          }
        }
      }

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
    if (!user) {
      toast({
        variant: "destructive",
        title: "You are not logged in",
        description: "Log in to start a study session.",
      });
      return;
    }
     if (mode === 'pomodoro' && !selectedActivityId) {
      toast({
        variant: "destructive",
        title: "No activity selected",
        description: "Please select an activity to focus on.",
      });
      return;
    }
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
      case 'pomodoro': return 'Focus';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
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
    <Card className="flex flex-col border-none shadow-xl shadow-black/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Study Session</CardTitle>
            <CardDescription>{getModeLabel()}</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Timer Settings</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 gap-8">
        <div className="relative h-56 w-56">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle className="stroke-current text-muted/50" strokeWidth="5" cx="50" cy="50" r="45" fill="transparent" />
                <circle
                    className="stroke-current text-primary"
                    strokeWidth="5"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - (timeLeft / getTotalTime()))}`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold font-mono tracking-tighter text-foreground">{formatTime(timeLeft)}</span>
            </div>
        </div>
        
        <div className="w-full space-y-4">
          <Select 
            disabled={!user || isActive}
            onValueChange={(value) => setSelectedActivityId(value)}
            value={selectedActivityId ?? ""}
          >
            <SelectTrigger className="py-6">
              <SelectValue placeholder="Select an activity to focus on" />
            </SelectTrigger>
            <SelectContent>
              {activities
                .filter((a) => a.status !== 'done')
                .map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={toggleTimer} className="w-40 py-7 text-lg">
              {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTimer} className="py-7">
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
            {[...Array(POMODOROS_BEFORE_LONG_BREAK)].map((_, i) => (
                <div key={i} className={`h-3 w-3 rounded-full transition-colors ${i < pomodoros ? 'bg-primary' : 'bg-muted'}`} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
