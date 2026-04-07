import type { FastifyInstance } from "fastify";
import { createInstructorSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isNoRows, isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires instructor HTTP routes onto the Fastify app. */
export async function registerInstructorRoutes(app: FastifyInstance): Promise<void> {
  // List all instructors, sorted by name.
  app.get("/instructors", async (request, reply) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("instructors")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      request.log.error(error, "list instructors failed");
      return reply.status(500).send({ error: "Database error listing instructors" });
    }

    return { data: data ?? [] };
  });

  // Fetch a single instructor by id.
  app.get<{ Params: { id: string } }>("/instructors/:id", async (request, reply) => {
    const id = parseIdParam(request.params.id);
    if (id === null) return reply.status(400).send({ error: "Invalid instructor id" });

    const supabase = getSupabase();
    const { data, error } = await supabase.from("instructors").select("*").eq("id", id).single();

    if (error) {
      if (isNoRows(error)) return reply.status(404).send({ error: "Instructor not found" });
      request.log.error(error, "get instructor failed");
      return reply.status(500).send({ error: "Database error loading instructor" });
    }

    return { data };
  });

  // Create an instructor (email must be unique).
  app.post("/instructors", async (request, reply) => {
    const parsed = createInstructorSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("instructors").insert(parsed.data).select().single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "An instructor with this email already exists" });
      }
      request.log.error(error, "create instructor failed");
      return reply.status(500).send({ error: "Database error creating instructor" });
    }

    return reply.status(201).send({ data });
  });
}
