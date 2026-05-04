import { useParams, useLocation } from "wouter";
import { useGetCourse, useListLessons, useCreateEnrollment } from "@/lib/api";
import { PageTransition, staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, PlayCircle, Users, BookOpen, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const enrollSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  studentEmail: z.string().email("Please enter a valid email address"),
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

export default function CourseDetail() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: course, isLoading: isCourseLoading } = useGetCourse(id, { query: { enabled: !!id } });
  const { data: lessons, isLoading: isLessonsLoading } = useListLessons(id, { query: { enabled: !!id } });
  const enrollMutation = useCreateEnrollment();

  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: { studentName: "", studentEmail: "" },
  });

  const onSubmit = (data: EnrollFormValues) => {
    enrollMutation.mutate({ data: { courseId: id, studentName: data.studentName, studentEmail: data.studentEmail } }, {
      onSuccess: () => {
        toast.success("Successfully enrolled!", { description: "You have been enrolled in the course. Happy learning!" });
        queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
        setLocation("/enrollments");
      },
      onError: (error: any) => {
        toast.error("Enrollment failed", { description: error?.message || "There was an error processing your enrollment." });
      }
    });
  };

  if (isCourseLoading || !course) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-12 w-3/4" /><Skeleton className="h-6 w-full" /><Skeleton className="h-64 w-full" />
            </div>
            <div><Skeleton className="h-96 w-full" /></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-muted/30 border-b pb-16 pt-10">
        <div className="container mx-auto px-6 lg:px-10">
          <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/courses"><ChevronLeft className="mr-1 h-4 w-4" />Back to Catalog</Link>
          </Button>
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{course.category}</Badge>
                <Badge variant="outline" className="uppercase tracking-wider text-[10px]">{course.level}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{course.title}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary/70" /><span className="text-foreground">{course.enrollmentCount}</span> students enrolled</div>
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary/70" /><span className="text-foreground">{Math.floor(course.duration / 60)}h {course.duration % 60}m</span> duration</div>
                <div className="flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary/70" /><span className="text-foreground">{course.lessonCount}</span> lessons</div>
              </div>
            </div>
            <div className="relative">
              <div className="sticky top-24">
                <Card className="shadow-2xl border-primary/10 overflow-hidden">
                  <div className="aspect-video relative bg-muted">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                        <BookOpen className="h-16 w-16 text-primary/20" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-8">
                    <div className="text-3xl font-bold tracking-tight mb-6">${course.price}</div>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="studentName" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="studentEmail" render={({ field }) => (
                          <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="jane@example.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" size="lg" className="w-full h-12 text-base mt-2 shadow-lg shadow-primary/20" disabled={enrollMutation.isPending}>
                          {enrollMutation.isPending ? "Processing..." : "Enroll Now"}
                        </Button>
                      </form>
                    </Form>
                    <p className="text-xs text-center text-muted-foreground mt-4">30-day money-back guarantee. Full lifetime access.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6">About the Instructor</h2>
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl border">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{course.instructor}</h3>
                  <p className="text-muted-foreground">Senior expert and dedicated educator. Known for breaking down complex topics into clear, actionable steps.</p>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-6">Course Curriculum</h2>
              {isLessonsLoading ? (
                <div className="space-y-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
              ) : lessons && lessons.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
                  {lessons.map((lesson: any, index: number) => (
                    <motion.div key={lesson.id} variants={staggerItem}>
                      <Card className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-0 flex items-center">
                          <div className="flex-none p-6 text-center border-r bg-muted/30 w-24">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Part</span>
                            <span className="text-2xl font-extrabold text-foreground">{index + 1}</span>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-bold text-lg mb-1 leading-none">{lesson.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0 bg-muted px-3 py-1 rounded-full">
                                <Clock className="h-3.5 w-3.5" /><span>{lesson.duration}m</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="p-8 text-center bg-muted/20 border border-dashed rounded-xl">
                  <BookOpen className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Curriculum being updated</h3>
                  <p className="text-sm text-muted-foreground">The lessons for this course are currently being finalized.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
