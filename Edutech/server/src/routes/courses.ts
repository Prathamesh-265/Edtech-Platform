import { Router } from "express";
import { db } from "../db/client";
import { coursesTable, lessonsTable, enrollmentsTable } from "../db/schema";
import { eq, ilike, sql, and, type SQL } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const CreateCourseBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  instructor: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.number().int().positive(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  price: z.number().min(0),
});

const UpdateCourseBody = CreateCourseBody.partial();
const GetCourseParams = z.object({ id: z.coerce.number().int().positive() });

router.get("/courses", async (req, res) => {
  try {
    const { category, search, level } = req.query as Record<string, string | undefined>;
    const conditions: SQL[] = [];
    if (category) conditions.push(eq(coursesTable.category, category));
    if (level) conditions.push(eq(coursesTable.level, level as "beginner" | "intermediate" | "advanced"));
    if (search) conditions.push(ilike(coursesTable.title, `%${search}%`));

    const courses = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
        instructor: coursesTable.instructor,
        category: coursesTable.category,
        level: coursesTable.level,
        duration: coursesTable.duration,
        thumbnailUrl: coursesTable.thumbnailUrl,
        price: coursesTable.price,
        createdAt: coursesTable.createdAt,
        lessonCount: sql<number>`cast(count(distinct ${lessonsTable.id}) as int)`,
        enrollmentCount: sql<number>`cast(count(distinct ${enrollmentsTable.id}) as int)`,
      })
      .from(coursesTable)
      .leftJoin(lessonsTable, eq(coursesTable.id, lessonsTable.courseId))
      .leftJoin(enrollmentsTable, eq(coursesTable.id, enrollmentsTable.courseId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(coursesTable.id)
      .orderBy(coursesTable.createdAt);

    res.json(courses.map(c => ({ ...c, price: Number(c.price) })));
  } catch (err) {
    console.error("Failed to list courses", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const body = CreateCourseBody.parse(req.body);
    const [course] = await db.insert(coursesTable).values({
      ...body,
      thumbnailUrl: body.thumbnailUrl || null,
      price: String(body.price),
    } as any).returning();
    res.status(201).json({ ...course, price: Number(course.price), lessonCount: 0, enrollmentCount: 0 });
  } catch (err) {
    console.error("Failed to create course", err);
    res.status(400).json({ message: "Invalid data" });
  }
});

router.get("/courses/:id", async (req, res) => {
  try {
    const { id } = GetCourseParams.parse({ id: req.params.id });
    const [course] = await db
      .select({
        id: coursesTable.id,
        title: coursesTable.title,
        description: coursesTable.description,
        instructor: coursesTable.instructor,
        category: coursesTable.category,
        level: coursesTable.level,
        duration: coursesTable.duration,
        thumbnailUrl: coursesTable.thumbnailUrl,
        price: coursesTable.price,
        createdAt: coursesTable.createdAt,
        lessonCount: sql<number>`cast(count(distinct ${lessonsTable.id}) as int)`,
        enrollmentCount: sql<number>`cast(count(distinct ${enrollmentsTable.id}) as int)`,
      })
      .from(coursesTable)
      .leftJoin(lessonsTable, eq(coursesTable.id, lessonsTable.courseId))
      .leftJoin(enrollmentsTable, eq(coursesTable.id, enrollmentsTable.courseId))
      .where(eq(coursesTable.id, id))
      .groupBy(coursesTable.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    const lessons = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.courseId, id))
      .orderBy(lessonsTable.order);

    res.json({
      ...course,
      price: Number(course.price),
      lessons: lessons.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })),
      createdAt: course.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Failed to get course", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/courses/:id", async (req, res) => {
  try {
    const { id } = GetCourseParams.parse({ id: req.params.id });
    const body = UpdateCourseBody.parse(req.body);
    const updates: Record<string, unknown> = { ...body };
    if (body.price !== undefined) updates.price = String(body.price);
    if (body.thumbnailUrl !== undefined) updates.thumbnailUrl = body.thumbnailUrl || null;

    const [updated] = await db.update(coursesTable).set(updates).where(eq(coursesTable.id, id)).returning();
    if (!updated) return res.status(404).json({ message: "Course not found" });

    const [counts] = await db
      .select({
        lessonCount: sql<number>`cast(count(distinct ${lessonsTable.id}) as int)`,
        enrollmentCount: sql<number>`cast(count(distinct ${enrollmentsTable.id}) as int)`,
      })
      .from(coursesTable)
      .leftJoin(lessonsTable, eq(coursesTable.id, lessonsTable.courseId))
      .leftJoin(enrollmentsTable, eq(coursesTable.id, enrollmentsTable.courseId))
      .where(eq(coursesTable.id, id))
      .groupBy(coursesTable.id);

    res.json({ ...updated, price: Number(updated.price), lessonCount: counts?.lessonCount ?? 0, enrollmentCount: counts?.enrollmentCount ?? 0 });
  } catch (err) {
    console.error("Failed to update course", err);
    res.status(400).json({ message: "Invalid data" });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = GetCourseParams.parse({ id: req.params.id });
    await db.delete(coursesTable).where(eq(coursesTable.id, id));
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete course", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const rows = await db.selectDistinct({ category: coursesTable.category }).from(coursesTable).orderBy(coursesTable.category);
    res.json(rows.map(r => r.category));
  } catch (err) {
    console.error("Failed to list categories", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
