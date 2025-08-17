"use client"

import { motion } from "framer-motion"
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

interface ActivityDialogProps {
  activity?: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityDialog({ open, onOpenChange, activity }: ActivityDialogProps) {
  const isEditing = !!activity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent asChild>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="sm:max-w-[425px]"
        >
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
              <Input id="title" defaultValue={activity?.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Matéria
              </Label>
              <Input id="subject" defaultValue={activity?.subject} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duração (min)
              </Label>
              <Input id="duration" type="number" defaultValue={activity?.estimatedDuration} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridade
              </Label>
              <Select defaultValue={activity?.priority}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => onOpenChange(false)}>Salvar</Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
