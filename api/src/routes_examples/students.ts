import type { FastifyInstance } from "fastify";
import { createStudentSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isNoRows, isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires student HTTP routes onto the Fastify app. */
export async function registerStudentRoutes(app: FastifyInstance): Promise<void> {
  // List all students, sorted by name.
  app.get("/students", async (request, reply) => {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("students").select("*").order("name", { ascending: true });

    if (error) {
      request.log.error(error, "list students failed");
      return reply.status(500).send({ error: "Database error listing students" });
    }

    return { data: data ?? [] };
  });

  // Fetch a single student by id.
  app.get<{ Params: { id: string } }>("/students/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid student id" });

    const supabase = getSupabase();
    const { data, error } = await supabase.from("students").select("*").eq("id", id).single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Student not found" });
      request.log.error(error, "get student failed");
      return reply.status(500).send({ error: "Database error loading student" });
    }

    return { data };
  });

  // List enrollments for one student, with nested section and course details.
  app.get<{ Params: { id: string } }>("/students/:id/enrollments", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid student id" });

    const supabase = getSupabase();
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (studentErr) {
      request.log.error(studentErr, "student lookup failed");
      return reply.status(500).send({ error: "Database error" });
    }
    if (!student) return reply.status(404).send({ error: "Student not found" });

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        student_id,
        section_id,
        enrolled_at,
        grade,
        course_sections (
          id,
          term,
          section_code,
          schedule,
          capacity,
          courses ( id, code, title, credits )
        )
      `,
      )
      .eq("student_id", id)
      .order("enrolled_at", { ascending: false });

    if (error) {
      request.log.error(error, "list student enrollments failed");
      return reply.status(500).send({ error: "Database error listing enrollments" });
    }

    return { data: data ?? [] };
  });

  // Create a student (email must be unique).
  app.post("/students", async (request, reply) => {
    const parsed = createStudentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("students").insert(parsed.data).select().single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "A student with this email already exists" });
      }
      request.log.error(error, "create student failed");
      return reply.status(500).send({ error: "Database error creating student" });
    }

    return reply.status(201).send({ data });
  });
}
