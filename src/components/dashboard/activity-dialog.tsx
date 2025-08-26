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
import { auth } from "@/lib/firebase"

const activitySchema = z.object({
  title: z.string().min(1, "Title is required."),
  subject: z.string().min(1, "Subject is required."),
  estimatedDuration: z.coerce.number().min(1, "Duration must be at least 1 minute."),
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
      reset({
        title: "",
        subject: "",
        estimatedDuration: 60,
        priority: "medium",
      });
    }
  }, [activity, reset, open]);

  const onSubmit = async (data: ActivityFormData) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save an activity.",
      });
      return;
    }

    try {
      if (isEditing && activity) {
        await updateActivity(activity.id, { ...data, status: activity.status });
        toast({ title: "Activity updated successfully!" });
      } else {
        await addActivity(user.uid, { ...data, status: 'todo' });
        toast({ title: "Activity added successfully!" });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving activity",
        description: "An error occurred. Please try again.",
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
              <DialogTitle>{isEditing ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the details of your study activity.' : 'Fill in the details for the new study activity.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <div className="col-span-3">
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                 <div className="col-span-3">
                  <Input id="subject" {...register("subject")} />
                  {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (min)
                </Label>
                <div className="col-span-3">
                  <Input id="duration" type="number" {...register("estimatedDuration")} />
                  {errors.estimatedDuration && <p className="text-destructive text-xs mt-1">{errors.estimatedDuration.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
