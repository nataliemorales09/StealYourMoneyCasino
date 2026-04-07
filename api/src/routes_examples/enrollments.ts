import type { FastifyInstance } from "fastify";
import { createEnrollmentSchema, patchEnrollmentGradeSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isFkViolation, isNoRows, isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires enrollment HTTP routes onto the Fastify app. */
export async function registerEnrollmentRoutes(app: FastifyInstance): Promise<void> {
  // List enrollments with student and section/course; optional ?section_id= or ?student_id=.
  app.get("/enrollments", async (request, reply) => {
    const q = request.query as { section_id?: string; student_id?: string };
    const supabase = getSupabase();
    let qb = supabase
      .from("enrollments")
      .select(
        `
        *,
        students ( id, name, email ),
        course_sections (
          id,
          term,
          section_code,
          schedule,
          courses ( id, code, title )
        )
      `,
      )
      .order("enrolled_at", { ascending: false });

    if (q.section_id !== undefined && q.section_id !== "") {
      const sid = parseIdParam(q.section_id);
      if (sid === null) return reply.status(400).send({ error: "Invalid section_id" });
      qb = qb.eq("section_id", sid);
    }

    if (q.student_id !== undefined && q.student_id !== "") {
      const st = parseIdParam(q.student_id);
      if (st === null) return reply.status(400).send({ error: "Invalid student_id" });
      qb = qb.eq("student_id", st);
    }

    const { data, error } = await qb;

    if (error) {
      request.log.error(error, "list enrollments failed");
      return reply.status(500).send({ error: "Database error listing enrollments" });
    }

    return { data: data ?? [] };
  });

  // Fetch one enrollment by id.
  app.get<{ Params: { id: string } }>("/enrollments/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid enrollment id" });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Enrollment not found" });
      request.log.error(error, "get enrollment failed");
      return reply.status(500).send({ error: "Database error loading enrollment" });
    }

    return { data };
  });

  // Enroll a student in a section (student + section pair must be unique).
  app.post("/enrollments", async (request, reply) => {
    const parsed = createEnrollmentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("enrollments").insert(parsed.data).select().single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "Student is already enrolled in this section" });
      }
      if (isFkViolation(error)) {
        return reply.status(400).send({ error: "Student or section not found" });
      }
      request.log.error(error, "create enrollment failed");
      return reply.status(500).send({ error: "Database error creating enrollment" });
    }

    return reply.status(201).send({ data });
  });

  // Update an enrollment’s grade only.
  app.patch<{ Params: { id: string } }>("/enrollments/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid enrollment id" });

    const parsed = patchEnrollmentGradeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("enrollments")
      .update({ grade: parsed.data.grade })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Enrollment not found" });
      request.log.error(error, "patch enrollment failed");
      return reply.status(500).send({ error: "Database error updating enrollment" });
    }

    return { data };
  });
}
