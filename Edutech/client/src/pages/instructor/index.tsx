import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListCourses, useDeleteCourse, useListLessons, useDeleteLesson, getListCoursesQueryKey, getListLessonsQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { PageTransition, staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { CourseFormDialog } from "@/components/instructor/CourseFormDialog";
import { LessonFormDialog } from "@/components/instructor/LessonFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Clock, Users, BookOpen, PlayCircle, GraduationCap, BarChart3, ListVideo } from "lucide-react";
import { toast } from "sonner";

type Course = { id: number; title: string; description: string; instructor: string; category: string; level: string; duration: number; price: number; thumbnailUrl?: string | null; lessonCount: number; enrollmentCount: number; createdAt: string; };
type Lesson = { id: number; courseId: number; title: string; description: string; duration: number; order: number; videoUrl?: string | null; createdAt: string; };

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = { beginner: "bg-emerald-500/10 text-emerald-600 border-emerald-200", intermediate: "bg-amber-500/10 text-amber-600 border-amber-200", advanced: "bg-rose-500/10 text-rose-600 border-rose-200" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${colors[level] ?? "bg-muted"}`}>{level}</span>;
}

function LessonRow({ lesson, onEdit, onDelete }: { lesson: Lesson; onEdit: (l: Lesson) => void; onDelete: (l: Lesson) => void; }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors group">
      <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{lesson.order}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{lesson.title}</p>
        <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 bg-background border px-2 py-1 rounded-full">
        <Clock className="h-3 w-3" />{lesson.duration}m
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(lesson)}><Pencil className="h-3.5 w-3.5" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(lesson)}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    </motion.div>
  );
}

function CourseRow({ course, onEdit, onDelete }: { course: Course; onEdit: (c: Course) => void; onDelete: (c: Course) => void; }) {
  const [expanded, setExpanded] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deleteLessonTarget, setDeleteLessonTarget] = useState<Lesson | null>(null);
  const queryClient = useQueryClient();
  const deleteLessonMutation = useDeleteLesson();
  const { data: lessons, isLoading: lessonsLoading } = useListLessons(course.id, { query: { enabled: expanded } });

  const handleDeleteLesson = () => {
    if (!deleteLessonTarget) return;
    deleteLessonMutation.mutate({ id: deleteLessonTarget.id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListLessonsQueryKey(course.id) }); queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); toast.success("Lesson deleted"); setDeleteLessonTarget(null); },
      onError: () => toast.error("Failed to delete lesson"),
    });
  };

  return (
    <>
      <motion.div layout variants={staggerItem}>
        <Card className="overflow-hidden border-border/60 hover:border-primary/20 transition-all duration-200">
          <CardContent className="p-0">
            <div className="flex items-start gap-4 p-5">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-primary/5 border shrink-0 flex items-center justify-center">
                {course.thumbnailUrl ? <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full" /> : <BookOpen className="h-6 w-6 text-primary/30" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <Link href={`/courses/${course.id}`} className="font-bold text-base hover:text-primary transition-colors line-clamp-1">{course.title}</Link>
                    <p className="text-sm text-muted-foreground mt-0.5">by {course.instructor}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <LevelBadge level={course.level} />
                    <Badge variant="outline" className="text-xs">{course.category}</Badge>
                    <span className="font-bold text-base">${course.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary/60" /><span className="font-medium text-foreground">{course.enrollmentCount}</span> enrolled</div>
                  <div className="flex items-center gap-1.5"><ListVideo className="h-3.5 w-3.5 text-primary/60" /><span className="font-medium text-foreground">{course.lessonCount}</span> lessons</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary/60" />{Math.floor(course.duration / 60)}h {course.duration % 60}m</div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} Lessons
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(course)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => onDelete(course)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
                  <Separator />
                  <div className="p-5 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Course Curriculum</p>
                      <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => { setEditLesson(null); setLessonDialogOpen(true); }}>
                        <Plus className="h-3.5 w-3.5" />Add Lesson
                      </Button>
                    </div>
                    {lessonsLoading ? (
                      <div className="space-y-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}</div>
                    ) : lessons && lessons.length > 0 ? (
                      <AnimatePresence>
                        {lessons.map((lesson: any) => (
                          <LessonRow key={lesson.id} lesson={lesson as Lesson} onEdit={(l) => { setEditLesson(l); setLessonDialogOpen(true); }} onDelete={setDeleteLessonTarget} />
                        ))}
                      </AnimatePresence>
                    ) : (
                      <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">No lessons yet. Add your first lesson to get started.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <LessonFormDialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen} courseId={course.id} lessonCount={lessons?.length ?? 0} editLesson={editLesson} />
      <AlertDialog open={!!deleteLessonTarget} onOpenChange={(o) => !o && setDeleteLessonTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lesson?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteLessonTarget?.title}" will be permanently removed. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteLesson}>Delete Lesson</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function InstructorPortal() {
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourseTarget, setDeleteCourseTarget] = useState<Course | null>(null);
  const queryClient = useQueryClient();
  const deleteCourseMutation = useDeleteCourse();
  const { data: courses, isLoading } = useListCourses();

  const handleDeleteCourse = () => {
    if (!deleteCourseTarget) return;
    deleteCourseMutation.mutate({ id: deleteCourseTarget.id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() }); toast.success(`"${deleteCourseTarget.title}" deleted`); setDeleteCourseTarget(null); },
      onError: () => toast.error("Failed to delete course"),
    });
  };

  const stats = {
    totalCourses: courses?.length ?? 0,
    totalLessons: courses?.reduce((sum: number, c: any) => sum + (c.lessonCount ?? 0), 0) ?? 0,
    totalEnrollments: courses?.reduce((sum: number, c: any) => sum + (c.enrollmentCount ?? 0), 0) ?? 0,
  };

  return (
    <PageTransition>
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 lg:px-10 py-14">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg"><GraduationCap className="h-6 w-6 text-primary" /></div>
                <h1 className="text-3xl font-extrabold tracking-tight">Instructor Portal</h1>
              </div>
              <p className="text-muted-foreground">Manage your courses, lessons, and student content from one place.</p>
            </div>
            <Button size="lg" className="gap-2 shadow-md shadow-primary/20" onClick={() => { setEditCourse(null); setCourseDialogOpen(true); }}>
              <Plus className="h-5 w-5" />New Course
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-primary bg-primary/10" },
              { label: "Total Lessons", value: stats.totalLessons, icon: PlayCircle, color: "text-chart-2 bg-chart-2/10" },
              { label: "Enrollments", value: stats.totalEnrollments, icon: BarChart3, color: "text-chart-3 bg-chart-3/10" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="border-border/50">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${color}`}><Icon className="h-5 w-5" /></div>
                  <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 py-12">
        <div className="flex items-center justify-between mb-6">
          <CardHeader className="p-0">
            <CardTitle className="text-xl">Your Courses</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Click "Lessons" on any course to expand and manage its curriculum.</p>
          </CardHeader>
        </div>
        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}</div>
        ) : courses && courses.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
            {courses.map((course: any) => (
              <CourseRow key={course.id} course={course as Course} onEdit={(c) => { setEditCourse(c); setCourseDialogOpen(true); }} onDelete={setDeleteCourseTarget} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 border border-dashed rounded-xl bg-muted/10">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Start building your curriculum by creating your first course.</p>
            <Button onClick={() => { setEditCourse(null); setCourseDialogOpen(true); }} className="gap-2"><Plus className="h-4 w-4" />Create First Course</Button>
          </div>
        )}
      </div>

      <CourseFormDialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen} editCourse={editCourse} />
      <AlertDialog open={!!deleteCourseTarget} onOpenChange={(o) => !o && setDeleteCourseTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription><strong>"{deleteCourseTarget?.title}"</strong> and all its lessons will be permanently deleted. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteCourse}>Delete Course</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
