import "dotenv/config";
import Fastify from "fastify";
import { getSupabase } from "./supabase.js";
import { registerCourseRoutes } from "./routes/courses.js";
import { registerCourseSectionRoutes } from "./routes/course-sections.js";
import { registerEnrollmentRoutes } from "./routes/enrollments.js";
import { registerInstructorRoutes } from "./routes/instructors.js";
import { registerStudentRoutes } from "./routes/students.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

async function main(): Promise<void> {
  getSupabase(); // Fail fast if env is missing

  const app = Fastify({ logger: true });

  app.get("/health", async () => ({ ok: true }));

  await registerInstructorRoutes(app);
  await registerStudentRoutes(app);
  await registerCourseRoutes(app);
  await registerCourseSectionRoutes(app);
  await registerEnrollmentRoutes(app);

  try {
    await app.listen({ port, host });
    app.log.info(`Listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
