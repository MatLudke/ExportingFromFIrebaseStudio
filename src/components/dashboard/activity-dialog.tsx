"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Activity } from "@/lib/types"
import { addActivity, updateActivity } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"

const activitySchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  subject: z.string().min(1, "A matéria é obrigatória."),
  estimatedDuration: z.coerce.number().min(1, "A duração deve ser de pelo menos 1 minuto."),
  priority: z.enum(["low", "medium", "high"]),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityDialogProps {
  activity?: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityDialog({ open, onOpenChange, activity }: ActivityDialogProps) {
  const isEditing = !!activity;
  const { toast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      subject: "",
      estimatedDuration: 60,
      priority: "medium",
    },
  });

  useEffect(() => {
    if (activity) {
      reset({
        title: activity.title,
        subject: activity.subject,
        estimatedDuration: activity.estimatedDuration,
        priority: activity.priority,
      });
    } else {
      reset();
    }
  }, [activity, reset, open]);

  const onSubmit = async (data: ActivityFormData) => {
    try {
      if (isEditing && activity) {
        await updateActivity(activity.id, { ...data, status: activity.status });
        toast({ title: "Atividade atualizada com sucesso!" });
      } else {
        await addActivity({ ...data, status: 'todo' });
        toast({ title: "Atividade adicionada com sucesso!" });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar atividade",
        description: "Ocorreu um erro. Por favor, tente novamente.",
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="sm:max-w-[425px]"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Atividade' : 'Adicionar Atividade'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Atualize os detalhes da sua atividade de estudo.' : 'Preencha os detalhes da nova atividade de estudo.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <div className="col-span-3">
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Matéria
                </Label>
                 <div className="col-span-3">
                  <Input id="subject" {...register("subject")} />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duração (min)
                </Label>
                <div className="col-span-3">
                  <Input id="duration" type="number" {...register("estimatedDuration")} />
                  {errors.estimatedDuration && <p className="text-red-500 text-xs mt-1">{errors.estimatedDuration.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Prioridade
                </Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
