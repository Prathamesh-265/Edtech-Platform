import { Router } from "express";
import { db } from "../db/client";
import { enrollmentsTable, coursesTable, lessonsTable, progressTable } from "../db/schema";
import { eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const CreateEnrollmentBody = z.object({
  courseId: z.number().int().positive(),
  studentName: z.string().min(1),
  studentEmail: z.string().email(),
});

const IdParam = z.object({ id: z.coerce.number().int().positive() });

router.get("/enrollments", async (req, res) => {
  try {
    const studentName = req.query.studentName as string | undefined;
    const rows = await db
      .select({
        id: enrollmentsTable.id,
        courseId: enrollmentsTable.courseId,
        studentName: enrollmentsTable.studentName,
        studentEmail: enrollmentsTable.studentEmail,
        enrolledAt: enrollmentsTable.enrolledAt,
        completedAt: enrollmentsTable.completedAt,
        courseTitle: coursesTable.title,
        courseInstructor: coursesTable.instructor,
        courseCategory: coursesTable.category,
        courseLevel: coursesTable.level,
        courseDuration: coursesTable.duration,
        courseThumbnailUrl: coursesTable.thumbnailUrl,
        coursePrice: coursesTable.price,
        courseDescription: coursesTable.description,
        courseCreatedAt: coursesTable.createdAt,
        lessonCount: sql<number>`cast(count(distinct ${lessonsTable.id}) as int)`,
        enrollmentCount: sql<number>`cast(count(distinct ${enrollmentsTable.id}) as int)`,
        completedLessons: sql<number>`cast(count(distinct ${progressTable.id}) as int)`,
      })
      .from(enrollmentsTable)
      .innerJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
      .leftJoin(lessonsTable, eq(coursesTable.id, lessonsTable.courseId))
      .leftJoin(progressTable, eq(enrollmentsTable.id, progressTable.enrollmentId))
      .where(studentName ? ilike(enrollmentsTable.studentName, `%${studentName}%`) : undefined)
      .groupBy(enrollmentsTable.id, coursesTable.id)
      .orderBy(enrollmentsTable.enrolledAt);

    const enrollments = rows.map(r => ({
      id: r.id,
      courseId: r.courseId,
      studentName: r.studentName,
      studentEmail: r.studentEmail,
      enrolledAt: r.enrolledAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
      course: {
        id: r.courseId,
        title: r.courseTitle,
        instructor: r.courseInstructor,
        category: r.courseCategory,
        level: r.courseLevel,
        duration: r.courseDuration,
        thumbnailUrl: r.courseThumbnailUrl,
        price: Number(r.coursePrice),
        description: r.courseDescription,
        createdAt: r.courseCreatedAt.toISOString(),
        lessonCount: r.lessonCount,
        enrollmentCount: r.enrollmentCount,
      },
      progressPercent: r.lessonCount > 0
        ? Math.round((r.completedLessons / r.lessonCount) * 100)
        : 0,
    }));

    res.json(enrollments);
  } catch (err) {
    console.error("Failed to list enrollments", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/enrollments", async (req, res) => {
  try {
    const body = CreateEnrollmentBody.parse(req.body);
    const [enrollment] = await db.insert(enrollmentsTable).values(body).returning();
    res.status(201).json({ ...enrollment, enrolledAt: enrollment.enrolledAt.toISOString(), completedAt: null });
  } catch (err) {
    console.error("Failed to create enrollment", err);
    res.status(400).json({ message: "Invalid data" });
  }
});

router.delete("/enrollments/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: req.params.id });
    await db.delete(enrollmentsTable).where(eq(enrollmentsTable.id, id));
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete enrollment", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
