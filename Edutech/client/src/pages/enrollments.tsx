import { PageTransition, staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { useListEnrollments } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, Trophy, BookMarked, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Enrollments() {
  const { data: enrollments, isLoading } = useListEnrollments();

  return (
    <PageTransition>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 lg:px-10 py-14">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight">My Learning</h1>
          </div>
          <p className="text-muted-foreground text-lg">Pick up where you left off and track your progress.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                <div className="flex flex-col sm:flex-row h-full">
                  <Skeleton className="h-48 sm:h-auto sm:w-1/3 rounded-none" />
                  <CardContent className="p-6 space-y-4 w-full">
                    <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" />
                    <div className="pt-6 space-y-2">
                      <div className="flex justify-between"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-10" /></div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : enrollments && enrollments.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-8">
            {enrollments.map((enrollment: any) => (
              <motion.div key={enrollment.id} variants={staggerItem}>
                <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row flex-1">
                    <div className="relative h-48 sm:h-auto sm:w-2/5 shrink-0 bg-muted overflow-hidden">
                      {enrollment.course.thumbnailUrl ? (
                        <img src={enrollment.course.thumbnailUrl} alt={enrollment.course.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                          <PlayCircle className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      {enrollment.progressPercent === 100 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Trophy className="h-12 w-12 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">{enrollment.course.category}</Badge>
                          {enrollment.progressPercent === 100 && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-transparent">Completed</Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{enrollment.course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-auto space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className={enrollment.progressPercent === 100 ? "text-green-600" : "text-primary"}>{enrollment.progressPercent}%</span>
                          </div>
                          <Progress value={enrollment.progressPercent} className={`h-2.5 ${enrollment.progressPercent === 100 ? "[&>div]:bg-green-500" : ""}`} />
                        </div>
                        <Button className="w-full justify-between" variant={enrollment.progressPercent === 100 ? "outline" : "default"} asChild>
                          <Link href={`/courses/${enrollment.courseId}`}>
                            {enrollment.progressPercent === 100 ? "Review Course" : "Continue Learning"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed shadow-sm">
            <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookMarked className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Your learning journey begins here</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">You haven't enrolled in any courses yet.</p>
            <Button size="lg" asChild>
              <Link href="/courses">Browse Course Catalog <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
