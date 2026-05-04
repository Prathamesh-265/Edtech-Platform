import "dotenv/config";
import express from "express";
import cors from "cors";
import coursesRouter from "./routes/courses";
import lessonsRouter from "./routes/lessons";
import enrollmentsRouter from "./routes/enrollments";
import dashboardRouter from "./routes/dashboard";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", coursesRouter);
app.use("/api", lessonsRouter);
app.use("/api", enrollmentsRouter);
app.use("/api", dashboardRouter);

app.get("/api/healthz", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
