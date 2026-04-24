import type { FastifyInstance } from "fastify";
import { createCocktailSchema } from "../schemas.js";
import { getSupabase } from "../supabase.js";
import { isUniqueViolation } from "./db-errors.js";
import { parseIdParam } from "./params.js";

/** Wires cocktail HTTP routes onto the Fastify app. */
export async function registerCocktailRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /cocktails
   *
   * Optional query parameters:
   * - id: positive integer; filters to a specific drink_id
   * - name: string; filters by exact cocktail name
   *
   * Returns up to 20 rows. If no rows match, returns { data: [] }.
   */
  app.get("/cocktails", async (request, reply) => {
    const q = request.query as { id?: string; name?: string };
    const supabase = getSupabase();

    const drinkId = q.id ? parseIdParam(q.id) : null;
    if (q.id && drinkId === null) {
      return reply.status(400).send({ error: "Invalid id" });
    }

    let qb = supabase.from("cocktails").select("*").limit(20);
    if (drinkId !== null) qb = qb.eq("drink_id", drinkId);
    if (q.name) qb = qb.eq("name", q.name);

    const { data, error } = await qb;
    if (error) {
      request.log.error(error, "list cocktails failed");
      return reply.status(500).send({ error: "Database error listing cocktails" });
    }

    return { data: data ?? [] };
  });

  /**
   * POST /cocktails
   *
   * Body:
   * - createCocktailSchema (drink_id, name)
   */
  app.post("/cocktails", async (request, reply) => {
    const parsed = createCocktailSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from("cocktails").insert(parsed.data).select("*").single();

    if (error) {
      if (isUniqueViolation(error)) {
        return reply.status(409).send({ error: "Cocktail already exists" });
      }
      request.log.error(error, "create cocktail failed");
      return reply.status(500).send({ error: "Database error creating cocktail" });
    }

    return reply.status(201).send({ data });
  });
}
