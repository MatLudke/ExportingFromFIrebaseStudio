import { Header } from "@/components/dashboard/header";
import { ActivityList } from "@/components/dashboard/activity-list";
import { StudyTimer } from "@/components/dashboard/study-timer";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityList />
          </div>
          <div>
            <StudyTimer />
          </div>
        </div>
      </main>
    </>
  );
}
