import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCourse, useUpdateCourse, getListCoursesQueryKey } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  instructor: z.string().min(2, "Instructor name required"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCourse?: { id: number; title: string; description: string; instructor: string; category: string; level: string; duration: number; price: number; thumbnailUrl?: string | null; } | null;
}

export function CourseFormDialog({ open, onOpenChange, editCourse }: CourseFormDialogProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const isEditing = !!editCourse;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: "", description: "", instructor: "", category: "", level: "beginner", duration: 60, price: 0, thumbnailUrl: "" },
  });

  useEffect(() => {
    if (editCourse) {
      form.reset({ title: editCourse.title, description: editCourse.description, instructor: editCourse.instructor, category: editCourse.category, level: editCourse.level as "beginner" | "intermediate" | "advanced", duration: editCourse.duration, price: editCourse.price, thumbnailUrl: editCourse.thumbnailUrl ?? "" });
    } else {
      form.reset({ title: "", description: "", instructor: "", category: "", level: "beginner", duration: 60, price: 0, thumbnailUrl: "" });
    }
  }, [editCourse, open, form]);

  const onSubmit = (values: CourseFormValues) => {
    const payload = { ...values, thumbnailUrl: values.thumbnailUrl || undefined };
    if (isEditing && editCourse) {
      updateMutation.mutate({ id: editCourse.id, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); toast.success("Course updated successfully"); onOpenChange(false); },
        onError: () => toast.error("Failed to update course"),
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); toast.success("Course created successfully"); onOpenChange(false); },
        onError: () => toast.error("Failed to create course"),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Course" : "Create New Course"}</DialogTitle>
          <DialogDescription>{isEditing ? "Update the course details below." : "Fill in the details to publish a new course."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Course Title</FormLabel><FormControl><Input placeholder="e.g. Full-Stack Web Development" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe what students will learn..." className="min-h-[100px] resize-none" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="instructor" render={({ field }) => (
              <FormItem><FormLabel>Instructor Name</FormLabel><FormControl><Input placeholder="e.g. Sarah Chen" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Web Development" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem><FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="duration" render={({ field }) => (
                <FormItem><FormLabel>Duration (minutes)</FormLabel><FormControl><Input type="number" min={1} placeholder="e.g. 720" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" min={0} step="0.01" placeholder="e.g. 49.99" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
              <FormItem><FormLabel>Thumbnail URL <span className="text-muted-foreground font-normal">(optional)</span></FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">{isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Course"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
