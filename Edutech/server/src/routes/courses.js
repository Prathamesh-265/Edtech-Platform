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
var CreateCourseBody = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    instructor: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    level: zod_1.z.enum(["beginner", "intermediate", "advanced"]),
    duration: zod_1.z.number().int().positive(),
    thumbnailUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    price: zod_1.z.number().min(0),
});
var UpdateCourseBody = CreateCourseBody.partial();
var GetCourseParams = zod_1.z.object({ id: zod_1.z.coerce.number().int().positive() });
router.get("/courses", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category, search, level, conditions, courses, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, category = _a.category, search = _a.search, level = _a.level;
                conditions = [];
                if (category)
                    conditions.push((0, drizzle_orm_1.eq)(schema_1.coursesTable.category, category));
                if (level)
                    conditions.push((0, drizzle_orm_1.eq)(schema_1.coursesTable.level, level));
                if (search)
                    conditions.push((0, drizzle_orm_1.ilike)(schema_1.coursesTable.title, "%".concat(search, "%")));
                return [4 /*yield*/, client_1.db
                        .select({
                        id: schema_1.coursesTable.id,
                        title: schema_1.coursesTable.title,
                        description: schema_1.coursesTable.description,
                        instructor: schema_1.coursesTable.instructor,
                        category: schema_1.coursesTable.category,
                        level: schema_1.coursesTable.level,
                        duration: schema_1.coursesTable.duration,
                        thumbnailUrl: schema_1.coursesTable.thumbnailUrl,
                        price: schema_1.coursesTable.price,
                        createdAt: schema_1.coursesTable.createdAt,
                        lessonCount: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.lessonsTable.id),
                        enrollmentCount: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.id),
                    })
                        .from(schema_1.coursesTable)
                        .leftJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.lessonsTable.courseId))
                        .leftJoin(schema_1.enrollmentsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.enrollmentsTable.courseId))
                        .where(conditions.length > 0 ? drizzle_orm_1.and.apply(void 0, conditions) : undefined)
                        .groupBy(schema_1.coursesTable.id)
                        .orderBy(schema_1.coursesTable.createdAt)];
            case 1:
                courses = _b.sent();
                res.json(courses.map(function (c) { return (__assign(__assign({}, c), { price: Number(c.price) })); }));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.error("Failed to list courses", err_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/courses", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, course, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                body = CreateCourseBody.parse(req.body);
                return [4 /*yield*/, client_1.db.insert(schema_1.coursesTable).values(__assign(__assign({}, body), { thumbnailUrl: body.thumbnailUrl || null, price: String(body.price) })).returning()];
            case 1:
                course = (_a.sent())[0];
                res.status(201).json(__assign(__assign({}, course), { price: Number(course.price), lessonCount: 0, enrollmentCount: 0 }));
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error("Failed to create course", err_2);
                res.status(400).json({ message: "Invalid data" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/courses/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, course, lessons, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = GetCourseParams.parse({ id: req.params.id }).id;
                return [4 /*yield*/, client_1.db
                        .select({
                        id: schema_1.coursesTable.id,
                        title: schema_1.coursesTable.title,
                        description: schema_1.coursesTable.description,
                        instructor: schema_1.coursesTable.instructor,
                        category: schema_1.coursesTable.category,
                        level: schema_1.coursesTable.level,
                        duration: schema_1.coursesTable.duration,
                        thumbnailUrl: schema_1.coursesTable.thumbnailUrl,
                        price: schema_1.coursesTable.price,
                        createdAt: schema_1.coursesTable.createdAt,
                        lessonCount: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.lessonsTable.id),
                        enrollmentCount: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.id),
                    })
                        .from(schema_1.coursesTable)
                        .leftJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.lessonsTable.courseId))
                        .leftJoin(schema_1.enrollmentsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.enrollmentsTable.courseId))
                        .where((0, drizzle_orm_1.eq)(schema_1.coursesTable.id, id))
                        .groupBy(schema_1.coursesTable.id)];
            case 1:
                course = (_a.sent())[0];
                if (!course)
                    return [2 /*return*/, res.status(404).json({ message: "Course not found" })];
                return [4 /*yield*/, client_1.db
                        .select()
                        .from(schema_1.lessonsTable)
                        .where((0, drizzle_orm_1.eq)(schema_1.lessonsTable.courseId, id))
                        .orderBy(schema_1.lessonsTable.order)];
            case 2:
                lessons = _a.sent();
                res.json(__assign(__assign({}, course), { price: Number(course.price), lessons: lessons.map(function (l) { return (__assign(__assign({}, l), { createdAt: l.createdAt.toISOString() })); }), createdAt: course.createdAt.toISOString() }));
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error("Failed to get course", err_3);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/courses/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, body, updates, updated, counts, err_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = GetCourseParams.parse({ id: req.params.id }).id;
                body = UpdateCourseBody.parse(req.body);
                updates = __assign({}, body);
                if (body.price !== undefined)
                    updates.price = String(body.price);
                if (body.thumbnailUrl !== undefined)
                    updates.thumbnailUrl = body.thumbnailUrl || null;
                return [4 /*yield*/, client_1.db.update(schema_1.coursesTable).set(updates).where((0, drizzle_orm_1.eq)(schema_1.coursesTable.id, id)).returning()];
            case 1:
                updated = (_c.sent())[0];
                if (!updated)
                    return [2 /*return*/, res.status(404).json({ message: "Course not found" })];
                return [4 /*yield*/, client_1.db
                        .select({
                        lessonCount: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.lessonsTable.id),
                        enrollmentCount: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.id),
                    })
                        .from(schema_1.coursesTable)
                        .leftJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.lessonsTable.courseId))
                        .leftJoin(schema_1.enrollmentsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.enrollmentsTable.courseId))
                        .where((0, drizzle_orm_1.eq)(schema_1.coursesTable.id, id))
                        .groupBy(schema_1.coursesTable.id)];
            case 2:
                counts = (_c.sent())[0];
                res.json(__assign(__assign({}, updated), { price: Number(updated.price), lessonCount: (_a = counts === null || counts === void 0 ? void 0 : counts.lessonCount) !== null && _a !== void 0 ? _a : 0, enrollmentCount: (_b = counts === null || counts === void 0 ? void 0 : counts.enrollmentCount) !== null && _b !== void 0 ? _b : 0 }));
                return [3 /*break*/, 4];
            case 3:
                err_4 = _c.sent();
                console.error("Failed to update course", err_4);
                res.status(400).json({ message: "Invalid data" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete("/courses/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = GetCourseParams.parse({ id: req.params.id }).id;
                return [4 /*yield*/, client_1.db.delete(schema_1.coursesTable).where((0, drizzle_orm_1.eq)(schema_1.coursesTable.id, id))];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error("Failed to delete course", err_5);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/categories", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, client_1.db.selectDistinct({ category: schema_1.coursesTable.category }).from(schema_1.coursesTable).orderBy(schema_1.coursesTable.category)];
            case 1:
                rows = _a.sent();
                res.json(rows.map(function (r) { return r.category; }));
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.error("Failed to list categories", err_6);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
