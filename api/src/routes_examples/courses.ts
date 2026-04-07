import type { FastifyInstance } from "fastify";
import { createCourseSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isFkViolation, isNoRows, isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires course HTTP routes onto the Fastify app. */
export async function registerCourseRoutes(app: FastifyInstance): Promise<void> {
  // List courses with instructor; optional ?instructor_id= filters by instructor.
  app.get("/courses", async (request, reply) => {
    const q = request.query as { instructor_id?: string };
    const supabase = getSupabase();

    let qb = supabase
      .from("courses")
      .select("*")
      .order("code", { ascending: true });

    if (q.instructor_id) {
      const instructorId = parseIdParam(q.instructor_id);
      if (instructorId === null) return reply.status(400).send({ error: "Invalid instructor_id" });
      qb = qb.eq("instructor_id", instructorId);
    }

    const { data, error } = await qb;

    if (error) {
      request.log.error(error, "list courses failed");
      return reply.status(500).send({ error: "Database error listing courses" });
    }

    return { data: data ?? [] };
  });

  // Fetch one course with instructor and its sections.
  app.get<{ Params: { id: string } }>("/courses/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid course id" });

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Course not found" });
      request.log.error(error, "get course failed");
      return reply.status(500).send({ error: "Database error loading course" });
    }

    return { data };
  });

  // Create a course (code unique; instructor_id must exist).
  app.post("/courses", async (request, reply) => {
    const parsed = createCourseSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("courses").insert(parsed.data).select().single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "A course with this code already exists" });
      }
      if (isFkViolation(error)) {
        return reply.status(400).send({ error: "Instructor not found" });
      }
      request.log.error(error, "create course failed");
      return reply.status(500).send({ error: "Database error creating course" });
    }

    return reply.status(201).send({ data });
  });
}
