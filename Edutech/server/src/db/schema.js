"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressTable = exports.enrollmentsTable = exports.lessonsTable = exports.coursesTable = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.coursesTable = (0, pg_core_1.pgTable)("courses", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    instructor: (0, pg_core_1.text)("instructor").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    level: (0, pg_core_1.text)("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
    duration: (0, pg_core_1.integer)("duration").notNull(),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    price: (0, pg_core_1.numeric)("price", { precision: 10, scale: 2 }).notNull().default("0"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.lessonsTable = (0, pg_core_1.pgTable)("lessons", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    courseId: (0, pg_core_1.integer)("course_id").notNull().references(function () { return exports.coursesTable.id; }, { onDelete: "cascade" }),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    videoUrl: (0, pg_core_1.text)("video_url"),
    duration: (0, pg_core_1.integer)("duration").notNull(),
    order: (0, pg_core_1.integer)("order").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.enrollmentsTable = (0, pg_core_1.pgTable)("enrollments", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    courseId: (0, pg_core_1.integer)("course_id").notNull().references(function () { return exports.coursesTable.id; }, { onDelete: "cascade" }),
    studentName: (0, pg_core_1.text)("student_name").notNull(),
    studentEmail: (0, pg_core_1.text)("student_email").notNull(),
    enrolledAt: (0, pg_core_1.timestamp)("enrolled_at").defaultNow().notNull(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
exports.progressTable = (0, pg_core_1.pgTable)("progress", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    enrollmentId: (0, pg_core_1.integer)("enrollment_id").notNull().references(function () { return exports.enrollmentsTable.id; }, { onDelete: "cascade" }),
    lessonId: (0, pg_core_1.integer)("lesson_id").notNull().references(function () { return exports.lessonsTable.id; }, { onDelete: "cascade" }),
    completedAt: (0, pg_core_1.timestamp)("completed_at").defaultNow().notNull(),
});
