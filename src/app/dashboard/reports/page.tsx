
"use client"

import { useEffect, useState } from 'react';
import { Header } from "@/components/dashboard/header";
import { ReportCharts } from "@/components/dashboard/report-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudySessions, getActivities } from '@/lib/firestore';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import type { StudySession, Activity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportStats {
    sessionsCompleted: number;
    focusHours: number;
    efficiency: number;
}

export default function ReportsPage() {
    const [stats, setStats] = useState<ReportStats>({
        sessionsCompleted: 0,
        focusHours: 0,
        efficiency: 0,
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchReportData(currentUser.uid);
            } else {
                setLoading(false);
                setStats({ sessionsCompleted: 0, focusHours: 0, efficiency: 0 });
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchReportData = async (userId: string) => {
        try {
            setLoading(true);
            const sessions: StudySession[] = await getStudySessions(userId);
            const activities: Activity[] = await getActivities(userId);

            const totalSessions = sessions.length;
            const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0) / 60;
            
            let efficiency = 0;
            if (activities.length > 0) {
                const completedActivities = activities.filter(a => a.status === 'done').length;
                efficiency = Math.round((completedActivities / activities.length) * 100);
            }

            setStats({
                sessionsCompleted: totalSessions,
                focusHours: Math.round(totalHours * 10) / 10,
                efficiency: efficiency,
            });

        } catch (error) {
            console.error("Failed to fetch report data:", error);
            setStats({ sessionsCompleted: 0, focusHours: 0, efficiency: 0 });
        } finally {
            setLoading(false);
        }
    };


    return (
      <>
        <Header title="Reports" />
        <main className="flex-1 overflow-auto p-6 md:p-8 pt-24 md:pt-32 lg:pt-40">
            <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-10 w-16" /> : <div className="text-4xl font-bold">{stats.sessionsCompleted}</div>}
                            <p className="text-xs text-muted-foreground">Total study sessions logged.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Focus Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? <Skeleton className="h-10 w-24" /> : <div className="text-4xl font-bold">{stats.focusHours}h</div>}
                            <p className="text-xs text-muted-foreground">Total time spent in focus sessions.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {loading ? <Skeleton className="h-10 w-20" /> : <div className="text-4xl font-bold">{stats.efficiency}%</div>}
                            <p className="text-xs text-muted-foreground">Percentage of completed activities.</p>
                        </CardContent>
                    </Card>
                </div>
                <ReportCharts />
            </div>
        </main>
      </>
    );
  }


    