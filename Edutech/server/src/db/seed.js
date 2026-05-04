"use strict";
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
require("dotenv/config");
var client_1 = require("./client");
var schema_1 = require("./schema");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var courses, c1, c2, c3, c4, c5, c6, enrollments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Seeding database...");
                    return [4 /*yield*/, client_1.db.delete(schema_1.progressTable)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client_1.db.delete(schema_1.enrollmentsTable)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client_1.db.delete(schema_1.lessonsTable)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client_1.db.delete(schema_1.coursesTable)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, client_1.db.insert(schema_1.coursesTable).values([
                            {
                                title: "Modern React & Next.js Development",
                                description: "Master React 18, hooks, server components, and Next.js 14. Build production-ready full-stack applications from scratch.",
                                instructor: "Sarah Chen",
                                category: "Development",
                                level: "intermediate",
                                duration: 1440,
                                price: "149.00",
                                thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
                            },
                            {
                                title: "UI/UX Design Mastery: From Figma to Production",
                                description: "Learn professional product design workflows. Create stunning interfaces, conduct user research, and deliver pixel-perfect designs.",
                                instructor: "Marcus Rivera",
                                category: "Design",
                                level: "beginner",
                                duration: 960,
                                price: "129.00",
                                thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
                            },
                            {
                                title: "Machine Learning with Python & TensorFlow",
                                description: "Build intelligent systems using neural networks, deep learning, NLP, and computer vision. Real-world projects throughout.",
                                instructor: "Dr. Priya Nair",
                                category: "Data Science",
                                level: "advanced",
                                duration: 2160,
                                price: "199.00",
                                thumbnailUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop",
                            },
                            {
                                title: "Node.js Backend Engineering",
                                description: "Build scalable REST APIs and microservices with Node.js, Express, PostgreSQL, Redis, and Docker. Production deployment included.",
                                instructor: "James Okonkwo",
                                category: "Development",
                                level: "intermediate",
                                duration: 1200,
                                price: "159.00",
                                thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
                            },
                            {
                                title: "Data Analysis with Python & Pandas",
                                description: "Transform raw data into actionable insights. Master Pandas, NumPy, Matplotlib, and Seaborn through hands-on projects.",
                                instructor: "Dr. Priya Nair",
                                category: "Data Science",
                                level: "beginner",
                                duration: 720,
                                price: "99.00",
                                thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
                            },
                            {
                                title: "Product Strategy & Growth for Tech Leaders",
                                description: "Learn how to define product vision, prioritize roadmaps, run A/B tests, and drive sustainable growth metrics.",
                                instructor: "Emily Watson",
                                category: "Business",
                                level: "advanced",
                                duration: 840,
                                price: "179.00",
                                thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
                            },
                        ]).returning()];
                case 5:
                    courses = _a.sent();
                    c1 = courses[0], c2 = courses[1], c3 = courses[2], c4 = courses[3], c5 = courses[4], c6 = courses[5];
                    return [4 /*yield*/, client_1.db.insert(schema_1.lessonsTable).values([
                            { courseId: c1.id, title: "React 18 Mental Model", description: "Understand the new concurrent rendering model and what changed from React 17.", duration: 28, order: 1 },
                            { courseId: c1.id, title: "Hooks Deep Dive: useState & useReducer", description: "Advanced state management patterns with built-in React hooks.", duration: 45, order: 2 },
                            { courseId: c1.id, title: "Server Components vs Client Components", description: "Learn when to render on the server vs client for optimal performance.", duration: 52, order: 3 },
                            { courseId: c1.id, title: "Data Fetching with React Query", description: "Manage async state, caching, and synchronization with TanStack Query.", duration: 48, order: 4 },
                            { courseId: c1.id, title: "Next.js App Router in Depth", description: "Layouts, nested routes, loading states, and error boundaries in App Router.", duration: 60, order: 5 },
                            { courseId: c2.id, title: "Design Thinking Framework", description: "Empathize, define, ideate, prototype, and test — the full design process.", duration: 35, order: 1 },
                            { courseId: c2.id, title: "Figma Fundamentals", description: "Master auto-layout, components, variants, and design tokens in Figma.", duration: 55, order: 2 },
                            { courseId: c2.id, title: "Typography & Color Systems", description: "Build scalable type scales and accessible color palettes for your products.", duration: 40, order: 3 },
                            { courseId: c2.id, title: "User Research & Usability Testing", description: "Plan and run user interviews, surveys, and usability tests.", duration: 45, order: 4 },
                            { courseId: c3.id, title: "Mathematics for ML: Linear Algebra", description: "Vectors, matrices, eigenvalues — all you need for understanding ML.", duration: 65, order: 1 },
                            { courseId: c3.id, title: "Supervised Learning Algorithms", description: "Linear regression, logistic regression, SVMs, and decision trees.", duration: 80, order: 2 },
                            { courseId: c3.id, title: "Neural Networks from Scratch", description: "Implement a neural network using only NumPy to understand backpropagation.", duration: 90, order: 3 },
                            { courseId: c3.id, title: "Convolutional Neural Networks", description: "Image classification with CNNs using TensorFlow and Keras.", duration: 75, order: 4 },
                            { courseId: c3.id, title: "Natural Language Processing", description: "Tokenization, embeddings, transformers, and fine-tuning LLMs.", duration: 85, order: 5 },
                            { courseId: c4.id, title: "Express.js & Middleware Architecture", description: "Build robust Express apps with proper middleware patterns.", duration: 40, order: 1 },
                            { courseId: c4.id, title: "PostgreSQL & Drizzle ORM", description: "Schema design, migrations, complex queries, and joins with Drizzle.", duration: 55, order: 2 },
                            { courseId: c4.id, title: "Authentication with JWT & Sessions", description: "Implement secure auth flows with JWT, refresh tokens, and cookies.", duration: 50, order: 3 },
                            { courseId: c4.id, title: "Docker & Container Deployment", description: "Containerize your Node.js app and deploy with Docker Compose.", duration: 45, order: 4 },
                            { courseId: c5.id, title: "Python for Data Analysis", description: "Pandas DataFrames, indexing, groupby, and merge operations.", duration: 50, order: 1 },
                            { courseId: c5.id, title: "Data Cleaning & Preprocessing", description: "Handle missing values, outliers, and feature engineering.", duration: 45, order: 2 },
                            { courseId: c5.id, title: "Visualization with Matplotlib & Seaborn", description: "Create publication-quality charts and interactive dashboards.", duration: 40, order: 3 },
                            { courseId: c6.id, title: "Product Vision & Strategy", description: "Define a compelling product vision and align your team around it.", duration: 35, order: 1 },
                            { courseId: c6.id, title: "Roadmap Prioritization Frameworks", description: "RICE, ICE, MoSCoW — choose the right framework for your team.", duration: 40, order: 2 },
                            { courseId: c6.id, title: "Growth Metrics & A/B Testing", description: "Define north star metrics and run statistically valid experiments.", duration: 45, order: 3 },
                        ])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, client_1.db.insert(schema_1.enrollmentsTable).values([
                            { courseId: c1.id, studentName: "Alex Thompson", studentEmail: "alex@example.com" },
                            { courseId: c1.id, studentName: "Jordan Lee", studentEmail: "jordan@example.com" },
                            { courseId: c2.id, studentName: "Priya Kapoor", studentEmail: "priya@example.com" },
                            { courseId: c2.id, studentName: "Marcus Green", studentEmail: "marcus@example.com" },
                            { courseId: c3.id, studentName: "Emily Clarke", studentEmail: "emily@example.com" },
                            { courseId: c4.id, studentName: "Daniel Park", studentEmail: "daniel@example.com" },
                            { courseId: c4.id, studentName: "Sophia Turner", studentEmail: "sophia@example.com" },
                            { courseId: c5.id, studentName: "Noah Wilson", studentEmail: "noah@example.com" },
                            { courseId: c5.id, studentName: "Ava Martinez", studentEmail: "ava@example.com" },
                            { courseId: c6.id, studentName: "Liam Johnson", studentEmail: "liam@example.com" },
                        ]).returning()];
                case 7:
                    enrollments = _a.sent();
                    console.log("Seeded: ".concat(courses.length, " courses, 23 lessons, ").concat(enrollments.length, " enrollments"));
                    console.log("Done!");
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (err) {
    console.error("Seed failed:", err);
    process.exit(1);
});
