
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getStudySessions } from "@/lib/firestore"
import { auth } from "@/lib/firebase"
import type { User } from "firebase/auth"
import type { StudySession } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export function ReportCharts() {
  const [user, setUser] = React.useState<User | null>(null);
  const [reportData, setReportData] = React.useState<{ subject: string, hours: number }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (currentUser) {
        fetchReportData(currentUser.uid);
      } else {
        setLoading(false);
        setReportData([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReportData = async (userId: string) => {
    try {
      setLoading(true);
      const sessions: StudySession[] = await getStudySessions(userId);
      const processedData = sessions.reduce((acc, session) => {
        const existing = acc.find(item => item.subject === session.subject);
        if (existing) {
          existing.hours += session.duration / 60;
        } else {
          acc.push({ subject: session.subject, hours: session.duration / 60 });
        }
        return acc;
      }, [] as { subject: string, hours: number }[]).map(item => ({...item, hours: Math.round(item.hours * 10) / 10}));
      
      setReportData(processedData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Time by Subject</CardTitle>
        <CardDescription>Hours dedicated to each subject this week.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="flex justify-around">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-10" />)}
              </div>
            </div>
        ) : reportData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No study sessions recorded yet.</p>
          </div>
        ) : (
          <ChartContainer config={{}} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={reportData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="subject"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
