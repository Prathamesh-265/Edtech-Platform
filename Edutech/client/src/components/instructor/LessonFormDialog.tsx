import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateLesson, useUpdateLesson, getListLessonsQueryKey } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  order: z.coerce.number().min(1, "Order must be at least 1"),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: number;
  lessonCount: number;
  editLesson?: { id: number; title: string; description: string; duration: number; order: number; videoUrl?: string | null; } | null;
}

export function LessonFormDialog({ open, onOpenChange, courseId, lessonCount, editLesson }: LessonFormDialogProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateLesson();
  const updateMutation = useUpdateLesson();
  const isEditing = !!editLesson;

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { title: "", description: "", duration: 30, order: lessonCount + 1, videoUrl: "" },
  });

  useEffect(() => {
    if (editLesson) {
      form.reset({ title: editLesson.title, description: editLesson.description, duration: editLesson.duration, order: editLesson.order, videoUrl: editLesson.videoUrl ?? "" });
    } else {
      form.reset({ title: "", description: "", duration: 30, order: lessonCount + 1, videoUrl: "" });
    }
  }, [editLesson, open, lessonCount, form]);

  const onSubmit = (values: LessonFormValues) => {
    const payload = { ...values, videoUrl: values.videoUrl || undefined };
    if (isEditing && editLesson) {
      updateMutation.mutate({ id: editLesson.id, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListLessonsQueryKey(courseId) }); toast.success("Lesson updated"); onOpenChange(false); },
        onError: () => toast.error("Failed to update lesson"),
      });
    } else {
      createMutation.mutate({ id: courseId, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListLessonsQueryKey(courseId) }); toast.success("Lesson added"); onOpenChange(false); },
        onError: () => toast.error("Failed to add lesson"),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          <DialogDescription>{isEditing ? "Update the lesson details." : "Add a lesson to this course."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Lesson Title</FormLabel><FormControl><Input placeholder="e.g. Introduction to TypeScript Generics" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Brief overview of what this lesson covers..." className="min-h-[80px] resize-none" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="duration" render={({ field }) => (
                <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="videoUrl" render={({ field }) => (
              <FormItem><FormLabel>Video URL <span className="text-muted-foreground font-normal">(optional)</span></FormLabel><FormControl><Input placeholder="https://youtube.com/watch?v=..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">{isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Lesson"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
