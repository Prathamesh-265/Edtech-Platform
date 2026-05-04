import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, PlayCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition, staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { useListCourses, useGetDashboardStats } from "@/lib/api";

export default function Home() {
  const { data: courses, isLoading: isLoadingCourses } = useListCourses();
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStats();
  const featuredCourses = courses?.slice(0, 3) || [];

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        <div className="container relative z-10 mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl space-y-8">
            <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full border-primary/20 bg-primary/10 text-primary">
              Platform 2.0 Now Available
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Master the Craft of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Digital Creation</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              EduVerse is the premier destination for ambitious professionals. Learn from industry leaders, track your progress, and build the future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-primary/20" asChild>
                <Link href="/courses">Explore Catalog <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-2" asChild>
                <Link href="/dashboard">View Analytics</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-6 lg:px-10 py-14">
          {isLoadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col items-center justify-center space-y-2">
                  <Skeleton className="h-10 w-24" /><Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
              <motion.div variants={staggerItem} className="flex flex-col items-center justify-center space-y-2 text-center px-4">
                <Users className="h-6 w-6 text-primary mb-2 opacity-80" />
                <h3 className="text-4xl font-bold tracking-tight">{stats?.totalStudents || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Learners</p>
              </motion.div>
              <motion.div variants={staggerItem} className="flex flex-col items-center justify-center space-y-2 text-center px-4">
                <BookOpen className="h-6 w-6 text-primary mb-2 opacity-80" />
                <h3 className="text-4xl font-bold tracking-tight">{stats?.totalCourses || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Premium Courses</p>
              </motion.div>
              <motion.div variants={staggerItem} className="flex flex-col items-center justify-center space-y-2 text-center px-4">
                <PlayCircle className="h-6 w-6 text-primary mb-2 opacity-80" />
                <h3 className="text-4xl font-bold tracking-tight">{stats?.totalLessons || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Video Lessons</p>
              </motion.div>
              <motion.div variants={staggerItem} className="flex flex-col items-center justify-center space-y-2 text-center px-4">
                <TrendingUp className="h-6 w-6 text-primary mb-2 opacity-80" />
                <h3 className="text-4xl font-bold tracking-tight">{(stats?.completionRate || 0).toFixed(1)}%</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completion Rate</p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Curriculum</h2>
              <p className="text-lg text-muted-foreground">Hand-picked courses designed to accelerate your career. Taught by industry veterans.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex group" asChild>
              <Link href="/courses">View full catalog <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            </Button>
          </div>
          {isLoadingCourses ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" />
                    <div className="pt-4 flex justify-between"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-3 gap-8">
              {featuredCourses.map((course: any) => (
                <motion.div key={course.id} variants={staggerItem}>
                  <Card className="group overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {course.thumbnailUrl ? (
                        <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur font-medium">{course.level}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline" className="text-primary border-primary/30">{course.category}</Badge>
                        <span className="font-bold text-lg">${course.price}</span>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">{course.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /><span>{course.enrollmentCount} learners</span></div>
                        <div className="flex items-center gap-1.5"><PlayCircle className="h-4 w-4" /><span>{course.lessonCount} lessons</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                Designed for outcomes, not just engagement.
              </h2>
              <div className="space-y-6">
                {["Structured curriculums built by practitioners", "Actionable progress tracking and analytics", "Rich media support and interactive exercises", "Community-driven insights and leaderboards"].map((prop, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                    <p className="text-lg opacity-90">{prop}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 blur-3xl opacity-20 rounded-full"></div>
              <Card className="relative bg-background/5 border-white/10 backdrop-blur-sm overflow-hidden text-primary-foreground">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Student Progress</h4>
                      <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-[72%] rounded-full"></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm opacity-80">
                        <span>Course Completion</span><span>72%</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium opacity-90">Recent Activity</h4>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <PlayCircle className="h-5 w-5 opacity-70" />
                          </div>
                          <div><p className="font-medium">Completed Lesson {i}</p><p className="text-sm opacity-70">2 hours ago</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
