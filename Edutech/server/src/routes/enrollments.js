"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("../db/client");
var schema_1 = require("../db/schema");
var drizzle_orm_1 = require("drizzle-orm");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
var CreateEnrollmentBody = zod_1.z.object({
    courseId: zod_1.z.number().int().positive(),
    studentName: zod_1.z.string().min(1),
    studentEmail: zod_1.z.string().email(),
});
var IdParam = zod_1.z.object({ id: zod_1.z.coerce.number().int().positive() });
router.get("/enrollments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentName, rows, enrollments, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentName = req.query.studentName;
                return [4 /*yield*/, client_1.db
                        .select({
                        id: schema_1.enrollmentsTable.id,
                        courseId: schema_1.enrollmentsTable.courseId,
                        studentName: schema_1.enrollmentsTable.studentName,
                        studentEmail: schema_1.enrollmentsTable.studentEmail,
                        enrolledAt: schema_1.enrollmentsTable.enrolledAt,
                        completedAt: schema_1.enrollmentsTable.completedAt,
                        courseTitle: schema_1.coursesTable.title,
                        courseInstructor: schema_1.coursesTable.instructor,
                        courseCategory: schema_1.coursesTable.category,
                        courseLevel: schema_1.coursesTable.level,
                        courseDuration: schema_1.coursesTable.duration,
                        courseThumbnailUrl: schema_1.coursesTable.thumbnailUrl,
                        coursePrice: schema_1.coursesTable.price,
                        courseDescription: schema_1.coursesTable.description,
                        courseCreatedAt: schema_1.coursesTable.createdAt,
                        lessonCount: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.lessonsTable.id),
                        enrollmentCount: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.id),
                        completedLessons: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.progressTable.id),
                    })
                        .from(schema_1.enrollmentsTable)
                        .innerJoin(schema_1.coursesTable, (0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.courseId, schema_1.coursesTable.id))
                        .leftJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.lessonsTable.courseId))
                        .leftJoin(schema_1.progressTable, (0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.id, schema_1.progressTable.enrollmentId))
                        .where(studentName ? (0, drizzle_orm_1.ilike)(schema_1.enrollmentsTable.studentName, "%".concat(studentName, "%")) : undefined)
                        .groupBy(schema_1.enrollmentsTable.id, schema_1.coursesTable.id)
                        .orderBy(schema_1.enrollmentsTable.enrolledAt)];
            case 1:
                rows = _a.sent();
                enrollments = rows.map(function (r) { return ({
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
                }); });
                res.json(enrollments);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error("Failed to list enrollments", err_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/enrollments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, enrollment, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = CreateEnrollmentBody.parse(req.body);
                return [4 /*yield*/, client_1.db.insert(schema_1.enrollmentsTable).values(body).returning()];
            case 1:
                enrollment = (_a.sent())[0];
                res.status(201).json(__assign(__assign({}, enrollment), { enrolledAt: enrollment.enrolledAt.toISOString(), completedAt: null }));
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error("Failed to create enrollment", err_2);
                res.status(400).json({ message: "Invalid data" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete("/enrollments/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = IdParam.parse({ id: req.params.id }).id;
                return [4 /*yield*/, client_1.db.delete(schema_1.enrollmentsTable).where((0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.id, id))];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error("Failed to delete enrollment", err_3);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
var templateObject_1, templateObject_2, templateObject_3;
