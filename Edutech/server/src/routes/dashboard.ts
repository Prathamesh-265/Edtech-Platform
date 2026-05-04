import { Router } from "express";
import { db } from "../db/client";
import { coursesTable, lessonsTable, enrollmentsTable, progressTable } from "../db/schema";
import { sql, eq, desc } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (_req, res) => {
  try {
    const [stats] = await db
      .select({
        totalCourses: sql<number>`cast(count(distinct ${coursesTable.id}) as int)`,
        totalEnrollments: sql<number>`cast(count(distinct ${enrollmentsTable.id}) as int)`,
        totalStudents: sql<number>`cast(count(distinct ${enrollmentsTable.studentEmail}) as int)`,
        totalLessons: sql<number>`cast(count(distinct ${lessonsTable.id}) as int)`,
      })
      .from(coursesTable)
      .leftJoin(enrollmentsTable, eq(coursesTable.id, enrollmentsTable.courseId))
      .leftJoin(lessonsTable, eq(coursesTable.id, lessonsTable.courseId));

    const progressCount = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(progressTable);
    const lessonCountResult = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(lessonsTable);

    const completedCount = progressCount[0]?.count ?? 0;
    const totalLessonsForRate = lessonCountResult[0]?.count ?? 0;
    const completionRate = totalLessonsForRate > 0 ? Math.round((completedCount / totalLessonsForRate) * 100) : 0;

    const [popularRow] = await db
      .select({ category: coursesTable.category, count: sql<number>`cast(count(${enrollmentsTable.id}) as int)` })
      .from(enrollmentsTable)
      .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .groupBy(coursesTable.category)
      .orderBy(desc(sql`count(${enrollmentsTable.id})`))
      .limit(1);

    res.json({
      totalCourses: stats?.totalCourses ?? 0,
      totalEnrollments: stats?.totalEnrollments ?? 0,
      totalStudents: stats?.totalStudents ?? 0,
      totalLessons: stats?.totalLessons ?? 0,
      completionRate,
      popularCategory: popularRow?.category ?? "N/A",
    });
  } catch (err) {
    console.error("Failed to get dashboard stats", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/dashboard/recent-activity", async (_req, res) => {
  try {
    const recentEnrollments = await db
      .select({
        id: enrollmentsTable.id,
        type: sql<string>`'enrollment'`,
        studentName: enrollmentsTable.studentName,
        courseTitle: coursesTable.title,
        lessonTitle: sql<string | null>`null`,
        timestamp: enrollmentsTable.enrolledAt,
      })
      .from(enrollmentsTable)
      .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .orderBy(desc(enrollmentsTable.enrolledAt))
      .limit(10);

    const recentProgress = await db
      .select({
        id: progressTable.id,
        type: sql<string>`'completion'`,
        studentName: enrollmentsTable.studentName,
        courseTitle: coursesTable.title,
        lessonTitle: lessonsTable.title,
        timestamp: progressTable.completedAt,
      })
      .from(progressTable)
      .innerJoin(enrollmentsTable, eq(progressTable.enrollmentId, enrollmentsTable.id))
      .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .innerJoin(lessonsTable, eq(progressTable.lessonId, lessonsTable.id))
      .orderBy(desc(progressTable.completedAt))
      .limit(10);

    const combined = [
      ...recentEnrollments.map(e => ({ ...e, timestamp: e.timestamp.toISOString() })),
      ...recentProgress.map(p => ({ ...p, timestamp: p.timestamp.toISOString() })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);

    res.json(combined);
  } catch (err) {
    console.error("Failed to get recent activity", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/dashboard/course-analytics", async (_req, res) => {
  try {
    const rows = await db
      .select({
        courseId: coursesTable.id,
        courseTitle: coursesTable.title,
        category: coursesTable.category,
        enrollmentCount: sql<number>`cast(count(distinct ${enrollmentsTable.id}) as int)`,
        lessonCount: sql<number>`cast(count(distinct ${lessonsTable.id}) as int)`,
        completedCount: sql<number>`cast(count(distinct ${progressTable.id}) as int)`,
      })
      .from(coursesTable)
      .leftJoin(enrollmentsTable, eq(coursesTable.id, enrollmentsTable.courseId))
      .leftJoin(lessonsTable, eq(coursesTable.id, lessonsTable.courseId))
      .leftJoin(progressTable, eq(enrollmentsTable.id, progressTable.enrollmentId))
      .groupBy(coursesTable.id)
      .orderBy(desc(sql`count(distinct ${enrollmentsTable.id})`));

    res.json(rows.map(r => ({
      courseId: r.courseId,
      courseTitle: r.courseTitle,
      category: r.category,
      enrollmentCount: r.enrollmentCount,
      completionRate: r.lessonCount > 0 ? Math.round((r.completedCount / r.lessonCount) * 100) : 0,
    })));
  } catch (err) {
    console.error("Failed to get course analytics", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
