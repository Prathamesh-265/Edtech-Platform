import { PageTransition, staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, TrendingUp, Activity } from "lucide-react";
import { useGetDashboardStats, useGetRecentActivity, useGetCourseAnalytics } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStats();
  const { data: activities, isLoading: isActivitiesLoading } = useGetRecentActivity();
  const { data: analytics, isLoading: isAnalyticsLoading } = useGetCourseAnalytics();

  return (
    <PageTransition>
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 lg:px-10 py-14">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Monitor your platform's performance and student engagement.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-10 py-12 space-y-10">
        <section>
          {isStatsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={staggerItem}>
                <Card><CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold tracking-tight text-primary">${((stats?.totalEnrollments || 0) * 149).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-lg"><TrendingUp className="h-5 w-5" /></div>
                  </div>
                </CardContent></Card>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Card><CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                      <p className="text-3xl font-bold tracking-tight">{stats?.totalStudents || 0}</p>
                    </div>
                    <div className="p-3 bg-accent/10 text-accent rounded-lg"><Users className="h-5 w-5" /></div>
                  </div>
                </CardContent></Card>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Card><CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                      <p className="text-3xl font-bold tracking-tight">{stats?.totalEnrollments || 0}</p>
                    </div>
                    <div className="p-3 bg-chart-3/10 text-chart-3 rounded-lg"><BookOpen className="h-5 w-5" /></div>
                  </div>
                </CardContent></Card>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Card><CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Avg Completion Rate</p>
                      <p className="text-3xl font-bold tracking-tight">{stats?.completionRate ? `${stats.completionRate.toFixed(1)}%` : "0%"}</p>
                    </div>
                    <div className="p-3 bg-chart-4/10 text-chart-4 rounded-lg"><Trophy className="h-5 w-5" /></div>
                  </div>
                </CardContent></Card>
              </motion.div>
            </motion.div>
          )}
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 space-y-6">
            <Card className="h-full border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Enrollments by Course</CardTitle>
                <p className="text-sm text-muted-foreground">Performance of your active curriculum</p>
              </CardHeader>
              <CardContent>
                {isAnalyticsLoading ? <Skeleton className="h-[350px] w-full" /> : analytics && analytics.length > 0 ? (
                  <div className="h-[350px] w-full pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="courseTitle" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => v.length > 15 ? v.substring(0, 15) + '...' : v} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }} />
                        <Bar dataKey="enrollmentCount" name="Enrollments" radius={[4, 4, 0, 0]} maxBarSize={50}>
                          {analytics.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground border border-dashed rounded-lg bg-muted/20">No analytics data available yet.</div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card className="h-full border-border/60 shadow-sm flex flex-col">
              <CardHeader className="pb-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                {isActivitiesLoading ? (
                  <div className="p-6 space-y-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="flex gap-4"><Skeleton className="h-10 w-10 rounded-full shrink-0" /><div className="space-y-2 w-full"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-20" /></div></div>)}
                  </div>
                ) : activities && activities.length > 0 ? (
                  <div className="divide-y divide-border max-h-[450px] overflow-y-auto p-2">
                    {activities.map((activity: any) => (
                      <div key={activity.id} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors rounded-lg">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'enrollment' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                          {activity.type === 'enrollment' ? <BookOpen className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-snug mb-1">
                            <span className="font-bold">{activity.studentName}</span>
                            {activity.type === 'enrollment' ? ' enrolled in ' : ' completed lesson '}
                            <span className="font-semibold">{activity.type === 'enrollment' ? activity.courseTitle : activity.lessonTitle}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                    <Activity className="h-12 w-12 opacity-20 mb-4" /><p>No recent activity on your platform.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
