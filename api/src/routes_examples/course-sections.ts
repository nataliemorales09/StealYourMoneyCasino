import type { FastifyInstance } from "fastify";
import { createCourseSectionSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isFkViolation, isNoRows, isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires course section HTTP routes onto the Fastify app. */
export async function registerCourseSectionRoutes(app: FastifyInstance): Promise<void> {
  // List sections with course summary; optional ?course_id= limits to one course.
  app.get("/sections", async (request, reply) => {
    const q = request.query as { course_id?: string };
    const supabase = getSupabase();
    let qb = supabase
      .from("course_sections")
      .select(
        `
        *,
        courses ( id, code, title, credits )
      `,
      )
      .order("term", { ascending: false })
      .order("section_code", { ascending: true });

    if (q.course_id !== undefined && q.course_id !== "") {
      const courseId = parseIdParam(q.course_id);
      if (courseId === null) return reply.status(400).send({ error: "Invalid course_id" });
      qb = qb.eq("course_id", courseId);
    }

    const { data, error } = await qb;

    if (error) {
      request.log.error(error, "list sections failed");
      return reply.status(500).send({ error: "Database error listing sections" });
    }

    return { data: data ?? [] };
  });

  // Fetch one section with parent course fields.
  app.get<{ Params: { id: string } }>("/sections/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid section id" });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("course_sections")
      .select(
        `
        *,
        courses ( id, code, title, description, credits, instructor_id )
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Section not found" });
      request.log.error(error, "get section failed");
      return reply.status(500).send({ error: "Database error loading section" });
    }

    return { data };
  });

  // Create a section (unique per course + term + section code; course_id must exist).
  app.post("/sections", async (request, reply) => {
    const parsed = createCourseSectionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("course_sections").insert(parsed.data).select().single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({
          error: "A section with this course, term, and section code already exists",
        });
      }
      if (isFkViolation(error)) {
        return reply.status(400).send({ error: "Course not found" });
      }
      request.log.error(error, "create section failed");
      return reply.status(500).send({ error: "Database error creating section" });
    }

    return reply.status(201).send({ data });
  });
}
