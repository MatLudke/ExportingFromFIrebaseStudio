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
import { mockActivities } from "@/lib/mock-data"
import type { Activity } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ActivityDialog } from "./activity-dialog"

export function ActivityList() {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

    const handleEdit = (activity: Activity) => {
        setSelectedActivity(activity);
        setOpenDialog(true);
    };

    const handleAddNew = () => {
        setSelectedActivity(null);
        setOpenDialog(true);
    }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Minhas Atividades</CardTitle>
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
              {mockActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.title}</TableCell>
                  <TableCell>{activity.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className={cn(
                      activity.priority === 'high' && 'bg-red-100 text-red-800 border-red-200',
                      activity.priority === 'medium' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      activity.priority === 'low' && 'bg-green-100 text-green-800 border-green-200'
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
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/> Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ActivityDialog open={openDialog} onOpenChange={setOpenDialog} activity={selectedActivity} />
    </>
  )
}
