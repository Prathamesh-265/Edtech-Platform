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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var client_1 = require("../db/client");
var schema_1 = require("../db/schema");
var drizzle_orm_1 = require("drizzle-orm");
var router = (0, express_1.Router)();
router.get("/dashboard/stats", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, progressCount, lessonCountResult, completedCount, totalLessonsForRate, completionRate, popularRow, err_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 5, , 6]);
                return [4 /*yield*/, client_1.db
                        .select({
                        totalCourses: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.coursesTable.id),
                        totalEnrollments: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.id),
                        totalStudents: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.studentEmail),
                        totalLessons: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.lessonsTable.id),
                    })
                        .from(schema_1.coursesTable)
                        .leftJoin(schema_1.enrollmentsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.enrollmentsTable.courseId))
                        .leftJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.lessonsTable.courseId))];
            case 1:
                stats = (_k.sent())[0];
                return [4 /*yield*/, client_1.db.select({ count: (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) }).from(schema_1.progressTable)];
            case 2:
                progressCount = _k.sent();
                return [4 /*yield*/, client_1.db.select({ count: (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) }).from(schema_1.lessonsTable)];
            case 3:
                lessonCountResult = _k.sent();
                completedCount = (_b = (_a = progressCount[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
                totalLessonsForRate = (_d = (_c = lessonCountResult[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
                completionRate = totalLessonsForRate > 0 ? Math.round((completedCount / totalLessonsForRate) * 100) : 0;
                return [4 /*yield*/, client_1.db
                        .select({ category: schema_1.coursesTable.category, count: (0, drizzle_orm_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["cast(count(", ") as int)"], ["cast(count(", ") as int)"])), schema_1.enrollmentsTable.id) })
                        .from(schema_1.enrollmentsTable)
                        .innerJoin(schema_1.coursesTable, (0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.courseId, schema_1.coursesTable.id))
                        .groupBy(schema_1.coursesTable.category)
                        .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["count(", ")"], ["count(", ")"])), schema_1.enrollmentsTable.id)))
                        .limit(1)];
            case 4:
                popularRow = (_k.sent())[0];
                res.json({
                    totalCourses: (_e = stats === null || stats === void 0 ? void 0 : stats.totalCourses) !== null && _e !== void 0 ? _e : 0,
                    totalEnrollments: (_f = stats === null || stats === void 0 ? void 0 : stats.totalEnrollments) !== null && _f !== void 0 ? _f : 0,
                    totalStudents: (_g = stats === null || stats === void 0 ? void 0 : stats.totalStudents) !== null && _g !== void 0 ? _g : 0,
                    totalLessons: (_h = stats === null || stats === void 0 ? void 0 : stats.totalLessons) !== null && _h !== void 0 ? _h : 0,
                    completionRate: completionRate,
                    popularCategory: (_j = popularRow === null || popularRow === void 0 ? void 0 : popularRow.category) !== null && _j !== void 0 ? _j : "N/A",
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _k.sent();
                console.error("Failed to get dashboard stats", err_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get("/dashboard/recent-activity", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recentEnrollments, recentProgress, combined, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, client_1.db
                        .select({
                        id: schema_1.enrollmentsTable.id,
                        type: (0, drizzle_orm_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["'enrollment'"], ["'enrollment'"]))),
                        studentName: schema_1.enrollmentsTable.studentName,
                        courseTitle: schema_1.coursesTable.title,
                        lessonTitle: (0, drizzle_orm_1.sql)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["null"], ["null"]))),
                        timestamp: schema_1.enrollmentsTable.enrolledAt,
                    })
                        .from(schema_1.enrollmentsTable)
                        .innerJoin(schema_1.coursesTable, (0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.courseId, schema_1.coursesTable.id))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.enrollmentsTable.enrolledAt))
                        .limit(10)];
            case 1:
                recentEnrollments = _a.sent();
                return [4 /*yield*/, client_1.db
                        .select({
                        id: schema_1.progressTable.id,
                        type: (0, drizzle_orm_1.sql)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["'completion'"], ["'completion'"]))),
                        studentName: schema_1.enrollmentsTable.studentName,
                        courseTitle: schema_1.coursesTable.title,
                        lessonTitle: schema_1.lessonsTable.title,
                        timestamp: schema_1.progressTable.completedAt,
                    })
                        .from(schema_1.progressTable)
                        .innerJoin(schema_1.enrollmentsTable, (0, drizzle_orm_1.eq)(schema_1.progressTable.enrollmentId, schema_1.enrollmentsTable.id))
                        .innerJoin(schema_1.coursesTable, (0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.courseId, schema_1.coursesTable.id))
                        .innerJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.progressTable.lessonId, schema_1.lessonsTable.id))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.progressTable.completedAt))
                        .limit(10)];
            case 2:
                recentProgress = _a.sent();
                combined = __spreadArray(__spreadArray([], recentEnrollments.map(function (e) { return (__assign(__assign({}, e), { timestamp: e.timestamp.toISOString() })); }), true), recentProgress.map(function (p) { return (__assign(__assign({}, p), { timestamp: p.timestamp.toISOString() })); }), true).sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); }).slice(0, 15);
                res.json(combined);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error("Failed to get recent activity", err_2);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/dashboard/course-analytics", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, client_1.db
                        .select({
                        courseId: schema_1.coursesTable.id,
                        courseTitle: schema_1.coursesTable.title,
                        category: schema_1.coursesTable.category,
                        enrollmentCount: (0, drizzle_orm_1.sql)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.enrollmentsTable.id),
                        lessonCount: (0, drizzle_orm_1.sql)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.lessonsTable.id),
                        completedCount: (0, drizzle_orm_1.sql)(templateObject_14 || (templateObject_14 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), schema_1.progressTable.id),
                    })
                        .from(schema_1.coursesTable)
                        .leftJoin(schema_1.enrollmentsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.enrollmentsTable.courseId))
                        .leftJoin(schema_1.lessonsTable, (0, drizzle_orm_1.eq)(schema_1.coursesTable.id, schema_1.lessonsTable.courseId))
                        .leftJoin(schema_1.progressTable, (0, drizzle_orm_1.eq)(schema_1.enrollmentsTable.id, schema_1.progressTable.enrollmentId))
                        .groupBy(schema_1.coursesTable.id)
                        .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql)(templateObject_15 || (templateObject_15 = __makeTemplateObject(["count(distinct ", ")"], ["count(distinct ", ")"])), schema_1.enrollmentsTable.id)))];
            case 1:
                rows = _a.sent();
                res.json(rows.map(function (r) { return ({
                    courseId: r.courseId,
                    courseTitle: r.courseTitle,
                    category: r.category,
                    enrollmentCount: r.enrollmentCount,
                    completionRate: r.lessonCount > 0 ? Math.round((r.completedCount / r.lessonCount) * 100) : 0,
                }); }));
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error("Failed to get course analytics", err_3);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
