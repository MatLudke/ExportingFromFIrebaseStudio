import type { Activity, StudySession } from './types';

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Resolver lista de Cálculo I',
    subject: 'Matemática',
    estimatedDuration: 120,
    priority: 'high',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Ler capítulo 5 de Física II',
    subject: 'Física',
    estimatedDuration: 60,
    priority: 'medium',
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'Fazer resumo de História do Brasil',
    subject: 'História',
    estimatedDuration: 90,
    priority: 'low',
    status: 'todo',
  },
  {
    id: '4',
    title: 'Praticar redação para o ENEM',
    subject: 'Português',
    estimatedDuration: 75,
    priority: 'high',
    status: 'done',
  },
  {
    id: '5',
    title: 'Revisar conceitos de Química Orgânica',
    subject: 'Química',
    estimatedDuration: 45,
    priority: 'medium',
    status: 'todo',
  },
];

export const mockStudySessions: StudySession[] = [
    { id: 's1', activityId: '1', startTime: new Date('2024-07-20T10:00:00Z'), endTime: new Date('2024-07-20T10:50:00Z'), duration: 50, subject: 'Matemática' },
    { id: 's2', activityId: '2', startTime: new Date('2024-07-20T11:00:00Z'), endTime: new Date('2024-07-20T11:25:00Z'), duration: 25, subject: 'Física' },
    { id: 's3', activityId: '4', startTime: new Date('2024-07-21T14:00:00Z'), endTime: new Date('2024-07-21T15:15:00Z'), duration: 75, subject: 'Português' },
    { id: 's4', activityId: '1', startTime: new Date('2024-07-22T10:00:00Z'), endTime: new Date('2024-07-22T10:50:00Z'), duration: 50, subject: 'Matemática' },
    { id: 's5', activityId: '3', startTime: new Date('2024-07-22T16:00:00Z'), endTime: new Date('2024-07-22T16:45:00Z'), duration: 45, subject: 'História' },
    { id: 's6', activityId: '5', startTime: new Date('2024-07-23T09:00:00Z'), endTime: new Date('2024-07-23T09:45:00Z'), duration: 45, subject: 'Química' },
];

export const mockReportData = mockStudySessions.reduce((acc, session) => {
    const existing = acc.find(item => item.subject === session.subject);
    if (existing) {
        existing.hours += session.duration / 60;
    } else {
        acc.push({ subject: session.subject, hours: session.duration / 60 });
    }
    return acc;
}, [] as { subject: string, hours: number }[]).map(item => ({...item, hours: Math.round(item.hours * 10) / 10}));

