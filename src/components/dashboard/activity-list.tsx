
"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Activity } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ActivityDialog } from "./activity-dialog"
import { getActivities, deleteActivity } from "@/lib/firestore"
import { auth } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export function ActivityList() {
    const [activities, setActivities] = React.useState<Activity[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
    const { toast } = useToast();

    React.useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          fetchActivities();
        } else {
          setLoading(false);
        }
      });
      return () => unsubscribe();
    }, []);

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const userActivities = await getActivities();
        setActivities(userActivities);
      } catch (error) {
        toast({ variant: "destructive", title: "Erro ao buscar atividades." });
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (activity: Activity) => {
        setSelectedActivity(activity);
        setOpenDialog(true);
    };

    const handleAddNew = () => {
        setSelectedActivity(null);
        setOpenDialog(true);
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteActivity(id);
            toast({ title: "Atividade deletada com sucesso!" });
            fetchActivities(); // Refresh list
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao deletar atividade."});
        }
    };

  return (
    <>
      <Card className="border-none shadow-xl shadow-black/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Minhas Atividades</CardTitle>
              <CardDescription>Gerencie suas tarefas e sessões de estudo.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4" />
              Adicionar Atividade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atividade</TableHead>
                <TableHead>Matéria</TableHead>
                <TableHead className="hidden md:table-cell">Prioridade</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
              ) : activities.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        Nenhuma atividade encontrada. Adicione uma para começar!
                    </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{activity.title}</TableCell>
                    <TableCell>{activity.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className={cn(
                        "font-semibold",
                        activity.priority === 'high' && 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
                        activity.priority === 'medium' && 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
                        activity.priority === 'low' && 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800'
                      )}>
                        {activity.priority === 'high' ? 'Alta' : activity.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(activity)}>
                              <Pencil className="mr-2 h-4 w-4"/> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => handleDelete(activity.id)}
                          >
                              <Trash2 className="mr-2 h-4 w-4"/> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ActivityDialog 
        open={openDialog} 
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
          if (!isOpen) {
            setSelectedActivity(null);
            fetchActivities();
          }
        }} 
        activity={selectedActivity} 
      />
    </>
  )
}
