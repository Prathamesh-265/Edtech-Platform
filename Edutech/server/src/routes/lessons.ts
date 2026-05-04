import { Router } from "express";
import { db } from "../db/client";
import { lessonsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const IdParam = z.object({ id: z.coerce.number().int().positive() });

const CreateLessonBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.number().int().positive(),
  order: z.number().int().positive(),
  videoUrl: z.string().url().optional().or(z.literal("")),
});

const UpdateLessonBody = CreateLessonBody.partial();

router.get("/courses/:id/lessons", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: req.params.id });
    const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, id)).orderBy(lessonsTable.order);
    res.json(lessons.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })));
  } catch (err) {
    console.error("Failed to list lessons", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/courses/:id/lessons", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: req.params.id });
    const body = CreateLessonBody.parse(req.body);
    const [lesson] = await db.insert(lessonsTable).values({
      ...body,
      videoUrl: body.videoUrl || null,
      courseId: id,
    }).returning();
    res.status(201).json({ ...lesson, createdAt: lesson.createdAt.toISOString() });
  } catch (err) {
    console.error("Failed to create lesson", err);
    res.status(400).json({ message: "Invalid data" });
  }
});

router.put("/lessons/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: req.params.id });
    const body = UpdateLessonBody.parse(req.body);
    const updates = { ...body, videoUrl: body.videoUrl !== undefined ? (body.videoUrl || null) : undefined };
    const [updated] = await db.update(lessonsTable).set(updates).where(eq(lessonsTable.id, id)).returning();
    if (!updated) return res.status(404).json({ message: "Lesson not found" });
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    console.error("Failed to update lesson", err);
    res.status(400).json({ message: "Invalid data" });
  }
});

router.delete("/lessons/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: req.params.id });
    await db.delete(lessonsTable).where(eq(lessonsTable.id, id));
    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete lesson", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
