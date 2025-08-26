export type Activity = {
  id: string;
  userId: string;
  title: string;
  subject: string;
  estimatedDuration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
};

export type StudySession = {
  id: string;
  activityId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  subject: string;
};
